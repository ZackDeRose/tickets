import { NewTableComponent } from './new-table/new-table.component';
import { Routes } from '@angular/router';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ticket-list'
  },
  {
    path: 'ticket-list',
    component: TicketListComponent,
    data: { state: 'list' }
  },
  {
    path: 'ticket-details/:id',
    component: TicketDetailsComponent,
    data: { state: 'details' }
  },
  {
    path: 'new-table',
    component: NewTableComponent
  },
  {
    path: '**/**',
    pathMatch: 'full',
    redirectTo: 'ticket-list'
  }
];
