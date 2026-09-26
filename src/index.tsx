import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import './index.css';

// 3D tilt for any `.tilt` element: pointer position -> --rx/--ry rotation and --mx/--my shine.
let tilted: HTMLElement | null = null;
const tilt = (el: HTMLElement, x = 0.5, y = 0.5) => {
  el.style.setProperty('--rx', `${(0.5 - y) * 20}deg`);
  el.style.setProperty('--ry', `${(x - 0.5) * 20}deg`);
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
};
document.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  const el = (e.target as Element).closest<HTMLElement>('.tilt');
  if (tilted && tilted !== el) tilt(tilted);
  tilted = el;
  if (!el) return;
  const r = el.getBoundingClientRect();
  tilt(el, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
});

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
