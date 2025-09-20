import React from 'react';
import { Info, Settings, Phone, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const HamburgerMenu: React.FC = () => {
  const menuItems = [
    { icon: Info, label: 'About/Help', href: '/about' },
    { icon: Settings, label: 'App Settings', href: '/settings' },
    { icon: Phone, label: 'Contact Support', href: '/contact' },
    { icon: FileText, label: 'Terms & Privacy', href: '/terms' },
    { icon: Shield, label: 'Safety Guidelines', href: '/safety' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <a href={item.href} className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </Button>
          ))}
        </nav>
      </div>
      
      <Separator />
      
      <div className="p-6 mt-auto">
        <p className="text-sm text-muted-foreground">
          Nagrik v1.0.0
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Building better communities together
        </p>
      </div>
    </div>
  );
};