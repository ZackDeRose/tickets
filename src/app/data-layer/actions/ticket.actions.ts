import { Action } from '@ngrx/store';
import { Ticket } from '../models';

export enum TicketActionTypes {
  RequestLoad = '[Backend API] Ticket Request Load',
  LoadSuccess = '[Backend API] Ticket Load Success',
  LoadError = '[Backend API] Ticket Load Error',
  RequestAdd = '[Backend API] Ticket Request Add',
  AddSuccess = '[Backend API] Ticket Add Success',
  AddError = '[Backend API] Ticket Add Error',
}

export class TicketRequestLoad implements Action {
  readonly type = TicketActionTypes.RequestLoad;
}

export class TicketLoadSuccess implements Action {
  readonly type = TicketActionTypes.LoadSuccess;

  constructor(public loadedData: Ticket[]) {}
}

export class TicketLoadError implements Action {
  readonly type = TicketActionTypes.LoadError;

  constructor(public error: Error) {}
}

export class TicketRequestAdd implements Action {
  readonly type = TicketActionTypes.RequestAdd;

  constructor(public description: string) {}
}

export class TicketAddSuccess implements Action {
  readonly type = TicketActionTypes.AddSuccess;
}

export class TicketAddError implements Action {
  readonly type = TicketActionTypes.AddError;

  constructor(public error: Error) {}
}

export type TicketActions =
  TicketRequestLoad
  | TicketLoadSuccess
  | TicketLoadError
  | TicketRequestAdd
  | TicketAddSuccess
  | TicketAddError;
