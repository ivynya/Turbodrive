import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

import { classroom_v1 } from 'googleapis';
import * as Store from 'electron-store';
import { DataService } from '../../../core/services';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let dataService: DataService;
  let dataSpyAnnouncements, dataSpyAssignments;
  let store: Store;

  // Spec according to classroom_v1.Schema$Course
  const defaultData: { courses: classroom_v1.Schema$Course[] } = 
    { "courses": [
      { "id": "123", "name": "Class", "ownerId": "", "creationTime": "",
        "updateTime": "", "enrollmentCode": "", "courseState": "",
        "alternateLink": "", "teacherGroupEmail": "",
        "courseGroupEmail": "", "guardiansEnabled": false, "calendarId": ""
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
    store = new Store();
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
    expect(dataSpyAnnouncements).toHaveBeenCalled();
    expect(dataSpyAssignments).toHaveBeenCalled();
  });
});
