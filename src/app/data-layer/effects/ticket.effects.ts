import { Injectable } from '@angular/core';
import {
  TicketLoadSuccess,
  TicketLoadError,
  TicketActionTypes,
  TicketAddSuccess,
  TicketAddError,
  TicketRequestAdd,
  TicketRequestLoad,
  TicketLoadSingleSuccess,
  TicketLoadSingleError,
  TicketRequestLoadSingle
} from '../actions/ticket.actions';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { BackendService } from '../../backend.service';

@Injectable()
export class TicketEffects {
  @Effect()
  loadEffect$: Observable<TicketLoadSuccess | TicketLoadError> = this.actions$.pipe(
    ofType(TicketActionTypes.RequestLoad),
    switchMap(() => {
      let toReturn: Observable<TicketLoadSuccess | TicketLoadError>;
      try {
        toReturn = this.backendService.tickets().pipe(
          map(ticketsResponse => new TicketLoadSuccess(ticketsResponse)),
        );
      } catch (error) {
        toReturn = of(new TicketLoadError(error));
      }
      return toReturn;
    }),
  );

  @Effect()
  loadSingleEffect$: Observable<TicketLoadSingleSuccess | TicketLoadSingleError> = this.actions$.pipe(
    ofType(TicketActionTypes.RequestLoadSingle),
    switchMap((action: TicketRequestLoadSingle) => {
      let toReturn: Observable<TicketLoadSingleSuccess | TicketLoadSingleError>;
      try {
        toReturn = this.backendService.ticket(action.id).pipe(
          map(ticket => new TicketLoadSingleSuccess(ticket))
        );
      } catch (error) {
        toReturn = of(new TicketLoadSingleError(error));
      }
      return toReturn;
    })
  );

  @Effect()
  addEffect$: Observable<TicketAddSuccess | TicketAddError> = this.actions$.pipe(
    ofType(TicketActionTypes.RequestAdd),
    switchMap((action: TicketRequestAdd) => {
      let toReturn: Observable<TicketAddSuccess | TicketAddError>;
      try {
        toReturn = this.backendService.newTicket({ description: action.description }).pipe(
          map(ticket => new TicketAddSuccess(ticket))
        );
      } catch (error) {
        toReturn = of(new TicketAddError(error));
      }
      return toReturn;
    })
  );

  @Effect()
  triggerLoad$: Observable<TicketRequestLoad> = this.actions$.pipe(
    ofType(
      TicketActionTypes.AddSuccess,
      TicketActionTypes.AssignSuccess,
      TicketActionTypes.CompleteSuccess
    ),
    map(() => new TicketRequestLoad())
  );

  constructor(private actions$: Actions, private backendService: BackendService) {}
}
