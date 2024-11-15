import React from 'react';
import SideBar from '../SideBar/SideBar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <SideBar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;