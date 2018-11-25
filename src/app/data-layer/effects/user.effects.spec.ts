import { of } from 'rxjs';
import { testUsers } from 'testing-utils';
import { Actions } from '@ngrx/effects';
import { UserEffects } from './user.effects';
import { cold } from 'jasmine-marbles';
import { BackendService } from '../../backend.service';
import {
  UserActionTypes,
  UserLoadSuccess,
  UserLoadSingleSuccess,
  UserRequestLoadSingle,
  UserLoadSingleError
} from 'tickets-data-layer/actions';
import { UserLoadError } from 'tickets-data-layer/actions';

describe('User Effects', () => {

  let service: jasmine.SpyObj<BackendService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('backendService', [
      'users',
      'user',
      'assign',
      'complete'
    ]);
  });

  describe('loadEffect', () => {

    it('should not emit anything if an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: UserActionTypes.LoadSingleError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

    it('should emit UserLoadSuccess on success', () => {
      const source = cold('a', { a: { type: UserActionTypes.RequestLoad }});

      const users = Object.values(testUsers);

      service.users.and.returnValue(of(users));

      const expected = cold('a', {
        a: new UserLoadSuccess(users)
      });

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

    it('should emit UserLoadError on error', () => {
      const source = cold('a', { a: { type: UserActionTypes.RequestLoad }});

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      service.users.and.throwError(errorMsg);

      const expected = cold('a', {
        a: new UserLoadError(error)
      });

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

    it('should continue to emit after an error', () => {
      const source = cold('a-b', {
        a: { type: UserActionTypes.RequestLoad },
        b: { type: UserActionTypes.RequestLoad }
      });

      const users = Object.values(testUsers);

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      let count = 0;
      service.users.and.callFake(() => {
        if (count === 0) {
          count++;
          throw error;
        }
        return of(users);
      });

      const expected = cold('a-b', {
        a: new UserLoadError(error),
        b: new UserLoadSuccess(users)
      });

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadEffect$).toBeObservable(expected);
    });

  });

  describe('loadSingleEffect', () => {

    it('should not emit anything if an unwatched action occurs', () => {
      const source = cold('a-b-c', {
        a: { type: UserActionTypes.LoadSingleError},
        b: { type: 'test action type'},
        c: { name: 'this one is not even an action'}
      });
      const expected = cold('---', {});

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

    it('should emit UserLoadSingleSuccess on success', () => {
      const source = cold('a', { a: { type: UserActionTypes.RequestLoadSingle }});

      const user = testUsers[0];

      service.user.and.returnValue(of(user));

      const expected = cold('a', {
        a: new UserLoadSingleSuccess(user)
      });

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

    it('should emit UserLoadSingleError on error', () => {
      const source = cold('a', { a: { type: UserActionTypes.RequestLoadSingle }});

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      service.user.and.throwError(errorMsg);

      const expected = cold('a', {
        a: new UserLoadSingleError(error)
      });

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

    it('should continue to emit after an error', () => {
      const userId = 0;
      const source = cold('a-b', {
        a: new UserRequestLoadSingle(userId),
        b: new UserRequestLoadSingle(userId)
      });

      const user = testUsers[0];

      const errorMsg = 'test Error';
      const error = new Error(errorMsg);
      let count = 0;
      service.user.and.callFake(() => {
        if (count === 0) {
          count++;
          throw error;
        }
        return of(user);
      });

      const expected = cold('a-b', {
        a: new UserLoadSingleError(error),
        b: new UserLoadSingleSuccess(user)
      });

      const effects = new UserEffects(new Actions(source), service);

      expect(effects.loadSingleEffect$).toBeObservable(expected);
    });

  });

});
