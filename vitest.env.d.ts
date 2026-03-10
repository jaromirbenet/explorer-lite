/// <reference types="vitest" />
import type { defineConfig } from 'vitest/config'

declare global {
  namespace Vi {
    interface Matchers<R> {
      toMatchSnapshot(): R
    }
  }
}
