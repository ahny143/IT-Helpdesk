import { Button, Card, Form, Input, Modal, Popconfirm, Switch, Table, message } from "antd";
import { useEffect, useState } from "react";
import * as service from "../../services/categoryService";

export default function CategoryManagement() {
    const [rows, setRows] = useState([]); const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null); const [statusLoadingId, setStatusLoadingId] = useState(null); const [form] = Form.useForm();
    const load = () => service.listCategories().then((r) => setRows(r.data.data.categories));
    useEffect(() => { load(); }, []);
    const save = async (v) => { if (editing) await service.updateCategory(editing._id, v); else await service.createCategory(v); message.success("Category saved"); setOpen(false); setEditing(null); form.resetFields(); load(); };
    const edit = (r) => { setEditing(r); form.setFieldsValue(r); setOpen(true); };
    const changeStatus = async (category, isActive) => { setStatusLoadingId(category._id); try { await service.updateCategoryStatus(category._id, isActive); message.success(`${isActive ? "Activated" : "Deactivated"} ${category.name}`); await load(); } catch (error) { message.error(error.response?.data?.message || "Unable to update category status"); } finally { setStatusLoadingId(null); } };
    return <Card title="Categories" extra={<Button type="primary" onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>New category</Button>}><Table rowKey="_id" dataSource={rows} columns={[{ title: "Name", dataIndex: "name" }, { title: "Description", dataIndex: "description" }, { title: "Active", dataIndex: "isActive", render: (v, r) => <Popconfirm title={`${v ? "Deactivate" : "Activate"} ${r.name}?`} description={`Confirm you want to ${v ? "deactivate" : "activate"} this category.`} okText="Confirm" cancelText="Cancel" onConfirm={() => changeStatus(r, !v)} disabled={statusLoadingId !== null}><Switch checked={v} loading={statusLoadingId === r._id} disabled={statusLoadingId !== null} /></Popconfirm> }, { title: "Action", render: (_, r) => <Button onClick={() => edit(r)}>Edit</Button> }]} /><Modal open={open} title={editing ? "Edit category" : "New category"} onCancel={() => setOpen(false)} footer={null}><Form form={form} layout="vertical" onFinish={save}><Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="description" label="Description"><Input.TextArea /></Form.Item><Button type="primary" htmlType="submit">Save</Button></Form></Modal></Card>;
}
