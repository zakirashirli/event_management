import { seatById } from './venue.js';
export const STORAGE_KEY = 'lumen:hall01:2026-11-08:1930:v1';
export function validateCart(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(id => typeof id === 'string' && seatById.get(id)?.available))];
}
export function loadCart(storage) {
  try { return validateCart(JSON.parse(storage.getItem(STORAGE_KEY) || '[]')); }
  catch { return []; }
}
export function saveCart(storage, cart) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify([...cart])); return true; }
  catch { return false; }
}
