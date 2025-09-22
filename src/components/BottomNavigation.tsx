import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, List, Map, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const getNavigationItems = (user: any) => [
  { icon: Home, label: 'Home', path: '/' },
  { icon: FileText, label: 'Report', path: user ? '/report/new' : '/auth' },
  { icon: List, label: 'My Reports', path: user ? '/reports' : '/auth' },
  { icon: Map, label: 'Map', path: user ? '/map' : '/auth' },
  { icon: User, label: 'Profile', path: user ? '/profile' : '/auth' },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const navigationItems = getNavigationItems(user);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "h-full rounded-none flex flex-col items-center justify-center space-y-1 p-1",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};