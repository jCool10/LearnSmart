# LearnSmart AI - Authentication System

Hệ thống authentication hoàn chỉnh được xây dựng với React, Next.js, TypeScript, và các công nghệ hiện đại.

## 🚀 Tính năng

- ✅ **Đăng nhập/Đăng ký** với validation mạnh mẽ
- ✅ **Quên mật khẩu** với email reset token
- ✅ **Đặt lại mật khẩu** với token validation
- ✅ **Xác thực email** (tích hợp sẵn)
- ✅ **Auto-refresh token** khi hết hạn
- ✅ **Protected routes** với role-based access
- ✅ **Persistent authentication** với localStorage
- ✅ **Loading states** và error handling
- ✅ **Responsive design** với Tailwind CSS

## 🛠 Công nghệ sử dụng

- **Frontend Framework**: Next.js 15 + React 19
- **State Management**: React Context + TanStack Query
- **Form Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios với interceptors
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Icons**: Lucide React

## 📁 Cấu trúc thư mục

```
frontend/src/
├── app/
│   ├── login/page.tsx              # Trang đăng nhập
│   ├── register/page.tsx           # Trang đăng ký
│   ├── forgot-password/page.tsx    # Trang quên mật khẩu
│   ├── reset-password/page.tsx     # Trang đặt lại mật khẩu
│   └── layout.tsx                  # Root layout với Providers
├── components/auth/
│   ├── LoginForm.tsx               # Form đăng nhập
│   ├── RegisterForm.tsx            # Form đăng ký
│   ├── ForgotPasswordForm.tsx      # Form quên mật khẩu
│   ├── ResetPasswordForm.tsx       # Form đặt lại mật khẩu
│   ├── ProtectedRoute.tsx          # Component bảo vệ routes
│   └── index.ts                    # Export tất cả components
├── contexts/
│   └── AuthContext.tsx             # Context quản lý auth state
├── hooks/
│   └── useAuthQueries.ts           # React Query hooks
├── lib/
│   ├── axios.ts                    # Axios configuration
│   └── validations/
│       └── auth.validation.ts      # Zod schemas
├── providers/
│   └── Providers.tsx               # App providers wrapper
└── types/
    └── auth.types.ts               # TypeScript types
```

## 🔧 Cách sử dụng

### 1. Setup cơ bản

Các providers đã được tích hợp trong `layout.tsx`:

```tsx
// app/layout.tsx
import Providers from "@/providers/Providers"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### 2. Sử dụng Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Xin chào, {user?.username}!</p>
          <button onClick={logout}>Đăng xuất</button>
        </div>
      ) : (
        <p>Vui lòng đăng nhập</p>
      )}
    </div>
  )
}
```

### 3. Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth'

function DashboardPage() {
  return (
    <ProtectedRoute requireEmailVerification>
      <div>Nội dung dashboard cho user đã xác thực email</div>
    </ProtectedRoute>
  )
}

// Admin only route
function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <div>Nội dung chỉ dành cho admin</div>
    </ProtectedRoute>
  )
}
```

### 4. Sử dụng React Query Hooks

```tsx
import { useAuthOperations } from '@/hooks/useAuthQueries'

function AuthComponent() {
  const {
    login,
    register,
    logout,
    isLoggingIn,
    loginError,
    isLoginSuccess
  } = useAuthOperations()

  const handleLogin = async (credentials) => {
    try {
      await login.mutateAsync(credentials)
      // Tự động redirect sau khi login thành công
    } catch (error) {
      // Error được handle tự động
    }
  }

  return (
    <div>
      {isLoggingIn && <p>Đang đăng nhập...</p>}
      {loginError && <p>Lỗi: {loginError.message}</p>}
      {/* UI components */}
    </div>
  )
}
```

### 5. Custom validation với Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth.validation'

function CustomLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}
      
      <button type="submit">Đăng nhập</button>
    </form>
  )
}
```

## 🔐 Security Features

### Token Management
- Access token tự động refresh khi hết hạn
- Refresh token được lưu an toàn trong localStorage
- Auto-logout khi refresh token hết hạn

### Validation
- Client-side validation với Zod schemas
- Server-side validation error handling
- Password strength indicator
- Email format validation

### Route Protection
- Protected routes với authentication check
- Role-based access control (user/admin)
- Email verification requirements
- Automatic redirect sau khi login

## 🎯 Backend API Integration

Authentication system tương thích hoàn toàn với backend API:

```typescript
// API Endpoints được sử dụng:
POST /api/v1/auth/register      // Đăng ký
POST /api/v1/auth/login         // Đăng nhập
POST /api/v1/auth/logout        // Đăng xuất
POST /api/v1/auth/refresh-tokens // Refresh token
POST /api/v1/auth/forgot-password // Quên mật khẩu
POST /api/v1/auth/reset-password  // Đặt lại mật khẩu
POST /api/v1/auth/verify-email    // Xác thực email
GET  /api/v1/auth/me             // Lấy thông tin user
```

## 🎨 UI Components

Tất cả form components đều có:
- Responsive design
- Loading states với spinner
- Error handling với toast messages
- Password visibility toggle
- Form validation feedback
- Accessibility support

## 🚀 Deployment

### Environment Variables

Tạo file `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Build và Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

## 📝 Customization

### Thay đổi styling
- Sửa classes trong components
- Customization Tailwind config
- Override Shadcn/ui components

### Thêm fields mới
1. Cập nhật types trong `auth.types.ts`
2. Sửa Zod schemas trong `auth.validation.ts`
3. Cập nhật form components
4. Cập nhật API calls

### Custom error handling
```tsx
// Trong component
const { login } = useLogin()

const handleLogin = async (data) => {
  try {
    await login.mutateAsync(data)
  } catch (error) {
    // Custom error handling
    if (error.response?.status === 429) {
      showRateLimitError()
    }
    // ...
  }
}
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Add proper types cho tất cả functions
4. Test với các edge cases
5. Update documentation khi có thay đổi

---

**Tác giả**: LearnSmart AI Development Team  
**Phiên bản**: 1.0.0  
**Cập nhật**: January 2025