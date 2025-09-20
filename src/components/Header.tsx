import React, { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HamburgerMenu } from './HamburgerMenu';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <HamburgerMenu />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">Nagrik</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/10">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/10">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};