# 📋 CODING STANDARDS & BEST PRACTICES

## 🎯 **OVERVIEW**

This document outlines the coding standards and best practices for the LearnSmart backend project to ensure consistency, maintainability, and scalability.

## 🏗️ **ARCHITECTURE PATTERNS**

### **Layered Architecture**

```
Controllers → Services → Repositories → Database
```

- **Controllers**: Handle HTTP requests/responses, input validation
- **Services**: Business logic, data transformation, orchestration
- **Repositories**: Data access layer, database interactions
- **Models**: Data entities and relationships

### **Dependency Injection**

- Use constructor injection for dependencies
- Inject interfaces, not concrete implementations
- Keep dependencies minimal and focused

## 📝 **NAMING CONVENTIONS**

### **Files & Directories**

```typescript
// ✅ Good
user.controller.ts
auth.service.ts
user.repository.ts
email.service.ts

// ❌ Bad
UserController.ts
authservice.ts
userRepo.ts
```

### **Classes & Interfaces**

```typescript
// ✅ Good
export class UserService extends BaseService<User> {}
export interface CreateUserDto {}
export interface UserRepository extends BaseRepository<User> {}

// ❌ Bad
export class userService {}
export interface createUserDTO {}
```

### **Variables & Functions**

```typescript
// ✅ Good
const userData = req.body
const isEmailVerified = user.isEmailVerified
async function createUser(data: CreateUserDto): Promise<User> {}

// ❌ Bad
const user_data = req.body
const IsEmailVerified = user.isEmailVerified
async function CreateUser(data: any): Promise<any> {}
```

### **Constants**

```typescript
// ✅ Good
export const API_VERSION = 'v1'
export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const TOKEN_TYPES = {
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword'
} as const

// ❌ Bad
export const apiVersion = 'v1'
export const max_file_size = 10485760
```

## 🔧 **CODE STRUCTURE**

### **Import Organization**

```typescript
// 1. Node modules
import express from 'express'
import bcrypt from 'bcrypt'

// 2. Internal modules (absolute paths with @/)
import { ResponseHandler } from '@/cores/response.handler'
import { UserService } from '@/services/user.service'
import { validate } from '@/middlewares/validation.middleware'

// 3. Relative imports (same directory)
import { AuthTokens } from './auth.types'
```

### **File Structure Template**

```typescript
'use strict'

// Imports
import { ... } from '...'

// Interfaces/Types
export interface SampleDto {
  // ...
}

// Constants (if any)
const SAMPLE_CONSTANT = 'value'

// Main class/function
export class SampleService extends BaseService<...> {
  constructor(
    private repository: SampleRepository,
    private config: ServiceConfig = {}
  ) {
    super(repository, config)
  }

  // Public methods first
  async publicMethod(): Promise<void> {
    // Implementation
  }

  // Protected methods
  protected protectedMethod(): void {
    // Implementation
  }

  // Private methods last
  private privateMethod(): void {
    // Implementation
  }
}

export default SampleService
```

## 📊 **RESPONSE STANDARDS**

### **Success Responses**

```typescript
// ✅ Standard format
return ResponseHandler.success(res, {
  message: 'User created successfully',
  data: userData,
  statusCode: StatusCodes.CREATED
})

// ✅ Paginated responses
return ResponseHandler.paginated(res, {
  message: 'Users retrieved successfully',
  data: users,
  pagination: paginationMeta
})
```

### **Error Responses**

```typescript
// ✅ Use custom error classes
throw new BadRequestError('Email is required')
throw new NotFoundError('User not found')
throw new ValidationError('Validation failed', validationErrors)

// ❌ Don't throw generic errors
throw new Error('Something went wrong')
```

## 🛡️ **ERROR HANDLING**

### **Service Layer**

```typescript
export class UserService extends BaseService<User> {
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      // Validate business rules
      await this.validateCreate(data)

      // Check for conflicts
      const existingUser = await this.repository.findByEmail(data.email)
      this.throwIfExists(!!existingUser, 'Email already registered')

      // Create user
      return await this.repository.create(data)
    } catch (error) {
      this.logger.error('Failed to create user', { error: error.message, data })
      throw error // Re-throw to let global handler catch it
    }
  }
}
```

### **Controller Layer**

```typescript
export class UserController extends BaseController<User> {
  createUser = catchAsync(async (req: Request, res: Response) => {
    const userData = this.extractCreateData(req)
    const result = await this.service.create(userData)

    return ResponseHandler.success(res, {
      message: 'User created successfully',
      data: result,
      statusCode: StatusCodes.CREATED
    })
  })
}
```

## 🔍 **VALIDATION STANDARDS**

### **Request Validation**

```typescript
// ✅ Use validation middleware
const userValidationSchema = {
  body: {
    email: commonValidations.email,
    password: commonValidations.password,
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50
    }
  }
}

router.post('/users', validate(userValidationSchema), userController.create)
```

### **Business Logic Validation**

```typescript
// ✅ In service layer
protected async validateCreate(data: CreateUserDto): Promise<void> {
  this.validateRequired(data.email, 'email')
  this.validateRequired(data.password, 'password')

  if (data.password.length < AUTH.PASSWORD.MIN_LENGTH) {
    throw new BadRequestError(`Password must be at least ${AUTH.PASSWORD.MIN_LENGTH} characters`)
  }
}
```

## 📝 **TYPE SAFETY**

### **DTOs & Interfaces**

```typescript
// ✅ Use specific DTOs
export interface CreateUserDto {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface UserResponseDto {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

// ❌ Avoid any types
async function createUser(data: any): Promise<any> {}
```

### **Generic Types**

