import { TicketEffects } from './ticket.effects';
import { BackendService } from '../../backend.service';
import { cold } from 'jasmine-marbles';
import {
  TicketActionTypes,
  TicketLoadSuccess,
  TicketLoadError,
  TicketAddSuccess,
  TicketRequestAdd,
  TicketAddError,
  TicketRequestLoad,
  TicketAssignSuccess,
  TicketCompleteSuccess,
  TicketLoadSingleSuccess,
  TicketLoadSingleError,
  TicketRequestLoadSingle,
  TicketRequestComplete,
  TicketCompleteError,
  TicketRequestAssign,
  TicketAssignError
} from 'tickets-data-layer/actions';
import { Actions } from '@ngrx/effects';
import { testTickets, createTicket, createUser } from 'testing-utils';
import { of } from 'rxjs';

describe('Ticket Effects', () => {

  let service: jasmine.SpyObj<BackendService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('backendService', [
      'tickets',
      'ticket',
      'users',
      'user',
      'newTicket',
      'assign',
      'complete'
    ]);
  });

  describe('loadEffect', () => {

    it('should not emit anything if an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: TicketActionTypes.CompleteError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

    it('should emit TicketLoadSuccess on success', () => {
      const source = cold('a', { a: { type: TicketActionTypes.RequestLoad }});

      const tickets = Object.values(testTickets);

      service.tickets.and.returnValue(of(tickets));

      const expected = cold('a', {
        a: new TicketLoadSuccess(tickets)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

    it('should emit TicketLoadError on error', () => {
      const source = cold('a', { a: { type: TicketActionTypes.RequestLoad }});

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      service.tickets.and.throwError(errorMsg);

      const expected = cold('a', {
        a: new TicketLoadError(error)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

    it('should continue to emit after an error', () => {
      const source = cold('a-b', {
        a: { type: TicketActionTypes.RequestLoad },
        b: { type: TicketActionTypes.RequestLoad }
      });

      const tickets = Object.values(testTickets);

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      let count = 0;
      service.tickets.and.callFake(() => {
        if (count === 0) {
          count++;
          throw error;
        }
        return of(tickets);
      });

      const expected = cold('a-b', {
        a: new TicketLoadError(error),
        b: new TicketLoadSuccess(tickets)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

  });

  describe('addEffect', () => {

    it('should not emit anything if an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: TicketActionTypes.CompleteError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.addEffect$).toBeObservable(expected);
    });

    it('should emit TicketAddSuccess on success', () => {
      const description = 'test description';
      const source = cold('a', { a: new TicketRequestAdd(description)});

      const ticket = createTicket({description});
      service.newTicket.and.returnValue(of(ticket));

      const expected = cold('a', {
        a: new TicketAddSuccess(ticket)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.addEffect$).toBeObservable(expected);
    });

    it('should emit TicketAddError on error', () => {
      const description = 'test description';
      const source = cold('a', { a: new TicketRequestAdd(description)});

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      service.newTicket.and.throwError(errorMsg);

      const expected = cold('a', {
        a: new TicketAddError(error)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.addEffect$).toBeObservable(expected);
    });

    it('should continue to emit after an error', () => {
      const description = 'test description';
      const source = cold('a-b', {
        a: new TicketRequestAdd(description),
        b: new TicketRequestAdd(description)
      });

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      const ticket = createTicket({description});
      let count = 0;
      service.newTicket.and.callFake(() => {
        if (count === 0) {
          count++;
          throw error;
        }
        return of(ticket);
      });

      const expected = cold('a-b', {
        a: new TicketAddError(error),
        b: new TicketAddSuccess(ticket)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.addEffect$).toBeObservable(expected);
    });

  });

  describe('triggerLoad', () => {

    it('should not emit anything id an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: TicketActionTypes.CompleteError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.triggerLoad$).toBeObservable(expected);
    });

    it('should emit a TicketRequestLoad whenever a TicketAddSuccess occurs', () => {
      const ticket = createTicket({id: 1337, description: 'test'});
      const source = cold('a', { a: new TicketAddSuccess(ticket) });
      const expected = cold('a', { a: new TicketRequestLoad() });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.triggerLoad$).toBeObservable(expected);
    });

    it('should emit a TicketRequestLoad whenever a TicketAssignSuccess occurs', () => {
      const ticket = createTicket({id: 1337, description: 'test'});
      const source = cold('a', { a: new TicketAssignSuccess(ticket) });
      const expected = cold('a', { a: new TicketRequestLoad() });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.triggerLoad$).toBeObservable(expected);
    });

    it('should emit a TicketRequestLoad whenever a TicketCinoketeSuccess occurs', () => {
      const ticket = createTicket({id: 1337, description: 'test'});
      const source = cold('a', { a: new TicketCompleteSuccess(ticket) });
      const expected = cold('a', { a: new TicketRequestLoad() });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.triggerLoad$).toBeObservable(expected);
    });

    it('should conitue to emit LoadRequests and ignore other action for all sequences', () => {
      const ticket = createTicket({id: 1337, description: 'test'});
      const source = cold('a-b-c-d-e', {
        a: new TicketCompleteSuccess(ticket),
        b: new TicketRequestLoad(),
        c: new TicketAddSuccess(ticket),
        d: new TicketRequestLoad(),
        e: new TicketAssignSuccess(ticket),
      });
      const expected = cold('a---b---c', {
        a: new TicketRequestLoad(),
        b: new TicketRequestLoad(),
        c: new TicketRequestLoad(),
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.triggerLoad$).toBeObservable(expected);
    });

  });

  describe('loadSingleEffect', () => {

    it('should not emit anything if an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: TicketActionTypes.LoadSingleError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

    it('should emit TicketLoadSingleSuccess on success', () => {
      const source = cold('a', { a: { type: TicketActionTypes.RequestLoadSingle }});

      const ticket = testTickets[0];

      service.ticket.and.returnValue(of(ticket));

      const expected = cold('a', {
        a: new TicketLoadSingleSuccess(ticket)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

    it('should emit TicketLoadSingleError on error', () => {
      const source = cold('a', { a: { type: TicketActionTypes.RequestLoadSingle }});

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      service.ticket.and.throwError(errorMsg);

      const expected = cold('a', {
        a: new TicketLoadSingleError(error)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

    it('should continue to emit after an error', () => {
      const ticketId = 0;
      const source = cold('a-b', {
        a: new TicketRequestLoadSingle(ticketId),
        b: new TicketRequestLoadSingle(ticketId)
      });

      const ticket = testTickets[0];

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      let count = 0;
      service.ticket.and.callFake(() => {
        if (count === 0) {
          count++;
          throw error;
        }
        return of(ticket);
      });

      const expected = cold('a-b', {
        a: new TicketLoadSingleError(error),
        b: new TicketLoadSingleSuccess(ticket)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

  });

  describe('completeEffect', () => {

    it('should not emit anything if an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: TicketActionTypes.CompleteError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.completeEffect$).toBeObservable(expected);
    });

    it('should emit TicketCompleteSuccess on success', () => {
      const ticket = createTicket();
      const source = cold('a', { a: new TicketRequestComplete(ticket.id, !ticket.completed)});

      service.complete.and.returnValue(of({ ...ticket, completed: !ticket.completed }));

      const expected = cold('a', {
        a: new TicketCompleteSuccess({ ...ticket, completed: !ticket.completed })
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.completeEffect$).toBeObservable(expected);
    });

    it('should emit TicketCompleteError on error', () => {
      const ticket = createTicket();
      const source = cold('a', { a: new TicketRequestComplete(ticket.id, !ticket.completed)});

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      service.complete.and.throwError(errorMsg);

      const expected = cold('a', {
        a: new TicketCompleteError(error)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.completeEffect$).toBeObservable(expected);
    });

    it('should continue to emit after an error', () => {
      const ticket = createTicket();
      const source = cold('a-b', {
        a: new TicketRequestComplete(ticket.id, !ticket.completed),
        b: new TicketRequestComplete(ticket.id, !ticket.completed)
      });

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      let count = 0;
      service.complete.and.callFake(() => {
        if (count === 0) {
          count++;
          throw error;
        }
        return of({ ...ticket, completed: !ticket.completed });
      });

      const expected = cold('a-b', {
        a: new TicketCompleteError(error),
        b: new TicketCompleteSuccess({ ...ticket, completed: !ticket.completed })
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.completeEffect$).toBeObservable(expected);
    });

  });

  describe('assignEffect', () => {

    it('should not emit anything if an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: TicketActionTypes.AssignError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.assignEffect$).toBeObservable(expected);
    });

    it('should emit TicketAssignSuccess on success', () => {
      const ticket = createTicket();
      const user = createUser();
      const source = cold('a', { a: new TicketRequestAssign(ticket.id, user.id)});
      const assignedTicket = { ...ticket, assigneeId: user.id };

      service.assign.and.returnValue(of(assignedTicket));

      const expected = cold('a', {
        a: new TicketAssignSuccess(assignedTicket)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.assignEffect$).toBeObservable(expected);
    });

    it('should emit TicketAssignError on error', () => {
      const ticket = createTicket();
      const user = createUser();
      const source = cold('a', { a: new TicketRequestAssign(ticket.id, user.id)});

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      service.assign.and.throwError(errorMsg);

      const expected = cold('a', {
        a: new TicketAssignError(error)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.assignEffect$).toBeObservable(expected);
    });

    it('should continue to emit after an error', () => {
      const ticket = createTicket();
      const user = createUser();
      const source = cold('a-b', {
        a: new TicketRequestAssign(ticket.id, user.id),
        b: new TicketRequestAssign(ticket.id, user.id)
      });
      const assignedTicket = { ...ticket, assigneeId: user.id };

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      let count = 0;
      service.assign.and.callFake(() => {
        if (count === 0) {
          count++;
          throw error;
        }
        return of(assignedTicket);
      });

      const expected = cold('a-b', {
        a: new TicketAssignError(error),
        b: new TicketAssignSuccess(assignedTicket)
      });

      const effects = new TicketEffects(new Actions(source), service);

      expect(effects.assignEffect$).toBeObservable(expected);
    });

  });

});
