import { Injectable } from '@angular/core';
import {
  UserLoadSuccess,
  UserLoadError,
  UserActionTypes
} from '../actions/user.actions';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { BackendService } from '../../backend.service';

@Injectable()
export class UserEffects {
  @Effect()
  loadEffect$: Observable<UserLoadSuccess | UserLoadError> = this.actions$.pipe(
    ofType(UserActionTypes.RequestLoad),
    switchMap(() => {
      let toReturn: Observable<UserLoadSuccess | UserLoadError>;
      try {
        toReturn = this.backendService.users().pipe(
          map(users => new UserLoadSuccess(users))
        );
      } catch (error) {
        toReturn = of(new UserLoadError(error));
      }
      return toReturn;
    })
  );

  // @Effect()
  // loadSingleEffect$: Observable<UserLoadSingleSuccess | UserLoadSingleError> = this.actions$.pipe(
  //   ofType(UserActionTypes.RequestLoadSingle),
  //   switchMap((action: UserRequestLoadSingle) => {
  //     let toReturn: Observable<UserLoadSingleSuccess | UserLoadSingleError>;
  //     try {
  //       toReturn = this.backendService.user(action.userId).pipe(
  //         map(user => new UserLoadSingleSuccess(user))
  //       );
  //     } catch (error) {
  //       toReturn = of(new UserLoadSingleError(error));
  //     }
  //     return toReturn;
  //   })
  // );

  constructor(private actions$: Actions, private backendService: BackendService) {}
}
