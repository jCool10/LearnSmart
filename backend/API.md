# 📚 API Documentation

## 🌐 **Base URL**

```
http://localhost:8080/api/v1
```

## 🔐 **Authentication**

### Authentication Method

The API uses **Bearer Token** authentication with JWT (JSON Web Tokens).

### Request Header

```http
Authorization: Bearer <access_token>
```

### Token Types

- **Access Token**: Short-lived token (15 minutes) for API access
- **Refresh Token**: Long-lived token (7 days) for obtaining new access tokens

---

## 📋 **Standard Response Format**

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    /* Response data */
  },
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z",
    "version": "v1"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z",
    "version": "v1"
  },
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    /* Array of items */
  ],
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z",
    "version": "v1",
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15
    }
  }
}
```

---

## 🔒 **Authentication Endpoints**

### 1. **Register User**

Create a new user account.

**Endpoint:** `POST /auth/register`  
**Authentication:** ❌ Not required

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "username": "John Doe"
}
```

#### Validation Rules

- **email**: Valid email format, unique
- **password**: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- **username**: 2-50 characters, letters, numbers, underscores, and spaces only

#### Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clr123abc456def789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": false,
      "createdAt": "2025-01-27T10:30:00.000Z",
      "updatedAt": "2025-01-27T10:30:00.000Z"
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2025-01-27T10:45:00.000Z"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2025-02-03T10:30:00.000Z"
      }
    }
  }
}
```

### 2. **Login User**

Authenticate existing user.

**Endpoint:** `POST /auth/login`  
**Authentication:** ❌ Not required

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      /* User object */
    },
    "tokens": {
      /* Token objects */
    }
  }
}
```

### 3. **Refresh Tokens**

Get new access and refresh tokens.

**Endpoint:** `POST /auth/refresh-tokens`  
**Authentication:** ❌ Not required

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Tokens refreshed successfully",
  "data": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2025-01-27T10:45:00.000Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2025-02-03T10:30:00.000Z"
    }
  }
}
```

### 4. **Logout User**

Invalidate refresh token.

**Endpoint:** `POST /auth/logout`  
**Authentication:** ❌ Not required

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

### 5. **Forgot Password**

Request password reset email.

**Endpoint:** `POST /auth/forgot-password`  
**Authentication:** ❌ Not required

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "If your email is registered, you will receive password reset instructions",
  "data": {}
}
```

### 6. **Reset Password**

Reset password using reset token.

**Endpoint:** `POST /auth/reset-password`  
**Authentication:** ❌ Not required

#### Request Body

```json
{
  "resetPasswordToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewSecurePassword123!"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {}
}
```

### 7. **Send Verification Email**

Send email verification link.

**Endpoint:** `POST /auth/send-verification-email`  
**Authentication:** ✅ Required

#### Request Body

```json
{
  "user": {
    "id": "clr123abc456def789",
    "email": "john@example.com"
  }
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Verification email sent",
  "data": {}
}
```

### 8. **Verify Email**

Verify email address using verification token.

**Endpoint:** `POST /auth/verify-email`  
**Authentication:** ❌ Not required

#### Request Body

```json
{
  "verifyEmailToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {}
}
```

---

## 👥 **User Management Endpoints**

### 1. **Create User** (Admin Only)

Create a new user.

**Endpoint:** `POST /users`  
**Authentication:** ✅ Required (`manageUsers` permission)

#### Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "role": "user"
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "clr123abc456def789",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user",
    "isEmailVerified": false,
    "createdAt": "2025-01-27T10:30:00.000Z",
    "updatedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

### 2. **Get All Users**

Retrieve paginated list of users.

**Endpoint:** `GET /users`  
**Authentication:** ✅ Required (`getUsers` permission)

#### Query Parameters

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sortBy` (optional): Sort field (default: 'createdAt')
- `sortOrder` (optional): 'asc' or 'desc' (default: 'desc')

#### Example Request

```
GET /users?page=1&limit=10&sortBy=name&sortOrder=asc
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "clr123abc456def789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "createdAt": "2025-01-27T10:30:00.000Z",
      "updatedAt": "2025-01-27T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15
    }
  }
}
```

### 3. **Search Users**

Search users by name or email.

**Endpoint:** `GET /users/search`  
**Authentication:** ✅ Required (`getUsers` permission)

#### Query Parameters

- `q` (required): Search query
- `page`, `limit`, `sortBy`, `sortOrder`: Same as Get All Users

#### Example Request

```
GET /users/search?q=john&page=1&limit=10
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    /* Array of matching users */
  ],
  "meta": {
    "pagination": {
      /* Pagination info */
    }
  }
}
```

### 4. **Get User Stats**

Get user statistics.

**Endpoint:** `GET /users/stats`  
**Authentication:** ✅ Required (`getUsers` permission)

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 1500,
    "verified": 1200,
    "unverified": 300,
    "admins": 5
  }
}
```

