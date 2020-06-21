import { TestBed } from '@angular/core/testing';
import { DefaultData } from '../../mocks/test-data';

import * as Store from 'electron-store';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  const store: Store = new Store();

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
});
