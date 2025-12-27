import { useState } from 'react';
import { NavMain } from './NavMain';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '@/context/AuthContext';
import type { IsidebarItems } from "@/types/general";
import { LogOut } from 'lucide-react';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { sidebarData: IsidebarItems[] };

export function AppSidebar({ sidebarData, ...props }: AppSidebarProps) {
  const { logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='mt-3'>
            <span className="text-3xl px-2 font-black tracking-tight leading-relaxed">
              <span className="bg-linear-to-r from-primary to-[#FFB05A] text-transparent bg-clip-text">
                Audio
              </span>{" "}
              <span>Call</span>
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='mt-1'>
        <NavMain sidebarData={sidebarData} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <SidebarMenuButton className='cursor-pointer hover:bg-destructive hover:text-white font-semibold duration-300 transition-colors rounded-2xl px-3'>
                <LogOut />
                Logout
              </SidebarMenuButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will log you out of your current session. You will need to sign in again to access the admin panel.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={handleLogout}>
                  Confirm Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};