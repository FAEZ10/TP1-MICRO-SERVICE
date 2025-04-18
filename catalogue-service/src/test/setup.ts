// Add Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchObject(expected: any): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalledTimes(times: number): R;
      toEqual(expected: any): R;
      toBeNull(): R;
      toBe(expected: any): R;
      rejects: {
        toThrow(message?: string | Error): Promise<void>;
      };
    }
  }
}

// Mock environment variables
process.env.PORT = '3001';

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

export {};
