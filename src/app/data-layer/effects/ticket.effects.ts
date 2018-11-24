import { Injectable } from '@angular/core';
import {
  TicketLoadSuccess,
  TicketLoadError,
  TicketActionTypes,
  TicketAddSuccess,
  TicketAddError,
  TicketRequestAdd,
  TicketRequestLoad
} from '../actions/ticket.actions';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { BackendService } from '../../backend.service';

@Injectable()
export class TicketEffects {
  @Effect()
  loadEffect$: Observable<TicketLoadSuccess | TicketLoadError> = this.actions$.pipe(
    ofType(TicketActionTypes.RequestLoad),
    switchMap(() => this.backendService.tickets().pipe(
      map(tickets => new TicketLoadSuccess(tickets))
    ))
    // TODO: Handle errors???
  );

  @Effect()
  addEffect$: Observable<TicketAddSuccess | TicketAddError> = this.actions$.pipe(
    ofType(TicketActionTypes.RequestAdd),
    switchMap((action: TicketRequestAdd) => this.backendService.newTicket({ description: action.description }).pipe(
      map(() => new TicketAddSuccess())
    ))
    // TODO: handle erros???
  );

  @Effect()
  addSuccessTriggersLoad$: Observable<TicketRequestLoad> = this.actions$.pipe(
    ofType(TicketActionTypes.AddSuccess),
    map(() => new TicketRequestLoad())
  );

  constructor(private actions$: Actions, private backendService: BackendService) {}
}
