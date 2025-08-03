import { PrismaClient, Role, DifficultyLevel } from '../generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  try {
    // Clean existing data in correct order (foreign key constraints)
    await prisma.userLessonProgress.deleteMany()
    await prisma.userRoadmapEnrollment.deleteMany()
    await prisma.roadmapTag.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.roadmap.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.category.deleteMany()
    await prisma.token.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Cleaned existing data')

    // Create users
    const hashedPassword = await bcrypt.hash('Password1@', 10)

    const user1 = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: Role.user,
        isEmailVerified: true
      }
    })

    const user2 = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: Role.user,
        isEmailVerified: true
      }
    })

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: Role.admin,
        isEmailVerified: true
      }
    })

    console.log('👥 Created users')

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          value: 'programming',
          label: 'Lập trình',
          description: 'Các roadmap về lập trình và phát triển phần mềm'
        }
      }),
      prisma.category.create({
        data: {
          value: 'design',
          label: 'Thiết kế',
          description: 'Các roadmap về thiết kế UI/UX và đồ họa'
        }
      }),
      prisma.category.create({
        data: {
          value: 'business',
          label: 'Kinh doanh',
          description: 'Các roadmap về kinh doanh và quản lý'
        }
      }),
      prisma.category.create({
        data: {
          value: 'soft-skills',
          label: 'Kỹ năng mềm',
          description: 'Các roadmap về kỹ năng mềm và phát triển cá nhân'
        }
      })
    ])

    console.log('📂 Created categories')

    // Create tags
    const tags = await Promise.all([
      prisma.tag.create({ data: { name: 'JavaScript', color: '#f7df1e' } }),
      prisma.tag.create({ data: { name: 'Frontend', color: '#61dafb' } }),
      prisma.tag.create({ data: { name: 'Programming', color: '#007acc' } }),
      prisma.tag.create({ data: { name: 'React', color: '#61dafb' } }),
      prisma.tag.create({ data: { name: 'Advanced', color: '#ff6b6b' } }),
      prisma.tag.create({ data: { name: 'Patterns', color: '#4ecdc4' } }),
      prisma.tag.create({ data: { name: 'UI Design', color: '#ff9ff3' } }),
      prisma.tag.create({ data: { name: 'UX Design', color: '#54a0ff' } }),
      prisma.tag.create({ data: { name: 'Figma', color: '#f24e1e' } }),
      prisma.tag.create({ data: { name: 'Python', color: '#3776ab' } }),
      prisma.tag.create({ data: { name: 'Data Science', color: '#ff6b6b' } }),
      prisma.tag.create({ data: { name: 'Machine Learning', color: '#4ecdc4' } }),
      prisma.tag.create({ data: { name: 'Marketing', color: '#ffa726' } }),
      prisma.tag.create({ data: { name: 'Strategy', color: '#26a69a' } }),
      prisma.tag.create({ data: { name: 'Business', color: '#5c6bc0' } }),
      prisma.tag.create({ data: { name: 'Leadership', color: '#ab47bc' } }),
      prisma.tag.create({ data: { name: 'Communication', color: '#ef5350' } }),
      prisma.tag.create({ data: { name: 'Soft Skills', color: '#66bb6a' } })
    ])

    console.log('🏷️ Created tags')

    // Create roadmaps with lessons (based on mock data from frontend)
    const roadmap1 = await prisma.roadmap.create({
      data: {
        title: 'JavaScript Fundamentals',
        description: 'Học JavaScript từ cơ bản đến nâng cao với phương pháp step-by-step',
        categoryId: categories[0].id, // programming
        difficulty: DifficultyLevel.BEGINNER,
        estimatedTime: '8 weeks',
        rating: 4.8,
        enrolledUsers: 2340,
        creatorId: adminUser.id,
        totalLessons: 15,
        lessons: {
          create: [
            {
              title: 'Introduction to JavaScript',
              description: 'Getting started with JavaScript basics',
              content: 'Learn about variables, data types, and basic syntax',
              orderIndex: 1,
              estimatedMinutes: 45
            },
            {
              title: 'Variables and Data Types',
              description: 'Understanding JavaScript variables and data types',
              content: 'Deep dive into var, let, const and primitive types',
              orderIndex: 2,
              estimatedMinutes: 60
            },
            {
              title: 'Functions in JavaScript',
              description: 'Learn about JavaScript functions',
              content: 'Function declarations, expressions, arrow functions',
              orderIndex: 3,
              estimatedMinutes: 75
            },
            {
              title: 'Objects and Arrays',
              description: 'Working with objects and arrays',
              content: 'Creating and manipulating objects and arrays',
              orderIndex: 4,
              estimatedMinutes: 90
            },
            {
              title: 'Control Flow',
              description: 'If statements, loops, and conditionals',
              content: 'Master control flow in JavaScript',
              orderIndex: 5,
              estimatedMinutes: 60
            }
          ]
        }
      }
    })

    const roadmap2 = await prisma.roadmap.create({
      data: {
        title: 'React Development Path',
        description: 'Trở thành React Developer với roadmap toàn diện từ hooks đến advanced patterns',
        categoryId: categories[0].id, // programming
        difficulty: DifficultyLevel.INTERMEDIATE,
        estimatedTime: '12 weeks',
        rating: 4.9,
        enrolledUsers: 1850,
        creatorId: adminUser.id,
        totalLessons: 20,
        lessons: {
          create: [
            {
              title: 'React Fundamentals',
              description: 'Getting started with React',
              content: 'Components, JSX, and props',
              orderIndex: 1,
              estimatedMinutes: 120
            },
            {
              title: 'State and Event Handling',
              description: 'Managing component state',
              content: 'useState hook and event handlers',
              orderIndex: 2,
              estimatedMinutes: 90
            },
            {
              title: 'React Hooks',
              description: 'Deep dive into React hooks',
              content: 'useEffect, useContext, custom hooks',
              orderIndex: 3,
              estimatedMinutes: 150
            },
            {
              title: 'Component Lifecycle',
              description: 'Understanding component lifecycle',
              content: 'Mounting, updating, and unmounting',
              orderIndex: 4,
              estimatedMinutes: 75
            }
          ]
        }
      }
    })

    const roadmap3 = await prisma.roadmap.create({
      data: {
        title: 'UI/UX Design Mastery',
        description: 'Học thiết kế UI/UX từ nguyên lý cơ bản đến thực hành dự án thực tế',
        categoryId: categories[1].id, // design
        difficulty: DifficultyLevel.BEGINNER,
        estimatedTime: '10 weeks',
        rating: 4.7,
        enrolledUsers: 1200,
        creatorId: adminUser.id,
        totalLessons: 18,
        lessons: {
          create: [
            {
              title: 'Design Principles',
              description: 'Fundamental design principles',
              content: 'Color theory, typography, layout',
              orderIndex: 1,
              estimatedMinutes: 90
            },
            {
              title: 'User Research',
              description: 'Understanding your users',
              content: 'User interviews, personas, user journey',
              orderIndex: 2,
              estimatedMinutes: 120
            },
            {
              title: 'Wireframing',
              description: 'Creating wireframes and mockups',
              content: 'Low-fi to high-fi wireframes',
              orderIndex: 3,
              estimatedMinutes: 105
            }
          ]
        }
      }
    })

    const roadmap4 = await prisma.roadmap.create({
      data: {
        title: 'Python for Data Science',
        description: 'Roadmap hoàn chỉnh để trở thành Data Scientist với Python',
        categoryId: categories[0].id, // programming
        difficulty: DifficultyLevel.INTERMEDIATE,
        estimatedTime: '16 weeks',
        rating: 4.8,
        enrolledUsers: 3200,
        creatorId: adminUser.id,
        totalLessons: 25,
        lessons: {
          create: [
            {
              title: 'Python Basics for Data Science',
              description: 'Python fundamentals for data analysis',
              content: 'Variables, data structures, control flow',
              orderIndex: 1,
              estimatedMinutes: 120
            },
            {
              title: 'NumPy and Pandas',
              description: 'Data manipulation with NumPy and Pandas',
              content: 'Arrays, DataFrames, data cleaning',
              orderIndex: 2,
              estimatedMinutes: 180
            }
          ]
        }
      }
    })

    const roadmap5 = await prisma.roadmap.create({
      data: {
        title: 'Digital Marketing Strategy',
        description: 'Xây dựng chiến lược marketing digital hiệu quả cho doanh nghiệp',
        categoryId: categories[2].id, // business
        difficulty: DifficultyLevel.ADVANCED,
        estimatedTime: '6 weeks',
        rating: 4.6,
        enrolledUsers: 890,
        creatorId: adminUser.id,
        totalLessons: 12,
        lessons: {
          create: [
            {
              title: 'Digital Marketing Fundamentals',
              description: 'Introduction to digital marketing',
              content: 'Channels, strategies, and metrics',
              orderIndex: 1,
              estimatedMinutes: 90
            }
          ]
        }
      }
    })

    const roadmap6 = await prisma.roadmap.create({
      data: {
        title: 'Leadership & Communication',
        description: 'Phát triển kỹ năng lãnh đạo và giao tiếp hiệu quả',
        categoryId: categories[3].id, // soft-skills
        difficulty: DifficultyLevel.INTERMEDIATE,
        estimatedTime: '4 weeks',
        rating: 4.5,
        enrolledUsers: 650,
        creatorId: adminUser.id,
        totalLessons: 10,
        lessons: {
          create: [
            {
              title: 'Leadership Fundamentals',
              description: 'Basic leadership principles',
              content: 'Leadership styles and techniques',
              orderIndex: 1,
              estimatedMinutes: 75
            }
          ]
        }
      }
    })

    console.log('🗺️ Created roadmaps with lessons')

    // Create roadmap-tag relationships
    const roadmapTagMappings = [
      { roadmapId: roadmap1.id, tagNames: ['JavaScript', 'Frontend', 'Programming'] },
      { roadmapId: roadmap2.id, tagNames: ['React', 'JavaScript', 'Frontend'] },
      { roadmapId: roadmap3.id, tagNames: ['UI Design', 'UX Design', 'Figma'] },
      { roadmapId: roadmap4.id, tagNames: ['Python', 'Data Science', 'Machine Learning'] },
      { roadmapId: roadmap5.id, tagNames: ['Marketing', 'Strategy', 'Business'] },
      { roadmapId: roadmap6.id, tagNames: ['Leadership', 'Communication', 'Soft Skills'] }
    ]

    for (const mapping of roadmapTagMappings) {
      for (const tagName of mapping.tagNames) {
        const tag = tags.find((t) => t.name === tagName)
        if (tag) {
          await prisma.roadmapTag.create({
            data: {
              roadmapId: mapping.roadmapId,
              tagId: tag.id
            }
          })
        }
      }
    }

    console.log('🔗 Created roadmap-tag relationships')

    // Create user enrollments (simulating the mock data)
    const enrollment1 = await prisma.userRoadmapEnrollment.create({
      data: {
        userId: user1.id,
        roadmapId: roadmap1.id,
        progress: 40,
        averageScore: 87,
        lastAccessedAt: new Date('2024-12-08'),
        isCompleted: false
      }
    })

    const enrollment2 = await prisma.userRoadmapEnrollment.create({
      data: {
        userId: user1.id,
        roadmapId: roadmap3.id,
        progress: 100,
        averageScore: 92,
        lastAccessedAt: new Date('2024-12-05'),
        isCompleted: true,
        completedAt: new Date('2024-12-05')
      }
    })

    const enrollment3 = await prisma.userRoadmapEnrollment.create({
      data: {
        userId: user1.id,
        roadmapId: roadmap4.id,
        progress: 12,
        averageScore: 85,
        lastAccessedAt: new Date('2024-12-07'),
        isCompleted: false
      }
    })

    console.log('📝 Created user enrollments')

    // Create some lesson progress for user1 in roadmap1 (40% progress = 2/5 lessons completed)
    const roadmap1Lessons = await prisma.lesson.findMany({
      where: { roadmapId: roadmap1.id },
      orderBy: { orderIndex: 'asc' },
      take: 2
    })

    for (const lesson of roadmap1Lessons) {
      await prisma.userLessonProgress.create({
        data: {
          userId: user1.id,
          lessonId: lesson.id,
          score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
          isCompleted: true,
          completedAt: new Date()
        }
      })
    }

    // Create lesson progress for completed roadmap (roadmap3)
    const roadmap3Lessons = await prisma.lesson.findMany({
      where: { roadmapId: roadmap3.id },
      orderBy: { orderIndex: 'asc' }
    })

    for (const lesson of roadmap3Lessons) {
      await prisma.userLessonProgress.create({
        data: {
          userId: user1.id,
          lessonId: lesson.id,
          score: Math.floor(Math.random() * 15) + 85, // Random score between 85-100
          isCompleted: true,
          completedAt: new Date('2024-12-05')
        }
      })
    }

    // Create partial progress for roadmap4
    const roadmap4Lessons = await prisma.lesson.findMany({
      where: { roadmapId: roadmap4.id },
      orderBy: { orderIndex: 'asc' },
      take: 1 // Only 1 lesson completed out of 2 (50% of visible lessons, but overall 12% because there are supposed to be 25 lessons)
    })

    for (const lesson of roadmap4Lessons) {
      await prisma.userLessonProgress.create({
        data: {
          userId: user1.id,
          lessonId: lesson.id,
          score: 85,
          isCompleted: true,
          completedAt: new Date('2024-12-07')
        }
      })
    }

    console.log('📊 Created lesson progress')

    // Update roadmap total lessons count to match the actual lessons created
    await prisma.roadmap.update({
      where: { id: roadmap1.id },
      data: { totalLessons: 5 }
    })

    await prisma.roadmap.update({
      where: { id: roadmap2.id },
      data: { totalLessons: 4 }
    })

    await prisma.roadmap.update({
      where: { id: roadmap3.id },
      data: { totalLessons: 3 }
    })

    await prisma.roadmap.update({
      where: { id: roadmap4.id },
      data: { totalLessons: 2 }
    })

    await prisma.roadmap.update({
      where: { id: roadmap5.id },
      data: { totalLessons: 1 }
    })

    await prisma.roadmap.update({
      where: { id: roadmap6.id },
      data: { totalLessons: 1 }
    })

    console.log('📈 Updated roadmap lesson counts')

    console.log('✅ Seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Users: ${await prisma.user.count()}`)
    console.log(`- Categories: ${await prisma.category.count()}`)
    console.log(`- Tags: ${await prisma.tag.count()}`)
    console.log(`- Roadmaps: ${await prisma.roadmap.count()}`)
    console.log(`- Lessons: ${await prisma.lesson.count()}`)
    console.log(`- Enrollments: ${await prisma.userRoadmapEnrollment.count()}`)
    console.log(`- Progress records: ${await prisma.userLessonProgress.count()}`)
    console.log(`- Roadmap-tag relationships: ${await prisma.roadmapTag.count()}`)
  } catch (error) {
    console.error('❌ Error during seed:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
