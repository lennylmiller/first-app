class StorageService {
  constructor(prefix = 'dashboard') {
    this.prefix = prefix;
  }
  
  _getKey(key) {
    return `${this.prefix}_${key}`;
  }
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this._getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }
  
  set(key, value) {
    try {
      localStorage.setItem(this._getKey(key), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }
  
  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
  
  clear() {
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
  
  has(key) {
    return localStorage.getItem(this._getKey(key)) !== null;
  }
  
  getAll() {
    const items = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(`${this.prefix}_`, '');
        try {
          items[cleanKey] = JSON.parse(localStorage.getItem(key));
        } catch {
          items[cleanKey] = localStorage.getItem(key);
        }
      }
    });
    
    return items;
  }
}

export const storage = new StorageService();