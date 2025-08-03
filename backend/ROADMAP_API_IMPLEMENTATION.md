# Roadmap API Implementation Plan

## Tổng quan

Task này bao gồm việc phân tích mock data từ Frontend và tạo các API tương ứng ở Backend để hỗ trợ hệ thống Learning Roadmap.

## Phân tích Mock Data từ Frontend

### 1. Categories Data Structure

```typescript
const categories = [
  { value: 'all', label: 'Tất cả', count: 12 },
  { value: 'programming', label: 'Lập trình', count: 6 },
  { value: 'design', label: 'Thiết kế', count: 3 },
  { value: 'business', label: 'Kinh doanh', count: 2 },
  { value: 'soft-skills', label: 'Kỹ năng mềm', count: 1 }
]
```

### 2. Roadmap Data Structure

```typescript
interface RoadmapMockData {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  totalLessons: number
  completedLessons: number
  estimatedTime: string
  progress: number
  averageScore: number
  enrolledUsers: number
  rating: number
  lastAccessed: string | null
  tags: string[]
  isEnrolled: boolean
  isCompleted: boolean
}
```

## Database Schema Design

### 1. Category Model

```prisma
model Category {
  id          String   @id @default(cuid())
  value       String   @unique
  label       String
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  roadmaps    Roadmap[]

  @@map("categories")
}
```

### 2. Roadmap Model

```prisma
model Roadmap {
  id              String           @id @default(cuid())
  title           String
  description     String
  difficulty      DifficultyLevel
  totalLessons    Int              @default(0)
  estimatedTime   String
  rating          Float            @default(0)
  enrolledUsers   Int              @default(0)
  isActive        Boolean          @default(true)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  // Relations
  categoryId      String
  category        Category         @relation(fields: [categoryId], references: [id])
  creatorId       String
  creator         User             @relation(fields: [creatorId], references: [id])

  lessons         Lesson[]
  enrollments     UserRoadmapEnrollment[]
  tags            RoadmapTag[]

  @@map("roadmaps")
}
```

### 3. Lesson Model

```prisma
model Lesson {
  id              String   @id @default(cuid())
  title           String
  description     String
  content         String?
  orderIndex      Int
  estimatedMinutes Int     @default(0)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  roadmapId       String
  roadmap         Roadmap  @relation(fields: [roadmapId], references: [id], onDelete: Cascade)

  userProgress    UserLessonProgress[]

  @@map("lessons")
}
```

### 4. User Enrollment Model

```prisma
model UserRoadmapEnrollment {
  id              String           @id @default(cuid())
  progress        Float            @default(0)
  averageScore    Float            @default(0)
  lastAccessedAt  DateTime?
  completedAt     DateTime?
  isCompleted     Boolean          @default(false)
  enrolledAt      DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  // Relations
  userId          String
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  roadmapId       String
  roadmap         Roadmap          @relation(fields: [roadmapId], references: [id], onDelete: Cascade)

  @@unique([userId, roadmapId])
  @@map("user_roadmap_enrollments")
}
```

### 5. Supporting Models

```prisma
model Tag {
  id          String   @id @default(cuid())
  name        String   @unique
  color       String?
  createdAt   DateTime @default(now())

  roadmapTags RoadmapTag[]

  @@map("tags")
}

model RoadmapTag {
  id        String  @id @default(cuid())
  roadmapId String
  tagId     String

  roadmap   Roadmap @relation(fields: [roadmapId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([roadmapId, tagId])
  @@map("roadmap_tags")
}

model UserLessonProgress {
  id              String    @id @default(cuid())
  score           Float?
  isCompleted     Boolean   @default(false)
  completedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId        String
  lesson          Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("user_lesson_progress")
}

enum DifficultyLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
```

## API Endpoints Design

### 1. Category APIs

#### GET /api/categories

