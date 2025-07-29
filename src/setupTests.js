jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      get: jest.fn(),
      post: jest.fn(() => Promise.resolve({ data: {} }))
    })),
    post: jest.fn(() => Promise.resolve({ data: {} }))
  }
}));
