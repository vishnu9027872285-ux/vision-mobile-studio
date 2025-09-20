import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-16">
        {children || <Outlet />}
      </main>
      <BottomNavigation />
    </div>
  );
};