// localStorage CRUD engine

const LS_PREFIX = 'app_data_';

function getLocalData<T>(collectionName: string): T[] {
  try {
    const raw = localStorage.getItem(LS_PREFIX + collectionName);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalData<T>(collectionName: string, data: T[]): void {
  try {
    localStorage.setItem(LS_PREFIX + collectionName, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

function generateId(): string {
  return 'local_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

export function createApi<T extends { id: string }>(collectionName: string) {
  return {
    getAll: async (): Promise<T[]> => {
      return getLocalData<T>(collectionName);
    },

    add: async (item: Omit<T, 'id'>): Promise<T> => {
      const newItem = { id: generateId(), ...item } as T;
      const current = getLocalData<T>(collectionName);
      setLocalData(collectionName, [...current, newItem]);
      return newItem;
    },

    update: async (id: string, data: Partial<T>): Promise<void> => {
      const current = getLocalData<T>(collectionName);
      setLocalData(collectionName, current.map(i => i.id === id ? { ...i, ...data } : i));
    },

    delete: async (id: string): Promise<void> => {
      const current = getLocalData<T>(collectionName);
      setLocalData(collectionName, current.filter(i => i.id !== id));
    }
  };
}