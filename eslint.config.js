import js from '@eslint/js';

const browserGlobals = { window: 'readonly', document: 'readonly', navigator: 'readonly', location: 'readonly', history: 'readonly', localStorage: 'readonly', sessionStorage: 'readonly', indexedDB: 'readonly', fetch: 'readonly', Blob: 'readonly', File: 'readonly', FileReader: 'readonly', URL: 'readonly', Intl: 'readonly', TextEncoder: 'readonly', TextDecoder: 'readonly', atob: 'readonly', btoa: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly', requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly', console: 'readonly', Node: 'readonly', structuredClone: 'readonly', Response: 'readonly', caches: 'readonly', self: 'readonly', globalThis: 'readonly', Buffer: 'readonly', process: 'readonly', crypto: 'readonly', Request: 'readonly', URLSearchParams: 'readonly', BroadcastChannel: 'readonly', matchMedia: 'readonly', ResizeObserver: 'readonly', MutationObserver: 'readonly', addEventListener: 'readonly', removeEventListener: 'readonly', Event: 'readonly', CustomEvent: 'readonly', DOMParser: 'readonly', XMLSerializer: 'readonly', getComputedStyle: 'readonly', performance: 'readonly', requestIdleCallback: 'readonly', cancelIdleCallback: 'readonly', IntersectionObserver: 'readonly' };

export default [
  { ignores: ['node_modules/**', 'vendor/**', 'test-results/**', 'playwright-report/**', 'assets/**'] },
  js.configs.recommended,
  { files: ['**/*.js', '**/*.mjs'], languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: browserGlobals }, rules: { 'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }], 'no-empty': ['error', { allowEmptyCatch: true }] } },
];
