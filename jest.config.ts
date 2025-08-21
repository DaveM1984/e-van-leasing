import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'preserve',
        types: ['jest', 'node']
      }
    }
  }
};
export default config;