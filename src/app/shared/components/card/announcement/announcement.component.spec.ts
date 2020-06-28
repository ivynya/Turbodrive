import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultData } from '../../../../core/mocks/test-data';

import { CardAnnouncementComponent } from './announcement.component';

describe('CardAnnouncementComponent', () => {
  let component: CardAnnouncementComponent;
  let fixture: ComponentFixture<CardAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAnnouncementComponent);
    component = fixture.componentInstance;
    component.announcement = DefaultData.courseData["123"].announcements[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
