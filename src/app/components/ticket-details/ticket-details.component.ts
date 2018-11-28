import { TicketDetailsAlterCompleted, TicketDetailsInit } from './ticket-details.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, filter, take, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import {
  selectTicketEntities,
  selectUserEntities,
  usersLoading,
  ticketsLoading,
  Ticket,
  User,
  ticketAssigning,
  ticketCompleting
} from '../../data-layer';
import { EditAssigneeDialogComponent } from '../edit-assignee-dialog/edit-assignee-dialog.component';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticket$: Observable<Ticket>;
  user$: Observable<User>;
  loading$: Observable<boolean>;
  assigning$: Observable<boolean>;
  completing$: Observable<boolean>;

  constructor(
    private store$: Store<any>,
    private route: ActivatedRoute,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    iconRegistry.addSvgIcon('checked-box', sanitizer.bypassSecurityTrustResourceUrl('assets/checked-box.svg'));
    iconRegistry.addSvgIcon('un-checked-box', sanitizer.bypassSecurityTrustResourceUrl('assets/un-checked-box.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/edit.svg'));
    iconRegistry.addSvgIcon('loading', sanitizer.bypassSecurityTrustResourceUrl('assets/loading.svg'));
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
      this.store$.pipe(select(usersLoading)),
    )
    .pipe(
      map(arr => arr.some(x => x > 0))
    );

    this.assigning$ = this.ticket$.pipe(
      filter(ticket => ticket != null),
      switchMap(ticket => this.store$.pipe(
        select(ticketAssigning(ticket.id))
      ))
    );

    this.completing$ = this.ticket$.pipe(
      filter(ticket => ticket != null),
      switchMap(ticket => this.store$.pipe(
        select(ticketCompleting(ticket.id))
      ))
    );
  }

  async complete() {
    const ticket = await this.ticket$.pipe(take(1)).toPromise();
    this.store$.dispatch(new TicketDetailsAlterCompleted(ticket.id, !ticket.completed));
  }

  async openAssigneeDialog() {
    this.dialog.open(
      EditAssigneeDialogComponent,
      {
        width: '250px',
        data: {
          ticketId: await this.ticket$.pipe(take(1), map(ticket => ticket.id)).toPromise(),
          parent: 'details'
        }
      }
    );
  }

}
