import { DomSanitizer } from '@angular/platform-browser';
import { TicketListEditAssignee } from './../ticket-list/ticket-list.actions';
import { map, take, switchMap, startWith, filter } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { TicketDetailsEditAssignee } from '../ticket-details/ticket-details.actions';
import {
  TicketRequestAssign,
  TicketActionTypes,
  User,
  selectAllUsers,
  Ticket,
  selectTicketEntities,
  ticketAssigning,
  selectUserEntities
} from 'tickets-data-layer';
import { FormControl, Validators } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-edit-assignee-dialog',
  templateUrl: './edit-assignee-dialog.component.html',
  styleUrls: ['./edit-assignee-dialog.component.css']
})
export class EditAssigneeDialogComponent implements OnInit {

  userForm: FormControl;
  ticket$: Observable<Ticket>;
  userOptions$: Observable<User[]>;
  hasChanges$: Observable<boolean>;
  submitting$: Observable<boolean>;
  canSubmit$: Observable<boolean>;

  constructor(
    private store$: Store<any>,
    private actions$: Actions,
    private dialogRef: MatDialogRef<EditAssigneeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { ticketId: number, parent?: 'list' | 'details' },
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon('loading', sanitizer.bypassSecurityTrustResourceUrl('assets/loading.svg'));
  }

  async ngOnInit() {

    this.userOptions$ = this.store$.pipe(select(selectAllUsers));

    this.ticket$ = this.store$.pipe(
      select(selectTicketEntities),
      map(tickets => tickets[this.data.ticketId])
    );

    const user = await this.ticket$.pipe(
      filter(ticket => ticket != null),
      switchMap(ticket => this.store$.pipe(
        select(selectUserEntities),
        map(users => users[ticket.assigneeId])
      )),
      take(1),
    ).toPromise();
    this.userForm = new FormControl(user, Validators.required);

    this.hasChanges$ = combineLatest(
      this.ticket$.pipe(map(ticket => ticket.assigneeId)),
      this.userForm.valueChanges.pipe(
        startWith(this.userForm.value),
        map(selectedUser => selectedUser ? selectedUser.id : -1)
      )
    ).pipe(
      map(([x, y]) => x !== y)
    );

    this.submitting$ = this.ticket$.pipe(
      switchMap(ticket => this.store$.pipe(
        select(ticketAssigning(ticket.id))
      ))
    );

    this.canSubmit$ = combineLatest(
      this.userForm.statusChanges.pipe(startWith('INVALID'), map(status => status === 'VALID')),
      this.hasChanges$,
      this.submitting$
    )
    .pipe(
      map(([formValid, hasChanges, submitting]) => formValid && hasChanges && !submitting)
    );
  }

  submit() {
    this.closeDialogOnNextAssignSuccess();

    if (this.data.parent === 'details') {
      this.store$.dispatch(new TicketDetailsEditAssignee(this.data.ticketId, this.userForm.value.id));
    } else if (this.data.parent === 'list') {
      this.store$.dispatch(new TicketListEditAssignee(this.data.ticketId, this.userForm.value.id));
    } else {
      this.store$.dispatch(new TicketRequestAssign(this.data.ticketId, this.userForm.value.id));
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  private async closeDialogOnNextAssignSuccess() {
    await this.actions$.pipe(ofType(TicketActionTypes.AssignSuccess), take(1)).toPromise();
    this.dialogRef.close();
  }

}
