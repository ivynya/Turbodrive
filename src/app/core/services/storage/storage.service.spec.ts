import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import * as Store from 'electron-store';

describe('ElectronService', () => {
  const store = new Store();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // Generic preset data to test off of
    store.store = {"courses": [{ "id": "123", "name": "Class Name" }]};
  });

  afterEach(() => {
    // Make sure storage cleared for other tests
    store.clear();
  });

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });

  it('should return correct values for has', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service.has("courses")).toBeTrue();
    expect(service.has("courseData")).toBeFalse();
  });

  it('should return correct values for get', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service.get("courses")).toEqual([{ "id": "123", "name": "Class Name" }]);
  });

  it('should set values correctly', () => {
    const service: StorageService = TestBed.get(StorageService);
    const data = { "123": { "announcements": [{ "courseId": "123", "id": "456" }],
      "assignments": [{ "courseId": "123", "id": "456", "title": "Title" }]}};
    store.set("courseData", data);
    expect(store.get("courseData")).toEqual(data);
  });
});
