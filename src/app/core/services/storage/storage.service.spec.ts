import { TestBed } from '@angular/core/testing';
import { DefaultData } from '../../mocks/test-data';

import { StorageService } from './storage.service';
import * as Store from 'electron-store';

describe('ElectronService', () => {
  let service: StorageService;
  const store = new Store();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(StorageService);

    // Generic preset data to test off of
    store.store = DefaultData;
  });

  afterEach(() => {
    // Make sure storage cleared for other tests
    store.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct values for has', () => {
    expect(service.has("courses")).toBeTrue();
    expect(service.has("courseData")).toBeTrue();
    expect(service.has("nonExistentValue")).toBeFalse();
  });

  it('should return correct values for get', () => {
    expect(service.get("courses")).toEqual(DefaultData.courses);
  });

  it('should set values correctly', () => {
    const data = { 
      "123": { 
        "announcements": [{ 
          "courseId": "123", 
          "id": "456" 
        }],
        "assignments": [{ 
          "courseId": "123", 
          "id": "456", 
          "title": "Title" 
        }]
      }
    };

    service.set("courseData", data);
    expect(store.get("courseData")).toEqual(data);
  });

  it('should update values correctly', () => {
    expect(service.update("courses", DefaultData.courses)).toBeFalse();

    const data = [{ "id": "456", "name": "Class Name" }];
    expect(service.update("courses", data)).toBeTrue();
    expect(store.get("courses")).toEqual(data);
  });
});
