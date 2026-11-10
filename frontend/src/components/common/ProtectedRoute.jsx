import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
export default function ProtectedRoute({ roles }) { const { user, loading } = useAuth(); const location = useLocation(); if (loading) return <div className="center-page">Loading...</div>; if (!user) return <Navigate to="/login" state={{ from: location }} replace />; if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />; return <Outlet />; }
