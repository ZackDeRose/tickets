import { selectUserEntities } from './../../data-layer/reducers/user.reducer';
import { map, take, switchMap, startWith, filter } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { TicketDetailsEditAssignee } from '../ticket-details/ticket-details.actions';
import {
  TicketRequestAssign,
  TicketActionTypes,
  User,
  selectAllUsers,
  Ticket,
  selectTicketEntities,
  ticketsSubmitting
} from 'tickets-data-layer';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-assignee-dialog',
  templateUrl: './edit-assignee-dialog.component.html',
  styleUrls: ['./edit-assignee-dialog.component.css']
})
export class EditAssigneeDialogComponent implements OnInit {

  userForm: FormControl;
  ticket$: Observable<Ticket>;
  userOptions$: Observable<User[]>;
  canSubmit$: Observable<boolean>;
  submitting$: Observable<boolean>;

  constructor(
    private store$: Store<any>,
    private actions$: Actions,
    private dialogRef: MatDialogRef<EditAssigneeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { ticketId: number, parent?: 'list' | 'details' }
  ) { }

  ngOnInit() {
    this.userOptions$ = this.store$.pipe(select(selectAllUsers));
    this.ticket$ = this.store$.pipe(
      select(selectTicketEntities),
      map(tickets => tickets[this.data.ticketId])
    );
    this.ticket$.pipe(
      filter(ticket => ticket != null),
      switchMap(ticket => this.store$.pipe(select(selectUserEntities), map(users => users[ticket.assigneeId]))),
      take(1),
    )
    .subscribe(user => {
      this.userForm = new FormControl(user);
      console.log('created');
      this.canSubmit$ = this.userForm.valueChanges.pipe(
        startWith(this.userForm.value),
        switchMap(selectedUser => this.store$.pipe(
          select(ticketsSubmitting),
          map(submitting => selectedUser !== user && !submitting)
        )),
      );
    });
    this.submitting$ = this.store$.pipe(
      select(ticketsSubmitting)
    );
  }

  submit() {
    // listen for the eventual success and close
    this.actions$.pipe(
      ofType(TicketActionTypes.AssignSuccess),
      take(1)
    )
    .subscribe(() => this.dialogRef.close());

    const userId = this.userForm.value === -1
      ? null
      : this.userForm.value.id;

    if (this.data.parent === 'details') {
      this.store$.dispatch(new TicketDetailsEditAssignee(this.data.ticketId, userId));
    } else if (this.data.parent === 'list') {
      // TODO: add list capability to edit assignee
    } else {
      this.store$.dispatch(new TicketRequestAssign(this.data.ticketId, userId));
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
