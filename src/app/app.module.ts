import { DataLayerModule } from './data-layer/data-layer.module';
import { BackendService } from './backend.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import {
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDialogModule,
  MatSelectModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { TicketDetailsEffects } from './components/ticket-details/ticket-details.effects';
import { EditAssigneeDialogComponent } from './components/edit-assignee-dialog/edit-assignee-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TicketListComponent,
    TicketDetailsComponent,
    EditAssigneeDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSelectModule,
    DataLayerModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([
      TicketDetailsEffects
    ]),
    StoreDevtoolsModule.instrument({
      name: 'Ticket App',
      maxAge: 100
    }),
    HttpClientModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent],
  entryComponents: [EditAssigneeDialogComponent]
})
export class AppModule { }
