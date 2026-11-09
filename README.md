<CodeBlock language="markdown" editable>
# IT Helpdesk & Support Management System

1. Giới thiệu
Hệ thống quản lý yêu cầu hỗ trợ kỹ thuật nội bộ,
giúp Employee gửi Ticket và IT Support tiếp nhận,
xử lý và theo dõi tiến độ.
2. Công nghệ sử dụng
Frontend
- ReactJS
- Vite
- Ant Design
- Axios
- React Router DOM
- Socket.IO Client
- Recharts
Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Bcrypt
- Socket.IO
3. Các vai trò
- Employee
- IT Support
- Admin
4. Chức năng chính
- Quản lý tài khoản và phân quyền.
- Tạo và quản lý Ticket.
- Phân công nhân viên IT.
- Trao đổi và gửi thông báo.
- Theo dõi SLA.
- Quản lý ngày nghỉ lễ.
- Thống kê và báo cáo.
- Đánh giá chất lượng hỗ trợ.
5. Cài đặt và chạy dự án
Frontend
cd frontend
npm install
npm run dev
Backend
cd backend
npm install
npm run dev
</CodeBlock>
6. Kiểm tra cấu trúc sau khi tạo
Khi hoàn thành, cấu trúc tổng thể sẽ có dạng:

<CodeBlock language="text" editable>
IT-Helpdesk/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── server.js
│   ├── app.js
│   ├── .env
│   └── package.json
│
├── documents/
│   ├── SRS/
│   ├── UseCase/
│   ├── ERD/
│   └── Diagrams/
│
├── .gitignore
└── README.md
</CodeBlock>