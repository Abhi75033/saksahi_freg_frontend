import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const PrivateRoute = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { user } = useAuth();
    return user && user.role === "admin" ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
};
