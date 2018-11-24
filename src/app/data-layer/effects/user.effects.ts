import { Injectable } from '@angular/core';
import {
  UserLoadSuccess,
  UserLoadError,
  UserActionTypes,
  UserAddSuccess,
  UserAddError,
  UserRequestAdd
} from '../actions/user.actions';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { BackendService } from '../../backend.service';

@Injectable()
export class UserEffects {
  @Effect()
  loadEffect$: Observable<UserLoadSuccess | UserLoadError> = this.actions$.pipe(
    ofType(UserActionTypes.RequestLoad),
    switchMap(() => this.backendService.users().pipe(
      map(users => new UserLoadSuccess(users))
    ))
    // TODO: Handle errors???
  );

  constructor(private actions$: Actions, private backendService: BackendService) {}
}
