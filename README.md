# IT Helpdesk

Hệ thống quản lý yêu cầu hỗ trợ kỹ thuật nội bộ. Employee tạo và theo dõi Ticket; IT Support xử lý Ticket được phân công; Admin quản lý người dùng, Category, phân công và hoạt động hỗ trợ.

## Tính năng

- Authentication: đăng ký Employee, đăng nhập, đăng xuất và khôi phục phiên qua `/api/auth/me`.
- User Management: hồ sơ, tạo tài khoản staff, khóa/mở khóa và phân quyền.
- Category Management: tạo, chỉnh sửa, kích hoạt/vô hiệu hóa Category.
- Ticket Management: tạo, phân công, xử lý trạng thái, reopen và Ticket History.
- Comments: Public Comment và Internal Note; Employee không được xem Internal Note.
- Attachments: upload nhiều file, kiểm tra signature/MIME/extension/dung lượng, retry và download có kiểm tra quyền.
- Backend kiểm tra RBAC ở từng request; Frontend không lưu JWT trong localStorage/sessionStorage.

## Kiến trúc

```text
Browser -> React/Vite :5173 -> Express API :5000
                              ├─ MongoDB Atlas / Mongoose
                              ├─ Cloudinary
                              └─ JWT HttpOnly cookie
```

## Công nghệ

Frontend: React 19, Vite, Ant Design, Axios, React Router DOM, Recharts, Socket.IO Client, Oxlint.

Backend: Node.js, Express 5, MongoDB/Mongoose, JWT, bcryptjs, Zod, Multer, Cloudinary, CORS, cookie-parser.

## Yêu cầu

- Node.js và npm.
- MongoDB Atlas hoặc MongoDB tương thích.
- Cloudinary nếu sử dụng Attachment.

## Cài đặt

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

Không commit `.env`, mật khẩu, JWT secret, MongoDB URI hoặc Cloudinary credentials.

## Cấu hình Backend

Tạo `backend/.env` dựa trên `backend/.env.example`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=1d
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

MAX_FILE_SIZE=10485760
MAX_FILES_PER_UPLOAD=5
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

SEED_ADMIN_NAME=<admin-name>
SEED_ADMIN_EMAIL=<admin-email>
SEED_ADMIN_PASSWORD=<strong-password>
```

`MAX_FILE_SIZE` tính theo byte. `MAX_FILES_PER_UPLOAD` là giới hạn số file trong một request và được Backend đọc từ môi trường.

## Cấu hình Frontend

Tạo `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Nếu không khai báo, Frontend dùng URL mặc định trên.

## Chạy dự án

Mở hai terminal:

```powershell
cd backend
npm start
```

Backend chạy mặc định tại `http://localhost:5000`.

```powershell
cd frontend
npm run dev
```

Frontend chạy mặc định tại `http://localhost:5173`.

Kiểm tra Backend:

```text
GET http://localhost:5000/
```

## Tạo tài khoản Admin

Sau khi điền `SEED_ADMIN_*` và `MONGODB_URI`:

```powershell
cd backend
npm run seed:admin
```

Script tạo tài khoản role `ADMIN`, trạng thái `isActive: true`. Không ghi thông tin đăng nhập thật vào README.

## Phân quyền

| Chức năng | Employee | IT Support | Admin |
|---|---:|---:|---:|
| Tự đăng ký | Có | Không | Không |
| Tạo Ticket | Có | Không | Không |
| Xem Ticket của mình | Có | Không | Không |
| Xem Ticket được phân công | Không | Có | Có |
| Xem toàn bộ Ticket | Không | Không | Có |
| Public Comment | Có | Có | Có |
| Internal Note | Không | Có | Có |
| Phân công Ticket | Không | Không | Có |
| Quản lý User/Category | Không | Không | Có |

Backend là nơi quyết định quyền cuối cùng.

## API chính

Các endpoint dùng prefix `/api`; endpoint bảo vệ sử dụng HttpOnly cookie.

### Authentication

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký Employee |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất |
| GET | `/auth/me` | Khôi phục phiên |

### User và Category

