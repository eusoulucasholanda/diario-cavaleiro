// Prints enviados pelo app ficam no IndexedDB do aparelho (não vão pra nuvem).
const DB = 'diario-cavaleiro';
const STORE = 'imagens';

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => res(req.result as T);
    req.onerror = () => rej(req.error);
  });
}

export const getImage = (slot: string) => tx<Blob | undefined>('readonly', (s) => s.get(slot)).catch(() => undefined);
export const setImage = (slot: string, b: Blob) => tx('readwrite', (s) => s.put(b, slot));
export const delImage = (slot: string) => tx('readwrite', (s) => s.delete(slot));
export const clearImages = () => tx('readwrite', (s) => s.clear());
