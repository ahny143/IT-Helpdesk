import { Outlet } from "react-router-dom";
export default function AuthLayout() { return <main className="auth-shell"><div className="auth-brand"><div className="brand-mark">IT</div><h1>Helpdesk</h1><p>Internal support management</p></div><Outlet /></main>; }
