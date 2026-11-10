import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/profile/Profile";
import UserManagement from "../pages/admin/UserManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";
import TicketList from "../pages/tickets/TicketList";
import CreateTicket from "../pages/employee/CreateTicket";
import TicketDetail from "../pages/tickets/TicketDetail";

export default function AppRoutes() {
    return <Routes>
        <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
            <Route element={<EmployeeLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tickets" element={<TicketList />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />
                <Route element={<ProtectedRoute roles={["EMPLOYEE"]} />}>
                    <Route path="/tickets/new" element={<CreateTicket />} />
                </Route>
            </Route>
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
            </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>;
}
