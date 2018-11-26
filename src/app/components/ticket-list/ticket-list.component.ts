import { FormControl } from '@angular/forms';
import { EditAssigneeDialogComponent } from './../edit-assignee-dialog/edit-assignee-dialog.component';
import { TicketListInit, TicketListAlterCompleted } from './ticket-list.actions';
import { CreateTicketDialogComponent } from './../create-ticket-dialog/create-ticket-dialog.component';
import { tap, map, startWith, switchMap } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import {
  selectUserEntities,
  usersLoading,
  usersSubmitting,
  selectTicketEntities,
  ticketsLoading,
  ticketsSubmitting
} from 'tickets-data-layer';
import { Observable, combineLatest } from 'rxjs';
import { MatIconRegistry, MatDialog, MatSort, SortDirection } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export interface TicketTableModel {
  id: number;
  description: string;
  user: string;
  completed: boolean;
}

const columns = [
  'completed',
  'user',
  'description',
  'link'
];

export const tableDataSelector = createSelector(
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

export interface TableState {
  globalFilter: string;
  sort: {
    active: string,
    direction: '' | 'asc' | 'desc'
  };
}

const sortByKey = <T>(keyname: keyof T, dir: SortDirection = 'asc') => (a: T, b: T) => {
  if (a[keyname].toString().toLowerCase() > b[keyname].toString().toLowerCase()) {
    return dir === 'asc' ? 1 : -1;
  }
  if (a[keyname].toString().toLowerCase() < b[keyname].toString().toLowerCase()) {
    return dir === 'asc' ? -1 : 1;
  }
  return 0;
};

export const refinedTableData = (tableState: TableState) => createSelector(
  tableDataSelector,
  tableData => {
    let temp = [...tableData];
    if (tableState.globalFilter) {
      temp = temp.filter(tableModel =>
        Object.values(tableModel).some(v => v.toString().toLowerCase().includes(tableState.globalFilter.toLowerCase()))
      );
    }
    if (tableState.sort && tableState.sort.active) {
      temp = temp.sort(sortByKey(tableState.sort.active as keyof TicketTableModel, tableState.sort.direction));
    }
    return temp;
  }
);

/**
 * NOTE: Blurs on transitioning out; root cause seems to be identified here:
 * https://github.com/angular/material2/issues/8057
 */
@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  tableData$: Observable<TicketTableModel[]>;
  columns = columns;
  initialized = false;
  loading$: Observable<boolean>;
  submitting$: Observable<boolean>;
  tableState$: Observable<TableState>;
  globalSearch = new FormControl('');

  constructor(
    private store$: Store<any>,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    iconRegistry.addSvgIcon('launch', sanitizer.bypassSecurityTrustResourceUrl('assets/launch.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/edit.svg'));
    iconRegistry.addSvgIcon('checked-box', sanitizer.bypassSecurityTrustResourceUrl('assets/checked-box.svg'));
    iconRegistry.addSvgIcon('un-checked-box', sanitizer.bypassSecurityTrustResourceUrl('assets/un-checked-box.svg'));
  }

  ngOnInit() {
    this.tableState$ = combineLatest(
      this.globalSearch.valueChanges.pipe(startWith(this.globalSearch.value)),
      this.sort.sortChange.pipe(startWith(({ active: this.sort.active, direction: this.sort.direction })))
    )
    .pipe(
      map(([globalSearch, sort]) => ({
        globalFilter: globalSearch as string,
        sort: sort
      }))
    );
    this.tableData$ = this.tableState$.pipe(
      switchMap(tableState => this.store$.pipe(
        select(refinedTableData(tableState)),
        tap(() => this.initialized = true)
      ))
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
    this.submitting$ = this.store$.pipe(select(ticketsSubmitting));

    this.store$.dispatch(new TicketListInit());
  }

  toggleCompleted(ticketId: number, completed: boolean) {
    this.store$.dispatch(new TicketListAlterCompleted(
      ticketId,
      !completed
    ));
  }

  openCreateTicketDialog() {
    this.dialog.open(
      CreateTicketDialogComponent,
      { width: '400px' }
    );
  }

  openAssigneeDialog(ticketId: number) {
    this.dialog.open(
      EditAssigneeDialogComponent,
      {
        width: '250px',
        data: {
          ticketId,
          parent: 'list'
        }
      }
    );
  }

}
