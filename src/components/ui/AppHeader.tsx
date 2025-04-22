
import { Bell, ChevronRight, MenuIcon, User } from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { useState } from 'react';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  className?: string;
  hideNotifications?: boolean;
  hideProfile?: boolean;
}

export function AppHeader({ 
  title, 
  showBackButton = false,
  showMenu = false, 
  onMenuClick,
  className,
  hideNotifications = false,
  hideProfile = false
}: AppHeaderProps) {
  const navigate = useNavigate();
  const [notificationCount] = useState(3);
  
  return (
    <header className={cn(
      "sticky top-0 z-50 flex w-full items-center justify-between bg-white/80 backdrop-blur-md py-4 px-5", 
      className
    )}>
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
        
        {showMenu && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="rounded-full"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        )}
        
        {title ? (
          <h1 className="text-xl font-cairo font-bold">{title}</h1>
        ) : (
          <Logo />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {!hideNotifications && (
          <Button 
            variant="ghost" 
            size="icon"
            className="relative rounded-full"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-growup text-[10px] text-white">
                {notificationCount}
              </span>
            )}
          </Button>
        )}
        
        {!hideProfile && (
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
