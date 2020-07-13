import { TestBed } from '@angular/core/testing';
import { DefaultData } from '../../mocks/test-data';

import * as Store from 'electron-store';

import { Turbo$Announcement } from '../../schemas';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  const store: Store = new Store({ name: "cache" });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DataService);

    store.store = DefaultData;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return cached courses', () => {
    service.subscribeCourses((data) => {
      expect(data).toEqual(DefaultData.courses);
    },false);
  });

  it('should return cached courseData (all)', () => {
    service.subscribeCourseDataAll((data) => {
      expect(data).toEqual(DefaultData.courseData);
    }, false);
  });

  it('should return cached courseData (id)', () => {
    service.subscribeCourseData("123", (data) => {
      expect(data).toEqual(DefaultData.courseData["123"]);
    }, false);
  });

  it('should be able to mark items as read', () => {
    store.onDidChange("courseData.456.announcements", (n)  => {
      expect(n[0].read).toBeTrue();
    });
    service.markRead("456", "announcements", "4567");
  });

  it('should be able to mark all items as read', () => {
    store.onDidChange("courseData.456.announcements", (n)  => {
      n.forEach((a: Turbo$Announcement) => {
        expect(a.read).toBeTrue();
      });
    });
    service.markAllRead("456", "announcements");
  });

  it('should mark course read on tryMarkCourseRead if all announcements read', () => {
    store.onDidChange("courses", (n) => {
      expect(n[1].hasUnread).toBeFalse();
    });
    
    const newData = DefaultData;
    newData.courseData["456"].announcements[0].read = true;
    store.store = newData;

    service.tryMarkCourseRead("456");
  });
});
