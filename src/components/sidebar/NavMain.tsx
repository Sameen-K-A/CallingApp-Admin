import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import type { IsidebarItems } from "@/types/general"
import { useLocation, useNavigate } from 'react-router-dom';

interface NavMainProps {
  sidebarData: IsidebarItems[];
}

export function NavMain({ sidebarData }: NavMainProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu>
          {sidebarData.map((item) => {
            const isActive = location.pathname.startsWith(item.url);
            const buttonClasses = `w-full cursor-pointer px-3 transition-colors duration-200 ${isActive ? 'bg-gradient-to-r from-primary to-primary/80 text-white' : 'hover:bg-secondary'}`;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`${buttonClasses} rounded-3xl`}
                  isActive={isActive}
                  onClick={() => item.onClick ? item.onClick() : navigate(item.url)}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-black' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${isActive ? 'text-black' : 'text-muted-foreground'}`}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
};