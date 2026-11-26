import { Alert, Button, Card, Form, Input, Rate, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { getTicketRating, submitRating } from "../../services/ratingService";

export default function RatingPanel({ ticketId, ticket, user }) {
    const [rating, setRating] = useState(null); const [loading, setLoading] = useState(true); const [sending, setSending] = useState(false); const [form] = Form.useForm(); const eligible = ticket.status === "CLOSED" && user.role === "EMPLOYEE";
    useEffect(() => { if (!eligible) return undefined; getTicketRating(ticketId).then((response) => setRating(response.data.data.rating)).catch(() => message.error("Unable to load rating")).finally(() => setLoading(false)); return undefined; }, [eligible, ticketId]);
    if (!eligible) return null; if (loading) return <Card title="Rating"><Spin /></Card>;
    const send = async (values) => { if (sending) return; setSending(true); try { const response = await submitRating(ticketId, values); setRating(response.data.data.rating); form.resetFields(); message.success("Rating submitted"); } catch (error) { message.error(error.response?.data?.message || "Unable to submit rating"); } finally { setSending(false); } };
    return <Card title="Rate support"><Alert type="info" message="Your rating can be submitted once for this closed ticket." style={{ marginBottom: 12 }} />{rating ? <><Rate disabled value={rating.score} /><p>{rating.feedback || "No feedback"}</p></> : <Form form={form} onFinish={send}><Form.Item name="score" rules={[{ required: true, message: "Please select a score" }]}><Rate /></Form.Item><Form.Item name="feedback"><Input.TextArea maxLength={2000} showCount placeholder="Optional feedback" /></Form.Item><Button type="primary" htmlType="submit" loading={sending}>Submit rating</Button></Form>}</Card>;
}
