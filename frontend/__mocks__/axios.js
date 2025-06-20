// Mock global de axios para Vitest (usado automáticamente por vi.mock('axios'))
function createMockAxios() {
  const mock = {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    defaults: {},
    // ...add more methods if needed
  };
  mock.create = () => createMockAxios();
  return mock;
}

const mockAxios = createMockAxios();

export default mockAxios;
