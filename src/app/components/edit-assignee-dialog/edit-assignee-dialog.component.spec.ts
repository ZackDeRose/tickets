import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssigneeDialogComponent } from './edit-assignee-dialog.component';
import { AppModule } from '../../app.module';

describe('EditAssigneeDialogComponent', () => {
  let component: EditAssigneeDialogComponent;
  let fixture: ComponentFixture<EditAssigneeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssigneeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
