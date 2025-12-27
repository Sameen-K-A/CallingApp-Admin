import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET_KEY;

if (!SECRET_KEY) {
  console.warn('VITE_STORAGE_SECRET_KEY is not defined. Using default key.');
};

export const setEncryptedItem = <T>(key: string, value: T): void => {
  try {
    const stringValue = JSON.stringify(value);
    const encryptedValue = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  } catch (error) {
    console.error('Could not save to localStorage:', error);
  }
};

export const getEncryptedItem = <T>(key: string): T | null => {
  try {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) {
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedValue) as T;
  } catch (error) {
    console.error('Could not retrieve from localStorage:', error);
    return null;
  }
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};