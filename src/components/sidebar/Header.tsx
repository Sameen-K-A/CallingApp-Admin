import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SunMedium, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-(--header-height) shrink-0 mb-8 sm:mb-5 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between">
        <SidebarTrigger />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {theme === 'light'
            ? <Moon className="h-5 w-5" />
            : <SunMedium className="h-5 w-5" />
          }
        </Button>
      </div>
    </header>
  );
};