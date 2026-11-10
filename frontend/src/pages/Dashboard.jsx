import { Card, Col, Row, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";
import { listTickets } from "../services/ticketService";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState({ total: 0, open: 0, resolved: 0 });
    useEffect(() => {
        const active = ["OPEN", "ASSIGNED", "IN_PROGRESS", "PENDING"];
        Promise.all([listTickets({ page: 1, limit: 1 }), ...active.map((status) => listTickets({ page: 1, limit: 1, status })), listTickets({ page: 1, limit: 1, status: "RESOLVED" }), listTickets({ page: 1, limit: 1, status: "CLOSED" })]).then(([all, ...responses]) => {
            const total = all.data.data.total || 0;
            const open = responses.slice(0, active.length).reduce((sum, r) => sum + (r.data.data.total || 0), 0);
            const resolved = responses.slice(active.length).reduce((sum, r) => sum + (r.data.data.total || 0), 0);
            setData({ total, open, resolved });
        }).catch(() => {});
    }, []);
    return <><Typography.Title level={2}>Welcome, {user?.fullName}</Typography.Title><Row gutter={[16, 16]}><Col xs={24} md={8}><Card><Statistic title="Visible tickets" value={data.total} /></Card></Col><Col xs={24} md={8}><Card><Statistic title="In progress" value={data.open} /></Card></Col><Col xs={24} md={8}><Card><Statistic title="Resolved or closed" value={data.resolved} /></Card></Col></Row></>;
}
