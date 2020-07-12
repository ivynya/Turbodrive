import * as Store from 'electron-store';

export class StorageService {
  private store: Store;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  // StorageService takes namespace for file name
  constructor(namespace: string) { 
    if (this.isElectron) {
      this.store = new Store({
        name: namespace
      });
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

  // Set function that only updates if a new value is provided
  // Returns false if values match (nothing changes) or true if not
  update(key: string, value: any): boolean {
    // Referring to the following for performance considerations
    // https://www.mattzeunert.com/2016/01/28/javascript-deep-equal.html
    const stored = JSON.stringify(this.store.get(key));
    const updated = JSON.stringify(value);

    if (stored !== updated) {
      this.store.set(key, value);
      return true;
    }
    else {
      return false;
    }
  }

  // Watch a value, returns unsubscribe callback
  watch(key: string, callback: (newVal: any, oldVal: any) => any): () => void {
    return this.store.onDidChange(key, callback);
  }
}
