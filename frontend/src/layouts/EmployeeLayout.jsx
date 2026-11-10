import { Layout } from "antd"; import { Outlet } from "react-router-dom"; import Header from "../components/common/Header"; import Sidebar from "../components/common/Sidebar";
export default function EmployeeLayout() { return <Layout className="app-shell"><Sidebar /><Layout><Header /><main className="content"><Outlet /></main></Layout></Layout>; }
