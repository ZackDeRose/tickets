import { TicketListCreateNew } from './../ticket-list/ticket-list.actions';
import { take, startWith, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ticketsSubmitting, TicketActionTypes } from 'tickets-data-layer';

@Component({
  selector: 'app-create-ticket-dialog',
  templateUrl: './create-ticket-dialog.component.html',
  styleUrls: ['./create-ticket-dialog.component.css']
})
export class CreateTicketDialogComponent implements OnInit {

  descriptionForm = new FormControl('', Validators.required);
  submitting$: Observable<boolean>;
  canSubmit$: Observable<boolean>;

  constructor(
    private store$: Store<any>,
    private actions$: Actions,
    private dialogRef: MatDialogRef<CreateTicketDialogComponent>,
  ) { }

  ngOnInit() {
    this.submitting$ = this.store$.pipe(select(ticketsSubmitting));
    this.canSubmit$ = this.descriptionForm.valueChanges.pipe(
      startWith(this.descriptionForm.value),
      switchMap(formValue => this.submitting$.pipe(
        map(submitting => !!formValue && !submitting)
      ))
    );
  }

  submit() {
    this.actions$.pipe(
      ofType(TicketActionTypes.AddSuccess),
      take(1)
    )
    .subscribe(() => this.dialogRef.close());

    this.store$.dispatch(new TicketListCreateNew(this.descriptionForm.value));
  }

  cancel() {
    this.dialogRef.close();
  }

}
