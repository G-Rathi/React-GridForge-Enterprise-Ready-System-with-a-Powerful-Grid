import { toast } from 'react-toastify';

// 🔥 Track active toasts
let activeToasts = [];

/**
 * Build toast options
 */
const buildToastOptions = (options = {}) => {
  const duration = options.duration ?? 5000;

  return {
    ...options,
    autoClose: duration,
  };
};

/**
 * 🔔 Main Alert Function (UPDATED)
 */
export const showAlert = (type = 'success', message, options = {}) => {
  if (!message) return;

  const toastOptions = buildToastOptions(options);

  // 🔥 LIMIT: max 3 toast
  if (activeToasts.length >= 3) {
    const oldest = activeToasts.shift();
    toast.dismiss(oldest);
  }

  const id = toast[type](message, {
    ...toastOptions,

    // Remove from list when closed
    onClose: () => {
      activeToasts = activeToasts.filter(t => t !== id);
    },
  });

  // Add new toast
  activeToasts.push(id);
};