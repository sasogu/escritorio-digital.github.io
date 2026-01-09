import { useEffect, useState } from 'react';
import { getFromIndexedDb, setInIndexedDb } from '../utils/storage';

let didWarnQuotaExceeded = false;
const IDB_MARKER = '__indexed_db__';
const IDB_THRESHOLD_BYTES = 200_000;

const isQuotaExceededError = (error: unknown): boolean => {
  if (error instanceof DOMException) {
    return (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    );
  }
  return false;
};

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      if (item === IDB_MARKER) return initialValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item !== IDB_MARKER) return;
    getFromIndexedDb(key)
      .then((json) => {
        if (!json) return;
        try {
          setStoredValue(JSON.parse(json));
        } catch (error) {
          console.error(error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const json = JSON.stringify(valueToStore);
      if (json.length > IDB_THRESHOLD_BYTES) {
        setInIndexedDb(key, json)
          .then(() => window.localStorage.setItem(key, IDB_MARKER))
          .catch((error) => console.error(error));
        return;
      }
      window.localStorage.setItem(key, json);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        setInIndexedDb(key, JSON.stringify(value instanceof Function ? value(storedValue) : value))
          .then(() => window.localStorage.setItem(key, IDB_MARKER))
          .catch((idbError) => console.error(idbError));
        if (!didWarnQuotaExceeded) {
          window.dispatchEvent(new Event('storage-quota-exceeded'));
          didWarnQuotaExceeded = true;
        }
        return;
      }
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