```typescript
// ✅ Use generics for reusability
export class BaseRepository<T, CreateInput, UpdateInput> {
  async create(data: CreateInput): Promise<T> {
    // Implementation
  }
}

export class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  // User-specific methods
}
```

## 🗄️ **DATABASE PATTERNS**

### **Repository Pattern**

```typescript
export class UserRepository extends BaseRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: { tokens: true }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find user by email: ${error}`)
    }
  }
}
```

### **Service Pattern**

```typescript
export class UserService extends BaseService<User> {
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.repository.findByEmail(email)
    this.throwIfNotExists(!!user, 'User not found')
    return this.transformOutput(user!)
  }
}
```

## 🔧 **MIDDLEWARE PATTERNS**

### **Authentication Middleware**

```typescript
// ✅ Use role-based middleware
router.get('/users', auth('users:read'), userController.getMany)
router.delete('/users/:id', auth('users:delete'), userController.delete)
```

### **Validation Middleware**

```typescript
// ✅ Use validation schemas
const loginSchema = {
  body: {
    email: commonValidations.email,
    password: { type: 'string', required: true }
  }
}

router.post('/login', validate(loginSchema), authController.login)
```

## 📊 **LOGGING STANDARDS**

### **Service Logging**

```typescript
export class UserService extends BaseService<User> {
  async createUser(data: CreateUserDto): Promise<User> {
    this.logger.info('Creating new user', { email: data.email })

    try {
      const result = await this.repository.create(data)
      this.logger.info('User created successfully', { userId: result.id })
      return result
    } catch (error) {
      this.logger.error('Failed to create user', { error: error.message, email: data.email })
      throw error
    }
  }
}
```

### **Request Logging**

```typescript
// ✅ Use structured logging
logRequest.info('User login attempt', req, null, { email: req.body.email })
logRequest.error('Login failed', req, error, { email: req.body.email })
```

## 🧪 **TESTING STANDARDS**

### **Unit Tests**

```typescript
describe('UserService', () => {
  let userService: UserService
  let mockRepository: jest.Mocked<UserRepository>

  beforeEach(() => {
    mockRepository = createMockRepository()
    userService = new UserService(mockRepository)
  })

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { name: 'Test', email: 'test@example.com', password: 'password123' }
      mockRepository.create.mockResolvedValue(mockUser)

      // Act
      const result = await userService.createUser(userData)

      // Assert
      expect(result).toEqual(mockUser)
      expect(mockRepository.create).toHaveBeenCalledWith(userData)
    })
  })
})
```

## 📚 **DOCUMENTATION STANDARDS**

### **Code Comments**

```typescript
/**
 * Creates a new user with email verification
 * @param userData - User data for creation
 * @returns Promise<User> - Created user without password
 * @throws BadRequestError - When validation fails
 * @throws ConflictError - When email already exists
 */
async createUser(userData: CreateUserDto): Promise<User> {
  // Implementation
}
```

### **API Documentation**

```typescript
/**
 * @route POST /api/v1/users
 * @desc Create a new user
 * @access Public
 * @body {CreateUserDto} userData - User creation data
 * @returns {UserResponseDto} Created user data
 */
```

## 🔒 **SECURITY STANDARDS**

### **Input Sanitization**

```typescript
// ✅ Always validate and sanitize inputs
const sanitizedEmail = data.email.toLowerCase().trim()
const hashedPassword = await bcrypt.hash(data.password, AUTH.PASSWORD.BCRYPT_ROUNDS)
```

### **Error Information**

```typescript
// ✅ Don't expose sensitive information
catch (error) {
  this.logger.error('Database error', { error: error.message, userId })
  throw new InternalServerError('An error occurred while processing your request')
}

// ❌ Don't expose internal details
catch (error) {
  throw new Error(`Database connection failed: ${error.message}`)
}
```

## 📈 **PERFORMANCE STANDARDS**

### **Database Queries**

```typescript
// ✅ Use specific selects
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true, role: true }
})

// ✅ Use pagination
const users = await prisma.user.findMany({
  take: limit,
  skip: (page - 1) * limit,
  orderBy: { createdAt: 'desc' }
})
```

### **Async Operations**

```typescript
// ✅ Use Promise.all for parallel operations
const [user, tokens] = await Promise.all([
  this.userRepository.findById(userId),
  this.tokenRepository.findByUserId(userId)
])

// ❌ Avoid sequential awaits when not necessary
const user = await this.userRepository.findById(userId)
const tokens = await this.tokenRepository.findByUserId(userId)
```

## 🔄 **VERSIONING & MIGRATION**

### **API Versioning**

```typescript
// ✅ Use version prefixes
const API_PREFIX = '/api/v1'
app.use(API_PREFIX, routes)
```

### **Database Migrations**

```sql
-- ✅ Always use migrations for schema changes
-- Migration: 20240101000000_add_user_role_field
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
```

## 📋 **CODE REVIEW CHECKLIST**

- [ ] Follows naming conventions
- [ ] Uses proper error handling
- [ ] Includes appropriate logging
- [ ] Has type safety (no `any` types)
- [ ] Follows layered architecture
- [ ] Uses standard response format
- [ ] Includes validation
- [ ] Has appropriate tests
- [ ] Follows security best practices
- [ ] Performance considerations addressed

## 🛠️ **TOOLS & LINTING**

### **ESLint Configuration**

```json
{
  "extends": ["@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### **Prettier Configuration**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 120
}
```

---

## 📞 **SUPPORT**

For questions about these standards, please:

1. Check existing code examples
2. Consult this documentation
3. Ask in team discussions
4. Update standards as needed

**Remember**: Consistency is key to maintainable code! 🎯