### 5. **Get User by ID**

Retrieve specific user by ID.

**Endpoint:** `GET /users/:id`  
**Authentication:** ✅ Required (`getUsers` permission)

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "clr123abc456def789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": true,
    "createdAt": "2025-01-27T10:30:00.000Z",
    "updatedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

### 6. **Get User by Email**

Retrieve specific user by email.

**Endpoint:** `GET /users/email/:email`  
**Authentication:** ✅ Required (`getUsers` permission)

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    /* User object */
  }
}
```

### 7. **Update User**

Update user information.

**Endpoint:** `PUT /users/:id`  
**Authentication:** ✅ Required (`manageUsers` permission)

#### Request Body

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    /* Updated user object */
  }
}
```

### 8. **Delete User**

Delete a user.

**Endpoint:** `DELETE /users/:id`  
**Authentication:** ✅ Required (`manageUsers` permission)

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {}
}
```

---

## 🎫 **Token Management Endpoints**

### 1. **Create Token** (Admin Only)

Create a new token.

**Endpoint:** `POST /tokens`  
**Authentication:** ✅ Required (`manageTokens` permission)

#### Request Body

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "refresh",
  "expires": "2025-02-03T10:30:00.000Z",
  "userId": "clr123abc456def789",
  "blacklisted": false
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Token created successfully",
  "data": {
    "id": "clr456def789ghi012",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "refresh",
    "expires": "2025-02-03T10:30:00.000Z",
    "blacklisted": false,
    "userId": "clr123abc456def789",
    "createdAt": "2025-01-27T10:30:00.000Z",
    "updatedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

### 2. **Get All Tokens**

Retrieve paginated list of tokens.

**Endpoint:** `GET /tokens`  
**Authentication:** ✅ Required (`getTokens` permission)

#### Query Parameters

- `page`, `limit`, `sortBy`, `sortOrder`: Same as other paginated endpoints

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Tokens retrieved successfully",
  "data": [
    /* Array of token objects */
  ],
  "meta": {
    "pagination": {
      /* Pagination info */
    }
  }
}
```

### 3. **Get Active Tokens**

Retrieve non-blacklisted, non-expired tokens.

**Endpoint:** `GET /tokens/active`  
**Authentication:** ✅ Required (`getTokens` permission)

### 4. **Get Token Stats**

Get token statistics.

**Endpoint:** `GET /tokens/stats`  
**Authentication:** ✅ Required (`getTokens` permission)

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Token statistics retrieved successfully",
  "data": {
    "total": 5000,
    "active": 1200,
    "expired": 3500,
    "blacklisted": 300,
    "byType": {
      "refresh": 2500,
      "resetPassword": 100,
      "verifyEmail": 150
    }
  }
}
```

### 5. **Delete Expired Tokens**

Clean up expired tokens.

**Endpoint:** `DELETE /tokens/expired`  
**Authentication:** ✅ Required (`manageTokens` permission)

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Expired tokens deleted successfully",
  "data": {
    "deletedCount": 1500
  }
}
```

### 6. **Get Tokens by User**

Get all tokens for a specific user.

**Endpoint:** `GET /tokens/user/:userId`  
**Authentication:** ✅ Required (`getTokens` permission)

### 7. **Delete User Tokens**

Delete all tokens for a specific user.

**Endpoint:** `DELETE /tokens/user/:userId`  
**Authentication:** ✅ Required (`manageTokens` permission)

### 8. **Get Tokens by Type**

Get tokens of a specific type.

**Endpoint:** `GET /tokens/type/:type`  
**Authentication:** ✅ Required (`getTokens` permission)

#### Valid Types

- `refresh`
- `resetPassword`
- `verifyEmail`

### 9. **Verify Token**

Verify if a token is valid.

