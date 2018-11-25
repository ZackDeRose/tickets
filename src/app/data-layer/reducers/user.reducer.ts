import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { User } from 'tickets-data-layer/models';
import { UserActions, UserActionTypes } from '../actions/user.actions';
import { createSelector } from '@ngrx/store';
import { dataLayerSelector } from './data-layer.state';

const adapter = createEntityAdapter<User>({
  selectId: user => user.id,
  sortComparer: false
});

type actions = UserActions;

export interface UserState extends EntityState<User> {
  loaded: boolean;
  loading: boolean;
  submitted: boolean;
  submitting: boolean;

  error: string;
}

export const initialUserState: UserState = adapter.getInitialState({
  loaded: false,
  loading: false,
  submitted: false,
  submitting: false,

  error: ''
});

export function userReducer(state = initialUserState, action: UserActions): UserState {
  switch (action.type) {

    case UserActionTypes.RequestLoad: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case UserActionTypes.LoadSuccess: {
      return {
        ...adapter.upsertMany(
          action.loadedData,
          adapter.removeAll(state) // in case Users have been deleted since last load
        ),
        loading: false,
        loaded: true
      };
    }

    case UserActionTypes.LoadError: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error.message
      };
    }

    case UserActionTypes.RequestLoadSingle: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case UserActionTypes.LoadSingleSuccess: {
      return {
        ...adapter.upsertOne(action.user, state),
        loading: false,
        loaded: true
      };
    }

    case UserActionTypes.LoadSingleError: {
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

export const userSelector = createSelector(dataLayerSelector, state => state.users);

const {
  selectAll: adapterSelectAll,
  selectEntities: adapterSelectEntities,
  selectIds: adapterSelectIds,
  selectTotal: adapterSelectTotal
} = adapter.getSelectors();

export const selectUserIds = createSelector(userSelector, adapterSelectIds);
export const selectUserEntities = createSelector(userSelector, adapterSelectEntities);
export const selectAllUsers = createSelector(userSelector, adapterSelectAll);
export const selectUsersTotal = createSelector(userSelector, adapterSelectTotal);

export const usersSubmitting = createSelector(userSelector, state => state.submitting);
export const usersSubmitted = createSelector(userSelector, state => state.submitted);
export const usersLoading = createSelector(userSelector, state => state.loading);
export const usersLoaded = createSelector(userSelector, state => state.loaded);
export const usersError = createSelector(userSelector, state => state.error);
