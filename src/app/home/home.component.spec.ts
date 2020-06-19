import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDateTimePipe } from '../shared/pipes/due-date-time.pipe';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from '../core/services';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dataService: DataService;
  let dataSpyRead, dataSpyReadAll;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DueDateTimePipe, HomeComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [ DataService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = fixture.debugElement.injector.get(DataService);
    dataSpyRead = spyOn(dataService, 'markRead');
    dataSpyReadAll = spyOn(dataService, 'markAllRead');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call DataService mark read functions correctly', () => {
    component.markAsRead("123", "announcements", "456");
    expect(dataSpyRead).toHaveBeenCalledWith("123", "announcements", "456");
    component.markAllRead("123", "announcements", 2);
    expect(dataSpyReadAll).toHaveBeenCalledWith("123", "announcements", 2);
  });
});
