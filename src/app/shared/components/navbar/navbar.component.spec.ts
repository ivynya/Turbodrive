import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

import * as Store from 'electron-store';
import { DataService } from '../../../core/services';
import { Turbo$Course } from '../../../core/schemas';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let dataService: DataService;
  let dataSpyAnnouncements, dataSpyAssignments;
  let store: Store;

  // Spec according to classroom_v1.Schema$Course
  const defaultData: { courses: Turbo$Course[] } = 
    { "courses": [
      { "id": "123", "name": "Class", "ownerId": "", "creationTime": "",
        "updateTime": "", "enrollmentCode": "", "courseState": "",
        "alternateLink": "", "teacherGroupEmail": "", "courseGroupEmail": "", 
        "guardiansEnabled": false, "calendarId": "", "hasUnread": false, "rank": 0
      }]
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [ RouterTestingModule ],
      providers: [ DataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Set default storage per test
    store = new Store({ name: "cache" });
    store.store = defaultData;

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = fixture.debugElement.injector.get(DataService);
    dataSpyAnnouncements = spyOn(dataService, 'updateAnnouncements');
    dataSpyAssignments = spyOn(dataService, 'updateAssignments');
  });

  afterEach(() => {
    // Clear storage for other tests
    store.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses', () => {
    expect(component.courses).toEqual(defaultData.courses);
  });

  it('should call data service refresh on refresh', () => {
    component.refresh();
    expect(dataSpyAnnouncements).toHaveBeenCalledWith('123');
    expect(dataSpyAssignments).toHaveBeenCalledWith('123');
  });
});
