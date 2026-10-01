import { defineConfig } from 'jest'

export default defineConfig({
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.[jt]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  // yet-another-react-lightbox is the library that is used for the full-screen image viewer.
  // It ships ES modules only, so it has to be compiled too.
  transformIgnorePatterns: ['/node_modules/(?!yet-another-react-lightbox/)'],
  // Report every source file, including ones no test imports yet, so the
  // coverage numbers aren't inflated. Test files are left out automatically.
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/setupTests.ts',
    '!src/test/**',
    '!src/mockData/**',
  ],
})
