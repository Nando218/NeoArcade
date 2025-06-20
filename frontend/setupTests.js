import '@testing-library/jest-dom';

// Mocks globales para APIs no soportadas por JSDOM
if (typeof vi !== 'undefined') {
  // Mock de HTMLMediaElement y HTMLAudioElement
  Object.defineProperty(global.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn(() => Promise.resolve()), // Devuelve una Promise
  });
  Object.defineProperty(global.HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(global.HTMLAudioElement.prototype, 'play', {
    configurable: true,
    value: vi.fn(() => Promise.resolve()), // Devuelve una Promise
  });
  Object.defineProperty(global.HTMLAudioElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });

  // Mock de HTMLCanvasElement.getContext
  Object.defineProperty(global.HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: [] })),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      strokeRect: vi.fn(),
    })),
  });

  // Mock global de axios para evitar peticiones reales y soportar interceptors
  try {
    const axios = require('axios');
    vi.mock('axios');
    axios.create = vi.fn(() => axios);
    axios.get = vi.fn(() => Promise.resolve({ data: [] }));
    axios.post = vi.fn(() => Promise.resolve({ data: {} }));
    axios.put = vi.fn(() => Promise.resolve({ data: {} }));
    axios.delete = vi.fn(() => Promise.resolve({ data: {} }));
    axios.interceptors = {
      response: {
        use: vi.fn(),
      },
    };
  } catch (e) {
    // axios no está instalado o no se usa
  }
}
