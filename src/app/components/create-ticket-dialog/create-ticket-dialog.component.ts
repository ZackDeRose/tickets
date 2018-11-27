import { ticketsAdding } from './../../data-layer/reducers/ticket.reducer';
import { DomSanitizer } from '@angular/platform-browser';
import { TicketListCreateNew } from './../ticket-list/ticket-list.actions';
import { take, startWith, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MatDialogRef, MatIconRegistry } from '@angular/material';
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
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon('loading', sanitizer.bypassSecurityTrustResourceUrl('assets/loading.svg'));
  }

  ngOnInit() {
    this.submitting$ = this.store$.pipe(select(ticketsAdding), map(adding => adding > 0));
    this.canSubmit$ = this.descriptionForm.valueChanges.pipe(
      startWith(this.descriptionForm.value),
      switchMap(formValue => this.submitting$.pipe(
        map(submitting => !!formValue && !submitting)
      ))
    );
  }

  submit() {
    this.closeDialogOnNextAddSuccess();

    this.store$.dispatch(new TicketListCreateNew(this.descriptionForm.value));
  }

  cancel() {
    this.dialogRef.close();
  }

  private async closeDialogOnNextAddSuccess() {
    await this.actions$.pipe(ofType(TicketActionTypes.AddSuccess), take(1)).toPromise();
    this.dialogRef.close();
  }

}
