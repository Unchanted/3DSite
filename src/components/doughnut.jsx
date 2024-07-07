import React, { useEffect } from 'react';

const ASCIIDoughnut = ({ position = { x: 0, y: 0 }, size = { width: window.innerWidth, height: window.innerHeight } }) => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const { width, height } = size;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.left = `${position.x}px`;
    canvas.style.top = `${position.y}px`;
    document.body.appendChild(canvas);

    const R1 = 1;
    const R2 = 2;
    const K1 = 150;
    const K2 = 5;
    let A = 1;
    let B = 1;

    const renderFrame = () => {
      context.clearRect(0, 0, width, height);

      for (let j = 0; j < Math.PI * 2; j += 0.07) {
        for (let i = 0; i < Math.PI * 2; i += 0.02) {
          const c = Math.sin(i);
          const d = Math.cos(j);
          const e = Math.sin(A);
          const f = Math.sin(j);
          const g = Math.cos(A);
          const h = d + R2;
          const D = 1 / (c * h * e + f * g + R1);
          const l = Math.cos(i);
          const m = Math.cos(B);
          const n = Math.sin(B);
          const t = c * h * g - f * e;

          const x = width / 2 + K1 * D * (l * h * m - t * n);
          const y = height / 2 - K2 * D * (l * h * n + t * m);
          const z = K1 * D;

          context.fillStyle = `rgba(${z * 255}, ${z * 255}, ${z * 255}, 1)`;
          context.fillRect(x, y, 2, 2);
        }
      }

      A += 0.07;
      B += 0.03;
      requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      document.body.removeChild(canvas);
    };
  }, [position, size]);

  return null;
};

export default ASCIIDoughnut;
