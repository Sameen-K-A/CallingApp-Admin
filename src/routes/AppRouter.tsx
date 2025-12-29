import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTE } from "@/routes/router";

// Layout
import AdminLayout from "@/layout/GeneralLayout";

// Pages
import Login from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import Telecallers from "@/pages/Telecallers";
import TelecallerDetails from "@/pages/TelecallerDetails";
import Users from "@/pages/Users";
import UserDetails from "@/pages/UserDetails";
import Plans from "@/pages/Plans";
import Transactions from "@/pages/Transactions";
import TransactionDetails from "@/pages/TransactionDetails";
import Reports from "@/pages/Reports";
import ReportDetails from "@/pages/ReportDetails";
import Configuration from "@/pages/Configuration";
import NotfoundPage from "@/pages/NotFound";

//Protecters
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PublicRoute } from "@/components/shared/PublicRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={ROUTE.LOGIN} element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTE.DEFAULT} element={<Navigate to={ROUTE.DASHBOARD} replace />} />
          <Route path={ROUTE.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTE.TELECALLERS} element={<Telecallers />} />
          <Route path={ROUTE.TELECALLER_DETAILS} element={<TelecallerDetails />} />
          <Route path={ROUTE.USERS} element={<Users />} />
          <Route path={ROUTE.USER_DETAILS} element={<UserDetails />} />
          <Route path={ROUTE.PLANS} element={<Plans />} />
          <Route path={ROUTE.TRANSACTIONS} element={<Transactions />} />
          <Route path={ROUTE.TRANSACTION_DETAILS} element={<TransactionDetails />} />
          <Route path={ROUTE.REPORTS} element={<Reports />} />
          <Route path={ROUTE.REPORT_DETAILS} element={<ReportDetails />} />
          <Route path={ROUTE.CONFIGURATION} element={<Configuration />} />
        </Route>
      </Route>

      <Route path={ROUTE.NOT_FOUND} element={<NotfoundPage />} />
    </Routes>
  );
};