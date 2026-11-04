import { zones, seats, seatById, money } from './venue.js';
import { setupNavigation } from './navigation.js';
import { loadCart, saveCart } from './storage.js';

const seatRoot = document.querySelector('#seats');
const details = document.querySelector('#seat-details');
const status = document.querySelector('#status');
let inspectedId = null;
// Access can itself throw when storage is blocked by browser policy.
let storage;
try { storage = window.localStorage; } catch { /* Selection remains usable in memory. */ }
const cart = new Set(loadCart(storage));
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
setupNavigation();

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
  add.addEventListener('click', () => {
    if (!seat.available || cart.has(seat.id)) return;
    cart.add(seat.id);
    updateBooking();
    status.textContent = `${seat.id} added to your evening.`;
  });
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

function renderCart() {
  const list = document.querySelector('#cart-items');
  list.replaceChildren();
  let total = 0;
  for (const id of cart) {
    const seat = seatById.get(id);
    total += seat.price;
    const item = document.createElement('li'); item.className = 'cart-item';
    const description = document.createElement('div');
    const name = document.createElement('strong'); name.textContent = `Row ${seat.row} · Seat ${seat.number}`;
    const meta = document.createElement('span'); meta.textContent = `${seat.zoneName} · ${money(seat.price)}`;
    description.append(name, meta);
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remove ${seat.id}`);
    remove.addEventListener('click', () => {
      cart.delete(id); updateBooking(); status.textContent = `${id} removed from your cart.`;
      (document.querySelector(`#cart-items button`) || buttons.get(id)).focus();
    });
    item.append(description, remove); list.append(item);
  }
  if (!cart.size) {
    const empty = document.createElement('li'); empty.className = 'empty-cart'; empty.textContent = 'Your next great story starts with a seat.'; list.append(empty);
  }
  document.querySelector('#cart-count').textContent = `${cart.size} ticket${cart.size === 1 ? '' : 's'}`;
  document.querySelector('#cart-total').textContent = money(total);
}
function updateBooking() {
  renderSeatStates(); renderCart(); renderDetails();
  document.querySelector('#storage-warning').hidden = saveCart(storage, cart);
}
renderCart();
