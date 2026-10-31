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

function renderDetails() {
  const seat = seatById.get(inspectedId);
  if (!seat) return;
  details.replaceChildren();
  const name = document.createElement('p');
  name.className = 'selected-seat';
  name.textContent = `Row ${seat.row} · Seat ${seat.number}`;
  const info = document.createElement('p');
  info.className = 'muted';
  info.textContent = `${seat.zoneName} · Hall 01 · ${money(seat.price)}`;
  const add = document.createElement('button');
  add.type = 'button';
  add.id = 'add-ticket';
  add.className = 'add-ticket';
  add.textContent = 'ADD TO CART';
  add.disabled = !seat.available || cart.has(seat.id);
  if (!seat.available) add.textContent = 'UNAVAILABLE';
  else if (cart.has(seat.id)) add.textContent = 'ALREADY IN YOUR CART';
  details.append(name, info, add);
}
seatRoot.addEventListener('click', event => {
  const button = event.target.closest('[data-seat]');
  if (!button) return;
  inspectedId = button.dataset.seat;
  renderDetails();
  renderSeatStates();
  status.textContent = `Inspecting ${inspectedId}. Use Add to Cart to select this ticket.`;
});

function renderSeatStates() {
  for (const seat of seats) {
    const button = buttons.get(seat.id);
    button.classList.toggle('unavailable', !seat.available);
    button.classList.toggle('in-cart', cart.has(seat.id));
    button.classList.toggle('inspected', seat.id === inspectedId);
    button.setAttribute('aria-pressed', String(cart.has(seat.id)));
    button.setAttribute('aria-label', `Row ${seat.row}, seat ${seat.number}, ${seat.zoneName}, ${money(seat.price)}, ${!seat.available ? 'unavailable' : cart.has(seat.id) ? 'in cart' : seat.id === inspectedId ? 'inspecting' : 'available'}`);
  }
}
renderSeatStates();
