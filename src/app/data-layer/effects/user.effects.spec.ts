import { of } from 'rxjs';
import { testUsers } from 'testing-utils';
import { Actions } from '@ngrx/effects';
import { UserEffects } from './user.effects';
import { cold } from 'jasmine-marbles';
import { BackendService } from '../../backend.service';
import {
  UserActionTypes,
  UserLoadSuccess,
  UserLoadError
} from '../actions';

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
        a: { type: UserActionTypes.LoadError},
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

});
