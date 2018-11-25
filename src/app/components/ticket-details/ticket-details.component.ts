import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { Ticket, User } from 'tickets-data-layer';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import {
  selectTicketEntities,
  selectUserEntities,
  usersSubmitting,
  usersLoading,
  ticketsLoading,
  ticketsSubmitting,
  TicketRequestLoad,
  UserRequestLoad
} from 'tickets-data-layer';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticket$: Observable<Ticket>;
  user$: Observable<User>;
  loading$: Observable<boolean>;

  constructor(
    private store$: Store<any>,
    private route: ActivatedRoute,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('checked-box', sanitizer.bypassSecurityTrustResourceUrl('assets/checked-box.svg'));
    iconRegistry.addSvgIcon('un-checked-box', sanitizer.bypassSecurityTrustResourceUrl('assets/un-checked-box.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/edit.svg'));
  }

  ngOnInit() {
    this.ticket$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.store$.pipe(
        select(selectTicketEntities),
        map(tickets => tickets[id])
      ))
    );
    this.user$ = this.ticket$.pipe(
      filter(ticket => !!ticket),
      map(ticket => ticket.assigneeId),
      switchMap(userId => this.store$.pipe(
        select(selectUserEntities),
        map(users => users[userId])
      ))
    );
    this.loading$ = combineLatest(
      this.store$.pipe(select(ticketsLoading)),
      this.store$.pipe(select(ticketsSubmitting)),
      this.store$.pipe(select(usersLoading)),
      this.store$.pipe(select(usersSubmitting))
    )
    .pipe(
      map(arr => arr.some(x => !!x))
    );

    // TODO: Replace with Page-level Actions
    this.store$.dispatch(new TicketRequestLoad());
    this.store$.dispatch(new UserRequestLoad());
  }

}
