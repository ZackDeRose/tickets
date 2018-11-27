import { Action } from '@ngrx/store';
import { Ticket } from '../models';

export enum TicketActionTypes {
  RequestLoad = '[Backend API] Ticket Request Load',
  LoadSuccess = '[Backend API] Ticket Load Success',
  LoadError = '[Backend API] Ticket Load Error',
  RequestAdd = '[Backend API] Ticket Request Add',
  AddSuccess = '[Backend API] Ticket Add Success',
  AddError = '[Backend API] Ticket Add Error',
  RequestAssign = '[Backend API] Ticket Request Assign',
  AssignSuccess = '[Backend API] Ticket Assign Success',
  AssignError = '[Backend API] Ticket Assign Error',
  RequestComplete = '[Backend API] Ticket Request Complete',
  CompleteSuccess = '[Backend API] Ticket Complete Success',
  CompleteError = '[Backend API] Ticket Complete Error',
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

  constructor(public added: Ticket) {}
}

export class TicketAddError implements Action {
  readonly type = TicketActionTypes.AddError;

  constructor(public error: Error) {}
}

export class TicketRequestAssign implements Action {
  readonly type = TicketActionTypes.RequestAssign;

  constructor(public ticketId: number, public userId: number) {}
}

export class TicketAssignSuccess implements Action {
  readonly type = TicketActionTypes.AssignSuccess;

  constructor(public assigned: Ticket) {}
}

export class TicketAssignError implements Action {
  readonly type = TicketActionTypes.AssignError;

  constructor(public ticketId, public error: Error) {}
}

export class TicketRequestComplete implements Action {
  readonly type = TicketActionTypes.RequestComplete;

  constructor(public ticketId: number, public completed: boolean) {}
}

export class TicketCompleteSuccess implements Action {
  readonly type = TicketActionTypes.CompleteSuccess;

  constructor(public completed: Ticket) {}
}

export class TicketCompleteError implements Action {
  readonly type = TicketActionTypes.CompleteError;

  constructor(public ticketId, public error: Error) {}
}

export type TicketActions =
  TicketRequestLoad
  | TicketLoadSuccess
  | TicketLoadError
  | TicketRequestAdd
  | TicketAddSuccess
  | TicketAddError
  | TicketRequestAssign
  | TicketAssignSuccess
  | TicketAssignError
  | TicketRequestComplete
  | TicketCompleteSuccess
  | TicketCompleteError;
