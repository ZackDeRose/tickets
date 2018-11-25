import { createUser, testUsers } from 'testing-utils';
import {
  UserRequestLoad,
  UserActionTypes,
  UserLoadSuccess,
  UserLoadError,
  UserRequestLoadSingle,
  UserLoadSingleSuccess,
  UserLoadSingleError
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

  it('should create UserRequestLoadSingle Action', () => {
    const id = 1337;
    const action = new UserRequestLoadSingle(id);

    expect(action.type).toBe(UserActionTypes.RequestLoadSingle);
    expect(action.userId).toBe(id);
  });

  it('should create UserLoadSingleSuccess Action', () => {
    const user = createUser();
    const action = new UserLoadSingleSuccess(user);

    expect(action.type).toBe(UserActionTypes.LoadSingleSuccess);
    expect(action.user).toEqual(user);
  });

  it('should create UserLoadSingleError Action', () => {
    const errorMsg = 'test error';
    const error = new Error(errorMsg);
    const action = new UserLoadSingleError(error);

    expect(action.type).toBe(UserActionTypes.LoadSingleError);
    expect(action.error).toBe(error);
  });

});
