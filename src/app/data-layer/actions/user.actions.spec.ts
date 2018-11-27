import { createUser, testUsers } from 'testing-utils';
import {
  UserRequestLoad,
  UserActionTypes,
  UserLoadSuccess,
  UserLoadError
} from './user.actions';


describe('User Actions', () => {

  it('should create UserRequestLoad Action', () => {
    const action = new UserRequestLoad();

    expect(action.type).toBe(UserActionTypes.RequestLoad);
  });

  it('should create UserLoadSuccess Action', () => {
    const users = Object.values(testUsers);
    const action = new UserLoadSuccess(users);

    expect(action.type).toBe(UserActionTypes.LoadSuccess);
    expect(action.loadedData).toEqual(users);
  });

  it('should create UserLoadError Action', () => {
    const errorMsg = 'test error';
    const error = new Error(errorMsg);
    const action = new UserLoadError(error);

    expect(action.type).toBe(UserActionTypes.LoadError);
    expect(action.error).toBe(error);
  });

});
