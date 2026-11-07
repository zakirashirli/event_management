export function setupNavigation() {
  const viewport = document.querySelector('#venue-container');
  const venue = document.querySelector('#venue');
  let scale = 1, x = 0, y = 0;
  const baseScale = () => Math.min(1, (viewport.clientWidth - 20) / 550, (viewport.clientHeight - 20) / 510);
  function paint() {
    const limitX = Math.max(0, (550 * baseScale() * scale - viewport.clientWidth) / 2) + 100;
    const limitY = Math.max(0, (510 * baseScale() * scale - viewport.clientHeight) / 2) + 100;
    x = Math.max(-limitX, Math.min(limitX, x));
    y = Math.max(-limitY, Math.min(limitY, y));
    venue.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${baseScale() * scale})`;
    document.querySelector('#zoom-level').textContent = `${Math.round(scale * 100)}%`;
  }
  function zoom(delta) { scale = Math.max(0.75, Math.min(2.5, scale + delta)); paint(); }
  const nav = document.querySelector('#navigation');
  const actions = [ ['−', 'Zoom out', () => zoom(-.25)], ['+', 'Zoom in', () => zoom(.25)], ['↑', 'Move up', () => { y -= 40; paint(); }], ['↓', 'Move down', () => { y += 40; paint(); }], ['←', 'Move left', () => { x -= 40; paint(); }], ['→', 'Move right', () => { x += 40; paint(); }], ['↺', 'Reset / center view', () => { scale = 1; x = y = 0; paint(); }] ];
  for (const [symbol, label, action] of actions) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = symbol;
    button.setAttribute('aria-label', label); button.title = label;
    button.addEventListener('click', action); nav.append(button);
  }
  const level = document.createElement('output'); level.id = 'zoom-level'; level.setAttribute('aria-label', 'Zoom level'); nav.append(level);
  viewport.addEventListener('wheel', event => {
    event.preventDefault(); zoom(event.deltaY < 0 ? .1 : -.1);
  }, { passive: false });
  let drag = null, suppressClick = false;
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.pointerType === 'touch') return;
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y, moved: false };
    suppressClick = false;
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 5) {
      drag.moved = true; viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('dragging');
      x = drag.x + dx; y = drag.y + dy; paint();
    }
  });
  function endDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    suppressClick = drag.moved;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    drag = null; viewport.classList.remove('dragging');
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', event => { if (drag && !drag.moved) endDrag(event); });
  viewport.addEventListener('click', event => {
    if (suppressClick) { event.stopPropagation(); event.preventDefault(); suppressClick = false; }
  }, true);
  new ResizeObserver(paint).observe(viewport);
  paint();
}
