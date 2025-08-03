import { Tag, Prisma } from 'generated/prisma'
import { BaseRepository } from './base.repository'
import { TagCreateDto, TagResponseDto } from '@/types/roadmap.types'
import { prisma } from '@/configs/database.config'

export class TagRepository implements BaseRepository<Tag, TagCreateDto, Partial<Tag>, Prisma.TagWhereInput> {
  create(data: TagCreateDto): Promise<Tag> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  findMany(where?: any, take?: number, skip?: number): Promise<Tag[]> {
    throw new Error('Method not implemented.')
  }
  findFirst(where: Prisma.TagWhereInput): Promise<any> {
    throw new Error('Method not implemented.')
  }
  update(id: string, data: Tag): Promise<Tag> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<Tag> {
    throw new Error('Method not implemented.')
  }
  count(where?: any): Promise<number> {
    throw new Error('Method not implemented.')
  }

  /**
   * Find tag by name
   */
  async findByName(name: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { name }
    })
  }

  /**
   * Find or create tag by name
   */
  async findOrCreate(name: string, color?: string): Promise<Tag> {
    return prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, color }
    })
  }

  /**
   * Find all tags with usage count
   */
  async findAllWithUsageCount(): Promise<TagResponseDto[]> {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            roadmapTags: {
              where: {
                roadmap: { isActive: true }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color || '',
      usageCount: tag._count.roadmapTags
    }))
  }

  /**
   * Find popular tags (most used)
   */
  async findPopularTags(limit: number = 20): Promise<TagResponseDto[]> {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            roadmapTags: {
              where: {
                roadmap: { isActive: true }
              }
            }
          }
        }
      },
      orderBy: {
        roadmapTags: {
          _count: 'desc'
        }
      },
      take: limit
    })

    return tags
      .filter((tag) => tag._count.roadmapTags > 0)
      .map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color || '',
        usageCount: tag._count.roadmapTags
      }))
  }

  /**
   * Search tags by name
   */
  async searchByName(query: string, limit: number = 10): Promise<TagResponseDto[]> {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: {
            roadmapTags: {
              where: {
                roadmap: { isActive: true }
              }
            }
          }
        }
      },
      orderBy: [{ roadmapTags: { _count: 'desc' } }, { name: 'asc' }],
      take: limit
    })

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color || '',
      usageCount: tag._count.roadmapTags
    }))
  }

  /**
   * Find tags for a specific roadmap
   */
  async findByRoadmapId(roadmapId: string): Promise<Tag[]> {
    const roadmapTags = await prisma.roadmapTag.findMany({
      where: { roadmapId },
      include: { tag: true }
    })

    return roadmapTags.map((rt) => rt.tag)
  }

  /**
   * Add tags to roadmap
   */
  async addTagsToRoadmap(roadmapId: string, tagNames: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const tagName of tagNames) {
        // Find or create tag
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })

        // Create roadmap-tag relationship if it doesn't exist
        await tx.roadmapTag.upsert({
          where: {
            roadmapId_tagId: { roadmapId, tagId: tag.id }
          },
          update: {},
          create: { roadmapId, tagId: tag.id }
        })
      }
    })
  }

  /**
   * Remove tags from roadmap
   */
  async removeTagsFromRoadmap(roadmapId: string, tagIds: string[]): Promise<void> {
    await prisma.roadmapTag.deleteMany({
      where: {
        roadmapId,
        tagId: { in: tagIds }
      }
    })
  }

  /**
   * Replace all tags for a roadmap
   */
  async replaceRoadmapTags(roadmapId: string, tagNames: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Remove existing tags
      await tx.roadmapTag.deleteMany({
        where: { roadmapId }
      })

      // Add new tags
      for (const tagName of tagNames) {
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })

        await tx.roadmapTag.create({
          data: { roadmapId, tagId: tag.id }
        })
      }
    })
  }

  /**
   * Get tag statistics
   */
  async getTagStatistics() {
    const stats = await prisma.tag.aggregate({
      _count: { id: true }
    })

    const popularTags = await this.findPopularTags(5)

    const categoryBreakdown = await prisma.tag.findMany({
      include: {
        roadmapTags: {
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

    // Process category breakdown
    const categoryStats = categoryBreakdown.reduce(
      (acc, tag) => {
        tag.roadmapTags.forEach((rt) => {
          const category = rt.roadmap.category.label
          if (!acc[category]) {
            acc[category] = new Set()
          }
          acc[category].add(tag.name)
        })
        return acc
      },
      {} as Record<string, Set<string>>
    )

    const categoryTagCounts = Object.entries(categoryStats).map(([category, tags]) => ({
      category,
      uniqueTagCount: tags.size
    }))

    return {
      totalTags: stats._count.id,
      popularTags,
      categoryTagCounts
    }
  }

  /**
   * Clean up unused tags (tags not associated with any roadmap)
   */
  async cleanupUnusedTags(): Promise<number> {
    const unusedTags = await prisma.tag.findMany({
      where: {
        roadmapTags: {
          none: {}
        }
      }
    })

    if (unusedTags.length > 0) {
      await prisma.tag.deleteMany({
        where: {
          id: { in: unusedTags.map((tag) => tag.id) }
        }
      })
    }

    return unusedTags.length
  }

  /**
   * Get related tags (tags that appear together with a given tag)
   */
  async findRelatedTags(tagName: string, limit: number = 10): Promise<TagResponseDto[]> {
    // Find roadmaps that have this tag
    const roadmapsWithTag = await prisma.roadmapTag.findMany({
      where: {
        tag: { name: tagName },
        roadmap: { isActive: true }
      },
      select: { roadmapId: true }
    })

    const roadmapIds = roadmapsWithTag.map((rt) => rt.roadmapId)

    if (roadmapIds.length === 0) return []

    // Find other tags that appear in these roadmaps
    const relatedTags = await prisma.tag.findMany({
      where: {
        name: { not: tagName },
        roadmapTags: {
          some: {
            roadmapId: { in: roadmapIds }
          }
        }
      },
      include: {
        _count: {
          select: {
            roadmapTags: {
              where: {
                roadmapId: { in: roadmapIds }
              }
            }
          }
        }
      },
      orderBy: {
        roadmapTags: {
          _count: 'desc'
        }
      },
      take: limit
    })

    return relatedTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color || '',
      usageCount: tag._count.roadmapTags
    }))
  }
}
