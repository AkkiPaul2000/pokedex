import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import './index.css';

// 3D tilt for any `.tilt` element: pointer position -> --rx/--ry rotation and --mx/--my shine.
// No reset on leave: tilt only applies under :hover, and a reset made the fading shine jump to the centre.
const tilt = (el: HTMLElement, x: number, y: number) => {
  el.style.setProperty('--rx', `${(0.5 - y) * 20}deg`);
  el.style.setProperty('--ry', `${(x - 0.5) * 20}deg`);
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
};
document.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  const el = (e.target as Element).closest<HTMLElement>('.tilt');
  if (!el) return;
  const r = el.getBoundingClientRect();
  tilt(el, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
});

// Site icon: a Poké Ball rocking like a catch (three wobbles, then the button lights up). Chrome won't play
// a GIF or SVG favicon, but every browser repaints the tab when the icon's href changes, so each pose is
// drawn once on a canvas and the poses are cycled.
const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
const pen = document.createElement('canvas').getContext('2d');
if (icon && pen) {
  pen.canvas.width = pen.canvas.height = 64;
  pen.lineWidth = 4;
  pen.strokeStyle = '#222';
  const disc = (r: number, fill: string, from = 0, to = 2 * Math.PI) => {
    pen.beginPath();
    pen.arc(32, 32, r, from, to);
    pen.closePath();
    pen.fillStyle = fill;
    pen.fill();
    pen.stroke();
  };
  const pose = (tilt: number, lit = false) => {
    pen.clearRect(0, 0, 64, 64);
    pen.save();
    pen.translate(32, 44); // rocks on a point below its middle, as if on the ground
    pen.rotate((tilt * Math.PI) / 180);
    pen.translate(-32, -44);
    disc(26, '#fff');
    disc(26, '#dc0a2d', Math.PI, 2 * Math.PI); // top half; closing it draws the band
    disc(8, lit ? '#ffcb05' : '#fff'); // button
    pen.restore();
    return pen.canvas.toDataURL();
  };
  const [l2, l1, mid, r1, r2] = [-18, -9, 0, 9, 18].map((tilt) => pose(tilt));
  const caught = pose(0, true);
  const shake = [l1, l2, l1, mid, r1, r2, r1, mid, mid, mid, mid]; // one wobble, then a beat
  const frames = [mid, mid, mid, ...shake, ...shake, ...shake, caught, caught, caught, caught, caught, mid, mid, mid];
  let frame = 0;
  setInterval(() => (icon.href = frames[frame++ % frames.length]), 80);
}

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
