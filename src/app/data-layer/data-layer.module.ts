import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { DataLayerState, ticketReducer, userReducer } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { TicketEffects, UserEffects } from './effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature<DataLayerState>('dataLayer', {
      tickets: ticketReducer,
      users: userReducer
    } as ActionReducerMap<DataLayerState>),
    EffectsModule.forFeature([
      TicketEffects,
      UserEffects
    ])
  ],
})
export class DataLayerModule { }
