class StorageService {
  private prefix: string;

  constructor(prefix: string = 'dashboard') {
    this.prefix = prefix;
  }
  
  private _getKey(key: string): string {
    return `${this.prefix}_${key}`;
  }
  
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(this._getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }
  
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this._getKey(key), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }
  
  remove(key: string): boolean {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
  
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
  
  has(key: string): boolean {
    return localStorage.getItem(this._getKey(key)) !== null;
  }
  
  getAll(): Record<string, any> {
    const items: Record<string, any> = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(`${this.prefix}_`, '');
        try {
          const item = localStorage.getItem(key);
          items[cleanKey] = item ? JSON.parse(item) : null;
        } catch {
          items[cleanKey] = localStorage.getItem(key);
        }
      }
    });
    
    return items;
  }
}

export const storage = new StorageService();