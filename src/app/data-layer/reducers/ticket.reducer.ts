import { createEntityAdapter, EntityState, Dictionary } from '@ngrx/entity';
import { Ticket } from '../models';
import { TicketActions, TicketActionTypes } from '../actions';
import { createSelector } from '@ngrx/store';
import { dataLayerSelector } from './data-layer.state';

const adapter = createEntityAdapter<Ticket>({
  selectId: ticket => ticket.id,
  sortComparer: false
});

export interface TicketPendingChanges {
  completed?: number;
  assignee?: number;
}

export interface TicketState extends EntityState<Ticket> {
  loading: number;
  adding: number;
  submitting: Dictionary<TicketPendingChanges>;

  error: string;
}

export const initialTicketState: TicketState = adapter.getInitialState({
  loading: 0,
  adding: 0,
  submitting: {},

  error: ''
});

export function ticketReducer(state = initialTicketState, action: TicketActions): TicketState {
  switch (action.type) {

    case TicketActionTypes.RequestLoad: {
      return {
        ...state,
        loading: ++state.loading,
      };
    }

    case TicketActionTypes.LoadSuccess: {
      return adapter.upsertMany(
        action.loadedData,
        {
          ...adapter.removeAll(state), // in case tickets have been deleted since last load
          loading: --state.loading,
        }
      );
    }

    case TicketActionTypes.LoadError: {
      return {
        ...state,
        loading: --state.loading,
        error: action.error.message
      };
    }

    case TicketActionTypes.RequestAdd: {
      return {
        ...state,
        adding: ++state.adding
      };
    }

    case TicketActionTypes.AddSuccess: {
      return {
        ...adapter.upsertOne(action.added, state),
        adding: --state.adding,
      };
    }

    case TicketActionTypes.AddError: {
      return {
        ...state,
        adding: state.adding - 1,
        error: action.error.message
      };
    }

    case TicketActionTypes.RequestAssign: {
      return {
        ...state,
        submitting: {
          ...state.submitting,
          [action.ticketId]: state.submitting[action.ticketId]
            ? {
              ...state.submitting[action.ticketId],
              assignee: state.submitting[action.ticketId].assignee
                ? ++state.submitting[action.ticketId].assignee
                : 1
            }
            : { assignee: 1 }
        }
      };
    }

    case TicketActionTypes.AssignSuccess: {
      return {
        ...adapter.upsertOne(action.assigned, state),
        submitting: {
          ...state.submitting,
          [action.assigned.id]: {
            ...state.submitting[action.assigned.id],
            assignee: --state.submitting[action.assigned.id].assignee
          }
        },
      };
    }

    case TicketActionTypes.AssignError: {
      return {
        ...state,
        submitting: {
          ...state.submitting,
          [action.ticketId]: {
            ...state.submitting[action.ticketId],
            assignee: --state.submitting[action.ticketId].assignee
          }
        },
        error: action.error.message
      };
    }

    case TicketActionTypes.RequestComplete: {
      return {
        ...state,
        submitting: {
          ...state.submitting,
          [action.ticketId]: state.submitting[action.ticketId]
            ? {
              ...state.submitting[action.ticketId],
              completed: state.submitting[action.ticketId].completed
                ? state.submitting[action.ticketId].completed++
                : 1
            }
            : { completed: 1 }
        }
      };
    }

    case TicketActionTypes.CompleteSuccess: {
      return {
        ...adapter.upsertOne(action.completed, state),
        submitting: {
          ...state.submitting,
          [action.completed.id]: {
            ...state.submitting[action.completed.id],
            completed: --state.submitting[action.completed.id].completed
          }
        },
      };
    }

    case TicketActionTypes.CompleteError: {
      return {
        ...state,
        submitting: {
          ...state.submitting,
          [action.ticketId]: {
            ...state.submitting[action.ticketId],
            completed: --state.submitting[action.ticketId].completed
          }
        },
        error: action.error.message
      };
    }

    default: return state;
  }
}

export const ticketSelector = createSelector(dataLayerSelector, state => state.tickets);

const {
  selectAll: adapterSelectAll,
  selectEntities: adapterSelectEntities,
  selectIds: adapterSelectIds,
  selectTotal: adapterSelectTotal
} = adapter.getSelectors();

export const selectTicketIds = createSelector(ticketSelector, adapterSelectIds);
export const selectTicketEntities = createSelector(ticketSelector, adapterSelectEntities);
export const selectAllTickets = createSelector(ticketSelector, adapterSelectAll);
export const selectTicketsTotal = createSelector(ticketSelector, adapterSelectTotal);

export const ticketsSubmitting = createSelector(ticketSelector, state => state.submitting);
export const ticketsLoading = createSelector(ticketSelector, state => state.loading);
export const ticketsAdding = createSelector(ticketSelector, state => state.adding);
export const ticketsError = createSelector(ticketSelector, state => state.error);

export const ticketAssigning = (id: number) => createSelector(ticketsSubmitting, submitting => {
  return submitting[id] ? submitting[id].assignee > 0 : false;
});

export const ticketCompleting = (id: number) => createSelector(ticketsSubmitting, submitting => {
  return submitting[id] ? submitting[id].completed > 0 : false;
});
