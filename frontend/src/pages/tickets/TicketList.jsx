import { Button, Card, Empty, Select, Space, Table, Tag, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTickets } from "../../services/ticketService";

const colors = { OPEN: "blue", ASSIGNED: "cyan", IN_PROGRESS: "processing", PENDING: "orange", RESOLVED: "green", CLOSED: "default" };

export default function TicketList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState({ page: 1, limit: 10, total: 0 });
    const [status, setStatus] = useState();
    const load = useCallback(() => {
        setLoading(true);
        listTickets({ page: page.page, limit: page.limit, ...(status ? { status } : {}) }).then((r) => { const d = r.data.data; setRows(d.items); setPage((p) => ({ ...p, total: d.total })); }).finally(() => setLoading(false));
    }, [page.page, page.limit, status]);
    useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer); }, [load]);
    return <Card title={<Typography.Title level={2}>Tickets</Typography.Title>} extra={<Space><Select allowClear placeholder="Status" style={{ width: 150 }} onChange={(value) => { setStatus(value); setPage((p) => ({ ...p, page: 1 })); }} options={Object.keys(colors).map((v) => ({ label: v, value: v }))} /><Link to="/tickets/new"><Button type="primary">Create Ticket</Button></Link></Space>}><Table rowKey="_id" loading={loading} locale={{ emptyText: <Empty description="No tickets" /> }} dataSource={rows} pagination={{ current: page.page, pageSize: page.limit, total: page.total, onChange: (p, limit) => setPage({ page: p, limit, total: page.total }) }} columns={[{ title: "Code", dataIndex: "ticketCode" }, { title: "Title", dataIndex: "title", render: (v, r) => <Link to={`/tickets/${r._id}`}>{v}</Link> }, { title: "Category", dataIndex: ["categoryId", "name"] }, { title: "Priority", dataIndex: "priority" }, { title: "Status", dataIndex: "status", render: (v) => <Tag color={colors[v]}>{v}</Tag> }, { title: "Created", dataIndex: "createdAt", render: (v) => new Date(v).toLocaleString() }]} /></Card>;
}
