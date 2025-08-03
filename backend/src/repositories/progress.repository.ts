import { UserLessonProgress, Prisma } from 'generated/prisma'
import { BaseRepository } from './base.repository'
import { LessonProgressUpdateDto, LessonProgressResponseDto } from '@/types/roadmap.types'
import { prisma } from '@/configs/database.config'

export interface ProgressCreateDto {
  userId: string
  lessonId: string
  score?: number
  isCompleted?: boolean
}

export class ProgressRepository
  implements
    BaseRepository<UserLessonProgress, ProgressCreateDto, LessonProgressUpdateDto, Prisma.UserLessonProgressWhereInput>
{
  create(data: ProgressCreateDto): Promise<{
    id: string
    score: number | null
    isCompleted: boolean
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    userId: string
    lessonId: string
  }> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<{
    id: string
    score: number | null
    isCompleted: boolean
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    userId: string
    lessonId: string
  } | null> {
    throw new Error('Method not implemented.')
  }
  findMany(
    where?: Prisma.UserLessonProgressWhereInput | undefined,
    take?: number,
    skip?: number
  ): Promise<
    {
      id: string
      score: number | null
      isCompleted: boolean
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
      userId: string
      lessonId: string
    }[]
  > {
    throw new Error('Method not implemented.')
  }
  findFirst(where: Prisma.UserLessonProgressWhereInput): Promise<{
    id: string
    score: number | null
    isCompleted: boolean
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    userId: string
    lessonId: string
  } | null> {
    throw new Error('Method not implemented.')
  }
  update(
    id: string,
    data: LessonProgressUpdateDto
  ): Promise<{
    id: string
    score: number | null
    isCompleted: boolean
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    userId: string
    lessonId: string
  }> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<{
    id: string
    score: number | null
    isCompleted: boolean
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    userId: string
    lessonId: string
  }> {
    throw new Error('Method not implemented.')
  }
  count(where?: Prisma.UserLessonProgressWhereInput | undefined): Promise<number> {
    throw new Error('Method not implemented.')
  }

  /**
  create(data: ProgressCreateDto): Promise<UserLessonProgress> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  findMany(where?: any, take?: number, skip?: number): Promise<UserLessonProgress[]> {
    throw new Error('Method not implemented.')
  }
  findFirst(where: Prisma.UserLessonProgressWhereInput): Promise<any> {
    throw new Error('Method not implemented.')
  }
  update(id: string, data: LessonProgressUpdateDto): Promise<UserLessonProgress> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<UserLessonProgress> {
    throw new Error('Method not implemented.')
  }
  count(where?: any): Promise<number> {
    throw new Error('Method not implemented.')
  }
   * Find or create lesson progress for user
   */
  async findOrCreate(userId: string, lessonId: string): Promise<UserLessonProgress> {
    let progress = await prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId }
      }
    })

    if (!progress) {
      progress = await prisma.userLessonProgress.create({
        data: { userId, lessonId }
      })
    }

    return progress
  }

  /**
   * Update lesson progress and recalculate roadmap progress
   */
  async updateLessonProgress(
    userId: string,
    lessonId: string,
    updateData: LessonProgressUpdateDto
  ): Promise<LessonProgressResponseDto> {
    // Get lesson info to find roadmap
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { roadmapId: true }
    })

    if (!lesson) {
      throw new Error('Lesson not found')
    }

    const updatedProgress = await prisma.$transaction(async (tx) => {
      // Update or create lesson progress
      const progress = await tx.userLessonProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId }
        },
        update: {
          ...updateData,
          ...(updateData.isCompleted && { completedAt: new Date() })
        },
        create: {
          userId,
          lessonId,
          ...updateData,
          ...(updateData.isCompleted && { completedAt: new Date() })
        }
      })

      // Recalculate roadmap progress
      await this.recalculateRoadmapProgress(tx, userId, lesson.roadmapId)

      return progress
    })

    return {
      id: updatedProgress.id,
      lessonId: updatedProgress.lessonId,
      userId: updatedProgress.userId,
      score: updatedProgress.score,
      isCompleted: updatedProgress.isCompleted,
      completedAt: updatedProgress.completedAt?.toISOString()
    }
  }

  /**
   * Get lesson progress for user
   */
  async findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgressResponseDto | null> {
    const progress = await prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId }
      }
    })

    if (!progress) return null

    return {
      id: progress.id,
      lessonId: progress.lessonId,
      userId: progress.userId,
      score: progress.score,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt?.toISOString()
    }
  }

  /**
   * Get all lesson progress for user in a roadmap
   */
  async findUserProgressInRoadmap(userId: string, roadmapId: string): Promise<LessonProgressResponseDto[]> {
    const progressList = await prisma.userLessonProgress.findMany({
      where: {
        userId,
        lesson: { roadmapId }
      },
      include: {
        lesson: {
          select: { orderIndex: true }
        }
      },
      orderBy: {
        lesson: { orderIndex: 'asc' }
      }
    })

    return progressList.map((progress) => ({
      id: progress.id,
      lessonId: progress.lessonId,
      userId: progress.userId,
      score: progress.score,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt?.toISOString()
    }))
  }

  /**
   * Get user's overall progress statistics
   */
  async getUserOverallStats(userId: string) {
    const progressData = await prisma.userLessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            roadmap: {
              include: {
                category: {
                  select: { label: true }
                }
              }
            }
          }
        }
      }
    })

    const totalLessons = progressData.length
    const completedLessons = progressData.filter((p) => p.isCompleted).length
    const lessonsWithScores = progressData.filter((p) => p.score !== null)

    const averageScore =
      lessonsWithScores.length > 0
        ? lessonsWithScores.reduce((sum, p) => sum + (p.score || 0), 0) / lessonsWithScores.length
        : 0

    // Calculate total learning time (estimated)
    const totalEstimatedMinutes = progressData
      .filter((p) => p.isCompleted)
      .reduce((sum, p) => sum + p.lesson.estimatedMinutes, 0)

    // Category breakdown
    const categoryStats = progressData.reduce(
      (acc, progress) => {
        const category = progress.lesson.roadmap.category.label
        if (!acc[category]) {
          acc[category] = { total: 0, completed: 0 }
        }
        acc[category].total++
        if (progress.isCompleted) {
          acc[category].completed++
        }
        return acc
      },
      {} as Record<string, { total: number; completed: number }>
    )

    const categoryBreakdown = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      totalLessons: stats.total,
      completedLessons: stats.completed,
      completionRate: (stats.completed / stats.total) * 100
    }))

    return {
      totalLessons,
      completedLessons,
      completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      averageScore: Math.round(averageScore * 100) / 100,
      totalLearningTime: totalEstimatedMinutes,
      categoryBreakdown
    }
  }

  /**
   * Get recent learning activity
   */
  async getRecentActivity(userId: string, limit: number = 10) {
    return prisma.userLessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            roadmap: {
              select: { id: true, title: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    })
  }

  /**
   * Get completion rate for lessons in a roadmap
   */
  async getRoadmapLessonCompletionRates(roadmapId: string) {
    const lessons = await prisma.lesson.findMany({
      where: { roadmapId, isActive: true },
      include: {
        _count: {
          select: {
            userProgress: true
          }
        },
        userProgress: {
          where: { isCompleted: true },
          select: { id: true }
        }
      },
      orderBy: { orderIndex: 'asc' }
    })

    // Get total enrollments for this roadmap
    const totalEnrollments = await prisma.userRoadmapEnrollment.count({
      where: { roadmapId }
    })

    return lessons.map((lesson) => ({
      lessonId: lesson.id,
      title: lesson.title,
      orderIndex: lesson.orderIndex,
      totalAttempts: lesson._count.userProgress,
      completions: lesson.userProgress.length,
      completionRate: totalEnrollments > 0 ? (lesson.userProgress.length / totalEnrollments) * 100 : 0
    }))
  }

  /**
   * Helper method to recalculate roadmap progress
   */
  private async recalculateRoadmapProgress(tx: any, userId: string, roadmapId: string) {
    // Get all lessons in roadmap and user's progress
    const lessons = await tx.lesson.findMany({
      where: { roadmapId, isActive: true },
      include: {
        userProgress: {
          where: { userId }
        }
      }
    })

    const totalLessons = lessons.length
    const completedLessons = lessons.filter(
      (lesson) => lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted
    ).length

    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    // Calculate average score from completed lessons with scores
    const lessonsWithScores = lessons
      .filter(
        (lesson) =>
          lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted && lesson.userProgress[0].score !== null
      )
      .map((lesson) => lesson.userProgress[0].score!)

    const averageScore =
      lessonsWithScores.length > 0
        ? lessonsWithScores.reduce((sum, score) => sum + score, 0) / lessonsWithScores.length
        : 0

    // Update enrollment progress
    const updateData: any = {
      progress,
      averageScore,
      lastAccessedAt: new Date()
    }

    // Mark as completed if progress is 100%
    if (progress >= 100) {
      updateData.isCompleted = true
      updateData.completedAt = new Date()
    }

    await tx.userRoadmapEnrollment.update({
      where: {
        userId_roadmapId: { userId, roadmapId }
      },
      data: updateData
    })
  }

  /**
   * Delete all progress for a user in a roadmap
   */
  async deleteUserProgressInRoadmap(userId: string, roadmapId: string): Promise<void> {
    await prisma.userLessonProgress.deleteMany({
      where: {
        userId,
        lesson: { roadmapId }
      }
    })
  }

  /**
   * Get learning streak for user
   */
  async getUserLearningStreak(userId: string): Promise<number> {
    const recentProgress = await prisma.userLessonProgress.findMany({
      where: {
        userId,
        isCompleted: true,
        completedAt: { not: null }
      },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' }
    })

    if (recentProgress.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0) // Reset to start of day

    const completionDates = recentProgress.map((p) => {
      const date = new Date(p.completedAt!)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })

    // Remove duplicates (same day completions)
    const uniqueDates = [...new Set(completionDates)].sort((a, b) => b - a)

    for (const dateTime of uniqueDates) {
      const daysDiff = Math.floor((currentDate.getTime() - dateTime) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 1) {
        streak++
        currentDate = new Date(dateTime)
      } else {
        break
      }
    }

    return streak
  }
}
