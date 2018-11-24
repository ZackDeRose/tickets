import { Action } from '@ngrx/store';
import { User } from '../models';

export enum UserActionTypes {
  RequestLoad = '[Backend API] User Request Load',
  LoadSuccess = '[Backend API] User Load Success',
  LoadError = '[Backend API] User Load Error',
  RequestAdd = '[Backend API] User Request Add',
  AddSuccess = '[Backend API] User Add Success',
  AddError = '[Backend API] User Add Error',
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

export class UserRequestAdd implements Action {
  readonly type = UserActionTypes.RequestAdd;

  constructor(public description: string) {}
}

export class UserAddSuccess implements Action {
  readonly type = UserActionTypes.AddSuccess;
}

export class UserAddError implements Action {
  readonly type = UserActionTypes.AddError;

  constructor(public error: Error) {}
}

export type UserActions =
  UserRequestLoad
  | UserLoadSuccess
  | UserLoadError
  | UserRequestAdd
  | UserAddSuccess
  | UserAddError;
