import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultData } from '../core/mocks/test-data';

import { RouterTestingModule } from '@angular/router/testing';
import * as Store from 'electron-store';

import { DataService } from '../core/services';
import { ClassComponent } from './class.component';
import { Turbo$CourseWork } from '../core/schemas';

describe('ClassComponent', () => {
  let component: ClassComponent;
  let fixture: ComponentFixture<ClassComponent>;
  const store: Store = new Store({ name: "cache" });
  let dataService: DataService;
  let dataSpyRead;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassComponent ],
      imports: [ RouterTestingModule ],
      providers: [ DataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store.store = DefaultData;

    fixture = TestBed.createComponent(ClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = fixture.debugElement.injector.get(DataService);
    dataSpyRead = spyOn(dataService, 'markRead');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should call DataService mark read functions correctly', () => {
    component.markAsRead("123", "announcements", "456");
    expect(dataSpyRead).toHaveBeenCalledWith("123", "announcements", "456");
  });

  it('should set feed type correctly', () => {
    component.setFeedType(1);
    expect(component.feedType).toEqual(1);
  });

  it('should update feed: stream', () => {
    expect(component.feedType).toEqual(0); // Type: Stream

    const data = DefaultData.courseData["123"];
    component.course = DefaultData.courses[0];
    component.updateFeed(data);
    // Expect both announcements and assignments to appear
    expect(component.feed).toContain(data.announcements[0]);
    expect(component.feed).toContain(data.assignments[0]);
  });

  it('should update feed: announcements', () => {
    component.feedType = 1; // Type: Announcements

    const data = DefaultData.courseData["123"];
    component.course = DefaultData.courses[0];
    component.updateFeed(data);
    // Expect only announcements to appear
    expect(component.feed).toContain(data.announcements[0]);
    expect(component.feed).not.toContain(data.assignments[0]);
  });

  it('should update feed: assignments', () => {
    component.feedType = 2; // Type: Assignments

    const data = DefaultData.courseData["123"];
    component.course = DefaultData.courses[0];
    component.updateFeed(data);
    // Expect only assignments to appear
    expect(component.feed).not.toContain(data.announcements[0]);
    expect(component.feed).toContain(data.assignments[0]);
  });

  it('should generate upcoming feed', () => {
    const assignments: Turbo$CourseWork[] = [
      {dueDate: {year: 2000, month: 2, day: 1}, dueTime: {hours: 7}, read: false},
      {dueDate: {year: 2030, month: 2, day: 1}, dueTime: {hours: 7}, read: false}
    ];
    component.generateUpcomingFeed(assignments);
    // Expect upcoming to only contain future assignments
    expect(component.upcoming).not.toContain(assignments[0]);
    expect(component.upcoming).toContain(assignments[1]);
  });

  it('should generate late feed', () => {
    const assignments: Turbo$CourseWork[] = [
      {dueDate: {year: 2000, month: 2, day: 1}, dueTime: {hours: 7}, read: false},
      {dueDate: {year: 2030, month: 2, day: 1}, dueTime: {hours: 7}, read: false}
    ];
    component.generateLateFeed(assignments);
    // Expect late to only contain past assignments
    expect(component.late).toContain(assignments[0]);
    expect(component.late).not.toContain(assignments[1]);
  });
});
