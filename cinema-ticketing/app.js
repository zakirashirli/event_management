import { zones, seats, seatById, money } from './venue.js';

const seatRoot = document.querySelector('#seats');
const details = document.querySelector('#seat-details');
const status = document.querySelector('#status');
let inspectedId = null;
const cart = new Set();
const buttons = new Map();

function renderVenue() {
  for (const zone of zones) {
    const section = document.createElement('section');
    section.className = 'zone';
    section.style.setProperty('--zone-color', zone.color);
    section.setAttribute('aria-label', `${zone.name}, ${money(zone.price)} per ticket`);
    const heading = document.createElement('div');
    heading.className = 'zone-label';
    heading.textContent = `${zone.name} · ${money(zone.price)}`;
    section.append(heading);
    for (const row of zone.rows) {
      const line = document.createElement('div');
      line.className = 'seat-row';
      const label = document.createElement('span');
      label.className = 'row-label';
      label.textContent = row;
      line.append(label);
      for (const seat of seats.filter(item => item.row === row)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'seat';
        button.textContent = seat.number;
        button.dataset.seat = seat.id;
        button.setAttribute('aria-label', `Row ${row}, seat ${seat.number}, ${seat.zoneName}, ${money(seat.price)}`);
        buttons.set(seat.id, button);
        line.append(button);
      }
      const end = label.cloneNode(true);
      line.append(end);
      section.append(line);
    }
    seatRoot.append(section);
  }
}
renderVenue();
