import { Action } from '@ngrx/store';


export enum TicketListActionTypes {
  Init = '[TicketList] Init',
  CreateNew = '[TicketList] Create New',
  EditAssignee = '[TicketList] Edit Assignee',
  AlterCompleted = '[TicketList] Edit Completed'
}

export class TicketListInit implements Action {
  readonly type = TicketListActionTypes.Init;
}

export class TicketListCreateNew implements Action {
  readonly type = TicketListActionTypes.CreateNew;

  constructor(public description: string) {}
}

export class TicketListEditAssignee implements Action {
  readonly type = TicketListActionTypes.EditAssignee;

  constructor(public ticketId, public userId) {}
}

export class TicketListAlterCompleted implements Action {
  readonly type = TicketListActionTypes.AlterCompleted;

  constructor(public ticketId: number, public completed: boolean) {}
}
