import { Alert, Card, Col, Empty, Row, Skeleton, Statistic, Table, Tag, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getEmployeeDashboard } from "../services/dashboardService";
import { listTickets } from "../services/ticketService";

const statuses = ["OPEN", "ASSIGNED", "IN_PROGRESS", "PENDING", "RESOLVED", "CLOSED"];
const statusColors = ["#1677ff", "#13c2c2", "#722ed1", "#faad14", "#52c41a", "#8c8c8c"];
const priorities = { LOW: "green", MEDIUM: "blue", HIGH: "orange", CRITICAL: "red" };
const slaStates = ["ON_TRACK", "NEAR_DEADLINE", "BREACHED", "PAUSED", "COMPLETED"];

function EmployeeDashboard({ user }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try { setData((await getEmployeeDashboard()).data.data); }
        catch (requestError) { setError(requestError.response?.data?.message || "Unable to load dashboard"); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);
    if (loading && !data) return <Skeleton active paragraph={{ rows: 8 }} />;
    if (error && !data) return <Alert type="error" showIcon message={error} action={<button type="button" onClick={load}>Retry</button>} />;
    if (!data) return <Empty description="No dashboard data" />;
    const chartData = statuses.map((status) => ({ name: status, value: data.countsByStatus?.[status] || 0 }));
    const columns = [
        { title: "Ticket", render: (_, ticket) => <Link to={`/tickets/${ticket._id}`}>{ticket.ticketCode}</Link> },
        { title: "Title", dataIndex: "title" },
        { title: "Priority", dataIndex: "priority", render: (value) => <Tag color={priorities[value]}>{value}</Tag> },
        { title: "Status", dataIndex: "status" },
        { title: "Created", dataIndex: "createdAt", render: (value) => new Date(value).toLocaleString() },
        { title: "Assignee", dataIndex: "assigneeId", render: (value) => value?.fullName || "Unassigned" }
    ];
    return <>
        <Typography.Title level={2}>Welcome, {user?.fullName}</Typography.Title>
        {error && <Alert type="error" showIcon message={error} action={<button type="button" onClick={load}>Retry</button>} style={{ marginBottom: 16 }} />}
        <Row gutter={[16, 16]}>{statuses.map((status) => <Col xs={12} md={8} lg={4} key={status}><Card><Statistic title={status} value={data.countsByStatus?.[status] || 0} /></Card></Col>)}</Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}><Card title="Tickets by status">{data.total ? <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={chartData} dataKey="value" nameKey="name" outerRadius={95} label>{chartData.map((entry, index) => <Cell key={entry.name} fill={statusColors[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer> : <Empty description="No tickets" />}</Card></Col>
            <Col xs={24} lg={12}><Card title="SLA summary"><Row gutter={[12, 12]}>{slaStates.map((state) => <Col span={12} key={state}><Statistic title={state} value={data.slaSummary?.[state] || 0} /></Col>)}</Row></Card></Col>
        </Row>
        <Card title="Recent tickets" style={{ marginTop: 16 }}><Table rowKey="_id" dataSource={data.recentTickets} columns={columns} pagination={false} locale={{ emptyText: <Empty description="No tickets" /> }} scroll={{ x: 800 }} /></Card>
    </>;
}

function GenericDashboard({ user }) {
    const [data, setData] = useState({ total: 0, open: 0, resolved: 0 });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const active = ["OPEN", "ASSIGNED", "IN_PROGRESS", "PENDING"];
            const [totalResponse, ...responses] = await Promise.all([listTickets({ page: 1, limit: 1 }), ...active.map((status) => listTickets({ page: 1, limit: 1, status })), listTickets({ page: 1, limit: 1, status: "RESOLVED" }), listTickets({ page: 1, limit: 1, status: "CLOSED" })]);
            setData({ total: totalResponse.data.data.total || 0, open: responses.slice(0, active.length).reduce((sum, item) => sum + (item.data.data.total || 0), 0), resolved: responses.slice(active.length).reduce((sum, item) => sum + (item.data.data.total || 0), 0) });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load dashboard");
        } finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);
    if (loading) return <Skeleton active paragraph={{ rows: 4 }} />;
    return <><Typography.Title level={2}>Welcome, {user?.fullName}</Typography.Title>{error && <Alert type="error" showIcon message={error} action={<button type="button" onClick={load}>Retry</button>} />}<Row gutter={[16, 16]}><Col xs={24} md={8}><Card><Statistic title="Visible tickets" value={data.total} /></Card></Col><Col xs={24} md={8}><Card><Statistic title="In progress" value={data.open} /></Card></Col><Col xs={24} md={8}><Card><Statistic title="Resolved or closed" value={data.resolved} /></Card></Col></Row></>;
}

export default function Dashboard() {
    const { user } = useAuth();
    if (user?.role !== "EMPLOYEE") return <GenericDashboard user={user} />;
    return <EmployeeDashboard user={user} />;
}
