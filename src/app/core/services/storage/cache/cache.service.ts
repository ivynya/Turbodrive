import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';

@Injectable({ providedIn: 'root' })
export class CacheService extends StorageService {
  constructor() {
    // Set namespace to cache
    super("cache");
  }
}