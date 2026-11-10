
import { Navigate, Outlet, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  isLoggedIn: boolean;
};

export default function ProtectedRoute({
  isLoggedIn,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
