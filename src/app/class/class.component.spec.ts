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
  const store: Store = new Store();
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
});
