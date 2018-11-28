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
  TicketAddError,
} from './../actions/ticket.actions';
import { initialTicketState, ticketReducer } from './ticket.reducer';
import { TicketActions, TicketRequestLoad } from '../actions';
import { createTicketState, testTickets, createTicket } from 'testing-utils';
import { Dictionary } from '@ngrx/entity';
import { Ticket } from '../models';

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

    it('should reflect that it is loading tickets', () => {
      expect(state.loading).toBe(1);
    });

    it('should not change anything else', () => {
      expect(state.adding).toBe(originalState.adding);
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
    const originalState = createTicketState({ loading: 1 });
    const state = ticketReducer(originalState, action);

    it('should reflect that the tickets are not currently loading', () => {
      expect(state.loading).toBe(0);
    });

    it('should add the loaded tickets to the store', () => {
      expect(state.ids).toEqual(ticketsPayload.map(ticket => ticket.id));
      const payloadEntities: Dictionary<Ticket> = {};
      ticketsPayload.forEach(ticket => payloadEntities[ticket.id] = ticket);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(payloadEntities));
    });

    it('should not affect the rest of TicketState', () => {
      expect(state.adding).toBe(originalState.adding);
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
    const originalState = createTicketState({ loading: 1 });
    const state = ticketReducer(originalState, action);

    it('should reflect that it is no longer loading', () => {
      expect(state.loading).toBe(0);
    });

    it('should put the error message into the store', () => {
      expect(state.error).toBe(errorMsg);
    });

    it('should maintain the rest of the state', () => {
      expect(state.adding).toBe(originalState.adding);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.ids).toEqual(originalState.ids);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(originalState.entities));
    });

  });

  describe('RequestAdd Action', () => {
    const action = new TicketRequestAdd('test description');
    const originalState = createTicketState();
    const state = ticketReducer(originalState, action);

    it('should reflect that it is adding a ticket', () => {
      expect(state.adding).toBe(1);
    });

    it('should not affect anything else in the state', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.adding).toBe(originalState.adding);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('AddSuccess Action', () => {

    const ticket = createTicket({id: 1337, description: 'test'});
    const action = new TicketAddSuccess(ticket);
    const originalState = createTicketState({ adding: 1 });
    const state = ticketReducer(originalState, action);

    it('should reflect that the ticket is no longer adding', () => {
      expect(state.adding).toBe(0);
    });

    it('should add the ticket to the store', () => {
      expect(state.ids).toContain(ticket.id);
      expect(state.entities).toEqual(jasmine.objectContaining({ [ticket.id]: ticket }));
    });

    it('should still have all previous entities as well', () => {
      const originalIdsFilteredByNewIds = (originalState.ids as number[]).filter(id =>
        !(state.ids as number[]).includes(id)
      );
      expect(originalIdsFilteredByNewIds.length).toBe(0);
      expect(state.entities).toEqual(jasmine.objectContaining(originalState.entities));
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
    });

  });

  describe('AddError Action', () => {
    const errorMsg = 'test error message';
    const error = new Error(errorMsg);
    const action = new TicketAddError(error);
    const originalState = createTicketState({ adding: 1 });
    const state = ticketReducer(originalState, action);

    it('should put the error message into the store', () => {
      expect(state.error).toBe(errorMsg);
    });

    it('should reflect that it is no longer adding this ticket', () => {
      expect(state.adding).toBe(0);
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('RequestAssign Action', () => {
    const userId = 1;
    const ticketId = 312;
    const action = new TicketRequestAssign(ticketId, userId);
    const originalState = createTicketState({
      submitting: {
        123: { assignee: 1 },
        321: { completed: 1 },
        312: { completed: 1 }
      }
    });
    const state = ticketReducer(originalState, action);

    it('should increase the submitting.assignee value corresponding to the ticket id', () => {
      expect(state.submitting[312].assignee).toBe(1);
    });

    it('should leave the completed value for the ticket id untouched', () => {
      expect(state.submitting[312].completed).toBe(1);
    });

    it('should leave the rest of the submitting values the same', () => {
      const submittingState = state.submitting;
      delete submittingState[312];
      expect(submittingState).toEqual({
        123: { assignee: 1 },
        321: { completed: 1 }
      });
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.adding).toBe(originalState.adding);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('AssignSuccess Action', () => {
    const originalState = createTicketState({
      submitting: {
        123: { assignee: 1 },
        321: { completed: 1 },
        312: { assignee: 1, completed: 1 }
      },
      entities: {
        123: createTicket({id: 123}),
        321: createTicket({id: 321}),
        312: createTicket({id: 312})
      },
      ids: [123, 321, 312]
    });
    const originalTicket = originalState.entities[312];
    const newAssigneeId = 0;
    const assignedTicket = { ...originalTicket, assigneeId: newAssigneeId };
    const action = new TicketAssignSuccess(assignedTicket);
    const state = ticketReducer(originalState, action);

    it('should decrease the submitting.assignee value of the corresponding ticket', () => {
      expect(state.submitting[312].assignee).toBe(0);
    });

    it('should leave the submitting.completed value for the ticket id untouched', () => {
      expect(state.submitting[312].completed).toBe(1);
    });

    it('should leave the rest of the submitting values the same', () => {
      const submittingState = state.submitting;
      delete submittingState[312];
      expect(submittingState).toEqual({
        123: { assignee: 1 },
        321: { completed: 1 }
      });
    });

    it('should adjust the value of the returned ticket in the store', () => {
      expect(state.entities[312]).toEqual(assignedTicket);
    });

    it('should leave the other tickets in the store untouched', () => {
      expect(state.entities[123]).toBe(originalState.entities[123]);
      expect(state.entities[321]).toBe(originalState.entities[321]);
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.adding).toBe(originalState.adding);
    });

  });

  describe('AssignError Action', () => {
    const originalState = createTicketState({
      submitting: {
        123: { assignee: 1 },
        321: { completed: 1 },
        312: { assignee: 1, completed: 1 }
      },
      entities: {
        123: createTicket({id: 123}),
        321: createTicket({id: 321}),
        312: createTicket({id: 312})
      },
      ids: [123, 321, 312]
    });
    const errorMsg = 'test error';
    const error = new Error(errorMsg);
    const action = new TicketAssignError(312, error);
    const state = ticketReducer(originalState, action);

    it('should put the error message into the store', () => {
      expect(state.error).toBe(errorMsg);
    });

    it('should decrease the submitting.assignee value of the corresponding ticket', () => {
      expect(state.submitting[312].assignee).toBe(0);
    });

    it('should leave the submitting.completed value for the ticket id untouched', () => {
      expect(state.submitting[312].completed).toBe(1);
    });

    it('should leave the rest of the submitting values the same', () => {
      const submittingState = state.submitting;
      delete submittingState[312];
      expect(submittingState).toEqual({
        123: { assignee: 1 },
        321: { completed: 1 }
      });
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.adding).toBe(originalState.adding);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('RequestComplete Action', () => {

    const ticketId = 312;
    const action = new TicketRequestComplete(ticketId, true);
    const originalState = createTicketState({
      submitting: {
        123: { assignee: 1 },
        321: { completed: 1 },
        312: { assignee: 1 }
      }
    });
    const state = ticketReducer(originalState, action);

    it('should increase the submitting.completed value corresponding to the ticket id', () => {
      expect(state.submitting[312].completed).toBe(1);
    });

    it('should leave the assignee value for the ticket id untouched', () => {
      expect(state.submitting[312].assignee).toBe(1);
    });

    it('should leave the rest of the submitting values the same', () => {
      const submittingState = state.submitting;
      delete submittingState[312];
      expect(submittingState).toEqual({
        123: { assignee: 1 },
        321: { completed: 1 }
      });
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.adding).toBe(originalState.adding);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('CompleteSuccess Action', () => {

    const originalState = createTicketState({
      submitting: {
        123: { assignee: 1 },
        321: { completed: 1 },
        312: { assignee: 1, completed: 1 }
      },
      entities: {
        123: createTicket({id: 123}),
        321: createTicket({id: 321}),
        312: createTicket({id: 312})
      },
      ids: [123, 321, 312]
    });
    const originalTicket = originalState.entities[312];
    const newAssigneeId = 0;
    const assignedTicket = { ...originalTicket, assigneeId: newAssigneeId };
    const action = new TicketCompleteSuccess(assignedTicket);
    const state = ticketReducer(originalState, action);

    it('should decrease the submitting.completed value of the corresponding ticket', () => {
      expect(state.submitting[312].completed).toBe(0);
    });

    it('should leave the submitting.assignee value for the ticket id untouched', () => {
      expect(state.submitting[312].assignee).toBe(1);
    });

    it('should leave the rest of the submitting values the same', () => {
      const submittingState = state.submitting;
      delete submittingState[312];
      expect(submittingState).toEqual({
        123: { assignee: 1 },
        321: { completed: 1 }
      });
    });

    it('should adjust the value of the returned ticket in the store', () => {
      expect(state.entities[312]).toEqual(assignedTicket);
    });

    it('should leave the other tickets in the store untouched', () => {
      expect(state.entities[123]).toBe(originalState.entities[123]);
      expect(state.entities[321]).toBe(originalState.entities[321]);
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.adding).toBe(originalState.adding);
    });

  });

  describe('CompleteError Action', () => {

    const originalState = createTicketState({
      submitting: {
        123: { assignee: 1 },
        321: { completed: 1 },
        312: { assignee: 1, completed: 1 }
      },
      entities: {
        123: createTicket({id: 123}),
        321: createTicket({id: 321}),
        312: createTicket({id: 312})
      },
      ids: [123, 321, 312]
    });
    const errorMsg = 'test error';
    const error = new Error(errorMsg);
    const action = new TicketCompleteError(312, error);
    const state = ticketReducer(originalState, action);

    it('should put the error message into the store', () => {
      expect(state.error).toBe(errorMsg);
    });

    it('should decrease the submitting.completed value of the corresponding ticket', () => {
      expect(state.submitting[312].completed).toBe(0);
    });

    it('should leave the submitting.assignee value for the ticket id untouched', () => {
      expect(state.submitting[312].assignee).toBe(1);
    });

    it('should leave the rest of the submitting values the same', () => {
      const submittingState = state.submitting;
      delete submittingState[312];
      expect(submittingState).toEqual({
        123: { assignee: 1 },
        321: { completed: 1 }
      });
    });

    it('should leave the rest of the state unaffected', () => {
      expect(state.loading).toBe(originalState.loading);
      expect(state.adding).toBe(originalState.adding);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

});
