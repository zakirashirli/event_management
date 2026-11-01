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
  new ResizeObserver(paint).observe(viewport);
  paint();
}
