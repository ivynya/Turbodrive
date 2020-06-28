import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultData } from '../../../../core/mocks/test-data';

import { DueDateTimePipe } from '../../../../shared/pipes/due-date-time.pipe';
import { CardAssignmentComponent } from './assignment.component';

describe('CardAssignmentComponent', () => {
  let component: CardAssignmentComponent;
  let fixture: ComponentFixture<CardAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DueDateTimePipe, CardAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAssignmentComponent);
    component = fixture.componentInstance;
    component.assignment = DefaultData.courseData["123"].assignments[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
