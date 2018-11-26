import { Action } from '@ngrx/store';

export enum TicketDetailsActionTypes {
  Init = '[Ticket Details] Initialize',
  AlterCompleted = '[Ticket Details] Alter Completed',
  EditAssignee = '[Ticket Details] Edit Assignee'
}

export class TicketDetailsInit implements Action {
  readonly type = TicketDetailsActionTypes.Init;

  constructor(public id: number) {}
}

export class TicketDetailsAlterCompleted implements Action {
  readonly type = TicketDetailsActionTypes.AlterCompleted;

  constructor(public ticketId: number, public completed: boolean) {}
}

export class TicketDetailsEditAssignee implements Action {
  readonly type = TicketDetailsActionTypes.EditAssignee;

  constructor(public ticketId, public userId) {}
}
