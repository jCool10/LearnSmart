# Docker PostgreSQL Setup Guide

## Cấu hình Environment Variables

Tạo file `.env` trong thư mục root với nội dung:

```env
# Database Configuration
POSTGRES_DB=learnsmart
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Prisma Database URL
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/learnsmart?schema=public

# pgAdmin Configuration
PGADMIN_EMAIL=admin@learnsmart.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
```

## Các lệnh Docker

### 1. Khởi chạy PostgreSQL
```bash
docker-compose up -d postgres
```

### 2. Khởi chạy cả PostgreSQL và pgAdmin
```bash
docker-compose up -d
```

### 3. Xem logs
```bash
docker-compose logs postgres
```

### 4. Dừng services
```bash
docker-compose down
```

### 5. Dừng và xóa volumes (data sẽ bị mất)
```bash
docker-compose down -v
```

## Chạy migrations

Sau khi PostgreSQL đã chạy:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Hoặc push schema (cho development)
npm run db:push
```

## Truy cập

- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050`
  - Email: admin@learnsmart.com
  - Password: admin123

## Kết nối từ pgAdmin

1. Mở http://localhost:5050
2. Đăng nhập với credentials trên
3. Add new server:
   - Name: LearnSmart
   - Host: postgres (container name)
   - Port: 5432
   - Database: learnsmart
   - Username: postgres
   - Password: postgres123

## Development Workflow

1. Start Docker containers:
   ```bash
   docker-compose up -d
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Production Notes

- Thay đổi passwords mạnh hơn
- Sử dụng environment variables từ hosting provider
- Cân nhắc sử dụng managed PostgreSQL service 