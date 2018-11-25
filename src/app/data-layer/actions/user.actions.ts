import { Action } from '@ngrx/store';
import { User } from '../models';

export enum UserActionTypes {
  RequestLoad = '[Backend API] User Request Load',
  LoadSuccess = '[Backend API] User Load Success',
  LoadError = '[Backend API] User Load Error',
  RequestLoadSingle = '[Backend API] User Request Load Single',
  LoadSingleError = '[Backend API] User Load Single Error',
  LoadSingleSuccess = '[Backend API] User Load Single Success',
}

export class UserRequestLoad implements Action {
  readonly type = UserActionTypes.RequestLoad;
}

export class UserLoadSuccess implements Action {
  readonly type = UserActionTypes.LoadSuccess;

  constructor(public loadedData: User[]) {}
}

export class UserLoadError implements Action {
  readonly type = UserActionTypes.LoadError;

  constructor(public error: Error) {}
}

export class UserRequestLoadSingle implements Action {
  readonly type = UserActionTypes.RequestLoadSingle;

  constructor(public userId: number) {}
}

export class UserLoadSingleSuccess implements Action {
  readonly type = UserActionTypes.LoadSingleSuccess;

  constructor(public user: User) {}
}

export class UserLoadSingleError implements Action {
  readonly type = UserActionTypes.LoadSingleError;

  constructor(public error: Error) {}
}

export type UserActions =
  UserRequestLoad
  | UserLoadSuccess
  | UserLoadError
  | UserRequestLoadSingle
  | UserLoadSingleSuccess
  | UserLoadSingleError;
