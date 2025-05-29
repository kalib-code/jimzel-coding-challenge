import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../src/providers/httpClient';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  };
  
  return {
    default: mockAxios,
    create: mockAxios.create,
  };
});

describe('HttpClient', () => {
  let requestInterceptor: Function;
  let responseInterceptor: Function;
  let responseErrorInterceptor: Function;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Extract the interceptors for testing
    const mockInterceptors = (axios.create() as any).interceptors;
    
    // Get the request interceptor
    requestInterceptor = mockInterceptors.request.use.mock.calls[0][0];
    
    // Get the response success and error interceptors
    responseInterceptor = mockInterceptors.response.use.mock.calls[0][0];
    responseErrorInterceptor = mockInterceptors.response.use.mock.calls[0][1];
    
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Request Interceptor', () => {
    it('should log requests and return the config', () => {
      const config = {
        method: 'get',
        url: '/api/test',
      };
      
      const result = requestInterceptor(config);
      
      expect(console.log).toHaveBeenCalledWith('Request: GET /api/test');
      expect(result).toBe(config);
    });
  });

  describe('Response Interceptor', () => {
    it('should log successful responses and return the response', () => {
      const response = {
        status: 200,
        config: {
          url: '/api/test',
        },
      };
      
      const result = responseInterceptor(response);
      
      expect(console.log).toHaveBeenCalledWith('Response: 200 /api/test');
      expect(result).toBe(response);
    });
  });

  describe('Error Interceptor', () => {
    it('should handle response errors with data', () => {
      const error = {
        response: {
          status: 404,
          data: {
            error: 'Resource not found',
          },
        },
      };
      
      try {
        responseErrorInterceptor(error);
        // Should not reach here
        expect(true).toBe(false);
      } catch (customError: any) {
        expect(console.error).toHaveBeenCalledWith('API Error:', error);
        expect(console.error).toHaveBeenCalledWith('Response error data:', error.response.data);
        
        expect(customError.message).toBe('Resource not found');
        expect(customError.statusCode).toBe(404);
        expect(customError.data).toBe(error.response.data);
      }
    });

    it('should handle response errors without specific error message', () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };
      
      try {
        responseErrorInterceptor(error);
        // Should not reach here
        expect(true).toBe(false);
      } catch (customError: any) {
        expect(customError.message).toBe('Server error: 500');
        expect(customError.statusCode).toBe(500);
      }
    });

    it('should handle request errors with no response', () => {
      const error = {
        request: {},
        message: 'Network Error',
      };
      
      try {
        responseErrorInterceptor(error);
        // Should not reach here
        expect(true).toBe(false);
      } catch (customError: any) {
        expect(console.error).toHaveBeenCalledWith('No response received:', error.request);
        expect(customError.message).toBe('No response from server');
      }
    });

    it('should handle other errors', () => {
      const error = {
        message: 'Something went wrong',
      };
      
      try {
        responseErrorInterceptor(error);
        // Should not reach here
        expect(true).toBe(false);
      } catch (customError: any) {
        expect(console.error).toHaveBeenCalledWith('Request setup error:', error.message);
        expect(customError.message).toBe('Error sending request');
      }
    });
  });
});