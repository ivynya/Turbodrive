import { Injectable } from '@angular/core';

import * as Store from 'electron-store';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private store: Store;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() { 
    if (this.isElectron) {
      this.store = new Store();
    }
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  get(key: string): any {
    return this.store.get(key);
  }

  set(key: string, value: any): void {
    this.store.set(key, value);
  }

  watch(key: string, callback: (newVal: any, oldVal: any) => any): void {
    this.store.onDidChange(key, callback);
  }
}
