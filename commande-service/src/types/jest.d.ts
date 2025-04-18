/// <reference types="jest" />

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

    type Mock<T = any, Y extends any[] = any> = {
      (...args: Y): T;
      mockReturnValue: (val: T) => Mock<T, Y>;
      mockResolvedValue: (val: T extends Promise<infer U> ? U : T) => Mock<Promise<T>, Y>;
      mockResolvedValueOnce: (val: T extends Promise<infer U> ? U : T) => Mock<Promise<T>, Y>;
      mockRejectedValue: (val: any) => Mock<Promise<T>, Y>;
      mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
      mockClear: () => void;
      mockReset: () => void;
      mockRestore: () => void;
      getMockName: () => string;
      mock: {
        calls: Y[];
        instances: T[];
        invocationCallOrder: number[];
        results: { type: "return" | "throw"; value: any }[];
      };
    };

    type Mocked<T> = {
      [P in keyof T]: T[P] extends (...args: any[]) => any
        ? Mock<ReturnType<T[P]>, Parameters<T[P]>>
        : T[P];
    } & T;

    const fn: <T extends (...args: any[]) => any>(
      implementation?: T,
    ) => Mock<ReturnType<T>, Parameters<T>>;
  }

  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function expect<T>(actual: T): jest.Matchers<void>;
  
  const jest: {
    fn: typeof jest.fn;
    mock: (<T extends {}>() => jest.Mocked<T>) & ((moduleName: string) => typeof jest);
    clearAllMocks(): void;
    resetAllMocks(): void;
    restoreAllMocks(): void;
    spyOn(object: any, methodName: string): jest.Mock;
    mockResolvedValueOnce<T>(value: T): jest.Mock<Promise<T>>;
  } & {
    [key: string]: any;
  };

  function afterEach(fn: () => void): void;
}

export {};
