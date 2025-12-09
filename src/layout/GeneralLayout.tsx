import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Header } from "@/components/sidebar/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROUTE } from "@/routes/router";
import type { IsidebarItems } from "@/types/general";
import { MdPayments, MdPeopleAlt, MdSpaceDashboard, MdWarning } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import { RiCustomerServiceFill } from "react-icons/ri";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {

  const navigate = useNavigate();
  const sidebarData: IsidebarItems[] = [
    {
      title: "Dashboard",
      url: ROUTE.DASHBOARD,
      icon: MdSpaceDashboard,
      onClick: () => navigate(ROUTE.DASHBOARD),
    },
    {
      title: "Telecallers",
      url: ROUTE.TELECALLERS,
      icon: RiCustomerServiceFill,
      onClick: () => navigate(ROUTE.TELECALLERS),
    },
    {
      title: "Users",
      url: ROUTE.USERS,
      icon: MdPeopleAlt,
      onClick: () => navigate(ROUTE.USERS),
    },
    {
      title: "Plans",
      url: ROUTE.PLANS,
      icon: FaCoins,
      onClick: () => navigate(ROUTE.PLANS),
    },
    {
      title: "Transactions",
      url: ROUTE.TRANSACTIONS,
      icon: MdPayments,
      onClick: () => navigate(ROUTE.TRANSACTIONS),
    },
    {
      title: "Reports",
      url: ROUTE.REPORTS,
      icon: MdWarning,
      onClick: () => navigate(ROUTE.REPORTS),
    },
  ];


  return (
    <SidebarProvider>
      <AppSidebar variant="inset" sidebarData={sidebarData} />
      <SidebarInset className="p-4">
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};