import { Lesson, Prisma } from '../../generated/prisma'
import { BaseRepository } from './base.repository'
import { LessonCreateDto, LessonUpdateDto, LessonResponseDto } from '@/types/roadmap.types'
import { prisma } from '@/configs/database.config'

export class LessonRepository
  implements BaseRepository<Lesson, LessonCreateDto, LessonUpdateDto, Prisma.LessonWhereInput, string>
{
  create(data: LessonCreateDto): Promise<{
    id: string
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    isActive: boolean
    roadmapId: string
    content: string | null
    orderIndex: number
    estimatedMinutes: number
  }> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<{
    id: string
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    isActive: boolean
    roadmapId: string
    content: string | null
    orderIndex: number
    estimatedMinutes: number
  } | null> {
    throw new Error('Method not implemented.')
  }
  findMany(
    where?: Prisma.LessonWhereInput | undefined,
    take?: number,
    skip?: number
  ): Promise<
    {
      id: string
      createdAt: Date
      updatedAt: Date
      title: string
      description: string
      isActive: boolean
      roadmapId: string
      content: string | null
      orderIndex: number
      estimatedMinutes: number
    }[]
  > {
    throw new Error('Method not implemented.')
  }
  findFirst(where: Prisma.LessonWhereInput): Promise<{
    id: string
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    isActive: boolean
    roadmapId: string
    content: string | null
    orderIndex: number
    estimatedMinutes: number
  } | null> {
    throw new Error('Method not implemented.')
  }
  update(
    id: string,
    data: LessonUpdateDto
  ): Promise<{
    id: string
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    isActive: boolean
    roadmapId: string
    content: string | null
    orderIndex: number
    estimatedMinutes: number
  }> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<{
    id: string
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    isActive: boolean
    roadmapId: string
    content: string | null
    orderIndex: number
    estimatedMinutes: number
  }> {
    throw new Error('Method not implemented.')
  }
  count(where?: Prisma.LessonWhereInput | undefined): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async findByRoadmapWithProgress(roadmapId: string, userId?: string) {
    const lessons = await prisma.lesson.findMany({
      where: {
        roadmapId,
        isActive: true
      },
      include: userId
        ? {
            userProgress: {
              where: { userId },
              select: {
                id: true,
                score: true,
                isCompleted: true,
                completedAt: true
              }
            }
          }
        : {
            userProgress: false
          },
      orderBy: { orderIndex: 'asc' }
    })

    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content ?? '',
      orderIndex: lesson.orderIndex,
      estimatedMinutes: lesson.estimatedMinutes,
      ...(userId &&
        lesson.userProgress &&
        lesson.userProgress.length > 0 && {
          userProgress: {
            id: lesson.userProgress[0].id,
            score: lesson.userProgress[0].score,
            isCompleted: lesson.userProgress[0].isCompleted,
            completedAt: lesson.userProgress[0].completedAt?.toISOString()
          }
        })
    }))
  }

  /**
   * Find lesson by ID with user progress
   */
  async findByIdWithProgress(id: string, userId?: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id, isActive: true },
      include: userId
        ? {
            userProgress: {
              where: { userId },
              select: {
                id: true,
                score: true,
                isCompleted: true,
                completedAt: true
              }
            }
          }
        : {
            userProgress: false
          }
    })

    if (!lesson) return null

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      orderIndex: lesson.orderIndex,
      estimatedMinutes: lesson.estimatedMinutes,
      ...(userId &&
        lesson.userProgress &&
        lesson.userProgress.length > 0 && {
          userProgress: {
            id: lesson.userProgress[0].id,
            score: lesson.userProgress[0].score,
            isCompleted: lesson.userProgress[0].isCompleted,
            completedAt: lesson.userProgress[0].completedAt?.toISOString()
          }
        })
    }
  }

  /**
   * Create multiple lessons for a roadmap
   */
  async createManyForRoadmap(roadmapId: string, lessons: LessonCreateDto[]): Promise<Lesson[]> {
    const createdLessons = await prisma.lesson.createManyAndReturn({
      data: lessons.map((lesson) => ({
        ...lesson,
        roadmapId
      }))
    })

    // Update roadmap total lessons count
    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: { totalLessons: lessons.length }
    })

    return createdLessons
  }

  /**
   * Update lesson order indices
   */
  async updateOrderIndices(lessonUpdates: Array<{ id: string; orderIndex: number }>): Promise<void> {
    await prisma.$transaction(
      lessonUpdates.map((update) =>
        prisma.lesson.update({
          where: { id: update.id },
          data: { orderIndex: update.orderIndex }
        })
      )
    )
  }

  /**
   * Get next lesson in sequence
   */
  async findNextLesson(currentLessonId: string): Promise<Lesson | null> {
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: currentLessonId },
      select: { roadmapId: true, orderIndex: true }
    })

    if (!currentLesson) return null

    return prisma.lesson.findFirst({
      where: {
        roadmapId: currentLesson.roadmapId,
        orderIndex: { gt: currentLesson.orderIndex },
        isActive: true
      },
      orderBy: { orderIndex: 'asc' }
    })
  }

  /**
   * Get previous lesson in sequence
   */
  async findPreviousLesson(currentLessonId: string): Promise<Lesson | null> {
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: currentLessonId },
      select: { roadmapId: true, orderIndex: true }
    })

    if (!currentLesson) return null

    return prisma.lesson.findFirst({
      where: {
        roadmapId: currentLesson.roadmapId,
        orderIndex: { lt: currentLesson.orderIndex },
        isActive: true
      },
      orderBy: { orderIndex: 'desc' }
    })
  }

  /**
   * Count completed lessons for user in roadmap
   */
  async countCompletedByUserAndRoadmap(userId: string, roadmapId: string): Promise<number> {
    return prisma.lesson.count({
      where: {
        roadmapId,
        isActive: true,
        userProgress: {
          some: {
            userId,
            isCompleted: true
          }
        }
      }
    })
  }

  /**
   * Get lesson completion statistics for roadmap
   */
  async getLessonStatistics(roadmapId: string) {
    const lessons = await prisma.lesson.findMany({
      where: { roadmapId, isActive: true },
      include: {
        _count: {
          select: {
            userProgress: {
              where: { isCompleted: true }
            }
          }
        },
        userProgress: {
          where: { isCompleted: true },
          select: {
            score: true,
            completedAt: true
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    })

    return lessons.map((lesson) => {
      const completedProgress = lesson.userProgress.filter((p) => p.score !== null)
      const averageScore =
        completedProgress.length > 0
          ? completedProgress.reduce((sum, p) => sum + (p.score || 0), 0) / completedProgress.length
          : 0

      return {
        id: lesson.id,
        title: lesson.title,
        orderIndex: lesson.orderIndex,
        completionCount: lesson._count.userProgress,
        averageScore: Math.round(averageScore * 100) / 100,
        estimatedMinutes: lesson.estimatedMinutes
      }
    })
  }

  /**
   * Soft delete lesson (set isActive to false)
   */
  async softDelete(id: string): Promise<Lesson> {
    const lesson = await prisma.lesson.update({
      where: { id },
      data: { isActive: false }
    })

    // Update roadmap total lessons count
    const activeLessonsCount = await prisma.lesson.count({
      where: { roadmapId: lesson.roadmapId, isActive: true }
    })

    await prisma.roadmap.update({
      where: { id: lesson.roadmapId },
      data: { totalLessons: activeLessonsCount }
    })

    return lesson
  }
}
