
import React, { useEffect } from 'react';

function ASCIIDoughnut() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    const R1 = 1;
    const R2 = 2;
    const K1 = 150;
    const K2 = 5;
    let A = 1, B = 1;

    function renderFrame() {
      context.clearRect(0, 0, width, height);

      for (let j = 0; j < Math.PI * 2; j += 0.07) {
        for (let i = 0; i < Math.PI * 2; i += 0.02) {
          const c = Math.sin(i),
            d = Math.cos(j),
            e = Math.sin(A),
            f = Math.sin(j),
            g = Math.cos(A),
            h = d + R2,
            D = 1 / (c * h * e + f * g + R1),
            l = Math.cos(i),
            m = Math.cos(B),
            n = Math.sin(B),
            t = c * h * g - f * e;

          const x = (width / 2 + K1 * D * (l * h * m - t * n));
          const y = (height / 2 - K2 * D * (l * h * n + t * m));
          const z = K1 * D;
          context.fillStyle = `rgba(${z * 255}, ${z * 255}, ${z * 255}, 1)`;
          context.fillRect(x, y, 2, 2);
        }
      }

      A += 0.07;
      B += 0.03;
      requestAnimationFrame(renderFrame);
    }

    renderFrame();

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  return null;
}

export default ASCIIDoughnut;
