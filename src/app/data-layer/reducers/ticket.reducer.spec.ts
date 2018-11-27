import {
  TicketLoadSuccess,
  TicketLoadError,
  TicketRequestAdd,
  TicketAddSuccess,
  TicketRequestAssign,
  TicketAssignSuccess,
  TicketAssignError,
  TicketRequestComplete,
  TicketCompleteSuccess,
  TicketCompleteError,
} from './../actions/ticket.actions';
import { initialTicketState, ticketReducer } from './ticket.reducer';
import { TicketActions, TicketRequestLoad } from 'tickets-data-layer/actions';
import { createTicketState, testTickets, createTicket } from 'testing-utils';
import { Dictionary } from '@ngrx/entity';
import { Ticket } from 'tickets-data-layer/models';

describe('TicketReducer', () => {

  describe('Undefined Action', () => {

    describe('with undefined original state', () => {

      it('should return the initial state', () => {
        const action = {} as TicketActions;
        const state = ticketReducer(undefined, action);

        expect(state).toBe(initialTicketState);
      });

    });

    describe('with a valid original state', () => {

      it('should return the original state', () => {
        const action = {} as TicketActions;
        const originalState = createTicketState();
        const state = ticketReducer(originalState, action);

        expect(state).toBe(originalState);
      });

    });

  });

  describe('RequestLoad Action', () => {

    const action = new TicketRequestLoad();
    const originalState = createTicketState();
    const state = ticketReducer(originalState, action);

    it('should reflect that it has started to load the tickets', () => {
      expect(state.loading).toBeTruthy();
      expect(state.loaded).toBeFalsy();
    });

    it('should not change anything else', () => {
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('LoadSuccess Action', () => {

    const ticketsPayload = [
      ...Object.values(testTickets),
       createTicket({id: 1337, description: 'test ticket'})
    ];
    const action = new TicketLoadSuccess(ticketsPayload);
    const originalState = createTicketState();
    const state = ticketReducer(originalState, action);

    it('should reflect that the tickets are done loading', () => {
      expect(state.loading).toBeFalsy();
      expect(state.loaded).toBeTruthy();
    });

    it('should add the loaded tickets to the store', () => {
      expect(state.ids).toEqual(ticketsPayload.map(ticket => ticket.id));
      const payloadEntities: Dictionary<Ticket> = {};
      ticketsPayload.forEach(ticket => payloadEntities[ticket.id] = ticket);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(payloadEntities));
    });

    it('should not affect the rest of TicketState', () => {
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
    });

    it('should remove tickets from the store if they no longer exist', () => {
      const ticketsPayload2 = [
        createTicket({id: 1337, description: 'test ticket'})
      ];
      const action2 = new TicketLoadSuccess(ticketsPayload2);
      const originalState2 = createTicketState();
      const state2 = ticketReducer(originalState2, action2);

      expect(state2.ids).toEqual(ticketsPayload2.map(ticket => ticket.id));
      const payloadEntities: Dictionary<Ticket> = {};
      ticketsPayload2.forEach(ticket => payloadEntities[ticket.id] = ticket);
      expect(JSON.stringify(state2.entities)).toBe(JSON.stringify(payloadEntities));
    });

  });

  describe('LoadError Action', () => {

    const errorMsg = 'test error message';
    const error = new Error(errorMsg);
    const action = new TicketLoadError(error);
    const originalState = createTicketState();
    const state = ticketReducer(originalState, action);

    it('should reflect that loading is over and it is not loaded', () => {
      expect(state.loading).toBeFalsy();
      expect(state.loaded).toBeFalsy();
    });

    it('should put the error message into the store', () => {
      expect(state.error).toBe(errorMsg);
    });

    it('should maintain the rest of the state', () => {
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.ids).toEqual(originalState.ids);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(originalState.entities));
    });

  });

  describe('RequestAdd Action', () => {

    it('should reflect that it has started to add the ticket', () => {
      const action = new TicketRequestAdd('test description');
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeTruthy();
      expect(state.submitted).toBeFalsy();
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('AddSuccess Action', () => {

    it('should add the ticket to the store', () => {
      const ticket = createTicket({id: 1337, description: 'test'});
      const action = new TicketAddSuccess(ticket);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeFalsy();
      expect(state.submitted).toBeTruthy();
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toContain(ticket.id);

      // all other IDs still there too
      const originalIdsFilteredByNewIds = (originalState.ids as number[]).filter(id =>
        !(state.ids as number[]).includes(id)
      );
      expect(originalIdsFilteredByNewIds.length).toBe(0);

      expect(state.entities).toEqual(jasmine.objectContaining({ [ticket.id]: ticket }));
      expect(state.entities).toEqual(jasmine.objectContaining(originalState.entities));
    });

  });

  describe('LoadError Action', () => {

    it('should put the error message into the store', () => {
      const errorMsg = 'test error message';
      const error = new Error(errorMsg);
      const action = new TicketLoadError(error);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitted).toBeFalsy();
      expect(state.submitting).toBeFalsy();
      expect(state.error).toBe(errorMsg);
      expect(state.ids).toEqual(originalState.ids);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(originalState.entities));
    });

  });

  describe('RequestAssign Action', () => {

    it('should reflect that it has started to assign the ticket', () => {
      const userId = 1;
      const ticketId = 312;
      const action = new TicketRequestAssign(ticketId, userId);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeTruthy();
      expect(state.submitted).toBeFalsy();
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('AssignSuccess Action', () => {

    it('should reflect that it is done submitting and adjust the ticket in the store', () => {
      const originalState = createTicketState();
      const originalTicket = originalState.entities[1];
      const newAssigneeId = 1337;
      const assignedTicket = { ...originalTicket, assigneeId: newAssigneeId };
      const action = new TicketAssignSuccess(assignedTicket);
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeFalsy();
      expect(state.submitted).toBeTruthy();
      expect(state.error).toBe(originalState.error);
      // all previous IDs to still be there
      const originalIdsFilteredByNewIds = (originalState.ids as number[]).filter(id =>
        !(state.ids as number[]).includes(id)
      );
      expect(originalIdsFilteredByNewIds.length).toBe(0);

      expect(state.entities).toEqual(jasmine.objectContaining({ [assignedTicket.id]: assignedTicket }));
    });

  });

  describe('AssignError Action', () => {

    it('should reflect that an error occurred', () => {
      const errorMsg = 'test error message';
      const error = new Error(errorMsg);
      const action = new TicketAssignError(error);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeFalsy();
      expect(state.submitted).toBeFalsy();
      expect(state.error).toBe(errorMsg);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('RequestComplete Action', () => {

    it('should reflect that it has started to adjust the complete property of the ticket', () => {
      const ticketId = 312;
      const isCompleted = true;
      const action = new TicketRequestComplete(ticketId, isCompleted);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeTruthy();
      expect(state.submitted).toBeFalsy();
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('CompleteSuccess Action', () => {

    it('should reflect that it is done submitting and adjust the ticket in the store', () => {
      const originalState = createTicketState();
      const originalTicket = originalState.entities[1];
      const newCompletedId = 1337;
      const completedTicket = { ...originalTicket, assigneeId: newCompletedId };
      const action = new TicketCompleteSuccess(completedTicket);
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeFalsy();
      expect(state.submitted).toBeTruthy();
      expect(state.error).toBe(originalState.error);
      // all previous IDs to still be there
      const originalIdsFilteredByNewIds = (originalState.ids as number[]).filter(id =>
        !(state.ids as number[]).includes(id)
      );
      expect(originalIdsFilteredByNewIds.length).toBe(0);

      expect(state.entities).toEqual(jasmine.objectContaining({ [completedTicket.id]: completedTicket }));
    });

  });

  describe('CompleteError Action', () => {

    it('should reflect that an error occurred', () => {
      const errorMsg = 'test error message';
      const error = new Error(errorMsg);
      const action = new TicketCompleteError(error);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeFalsy();
      expect(state.submitted).toBeFalsy();
      expect(state.error).toBe(errorMsg);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

});
