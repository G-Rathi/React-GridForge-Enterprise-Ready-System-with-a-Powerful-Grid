import React, { useState } from 'react';
import { useAbortableEffect } from '../../hooks/useAbortableEffect';
import { serviceClient } from '../../services/http/serviceClient';

const TestPage = () => {
  const [status, setStatus] = useState({ sample: 'idle', todos: 'idle', columns: 'idle' });

  useAbortableEffect((signal) => {
    // Start multiple API calls on mount. If user navigates away quickly,
    // these should be cancelled by the global route-change cancel hook.
    setStatus({ sample: 'loading', todos: 'loading', columns: 'loading' });

    serviceClient.get('/sampleData', {
      requestKey: 'test:sampleData',
      onSuccess: () => setStatus(s => ({ ...s, sample: 'done' })),
      onError: () => setStatus(s => ({ ...s, sample: 'error' }))
    });

    serviceClient.get('/todos', {
      requestKey: 'test:todos',
      onSuccess: () => setStatus(s => ({ ...s, todos: 'done' })),
      onError: () => setStatus(s => ({ ...s, todos: 'error' }))
    });

    serviceClient.get('/columns', {
      requestKey: 'test:columns',
      onSuccess: () => setStatus(s => ({ ...s, columns: 'done' })),
      onError: () => setStatus(s => ({ ...s, columns: 'error' }))
    });

    // nothing to return here; cleanup is handled by abort controllers inside serviceClient
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Page (Cancellable API demo)</h2>
      <p>
        This page fires multiple API calls on mount. If you accidentally open another
        menu quickly (within a few seconds), the previous page's API requests will
        be cancelled automatically.
      </p>

      <ul>
        <li><strong>Sample Data:</strong> {status.sample}</li>
        <li><strong>Todos:</strong> {status.todos}</li>
        <li><strong>Columns:</strong> {status.columns}</li>
      </ul>

      <p style={{ marginTop: 16, color: '#666' }}>
        Try: click on another menu right after opening this page to see cancellation.
      </p>
    </div>
  );
};

export default TestPage;
