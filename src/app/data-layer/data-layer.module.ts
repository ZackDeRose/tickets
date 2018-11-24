import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { DataLayerState, ticketReducer, userReducer } from 'tickets-data-layer/reducers';
import { EffectsModule } from '@ngrx/effects';
import { TicketEffects, UserEffects } from 'tickets-data-layer/effects';

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
