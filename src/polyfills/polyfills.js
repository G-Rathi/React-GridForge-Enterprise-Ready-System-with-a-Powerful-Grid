import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import 'intersection-observer';

export function setupPolyfills() {
  // Add any additional polyfills here
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(cb) {
      return setTimeout(() => {
        const start = Date.now();
        cb({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1);
    };
  }

  if (!window.cancelIdleCallback) {
    window.cancelIdleCallback = function(id) {
      clearTimeout(id);
    };
  }
}