- **Mục đích**: Lấy danh sách tất cả categories với số lượng roadmap
- **Response**:

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "cat1",
      "value": "programming",
      "label": "Lập trình",
      "description": "Các roadmap về lập trình",
      "roadmapCount": 6
    }
  ]
}
```

#### POST /api/categories (Admin only)

- **Mục đích**: Tạo category mới
- **Body**:

```json
{
  "value": "data-science",
  "label": "Data Science",
  "description": "Các roadmap về Data Science"
}
```

### 2. Roadmap APIs

#### GET /api/roadmaps

- **Mục đích**: Lấy danh sách roadmaps với filtering, pagination
- **Query Parameters**:
  - `category`: Filter theo category
  - `difficulty`: Filter theo độ khó
  - `search`: Tìm kiếm theo title, description, tags
  - `page`: Số trang
  - `limit`: Số items per page
  - `userId`: Lấy roadmaps của user cụ thể (enrolled/completed status)

- **Response**:

```json
{
  "success": true,
  "message": "Roadmaps retrieved successfully",
  "data": {
    "items": [
      {
        "id": "rm1",
        "title": "JavaScript Fundamentals",
        "description": "Học JavaScript từ cơ bản đến nâng cao",
        "category": {
          "id": "cat1",
          "value": "programming",
          "label": "Lập trình"
        },
        "difficulty": "BEGINNER",
        "totalLessons": 15,
        "estimatedTime": "8 weeks",
        "rating": 4.8,
        "enrolledUsers": 2340,
        "tags": ["JavaScript", "Frontend", "Programming"],
        "creator": {
          "id": "user1",
          "name": "John Doe"
        },
        "userEnrollment": {
          "isEnrolled": true,
          "progress": 40,
          "completedLessons": 6,
          "averageScore": 87,
          "lastAccessedAt": "2024-12-08T10:00:00Z",
          "isCompleted": false
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-12-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "totalPages": 2
    }
  }
}
```

#### GET /api/roadmaps/:id

- **Mục đích**: Lấy thông tin chi tiết một roadmap
- **Response**: Tương tự GET /api/roadmaps nhưng single object + lessons

#### POST /api/roadmaps

- **Mục đích**: Tạo roadmap mới
- **Body**:

```json
{
  "title": "Advanced React Patterns",
  "description": "Learn advanced React patterns and architectures",
  "categoryId": "cat1",
  "difficulty": "ADVANCED",
  "estimatedTime": "12 weeks",
  "tags": ["React", "Advanced", "Patterns"],
  "lessons": [
    {
      "title": "Higher Order Components",
      "description": "Understanding HOCs",
      "content": "...",
      "orderIndex": 1,
      "estimatedMinutes": 60
    }
  ]
}
```

#### PUT /api/roadmaps/:id

- **Mục đích**: Cập nhật roadmap

#### DELETE /api/roadmaps/:id

- **Mục đích**: Xóa roadmap

### 3. Enrollment APIs

#### POST /api/roadmaps/:id/enroll

- **Mục đích**: Đăng ký học roadmap
- **Response**:

```json
{
  "success": true,
  "message": "Successfully enrolled in roadmap",
  "data": {
    "enrollmentId": "enr1",
    "roadmapId": "rm1",
    "userId": "user1",
    "enrolledAt": "2024-12-08T10:00:00Z"
  }
}
```

#### DELETE /api/roadmaps/:id/enroll

- **Mục đích**: Hủy đăng ký roadmap

#### GET /api/users/:userId/roadmaps

- **Mục đích**: Lấy danh sách roadmaps của user
- **Query Parameters**:
  - `status`: enrolled, completed, all

### 4. Progress APIs

#### PUT /api/lessons/:id/progress

- **Mục đích**: Cập nhật tiến độ lesson
- **Body**:

```json
{
  "score": 85,
  "isCompleted": true
}
```

#### GET /api/roadmaps/:id/progress

- **Mục đích**: Lấy tiến độ chi tiết của user trong roadmap

### 5. Statistics APIs

#### GET /api/roadmaps/:id/stats

- **Mục đích**: Lấy thống kê roadmap
- **Response**:

```json
{
  "success": true,
  "data": {
    "totalEnrollments": 2340,
    "completionRate": 65,
    "averageRating": 4.8,
    "averageCompletionTime": "9 weeks",
    "topPerformers": [...]
  }
}
```

#### GET /api/users/:userId/stats

- **Mục đích**: Lấy thống kê học tập của user

## Implementation Plan

### Phase 1: Database Setup ✅

1. ✅ Cập nhật Prisma schema
2. ✅ Tạo migration
3. ✅ Seed data

### Phase 2: Core Models & Repositories ✅

1. ✅ Category Repository
2. ✅ Roadmap Repository
3. ✅ Lesson Repository
4. ✅ Enrollment Repository
5. ✅ Tag Repository

### Phase 3: Services Layer ✅

1. ✅ Category Service
2. ✅ Roadmap Service
3. ✅ Enrollment Service
4. ✅ Progress Service

### Phase 4: Controllers & Routes ✅

1. ✅ Category Controller & Routes
2. ✅ Roadmap Controller & Routes
3. ✅ Enrollment Controller & Routes
4. ✅ Progress Controller & Routes

### Phase 5: Validation & DTOs ✅

1. ✅ Request/Response DTOs
2. ✅ Validation schemas
3. ✅ Type definitions
4. ✅ Auth middleware updates (optionalAuth, authorize)

### Phase 6: Testing & Documentation

1. ⏳ Unit tests
2. ⏳ Integration tests
3. ⏳ API documentation
4. ⏳ Postman collection

## Các Features Nâng cao (Future)

### 1. AI Recommendations

- API để lấy roadmap suggestions dựa trên user behavior
- Machine learning integration

### 2. Social Features

- User reviews & ratings
- Discussion threads per lesson
- User achievements & badges

### 3. Advanced Analytics

- Learning path analytics
- Performance metrics
- Completion predictions

### 4. Content Management

- Rich text editor for lessons
- Video/audio content support
- Interactive exercises

## Notes cho Development

### 1. Performance Considerations

- Index database properly (user_id, roadmap_id, category_id)
- Implement caching for popular roadmaps
- Optimize queries with proper joins
- Consider pagination for large datasets

### 2. Security Considerations

- Proper authorization (users can only access their own progress)
- Rate limiting for API endpoints
- Input validation and sanitization
- Secure file upload for content

### 3. Scalability Considerations

- Database sharding strategies
- CDN for static content
- Background jobs for heavy computations
- Microservices architecture consideration

## Testing Strategy

### 1. Unit Tests

- Service layer logic
- Repository methods
- Utility functions

### 2. Integration Tests

- API endpoint testing
- Database integration
- Authentication flows

### 3. E2E Tests

- Complete user workflows
- Cross-browser compatibility
- Performance testing

---

**Tác giả**: AI Assistant  
**Ngày tạo**: 2024-12-08  
**Phiên bản**: 1.0
