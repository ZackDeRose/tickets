import { tap, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import {
  TicketRequestLoad,
  UserRequestLoad,
  selectUserEntities,
  usersLoading,
  usersSubmitting,
  selectTicketEntities,
  ticketsLoading,
  ticketsSubmitting
} from 'tickets-data-layer';
import { Observable, combineLatest } from 'rxjs';

export interface TicketTableModel {
  id: number;
  description: string;
  user: string;
  completed: boolean;
}

const columns = [
  'id',
  'description',
  'user',
  'completed'
];

const tableDataSelector = createSelector(
  selectUserEntities,
  selectTicketEntities, // selectAllTickets might go better
  (users, tickets) => {
    const tableModels: TicketTableModel[] = [];
    for (const ticket of Object.values(tickets)) {
      const user = users[ticket.assigneeId];
      const userText = user ? user.name : 'Not Assigned';
      tableModels.push({
        id: ticket.id,
        description: ticket.description,
        user: userText,
        completed: ticket.completed
      });
    }
    return tableModels;
  }
);

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tableData$: Observable<TicketTableModel[]>;
  columns = columns;
  initialized = false;
  loading$: Observable<boolean>;

  constructor(private store$: Store<any>) { }

  ngOnInit() {
    this.tableData$ = this.store$.pipe(
      select(tableDataSelector),
      tap(() => this.initialized = true)
    );
    this.loading$ = combineLatest(
      this.store$.pipe(select(ticketsLoading)),
      this.store$.pipe(select(ticketsSubmitting)),
      this.store$.pipe(select(usersLoading)),
      this.store$.pipe(select(usersSubmitting)),
    )
    .pipe(
      map(arr => arr.some(working => !!working))
    );

    this.store$.dispatch(new TicketRequestLoad());
    this.store$.dispatch(new UserRequestLoad());
  }

}
