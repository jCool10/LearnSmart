import { Category } from 'generated/prisma'
import { BaseRepository } from './base.repository'
import { CategoryCreateDto, CategoryUpdateDto, CategoryWithCountDto } from '@/types/roadmap.types'
import { prisma } from '@/configs/database.config'

export class CategoryRepository implements BaseRepository<Category, CategoryCreateDto, CategoryUpdateDto, any, string> {
  create(data: CategoryCreateDto): Promise<Category> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  findMany(where?: any, take?: number, skip?: number): Promise<Category[]> {
    throw new Error('Method not implemented.')
  }
  findFirst(where: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  update(id: string, data: CategoryUpdateDto): Promise<Category> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<Category> {
    throw new Error('Method not implemented.')
  }
  count(where?: any): Promise<number> {
    throw new Error('Method not implemented.')
  }

  /**
   * Find all categories with roadmap count
   */
  async findAllWithCount(): Promise<CategoryWithCountDto[]> {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            roadmaps: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { label: 'asc' }
    })

    return categories.map((category) => ({
      id: category.id,
      value: category.value,
      label: category.label,
      description: category.description || '',
      roadmapCount: category._count.roadmaps
    }))
  }

  /**
   * Find category by value
   */
  async findByValue(value: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { value }
    })
  }

  /**
   * Check if category exists by value (excluding a specific id)
   */
  async existsByValue(value: string, excludeId?: string): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: {
        value,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    })

    return !!category
  }

  /**
   * Get categories with statistics
   */
  async findWithStatistics() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            roadmaps: {
              where: { isActive: true }
            }
          }
        },
        roadmaps: {
          where: { isActive: true },
          select: {
            rating: true,
            enrolledUsers: true,
            enrollments: {
              where: { isCompleted: true },
              select: { id: true }
            }
          }
        }
      },
      orderBy: { label: 'asc' }
    })
  }

  /**
   * Soft delete category (set isActive to false)
   */
  async softDelete(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isActive: false }
    })
  }

  /**
   * Restore soft deleted category
   */
  async restore(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isActive: true }
    })
  }
}
