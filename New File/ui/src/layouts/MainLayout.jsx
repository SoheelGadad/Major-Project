import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-app-container">
      {/* If you want a shared Navbar for all admin pages, put it here */}
      <Outlet /> 
    </div>
  );
};

export default MainLayout;