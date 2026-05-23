import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Auth-specific layout elements */}
      {children}
    </div>
  );
};

export default AuthLayout;