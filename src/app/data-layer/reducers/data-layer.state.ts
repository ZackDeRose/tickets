import { TicketState } from './ticket.reducer';
import { UserState } from './user.reducer';
import { createFeatureSelector } from '@ngrx/store';

export interface DataLayerState {
  tickets: TicketState;
  users: UserState;
}

export const dataLayerSelector = createFeatureSelector<DataLayerState>('dataLayer');