| Method | Endpoint | Quyền |
|---|---|---|
| GET/PUT | `/users/profile` | Người dùng đăng nhập |
| GET/POST | `/users` | Admin |
| PATCH | `/users/:id/status` | Admin |
| GET | `/categories`, `/categories/:id` | Người dùng đăng nhập |
| POST/PUT | `/categories`, `/categories/:id` | Admin |
| PATCH | `/categories/:id/status` | Admin |

### Ticket và Comment

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/tickets` | Employee tạo Ticket |
| GET | `/tickets` | Danh sách theo quyền |
| GET | `/tickets/:id` | Chi tiết theo quyền |
| PUT | `/tickets/:id` | Cập nhật Ticket |
| PATCH | `/tickets/:id/assign` | Admin phân công |
| PATCH | `/tickets/:id/status` | Đổi trạng thái |
| GET | `/tickets/:id/history` | Ticket History |
| GET/POST | `/tickets/:id/comments` | Xem/tạo Comment |

### Attachment

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/tickets/:ticketId/attachments` | Upload một hoặc nhiều file |
| GET | `/tickets/:ticketId/attachments` | Danh sách theo quyền |
| GET | `/attachments/:attachmentId/download` | Download sau khi kiểm tra quyền |

Multipart field bắt buộc là `files`:

```text
files=<file-1>
files=<file-2>
commentId=<optional-comment-id>
```

## Luồng Attachment

1. Frontend tạo Ticket trước.
2. Khi Ticket tạo thành công, Frontend gửi batch file với `ticketId`.
3. Nếu upload lỗi, giao diện báo rõ Ticket đã được tạo.
4. Người dùng có thể retry Attachment mà không tạo Ticket mới.
5. Backend kiểm tra Ticket, Comment, role, file signature, MIME, extension, kích thước và số lượng.
6. Nếu batch lỗi, các asset Cloudinary và metadata đã tạo trong request đó được cleanup khi có thể.
7. Download luôn đi qua Backend; danh sách không dùng trực tiếp URL Cloudinary.

Employee chỉ truy cập Ticket của mình. IT Support chỉ truy cập Ticket được phân công. Admin có quyền theo nghiệp vụ. Employee không xem/tải Attachment của Internal Note.

## Kiểm tra chất lượng

Frontend:

```powershell
cd frontend
npx oxlint src
npm run build
```

Backend:

```powershell
cd backend
Get-ChildItem -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
node -e "require('./app'); require('./models/Attachment'); require('./validators/attachmentValidator'); console.log('Backend load passed'); process.exit(0)"
```

Git:

```powershell
cd ..
git diff --check
git status
git diff
```

HTTP integration với MongoDB Atlas, Cloudinary và trình duyệt chỉ được đánh dấu Passed sau khi thực sự chạy bằng credentials hợp lệ.

## Cấu trúc thư mục

```text
IT-Helpdesk/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── validators/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   └── package.json
├── documents/
├── .gitignore
└── README.md
```

## An toàn thông tin

- Không commit `.env` hoặc credentials.
- Không lưu JWT trong localStorage/sessionStorage.
- Không lấy `uploadedBy` từ request body.
- Không tin cậy `ticketId`, `commentId` hoặc `attachmentId` nếu chưa truy vấn và kiểm tra quyền.
- Không trả Cloudinary API key/API secret cho Client.
- URL Cloudinary public đã bị lộ trước đây có thể tiếp tục truy cập trực tiếp; proxy Backend bảo vệ các request mới đi qua API.
- Khi thay đổi nghiệp vụ, đối chiếu SRS, Use Case, Business Process và Collection trước khi sửa code.

## Tài liệu nghiệp vụ

Các tài liệu yêu cầu nằm trong thư mục `documents/`:

- Software Requirements Specification.
- Use Case Specification.
- Business Process.
- Collection Design.

## Trạng thái dự án

Nền tảng hiện gồm Authentication, User Management, Category Management, Ticket Management, Comments/Internal Notes và Attachments. Trước production cần bổ sung kiểm thử tích hợp tự động, kiểm thử HTTP đầy đủ theo từng role, cấu hình deployment và đánh giá private storage Cloudinary.

