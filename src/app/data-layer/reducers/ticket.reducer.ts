import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Ticket } from 'tickets-data-layer/models';
import { TicketActions, TicketActionTypes } from 'tickets-data-layer/actions';
import { createSelector } from '@ngrx/store';
import { dataLayerSelector } from './data-layer.state';
import { convertToR3QueryMetadata } from '../../../../node_modules/@angular/core/src/render3/jit/directive';

const adapter = createEntityAdapter<Ticket>({
  selectId: ticket => ticket.id,
  sortComparer: false
});

export interface TicketState extends EntityState<Ticket> {
  loaded: boolean;
  loading: boolean;
  submitted: boolean;
  submitting: boolean;

  error: string;
}

export const initialTicketState: TicketState = adapter.getInitialState({
  loaded: false,
  loading: false,
  submitted: false,
  submitting: false,

  error: ''
});

export function ticketReducer(state = initialTicketState, action: TicketActions): TicketState {
  switch (action.type) {

    case TicketActionTypes.RequestLoad: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case TicketActionTypes.LoadSuccess: {
      return adapter.upsertMany(
        action.loadedData,
        {
          ...adapter.removeAll(state), // in case tickets have been deleted since last load
          loading: false,
          loaded: true
        }
      );
    }

    case TicketActionTypes.LoadError: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error.message
      };
    }

    case TicketActionTypes.RequestAdd: {
      return {
        ...state,
        submitting: true,
        submitted: false
      };
    }

    case TicketActionTypes.AddSuccess: {
      return {
        ...adapter.upsertOne(action.added, state),
        submitting: false,
        submitted: true
      };
    }

    case TicketActionTypes.AddError: {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.error.message
      };
    }

    case TicketActionTypes.RequestAssign: {
      return {
        ...state,
        submitting: true,
        submitted: false,
      };
    }

    case TicketActionTypes.AssignSuccess: {
      return {
        ...adapter.upsertOne(action.assigned, state),
        submitting: false,
        submitted: true
      };
    }

    case TicketActionTypes.AssignError: {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.error.message
      };
    }

    case TicketActionTypes.RequestComplete: {
      return {
        ...state,
        submitting: true,
        submitted: false
      };
    }

    case TicketActionTypes.CompleteSuccess: {
      return {
        ...adapter.upsertOne(action.completed, state),
        submitting: false,
        submitted: true
      };
    }

    case TicketActionTypes.CompleteError: {
      return {
        ...state,
        submitting: false,
        submitted: false,
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
export const ticketsSubmitted = createSelector(ticketSelector, state => state.submitted);
export const ticketsLoading = createSelector(ticketSelector, state => state.loading);
export const ticketsLoaded = createSelector(ticketSelector, state => state.loaded);
export const ticketsError = createSelector(ticketSelector, state => state.error);
