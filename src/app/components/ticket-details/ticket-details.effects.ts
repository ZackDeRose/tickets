import { map } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import {
  TicketDetailsActionTypes,
  TicketDetailsAlterCompleted,
  TicketDetailsEditAssignee
} from './ticket-details.actions';
import { TicketRequestComplete, TicketRequestAssign } from 'tickets-data-layer';
import { Injectable } from '@angular/core';

@Injectable()
export class TicketDetailsEffects {
  @Effect()
  triggerRequestComplete$ = this.actions$.pipe(
    ofType(TicketDetailsActionTypes.AlterCompleted),
    map((action: TicketDetailsAlterCompleted) => new TicketRequestComplete(action.ticketId, action.completed))
  );

  @Effect()
  triggerRequestAssignee$ = this.actions$.pipe(
    ofType(TicketDetailsActionTypes.EditAssignee),
    map((action: TicketDetailsEditAssignee) => new TicketRequestAssign(action.ticketId, action.userId))
  );

  constructor(private actions$: Actions) {}
}
