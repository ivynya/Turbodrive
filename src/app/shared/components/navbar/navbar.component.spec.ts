import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

import { classroom_v1 } from 'googleapis';
import * as Store from 'electron-store';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
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
      imports: [ RouterTestingModule ]
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

  it('should watch for course changes', () => {
    // Add new data and set store
    const newData = defaultData;
    newData.courses.push(
      { "id": "123", "name": "Class", "ownerId": "", "creationTime": "",
        "updateTime": "", "enrollmentCode": "", "courseState": "",
        "alternateLink": "", "teacherGroupEmail": "",
        "courseGroupEmail": "", "guardiansEnabled": false, "calendarId": ""});
    store.store = newData;
    
    // Give time for the watch function to update
    setTimeout(() => {
      expect(component.courses).toEqual(newData.courses);
    }, 500);
  })
});
