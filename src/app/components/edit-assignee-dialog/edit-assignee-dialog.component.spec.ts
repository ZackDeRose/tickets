import { FormControl } from '@angular/forms';
import { TicketListEditAssignee } from './../ticket-list/ticket-list.actions';

import { Store } from '@ngrx/store';
import { AppModule } from './../../app.module';
import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';

import { EditAssigneeDialogComponent } from './edit-assignee-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { createUser, createTicket } from 'testing-utils';

describe('EditAssigneeDialogComponent', () => {
  let component: EditAssigneeDialogComponent;
  let fixture: ComponentFixture<EditAssigneeDialogComponent>;
  let store: Store<any>;
  const listConfig = {
    data: {
      ticketId: 1,
      parent: 'list'
    }
  };
  const detailConfig = {
    data: {
      ticketId: 1,
      parent: 'detail'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:  [
        AppModule
      ],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: listConfig},
        {provide: MatDialogRef, useValue: {}}
      ],
    }).compileComponents();

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(EditAssigneeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // console.log(dialogue);

    // noop = TestBed.createComponent(NoopComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('From ticket-list component', () => {
    it(`should have 'Edit Assigneet' as it's title`, () => {
      const h1 = fixture.nativeElement.querySelector('h1');
      expect(h1.textContent).toBe('Edit Assignee');
    });

    it(`should dipatch a TicketListEditAssignee when submit is called`, fakeAsync(() => {
      const user = createUser({ id: 2 });
      component.userForm = new FormControl(user);
      console.log(component.data);
      component.submit();

      const expectedAction = new TicketListEditAssignee(1, user.id);
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
