import { Roadmap, Prisma } from 'generated/prisma'
import { BaseRepository, PaginationOptions, PaginationResult } from './base.repository'
import { RoadmapCreateDto, RoadmapUpdateDto, RoadmapQueryDto, RoadmapResponseDto } from '@/types/roadmap.types'
import { prisma } from '@/configs/database.config'

export class RoadmapRepository
  implements BaseRepository<Roadmap, RoadmapCreateDto, RoadmapUpdateDto, Prisma.RoadmapWhereInput>
{
  async findWithFiltersAndUserData(
    filters: RoadmapQueryDto,
    pagination: PaginationOptions,
    userId: string | undefined
  ): Promise<PaginationResult<RoadmapResponseDto>> {
    const whereClause: Prisma.RoadmapWhereInput = {
      isActive: true,
      ...(filters.category && { category: { value: filters.category } }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    }

    const [roadmaps, total] = await Promise.all([
      prisma.roadmap.findMany({
        where: whereClause,
        include: {
          category: {
            select: { id: true, value: true, label: true }
          },
          creator: {
            select: { id: true, name: true }
          },
          tags: {
            include: {
              tag: {
                select: { name: true }
              }
            }
          },
          enrollments: userId
            ? {
                where: { userId },
                select: {
                  id: true,
                  progress: true,
                  averageScore: true,
                  lastAccessedAt: true,
                  isCompleted: true
                }
              }
            : false,
          lessons: {
            where: { isActive: true },
            include: userId
              ? {
                  userProgress: {
                    where: { userId },
                    select: { isCompleted: true }
                  }
                }
              : {
                  userProgress: false
                }
          }
        },
        orderBy: { createdAt: 'desc' },
        ...(pagination && { skip: pagination.skip, take: pagination.take })
      }),
      prisma.roadmap.count({ where: whereClause })
    ])

    const transformedRoadmaps: RoadmapResponseDto[] = roadmaps.map((roadmap: any) => {
      const enrollment = Array.isArray(roadmap.enrollments) ? roadmap.enrollments[0] : undefined
      const completedLessons = userId
        ? roadmap.lessons.filter(
            (lesson: any) => lesson.userProgress && lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted
          ).length
        : 0

      return {
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        category: roadmap.category,
        difficulty: roadmap.difficulty,
        totalLessons: roadmap.lessons.length,
        estimatedTime: roadmap.estimatedTime,
        rating: roadmap.rating,
        enrolledUsers: roadmap.enrolledUsers,
        tags: roadmap.tags.map((rt: any) => rt.tag.name),
        creator: roadmap.creator,
        ...(enrollment && {
          userEnrollment: {
            isEnrolled: true,
            progress: enrollment.progress,
            completedLessons,
            averageScore: enrollment.averageScore,
            lastAccessedAt: enrollment.lastAccessedAt?.toISOString(),
            isCompleted: enrollment.isCompleted
          }
        }),
        ...(!enrollment &&
          userId && {
            userEnrollment: {
              isEnrolled: false,
              progress: 0,
              completedLessons: 0,
              averageScore: 0,
              isCompleted: false
            }
          }),
        createdAt: roadmap.createdAt.toISOString(),
        updatedAt: roadmap.updatedAt.toISOString()
      }
    })

    return {
      items: transformedRoadmaps,
      data: transformedRoadmaps,
      meta: pagination
        ? {
            page: Math.floor((pagination.skip || 0) / (pagination.take || 10)) + 1,
            limit: pagination.take || 10,
            total,
            totalPages: Math.ceil(total / (pagination.take || 10)),
            hasNext: (pagination.skip || 0) + (pagination.take || 10) < total,
            hasPrev: (pagination.skip || 0) > 0
          }
        : {
            page: 1,
            limit: total,
            total,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
    }
  }
  async create(data: RoadmapCreateDto & { creatorId: string }): Promise<Roadmap> {
    const { tags: _tags, lessons, ...roadmapData } = data
    return prisma.roadmap.create({
      data: {
        ...roadmapData,
        totalLessons: lessons?.length || 0
      }
    })
  }
  async findById(id: string): Promise<Roadmap | null> {
    return prisma.roadmap.findUnique({
      where: { id, isActive: true }
    })
  }
  async findMany(where?: Prisma.RoadmapWhereInput | undefined, take?: number, skip?: number): Promise<Roadmap[]> {
    return prisma.roadmap.findMany({
      where: { ...where, isActive: true },
      take,
      skip,
      orderBy: { createdAt: 'desc' }
    })
  }
  async findFirst(where: Prisma.RoadmapWhereInput): Promise<Roadmap | null> {
    return prisma.roadmap.findFirst({
      where: { ...where, isActive: true }
    })
  }
  async update(id: string, data: RoadmapUpdateDto): Promise<Roadmap> {
    return prisma.roadmap.update({
      where: { id },
      data
    })
  }
  async delete(id: string): Promise<Roadmap> {
    return prisma.roadmap.update({
      where: { id },
      data: { isActive: false }
    })
  }
  async count(where?: Prisma.RoadmapWhereInput | undefined): Promise<number> {
    return prisma.roadmap.count({
      where: { ...where, isActive: true }
    })
  }

  async findByIdWithDetails(id: string, userId?: string): Promise<RoadmapResponseDto | null> {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id, isActive: true },
      include: {
        category: {
          select: { id: true, value: true, label: true }
        },
        creator: {
          select: { id: true, name: true }
        },
        tags: {
          include: {
            tag: {
              select: { name: true }
            }
          }
        },
        enrollments: userId
          ? {
              where: { userId },
              select: {
                id: true,
                progress: true,
                averageScore: true,
                lastAccessedAt: true,
                isCompleted: true
              }
            }
          : false,
        lessons: {
          where: { isActive: true },
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
        }
      }
    })

    if (!roadmap) return null

    const enrollment = Array.isArray(roadmap.enrollments) ? roadmap.enrollments[0] : undefined
    const completedLessons = userId
      ? roadmap.lessons.filter(
          (lesson: any) => lesson.userProgress && lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted
        ).length
      : 0

    return {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      category: roadmap.category,
      difficulty: roadmap.difficulty,
      totalLessons: roadmap.lessons.length,
      estimatedTime: roadmap.estimatedTime,
      rating: roadmap.rating,
      enrolledUsers: roadmap.enrolledUsers,
      tags: roadmap.tags.map((rt) => rt.tag.name),
      creator: roadmap.creator,
      ...(enrollment && {
        userEnrollment: {
          isEnrolled: true,
          progress: enrollment.progress,
          completedLessons,
          averageScore: enrollment.averageScore,
          lastAccessedAt: enrollment.lastAccessedAt?.toISOString(),
          isCompleted: enrollment.isCompleted
        }
      }),
      ...(!enrollment &&
        userId && {
          userEnrollment: {
            isEnrolled: false,
            progress: 0,
            completedLessons: 0,
            averageScore: 0,
            isCompleted: false
          }
        }),
      createdAt: roadmap.createdAt.toISOString(),
      updatedAt: roadmap.updatedAt.toISOString()
    }
  }

  /**
   * Create roadmap with lessons and tags
   */
  async createWithLessonsAndTags(data: RoadmapCreateDto & { creatorId: string }): Promise<Roadmap> {
    const { tags, lessons, ...roadmapData } = data

    return prisma.$transaction(async (tx) => {
      // Create roadmap
      const roadmap = await tx.roadmap.create({
        data: {
          ...roadmapData,
          totalLessons: lessons?.length || 0
        }
      })

      // Create lessons if provided
      if (lessons && lessons.length > 0) {
        await tx.lesson.createMany({
          data: lessons.map((lesson) => ({
            ...lesson,
            roadmapId: roadmap.id
          }))
        })
      }

      // Handle tags if provided
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Find or create tag
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName }
          })

          // Link roadmap to tag
          await tx.roadmapTag.create({
            data: {
              roadmapId: roadmap.id,
              tagId: tag.id
            }
          })
        }
      }

      return roadmap
    })
  }

  /**
   * Update roadmap enrollment count
   */
  async updateEnrollmentCount(roadmapId: string, increment: boolean = true): Promise<void> {
    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        enrolledUsers: {
          [increment ? 'increment' : 'decrement']: 1
        }
      }
    })
  }

  /**
   * Find user's enrolled roadmaps
   */
  async findUserEnrolledRoadmaps(
    userId: string,
    status?: 'enrolled' | 'completed' | 'all',
    pagination?: PaginationOptions
  ): Promise<PaginationResult<RoadmapResponseDto>> {
    const whereClause: Prisma.UserRoadmapEnrollmentWhereInput = {
      userId,
      roadmap: { isActive: true },
      ...(status === 'completed' && { isCompleted: true }),
      ...(status === 'enrolled' && { isCompleted: false })
    }

    const [enrollments, total] = await Promise.all([
      prisma.userRoadmapEnrollment.findMany({
        where: whereClause,
        include: {
          roadmap: {
            include: {
              category: {
                select: { id: true, value: true, label: true }
              },
              creator: {
                select: { id: true, name: true }
              },
              tags: {
                include: {
                  tag: {
                    select: { name: true }
                  }
                }
              },
              lessons: {
                where: { isActive: true },
                include: {
                  userProgress: {
                    where: { userId },
                    select: { isCompleted: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { enrolledAt: 'desc' },
        ...(pagination && { skip: pagination.skip, take: pagination.take })
      }),
      prisma.userRoadmapEnrollment.count({ where: whereClause })
    ])

    const transformedRoadmaps: RoadmapResponseDto[] = enrollments.map((enrollment) => {
      const roadmap = enrollment.roadmap
      const completedLessons = roadmap.lessons.filter(
        (lesson) => lesson.userProgress && lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted
      ).length

      return {
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        category: roadmap.category,
        difficulty: roadmap.difficulty,
        totalLessons: roadmap.lessons.length,
        estimatedTime: roadmap.estimatedTime,
        rating: roadmap.rating,
        enrolledUsers: roadmap.enrolledUsers,
        tags: roadmap.tags.map((rt) => rt.tag.name),
        creator: roadmap.creator,
        userEnrollment: {
          isEnrolled: true,
          progress: enrollment.progress,
          completedLessons,
          averageScore: enrollment.averageScore,
          lastAccessedAt: enrollment.lastAccessedAt?.toISOString(),
          isCompleted: enrollment.isCompleted
        },
        createdAt: roadmap.createdAt.toISOString(),
        updatedAt: roadmap.updatedAt.toISOString()
      }
    })

    return {
      items: transformedRoadmaps,
      data: transformedRoadmaps,
      meta: pagination
        ? {
            page: Math.floor((pagination.skip || 0) / (pagination.take || 10)) + 1,
            limit: pagination.take || 10,
            total,
            totalPages: Math.ceil(total / (pagination.take || 10)),
            hasNext: (pagination.skip || 0) + (pagination.take || 10) < total,
            hasPrev: (pagination.skip || 0) > 0
          }
        : {
            page: 1,
            limit: total,
            total,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
    }
  }

  /**
   * Get roadmap statistics
   */
  async getStatistics(roadmapId: string) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        enrollments: {
          select: {
            isCompleted: true,
            progress: true,
            averageScore: true,
            enrolledAt: true,
            completedAt: true
          }
        }
      }
    })

    if (!roadmap) return null

    const totalEnrollments = roadmap.enrollments.length
    const completedEnrollments = roadmap.enrollments.filter((e) => e.isCompleted).length
    const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0

    const averageProgress =
      totalEnrollments > 0 ? roadmap.enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments : 0

    const completedWithTime = roadmap.enrollments.filter((e) => e.isCompleted && e.completedAt && e.enrolledAt)
    const averageCompletionDays =
      completedWithTime.length > 0
        ? completedWithTime.reduce((sum, e) => {
            const days = Math.ceil((e.completedAt!.getTime() - e.enrolledAt.getTime()) / (1000 * 60 * 60 * 24))
            return sum + days
          }, 0) / completedWithTime.length
        : 0

    return {
      totalEnrollments,
      completionRate: Math.round(completionRate * 100) / 100,
      averageRating: roadmap.rating,
      averageCompletionTime: `${Math.round(averageCompletionDays)} days`,
      averageProgress: Math.round(averageProgress * 100) / 100
    }
  }
}
