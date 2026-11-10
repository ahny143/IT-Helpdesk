import { createContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
    useEffect(() => { authService.me().then((r) => setUser(r.data.data.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
    const value = useMemo(() => ({ user, loading, login: async (d) => { const r = await authService.login(d); setUser(r.data.data.user); return r; }, register: authService.register, logout: async () => { try { await authService.logout(); } finally { setUser(null); } } }), [user, loading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthContext;
