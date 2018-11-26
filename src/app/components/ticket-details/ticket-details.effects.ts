import { switchMap, map } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import {
  TicketDetailsActionTypes,
  TicketDetailsInit,
  TicketDetailsAlterCompleted,
  TicketDetailsEditAssignee
} from './ticket-details.actions';
import { TicketRequestLoadSingle, UserRequestLoad, TicketRequestComplete, TicketRequestAssign } from 'tickets-data-layer';
import { Injectable } from '@angular/core';

@Injectable()
export class TicketDetailsEffects {
  @Effect()
  init$ = this.actions$.pipe(
    ofType(TicketDetailsActionTypes.Init),
    switchMap((action: TicketDetailsInit) => [
      new TicketRequestLoadSingle(action.id),
      new UserRequestLoad()
    ])
  );

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