**Endpoint:** `GET /tokens/verify/:token`  
**Authentication:** ✅ Required (`getTokens` permission)

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Token verification result",
  "data": {
    "valid": true,
    "token": {
      /* Token object if valid */
    }
  }
}
```

### 10. **Blacklist Token by Value**

Blacklist a token by its value.

**Endpoint:** `PATCH /tokens/blacklist/:token`  
**Authentication:** ✅ Required (`manageTokens` permission)

### 11. **Get Token by ID**

Retrieve specific token by ID.

**Endpoint:** `GET /tokens/:id`  
**Authentication:** ✅ Required (`getTokens` permission)

### 12. **Get Token by Value**

Retrieve token by its value.

**Endpoint:** `GET /tokens/value/:token`  
**Authentication:** ✅ Required (`getTokens` permission)

### 13. **Update Token**

Update token information.

**Endpoint:** `PUT /tokens/:id`  
**Authentication:** ✅ Required (`manageTokens` permission)

### 14. **Blacklist Token by ID**

Blacklist a token by its ID.

**Endpoint:** `PATCH /tokens/:id/blacklist`  
**Authentication:** ✅ Required (`manageTokens` permission)

### 15. **Delete Token**

Delete a token.

**Endpoint:** `DELETE /tokens/:id`  
**Authentication:** ✅ Required (`manageTokens` permission)

---

## 🏥 **Health Check Endpoints**

### 1. **Health Check**

Check API health status.

**Endpoint:** `GET /health`  
**Authentication:** ❌ Not required

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-01-27T10:30:00.000Z",
    "uptime": 86400,
    "environment": "development",
    "version": "1.0.0",
    "database": {
      "status": "connected",
      "responseTime": 5
    },
    "memory": {
      "used": "125.5 MB",
      "free": "890.2 MB",
      "total": "1015.7 MB"
    }
  }
}
```

---

## ❌ **Error Codes**

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation failed
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Common Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z"
  },
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

#### Unauthorized Error (401)

```json
{
  "success": false,
  "message": "Please authenticate",
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z"
  }
}
```

#### Forbidden Error (403)

```json
{
  "success": false,
  "message": "Insufficient permissions",
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z"
  }
}
```

#### Not Found Error (404)

```json
{
  "success": false,
  "message": "Resource not found",
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z"
  }
}
```

#### Conflict Error (409)

```json
{
  "success": false,
  "message": "User with this email already exists",
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z"
  }
}
```

#### Rate Limit Error (429)

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "meta": {
    "timestamp": "2025-01-27T10:30:00.000Z"
  }
}
```

---

## 🔐 **Permissions**

### User Roles

- **user**: Regular user with basic permissions
- **admin**: Administrator with all permissions

### Available Permissions

- `getUsers`: View user information
- `manageUsers`: Create, update, delete users
- `getTokens`: View token information
- `manageTokens`: Create, update, delete tokens

### Permission Matrix

| Endpoint          | user | admin |
| ----------------- | ---- | ----- |
| POST /auth/\*     | ✅   | ✅    |
| GET /users/\*     | ❌   | ✅    |
| POST /users       | ❌   | ✅    |
| PUT /users/\*     | ❌   | ✅    |
| DELETE /users/\*  | ❌   | ✅    |
| GET /tokens/\*    | ❌   | ✅    |
| POST /tokens      | ❌   | ✅    |
| PUT /tokens/\*    | ❌   | ✅    |
| DELETE /tokens/\* | ❌   | ✅    |
| GET /health       | ✅   | ✅    |

---

## 🚀 **Rate Limiting**

### Default Limits

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Routes**: All `/api/v1/*` routes

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643275200
```

---

## 📝 **Request Examples**

### Using cURL

#### Register User

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "username": "John Doe"
  }'
```

#### Login User

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Get Users (with token)

```bash
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using JavaScript (Fetch)

#### Register User

```javascript
const response = await fetch('http://localhost:8080/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePassword123!',
    username: 'John Doe'
  })
})

const data = await response.json()
console.log(data)
```

#### Authenticated Request

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

const response = await fetch('http://localhost:8080/api/v1/users', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
console.log(data)
```

---

## 🧪 **Testing**

### Test Environment

- **Base URL**: `http://localhost:8080/api/v1`
- **Test Database**: Separate test database
- **Rate Limiting**: Disabled in test environment

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

---

## 📞 **Support**

For questions or issues with the API:

1. **Documentation**: Check this documentation first
2. **Testing**: Use the health check endpoint to verify API status
3. **Logs**: Check application logs for detailed error information
4. **Environment**: Ensure all environment variables are properly configured

### Environment Variables Required

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
FRONTEND_URL=http://localhost:3000
```

---

**Last Updated**: January 27, 2025  
**API Version**: v1  
**Documentation Version**: 1.0.0
