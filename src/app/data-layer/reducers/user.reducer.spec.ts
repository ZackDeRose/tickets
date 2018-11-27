import { User } from 'tickets-data-layer/models';
import { Dictionary } from '@ngrx/entity';
import { userReducer, initialUserState } from './user.reducer';
import {
  UserActions,
  UserRequestLoad,
  UserLoadSuccess,
  UserLoadError
} from 'tickets-data-layer/actions';
import { createUserState, testUsers, createUser } from 'testing-utils';

describe('UserReducer', () => {

  describe('Undefined Action', () => {

    describe('with undefined original state', () => {

      it('should return the initial state', () => {
        const action = {} as UserActions;
        const state = userReducer(undefined, action);

        expect(state).toBe(initialUserState);
      });

    });

    describe('with a valid original state', () => {

      it('should return the original state', () => {
        const action = {} as UserActions;
        const originalState = createUserState();
        const state = userReducer(originalState, action);

        expect(state).toBe(originalState);
      });

    });

  });

  describe('RequestLoad Action', () => {

    const action = new UserRequestLoad();
    const originalState = createUserState();
    const state = userReducer(originalState, action);

    it('should reflect that it has started to load the users', () => {
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

    const usersPayload = [
      ...Object.values(testUsers),
       createUser({id: 99, name: 'Claire Bear'})
    ];
    const action = new UserLoadSuccess(usersPayload);
    const originalState = createUserState();
    const state = userReducer(originalState, action);

    it('should reflect that the users are done loading', () => {
      expect(state.loading).toBeFalsy();
      expect(state.loaded).toBeTruthy();
    });

    it('should add the loaded users to the store', () => {
      expect(state.ids).toEqual(usersPayload.map(user => user.id));
      const payloadEntities: Dictionary<User> = {};
      usersPayload.forEach(user => payloadEntities[user.id] = user);
      expect(JSON.stringify(state.entities)).toBe(JSON.stringify(payloadEntities));
    });

    it('should not affect the rest of UserState', () => {
      expect(state.submitted).toBe(originalState.submitted);
      expect(state.submitting).toBe(originalState.submitting);
      expect(state.error).toBe(originalState.error);
    });

    it('should remove users from the store if they no longer exist', () => {
      const usersPayload2 = [
        createUser({id: 78787, name: 'Avie'})
      ];
      const action2 = new UserLoadSuccess(usersPayload2);
      const originalState2 = createUserState();
      const state2 = userReducer(originalState2, action2);

      expect(state2.ids).toEqual(usersPayload2.map(user => user.id));
      const payloadEntities: Dictionary<User> = {};
      usersPayload2.forEach(user => payloadEntities[user.id] = user);
      expect(JSON.stringify(state2.entities)).toBe(JSON.stringify(payloadEntities));
    });

  });

  describe('LoadError Action', () => {

    const errorMsg = 'test error message';
    const error = new Error(errorMsg);
    const action = new UserLoadError(error);
    const originalState = createUserState();
    const state = userReducer(originalState, action);

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

});
