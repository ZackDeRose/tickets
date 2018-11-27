import { DataLayerState } from 'tickets-data-layer/reducers';
import { Ticket, User, TicketState, UserState } from 'tickets-data-layer';
import { Dictionary } from '@ngrx/entity';

export const createTicket: (x?: Partial<Ticket>) => Ticket = ({
  id = 0,
  description = 'Canned test description',
  assigneeId = null,
  completed = false
} = {
  id,
  description,
  assigneeId,
  completed
}) => ({
  id,
  description,
  assigneeId,
  completed
});

export const createUser: (x?: User) => User = ({
  id = 0,
  name = 'Zack'
} = {
  id,
  name
}) => ({
  id,
  name
});

export const testTickets: Dictionary<Ticket> = {
  0: createTicket({ id: 0, description: 'Tickets App - Hiring Test', assigneeId: 0 }),
  1: createTicket({ id: 1, description: 'That Task No One Wants To Do' }),
  2: createTicket({ id: 2, description: 'Clean Room', assigneeId: 0, completed: true }),
  3: createTicket({ id: 3, description: '', assigneeId: 0, completed: false }),
  4: createTicket({ id: 4, description: 'Tickets App - Hiring Test', assigneeId: 0, completed: false })
};

export const createTicketState: (x?: Partial<TicketState>) => TicketState = ({
  ids = Object.values(testTickets).map(ticket => ticket.id),
  entities = { ...testTickets },
  loading = 0,
  adding = 0,
  submitting = {},
  error = ''
} = {
  ids,
  entities,
  loading,
  adding,
  submitting,
  error
}) => ({
  ids,
  entities,
  loading,
  adding,
  submitting,
  error
});

export const testUsers: Dictionary<User> = {
  0: createUser({ id: 0, name: 'Zack' }), // wishful thinking!!
  1: createUser({ id: 1, name: 'Victor' }),
  2: createUser({ id: 2, name: 'Dan' }),
  3: createUser({ id: 3, name: 'Ayşegül' }),
  4: createUser({ id: 4, name: 'Jack' }),
  5: createUser({ id: 5, name: 'Thomas' }),
  6: createUser({ id: 6, name: 'Amanda' }),
  7: createUser({ id: 7, name: 'Jeff' }),
  8: createUser({ id: 8, name: 'James' }),
  9: createUser({ id: 9, name: 'Benjamin' }),
  10: createUser({ id: 10, name: 'Jason' }),
  11: createUser({ id: 11, name: 'Nitin' }),
  12: createUser({ id: 12, name: 'Justin' }),
  13: createUser({ id: 13, name: 'Torgeir' }),
};

export const createUserState: (x?: UserState) => UserState = ({
  ids = Object.values(testUsers).map(user => user.id),
  entities = { ...testUsers },
  loaded = false,
  loading = false,
  submitted = false,
  submitting = false,
  error = ''
} = {
  ids,
  entities,
  loaded,
  loading,
  submitted,
  submitting,
  error
}) => ({
  ids,
  entities,
  loaded,
  loading,
  submitted,
  submitting,
  error
});


export const createDataLayerState: (x?: DataLayerState) => DataLayerState = ({
  tickets = createTicketState(),
  users = createUserState()
} = {
  tickets,
  users
}) => ({
  tickets,
  users
});
