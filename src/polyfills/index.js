import { setupPolyfills } from './polyfills';
setupPolyfills();

// Run any compatibility checks here
const checkCompatibility = () => {
  if (!window.fetch) {
    console.warn('Fetch API not available, using polyfill');
  }
  
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not available, using polyfill');
  }
  
  // Add more compatibility checks as needed
};

checkCompatibility();
