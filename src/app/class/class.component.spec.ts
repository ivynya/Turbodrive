import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassComponent } from './class.component';
import { RouterTestingModule } from '@angular/router/testing';

import { classroom_v1 } from 'googleapis';
import * as Store from 'electron-store';

describe('ClassComponent', () => {
  let component: ClassComponent;
  let fixture: ComponentFixture<ClassComponent>;
  const store: Store = new Store();

  // Spec according to courseData and courses schemas
  const defaultData: { 
    courses: classroom_v1.Schema$Course[];
    courseData: {
      [id: string]: {
        announcements: classroom_v1.Schema$Announcement[];
        assignments: classroom_v1.Schema$CourseWork[];
      };
    };
  } = { 
    "courses": [{ "id": "123", 
      "name": "Class", "ownerId": "", "creationTime": "",
      "updateTime": "", "enrollmentCode": "", "courseState": "",
      "alternateLink": "", "teacherGroupEmail": "",
      "courseGroupEmail": "", "guardiansEnabled": false, "calendarId": ""}],
    "courseData": { "123": {
			"announcements": [
				{ "courseId": "123", "id": "456", "text": "", "materials": [],
					"state": "PUBLISHED", "alternateLink": "", "creationTime": "",
					"updateTime": "", "creatorUserId": "" }],
			"assignments": [
				{ "courseId": "123", "id": "789", "title": "", "materials": [],
					"state": "PUBLISHED", "alternateLink": "", "creationTime": "",
					"updateTime": "", "dueDate": { "year": 2020, "month": 5, "day": 30 },
					"dueTime": { "hours": 6, "minutes": 59 }, "maxPoints": 100,
					"workType": "ASSIGNMENT", "submissionModificationMode": "MODIFIABLE_UNTIL_TURNED_IN",
					"creatorUserId": ""}]}}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store.store = defaultData;

    fixture = TestBed.createComponent(ClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
