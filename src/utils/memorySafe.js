// Memory management utilities
export const cleanup = {
  // Clear timeouts and intervals
  clearTimers: (timers = []) => {
    timers.forEach(timer => {
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
      }
    });
  },

  // Clear event listeners
  clearListeners: (element, events = [], listeners = []) => {
    events.forEach((event, index) => {
      if (element && listeners[index]) {
        element.removeEventListener(event, listeners[index]);
      }
    });
  },

  // Clear refs
  clearRefs: (refs = []) => {
    refs.forEach(ref => {
      if (ref.current) {
        ref.current = null;
      }
    });
  },

  // Clear WebSocket connections
  clearWebSockets: (sockets = []) => {
    sockets.forEach(socket => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    });
  },
};