import { useSyncExternalStore } from "react";
import { Navigate, Outlet } from "react-router-dom";

import {
  isAdminAuthenticated,
  subscribeToAdminAuth,
} from "../../services/adminAuth";

export default function ProtectedAdminRoute() {
  const isAdmin = useSyncExternalStore(
    subscribeToAdminAuth,
    isAdminAuthenticated,
  );

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
