import { map } from 'rxjs/operators';
import {
  TicketListActionTypes,
  TicketListCreateNew,
  TicketListEditAssignee,
  TicketListAlterCompleted
} from './ticket-list.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  TicketRequestAdd,
  TicketRequestAssign,
  TicketRequestComplete
} from '../../data-layer';

@Injectable()
export class TicketListEffects {
  @Effect()
  triggerAdd$ = this.actions$.pipe(
    ofType(TicketListActionTypes.CreateNew),
    map((action: TicketListCreateNew) => new TicketRequestAdd(action.description))
  );

  @Effect()
  triggerRequestAssignee$ = this.actions$.pipe(
    ofType(TicketListActionTypes.EditAssignee),
    map((action: TicketListEditAssignee) => new TicketRequestAssign(action.ticketId, action.userId))
  );

  @Effect()
  triggerRequestComplete$ = this.actions$.pipe(
    ofType(TicketListActionTypes.AlterCompleted),
    map((action: TicketListAlterCompleted) => new TicketRequestComplete(action.ticketId, action.completed))
  );

  constructor(private actions$: Actions) {}
}
