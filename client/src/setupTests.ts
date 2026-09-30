import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'node:util'

// jsdom doesn't provide these; React Router needs them.
Object.assign(globalThis, { TextDecoder, TextEncoder })
