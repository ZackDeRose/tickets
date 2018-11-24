import { TicketLoadSuccess, TicketLoadError, TicketRequestAdd, TicketAddSuccess } from './../actions/ticket.actions';
import { initialTicketState, ticketReducer } from './ticket.reducer';
import { TicketActions, TicketRequestLoad } from 'tickets-data-layer/actions';
import { createTicketState, testTickets, createTicket } from 'testing-utils';
import { DictionaryNum } from '../../../../node_modules/@ngrx/entity/src/models';
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

    it('should reflect that it was started to load the tickets', () => {
      const action = new TicketRequestLoad();
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBeTruthy();
      expect(state.loaded).toBeFalsy();
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
    });

  });

  describe('LoadSuccess Action', () => {

    it('should load the tickets to the store', () => {
      const ticketsPayload = [
       ...Object.values(testTickets),
        createTicket({id: 1337, description: 'test ticket'})
      ];
      const action = new TicketLoadSuccess(ticketsPayload);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBeFalsy();
      expect(state.loaded).toBeTruthy();
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toEqual(ticketsPayload.map(ticket => ticket.id));
      const payloadEntities: DictionaryNum<Ticket> = {};
      ticketsPayload.forEach(ticket => payloadEntities[ticket.id] = ticket);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(payloadEntities));
    });

    it('should remove tickets from the store if they no longer exist', () => {
      const ticketsPayload = [
        createTicket({id: 1337, description: 'test ticket'})
      ];
      const action = new TicketLoadSuccess(ticketsPayload);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBeFalsy();
      expect(state.loaded).toBeTruthy();
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toEqual(ticketsPayload.map(ticket => ticket.id));
      const payloadEntities: DictionaryNum<Ticket> = {};
      ticketsPayload.forEach(ticket => payloadEntities[ticket.id] = ticket);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(payloadEntities));
    });

  });

  describe('LoadError Action', () => {

    it('should put the error message into the store', () => {
      const errorMsg = 'test error message';
      const error = new Error(errorMsg);
      const action = new TicketLoadError(error);
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBeFalsy();
      expect(state.loaded).toBeFalsy();
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(errorMsg);
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

    it('should reflect that submission completed', () => {
      const action = new TicketAddSuccess();
      const originalState = createTicketState();
      const state = ticketReducer(originalState, action);

      expect(state.loading).toBe(originalState.loading);
      expect(state.loaded).toBe(originalState.loaded);
      expect(state.submitting).toBeFalsy();
      expect(state.submitted).toBeTruthy();
      expect(state.error).toBe(originalState.error);
      expect(state.ids).toBe(originalState.ids);
      expect(state.entities).toBe(originalState.entities);
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

});
