import { UserRoadmapEnrollment, Prisma } from 'generated/prisma'
import { BaseRepository } from './base.repository'
import { EnrollmentCreateDto, EnrollmentResponseDto } from '@/types/roadmap.types'
import { prisma } from '@/configs/database.config'

export class EnrollmentRepository
  implements
    BaseRepository<
      UserRoadmapEnrollment,
      EnrollmentCreateDto,
      Partial<UserRoadmapEnrollment>,
      Prisma.UserRoadmapEnrollmentWhereInput
    >
{
  create(data: EnrollmentCreateDto): Promise<UserRoadmapEnrollment> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  findMany(where?: any, take?: number, skip?: number): Promise<UserRoadmapEnrollment[]> {
    throw new Error('Method not implemented.')
  }
  findFirst(where: Prisma.UserRoadmapEnrollmentWhereInput): Promise<any> {
    throw new Error('Method not implemented.')
  }
  update(id: string, data: UserRoadmapEnrollment): Promise<UserRoadmapEnrollment> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<UserRoadmapEnrollment> {
    throw new Error('Method not implemented.')
  }
  count(where?: any): Promise<number> {
    throw new Error('Method not implemented.')
  }

  /**
   * Find enrollment by user and roadmap
   */
  async findByUserAndRoadmap(userId: string, roadmapId: string): Promise<UserRoadmapEnrollment | null> {
    return prisma.userRoadmapEnrollment.findUnique({
      where: {
        userId_roadmapId: { userId, roadmapId }
      }
    })
  }

  /**
   * Check if user is enrolled in roadmap
   */
  async isUserEnrolled(userId: string, roadmapId: string): Promise<boolean> {
    const enrollment = await this.findByUserAndRoadmap(userId, roadmapId)
    return !!enrollment
  }

  /**
   * Enroll user in roadmap
   */
  async enrollUser(userId: string, roadmapId: string): Promise<UserRoadmapEnrollment> {
    // Check if already enrolled
    const existingEnrollment = await this.findByUserAndRoadmap(userId, roadmapId)
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this roadmap')
    }

    return prisma.$transaction(async (tx) => {
      // Create enrollment
      const enrollment = await tx.userRoadmapEnrollment.create({
        data: { userId, roadmapId }
      })

      // Increment enrolled users count
      await tx.roadmap.update({
        where: { id: roadmapId },
        data: { enrolledUsers: { increment: 1 } }
      })

      return enrollment
    })
  }

  /**
   * Unenroll user from roadmap
   */
  async unenrollUser(userId: string, roadmapId: string): Promise<boolean> {
    const enrollment = await this.findByUserAndRoadmap(userId, roadmapId)
    if (!enrollment) {
      return false
    }

    await prisma.$transaction(async (tx) => {
      // Delete enrollment
      await tx.userRoadmapEnrollment.delete({
        where: { id: enrollment.id }
      })

      // Decrement enrolled users count
      await tx.roadmap.update({
        where: { id: roadmapId },
        data: { enrolledUsers: { decrement: 1 } }
      })

      // Delete all user progress for this roadmap
      await tx.userLessonProgress.deleteMany({
        where: {
          userId,
          lesson: { roadmapId }
        }
      })
    })

    return true
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(
    userId: string,
    roadmapId: string,
    progress: number,
    averageScore?: number
  ): Promise<UserRoadmapEnrollment> {
    const updateData: Partial<UserRoadmapEnrollment> = {
      progress,
      lastAccessedAt: new Date(),
      ...(averageScore !== undefined && { averageScore })
    }

    // Mark as completed if progress is 100%
    if (progress >= 100) {
      updateData.isCompleted = true
      updateData.completedAt = new Date()
    }

    return prisma.userRoadmapEnrollment.update({
      where: {
        userId_roadmapId: { userId, roadmapId }
      },
      data: updateData
    })
  }

  /**
   * Calculate and update enrollment progress based on lesson completions
   */
  async recalculateProgress(userId: string, roadmapId: string): Promise<UserRoadmapEnrollment> {
    // Get roadmap lessons and user progress
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        lessons: {
          where: { isActive: true },
          include: {
            userProgress: {
              where: { userId }
            }
          }
        }
      }
    })

    if (!roadmap || roadmap.lessons.length === 0) {
      throw new Error('Roadmap not found or has no lessons')
    }

    const totalLessons = roadmap.lessons.length
    const completedLessons = roadmap.lessons.filter(
      (lesson) => lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted
    ).length

    const progress = (completedLessons / totalLessons) * 100

    // Calculate average score from completed lessons with scores
    const lessonsWithScores = roadmap.lessons
      .filter(
        (lesson) =>
          lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted && lesson.userProgress[0].score !== null
      )
      .map((lesson) => lesson.userProgress[0].score!)

    const averageScore =
      lessonsWithScores.length > 0
        ? lessonsWithScores.reduce((sum, score) => sum + score, 0) / lessonsWithScores.length
        : 0

    return this.updateProgress(userId, roadmapId, progress, averageScore)
  }

  /**
   * Get user's enrollment with detailed progress
   */
  async findUserEnrollmentWithDetails(userId: string, roadmapId: string): Promise<EnrollmentResponseDto | null> {
    const enrollment = await prisma.userRoadmapEnrollment.findUnique({
      where: {
        userId_roadmapId: { userId, roadmapId }
      }
    })

    if (!enrollment) return null

    return {
      id: enrollment.id,
      roadmapId: enrollment.roadmapId,
      userId: enrollment.userId,
      progress: enrollment.progress,
      averageScore: enrollment.averageScore,
      lastAccessedAt: enrollment.lastAccessedAt?.toISOString(),
      completedAt: enrollment.completedAt?.toISOString(),
      isCompleted: enrollment.isCompleted,
      enrolledAt: enrollment.enrolledAt.toISOString()
    }
  }

  /**
   * Get user's all enrollments with roadmap info
   */
  async findUserEnrollments(userId: string, status?: 'enrolled' | 'completed' | 'all') {
    const whereClause: Prisma.UserRoadmapEnrollmentWhereInput = {
      userId,
      roadmap: { isActive: true },
      ...(status === 'completed' && { isCompleted: true }),
      ...(status === 'enrolled' && { isCompleted: false })
    }

    return prisma.userRoadmapEnrollment.findMany({
      where: whereClause,
      include: {
        roadmap: {
          include: {
            category: true,
            creator: {
              select: { id: true, name: true }
            },
            tags: {
              include: {
                tag: true
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    })
  }

  /**
   * Get enrollment statistics for a user
   */
  async getUserEnrollmentStats(userId: string) {
    const enrollments = await prisma.userRoadmapEnrollment.findMany({
      where: { userId },
      include: {
        roadmap: {
          select: {
            category: {
              select: { label: true }
            }
          }
        }
      }
    })

    const totalEnrollments = enrollments.length
    const completedEnrollments = enrollments.filter((e) => e.isCompleted).length
    const averageScore =
      enrollments.length > 0 ? enrollments.reduce((sum, e) => sum + e.averageScore, 0) / enrollments.length : 0

    // Calculate favorite categories
    const categoryCount = enrollments.reduce(
      (acc, enrollment) => {
        const category = enrollment.roadmap.category.label
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const favoriteCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalEnrollments,
      totalCompletions: completedEnrollments,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
      favoriteCategories
    }
  }

  /**
   * Get recent enrollments across all users
   */
  async getRecentEnrollments(limit: number = 10) {
    return prisma.userRoadmapEnrollment.findMany({
      take: limit,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true }
        },
        roadmap: {
          select: { id: true, title: true }
        }
      }
    })
  }

  /**
   * Get completion streaks for user
   */
  async getUserCompletionStreak(userId: string): Promise<number> {
    const completions = await prisma.userRoadmapEnrollment.findMany({
      where: {
        userId,
        isCompleted: true,
        completedAt: { not: null }
      },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' }
    })

    if (completions.length === 0) return 0

    let streak = 0
    let currentDate = new Date()

    for (const completion of completions) {
      const completionDate = new Date(completion.completedAt!)
      const daysDiff = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 1) {
        streak++
        currentDate = completionDate
      } else {
        break
      }
    }

    return streak
  }
}
