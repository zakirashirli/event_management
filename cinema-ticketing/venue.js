export const zones = [
  { id: 'classic', name: 'Classic', price: 12, rows: ['A', 'B', 'C'], color: '#a7b8ac' },
  { id: 'prime', name: 'Prime', price: 18, rows: ['D', 'E', 'F', 'G'], color: '#a8c7d0' },
  { id: 'lounge', name: 'Lounge', price: 26, rows: ['H', 'J', 'K', 'L'], color: '#c9b4db' },
];
const reserved = new Set(['A-3', 'A-4', 'B-8', 'C-10', 'D-5', 'D-6', 'E-2', 'F-9', 'F-10', 'G-7', 'H-3', 'J-11', 'K-5', 'K-6', 'L-12']);
export const seats = zones.flatMap(zone => zone.rows.flatMap(row =>
  Array.from({ length: 12 }, (_, index) => ({
    id: `${row}-${index + 1}`, row, number: index + 1,
    zone: zone.id, zoneName: zone.name, price: zone.price,
    available: !reserved.has(`${row}-${index + 1}`),
  }))));
export const seatById = new Map(seats.map(seat => [seat.id, seat]));
export const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AZN', currencyDisplay: 'narrowSymbol' }).format(value);
