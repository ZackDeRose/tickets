import { Action } from '@ngrx/store';
import { User } from '../models';

export enum UserActionTypes {
  RequestLoad = '[Backend API] User Request Load',
  LoadSuccess = '[Backend API] User Load Success',
  LoadError = '[Backend API] User Load Error'
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

export type UserActions =
  UserRequestLoad
  | UserLoadSuccess
  | UserLoadError;
