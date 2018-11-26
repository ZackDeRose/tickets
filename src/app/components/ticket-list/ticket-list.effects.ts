import { map, switchMap } from 'rxjs/operators';
import { TicketListActionTypes, TicketListCreateNew, TicketListInit, TicketListEditAssignee } from './ticket-list.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TicketRequestAdd, TicketRequestLoad, UserRequestLoad, TicketRequestAssign } from 'tickets-data-layer';

@Injectable()
export class TicketListEffects {

  @Effect()
  init$ = this.actions$.pipe(
    ofType(TicketListActionTypes.Init),
    switchMap((action: TicketListInit) => [
      new TicketRequestLoad(),
      new UserRequestLoad()
    ])
  );

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

  constructor(private actions$: Actions) {}
}
