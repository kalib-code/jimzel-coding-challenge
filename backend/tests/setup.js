// Mock database connection
jest.mock('../config/database', () => {
  return {
    query: jest.fn().mockImplementation((query, params, callback) => {
      // If a callback is provided, call it with no error and empty results
      if (callback) {
        callback(null, []);
      }
      // Otherwise return a promise that resolves to empty results
      return Promise.resolve([]);
    }),
    escape: jest.fn(value => value),
    format: jest.fn((query, values) => query)
  };
});

// Mock Winston logger to prevent console output during tests
jest.mock('../utilities/logger', () => {
  return {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    stream: {
      write: jest.fn()
    }
  };
});

// Mock data logger
jest.mock('../utilities/datalogger', () => {
  return {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    logfile: jest.fn()
  };
});

// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};