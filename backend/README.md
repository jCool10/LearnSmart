# LearnSmart Backend API

Express.js backend với Prisma ORM, PostgreSQL, và TypeScript theo kiến trúc Clean Architecture.

## 🚀 Tính năng

- ✅ **Clean Architecture** - Controller-Service-Repository pattern
- ✅ **Prisma ORM** - Type-safe database access với PostgreSQL
- ✅ **TypeScript** - Type safety và developer experience tốt hơn
- ✅ **RESTful API** - CRUD operations cho Users, Posts, Profiles
- ✅ **Error Handling** - Centralized error handling
- ✅ **Logging** - Winston logger với daily rotation
- ✅ **Health Check** - Database connectivity monitoring
- ✅ **Pagination** - Built-in pagination support
- ✅ **Search** - Full-text search capabilities
- ✅ **Validation** - Input validation và sanitization

## 📋 Yêu cầu

- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- Yarn hoặc npm

## 🛠️ Cài đặt

1. **Clone repository và install dependencies:**

```bash
git clone <repository-url>
cd backend
yarn install
```

2. **Setup environment variables:**

```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

3. **Setup database:**

```bash
# Tạo database và run migrations
yarn db:push

# Hoặc sử dụng migrations (recommended for production)
yarn db:migrate

# Generate Prisma client
yarn db:generate
```

4. **Start development server:**

```bash
yarn dev
```

Server sẽ chạy tại: `http://localhost:8080`

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api/v1
```

### Health Check

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check với database status

### Users API

- `POST /users` - Tạo user mới
- `POST /users/with-profile` - Tạo user với profile
- `GET /users` - Lấy danh sách users (có pagination)
- `GET /users/search?q=term` - Tìm kiếm users
- `GET /users/stats` - Thống kê users
- `GET /users/:id` - Lấy user theo ID
- `GET /users/email/:email` - Lấy user theo email
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Posts API

- `POST /posts` - Tạo bài viết mới
- `GET /posts` - Lấy danh sách bài viết
- `GET /posts/published` - Lấy bài viết đã publish
- `GET /posts/drafts` - Lấy bài viết draft
- `GET /posts/search?q=term` - Tìm kiếm bài viết
- `GET /posts/stats` - Thống kê bài viết
- `GET /posts/author/:authorId` - Lấy bài viết theo tác giả
- `GET /posts/:id` - Lấy bài viết theo ID
- `PUT /posts/:id` - Cập nhật bài viết
- `PATCH /posts/:id/publish` - Publish bài viết
- `PATCH /posts/:id/unpublish` - Unpublish bài viết
- `DELETE /posts/:id` - Xóa bài viết

### Profiles API

- `POST /profiles` - Tạo profile mới
- `GET /profiles` - Lấy danh sách profiles
- `GET /profiles/search?q=term` - Tìm kiếm profiles
- `GET /profiles/stats` - Thống kê profiles
- `GET /profiles/:id` - Lấy profile theo ID
- `GET /profiles/user/:userId` - Lấy profile theo user ID
- `PUT /profiles/:id` - Cập nhật profile
- `PUT /profiles/user/:userId` - Cập nhật profile theo user ID
- `DELETE /profiles/:id` - Xóa profile
- `DELETE /profiles/user/:userId` - Xóa profile theo user ID

### Pagination Parameters

Tất cả API list đều support pagination:

- `page` - Số trang (default: 1)
- `limit` - Số items per page (default: 10, max: 100)

### Response Format

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {}, // hoặc []
  "meta": {
    // chỉ có với pagination
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🗂️ Cấu trúc dự án

```
src/
├── configs/           # Configuration files
│   ├── database.config.ts    # Prisma client setup
│   ├── express.config.ts     # Express middleware
│   └── index.ts             # Config exports
├── controllers/       # HTTP request handlers
│   ├── user.controller.ts
│   ├── post.controller.ts
│   ├── profile.controller.ts
│   └── health.controller.ts
├── services/          # Business logic layer
│   ├── user.service.ts
│   ├── post.service.ts
│   └── profile.service.ts
├── repositories/      # Data access layer
│   ├── base.repository.ts
│   ├── user.repository.ts
│   ├── post.repository.ts
│   └── profile.repository.ts
├── routes/           # API routes
│   ├── user.route.ts
│   ├── post.route.ts
│   ├── profile.route.ts
│   └── health.route.ts
├── cores/            # Core utilities
│   ├── error.handler.ts
│   └── response.handler.ts
├── middlewares/      # Custom middlewares
└── utils/           # Utility functions
```

## 📝 Database Scripts

```bash
# Generate Prisma client
yarn db:generate

# Push schema changes to database (development)
yarn db:push

# Create and run migrations
yarn db:migrate

# Run migrations in production
yarn db:migrate:prod

# Open Prisma Studio
yarn db:studio

# Reset database (cảnh báo: xóa tất cả data)
yarn db:reset
```

## 🔧 Development

```bash
# Start development server với hot reload
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Linting
yarn lint
yarn lint:fix

# Code formatting
yarn prettier
yarn prettier:fix
```

## 🌟 Tính năng nổi bật

### 1. Clean Architecture

- **Controllers**: Xử lý HTTP requests/responses
- **Services**: Chứa business logic
- **Repositories**: Truy cập database

### 2. Type Safety

- Prisma generated types
- TypeScript strict mode
- Interface-based development

### 3. Error Handling

- Centralized error handling
- Custom error classes
- Proper HTTP status codes

### 4. Database Features

- Connection pooling
- Query logging
- Health checks
- Graceful shutdown

### 5. Developer Experience

- Hot reload với nodemon
- Detailed logging
- Environment-based configuration
- TypeScript path mapping

## 📄 Environment Variables

Xem file `.env.example` để biết tất cả environment variables cần thiết.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License

This project is licensed under the ISC License.
