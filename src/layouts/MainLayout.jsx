import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      {/* Header, navigation, and other common elements */}
      {children}
      {/* Footer */}
    </div>
  );
};

export default MainLayout;