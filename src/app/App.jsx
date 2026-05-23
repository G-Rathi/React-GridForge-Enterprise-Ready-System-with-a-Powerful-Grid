import React from 'react';
import { Provider } from 'react-redux';
import { AuthProvider } from '../common/contexts/AuthContext';
import { ThemeProvider } from '../common/contexts/ThemeContext';
import SuspenseBoundary from '../components/SuspenseBoundary';
import ErrorBoundary from '../components/ErrorBoundary';
import store from '../store';
import AppRoutes from './AppRoutes';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider>
             <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={3}
              />
            <SuspenseBoundary>
              <AppRoutes />
            </SuspenseBoundary>
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
