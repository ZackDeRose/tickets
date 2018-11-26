import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Ticket, User } from 'tickets-data-layer';

// *** NOTE: moved User and Ticket to data-layer.models ***

function randomDelay() {
  return Math.random() * 4000;
}

@Injectable()
export class BackendService {
  storedTickets: Ticket[] = [
    {
      id: 0,
      description: 'Install a monitor arm',
      assigneeId: 111,
      completed: false
    },
    {
      id: 1,
      description: 'Move the desk to the new location',
      assigneeId: 111,
      completed: false
    }
  ];

  storedUsers: User[] = [
    { id: 111, name: 'Victor' },
    { id: 0, name: 'Zack' }
  ]; // ZackDeRose: added another user to make interesting

  lastId = 1;

  constructor() { }

  private findTicketById = id => this.storedTickets.find(ticket => ticket.id === +id);
  private findUserById = id => this.storedUsers.find(user => user.id === +id);

  tickets() {
    return of(this.storedTickets).pipe(delay(randomDelay()));
  }

  ticket(id: number): Observable<Ticket> {
    return of(this.findTicketById(id)).pipe(delay(randomDelay()));
  }

  users() {
    return of(this.storedUsers).pipe(delay(randomDelay()));
  }

  user(id: number) {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTicket(payload: { description: string }) {
    const newTicket: Ticket = {
      id: ++this.lastId,
      description: payload.description,
      assigneeId: null,
      completed: false
    };

    return of(newTicket).pipe(
      delay(randomDelay()),
      tap((ticket: Ticket) => this.storedTickets.push(ticket))
    );
  }

  assign(ticketId: number, userId: number) {
    const foundTicket = this.findTicketById(+ticketId);
    const user = this.findUserById(+userId);

    if (foundTicket && user) {
      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.assigneeId = +userId;
        })
      );
    }

    return throwError(new Error('ticket or user not found'));
  }

  complete(ticketId: number, completed: boolean) {
    const foundTicket = this.findTicketById(+ticketId);
    if (foundTicket) {
      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.completed = completed; // ZackDeRose: changed/fixed??
        })
      );
    }

    return throwError(new Error('ticket not found'));
  }
}
