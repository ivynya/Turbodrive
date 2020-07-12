import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';

@Injectable({ providedIn: 'root' })
export class ConfigService extends StorageService {
  constructor() {
    // Set namespace to cache
    super("config");
  }
}