import { testTickets, createTicket } from 'testing-utils';
import {
  TicketRequestLoad,
  TicketActionTypes,
  TicketLoadSuccess,
  TicketLoadError,
  TicketRequestAdd,
  TicketAddSuccess,
  TicketAddError,
  TicketRequestAssign,
  TicketAssignSuccess,
  TicketAssignError,
  TicketRequestComplete,
  TicketCompleteSuccess,
  TicketCompleteError
} from './ticket.actions';


describe('Ticket Actions', () => {

  it('should create TicketRequestLoad action', () => {
    const action = new TicketRequestLoad();

    expect(action.type).toBe(TicketActionTypes.RequestLoad);
  });

  it('should create TicketLoadSuccess action', () => {
    const ticketsPayload = [
      ...Object.values(testTickets),
       createTicket({id: 1337, description: 'test ticket'})
    ];
    const action = new TicketLoadSuccess(ticketsPayload);

    expect(action.type).toBe(TicketActionTypes.LoadSuccess);
    expect(action.loadedData).toEqual(ticketsPayload);
  });

  it('should create TicketLoadError action', () => {
    const errorMsg = 'test error message';
    const error = new Error(errorMsg);
    const action = new TicketLoadError(error);

    expect(action.type).toBe(TicketActionTypes.LoadError);
    expect(action.error).toBe(error);
  });

  it('should create TicketRequestAdd action', () => {
    const description = 'test description';
    const action = new TicketRequestAdd(description);

    expect(action.type).toBe(TicketActionTypes.RequestAdd);
    expect(action.description).toBe(description);
  });

  it('should create TicketAddSuccess action', () => {
    const ticket = createTicket();
    const action = new TicketAddSuccess(ticket);

    expect(action.type).toBe(TicketActionTypes.AddSuccess);
    expect(action.added).toBe(ticket);
  });

  it('should create TicketAddError action', () => {
    const errorMsg = 'test error message';
    const error = new Error(errorMsg);
    const action = new TicketAddError(error);

    expect(action.type).toBe(TicketActionTypes.AddError);
    expect(action.error).toBe(error);
  });

  it('should create TicketRequestAssign action', () => {
    const userId = 1;
    const ticketId = 312;
    const action = new TicketRequestAssign(ticketId, userId);

    expect(action.type).toBe(TicketActionTypes.RequestAssign);
    expect(action.ticketId).toBe(ticketId);
    expect(action.userId).toBe(userId);
  });

  it('should create TicketAssignSuccess action', () => {
    const ticket = createTicket();
    const action = new TicketAssignSuccess(ticket);

    expect(action.type).toBe(TicketActionTypes.AssignSuccess);
    expect(action.assigned).toBe(ticket);
  });

  it('should create TicketAssignError action', () => {
    const errorMsg = 'test error message';
    const error = new Error(errorMsg);
    const ticketId = 0;
    const action = new TicketAssignError(ticketId, error);

    expect(action.type).toBe(TicketActionTypes.AssignError);
    expect(action.error).toBe(error);
    expect(action.ticketId).toBe(ticketId);
  });

  it('should create TicketRequestComplete action', () => {
    const ticketId = 312;
    const isCompleted = true;
    const action = new TicketRequestComplete(ticketId, isCompleted);

    expect(action.type).toBe(TicketActionTypes.RequestComplete);
    expect(action.ticketId).toBe(ticketId);
    expect(action.completed).toBe(isCompleted);
  });

  it('should create TicketCompleteSuccess action', () => {
    const ticket = createTicket();
    const action = new TicketCompleteSuccess(ticket);

    expect(action.type).toBe(TicketActionTypes.CompleteSuccess);
    expect(action.completed).toBe(ticket);
  });

  it('should create TicketCompleteError action', () => {
    const errorMsg = 'test error message';
    const error = new Error(errorMsg);
    const ticketId = 0;
    const action = new TicketCompleteError(ticketId, error);

    expect(action.type).toBe(TicketActionTypes.CompleteError);
    expect(action.error).toBe(error);
    expect(action.ticketId).toBe(ticketId);
  });

});
