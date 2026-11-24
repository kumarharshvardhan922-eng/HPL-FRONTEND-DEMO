// Global type declarations for frontend module tests
declare module "vitest" {
  export const describe: any;
  export const it: any;
  export const test: any;
  export const expect: any;
  export const vi: any;
  export const beforeEach: any;
  export const afterEach: any;
  export const beforeAll: any;
  export const afterAll: any;
}

declare module "vitest/config" {
  export const defineConfig: any;
}

declare module "@testing-library/react" {
  export const render: any;
  export const screen: any;
  export const fireEvent: any;
  export const waitFor: any;
  export const cleanup: any;
  export const act: any;
  export const within: any;
}
