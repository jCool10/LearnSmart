import { Router } from 'express'
import { categoryController } from '@/controllers'
import { auth, authorize } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
  paginationSchema
} from '@/validations/roadmap.validation'

const router = Router()

/**
 * @route   GET /api/categories
 * @desc    Get all categories with roadmap count
 * @access  Public
 */
router.get('/', categoryController.getAllWithCount)

/**
 * @route   GET /api/categories/stats
 * @desc    Get categories with statistics (admin only)
 * @access  Private (Admin)
 */
router.get('/stats', auth(), authorize('admin'), categoryController.getCategoriesWithStatistics)

/**
 * @route   GET /api/categories/value/:value
 * @desc    Get category by value
 * @access  Public
 */
router.get('/value/:value', categoryController.getByValue)

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', validate({ params: idParamSchema }), categoryController.getById)

/**
 * @route   POST /api/categories
 * @desc    Create new category (admin only)
 * @access  Private (Admin)
 */
router.post('/', auth(), authorize('admin'), validate({ body: createCategorySchema }), categoryController.create)

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category (admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  auth(),
  authorize('admin'),
  validate({
    params: idParamSchema,
    body: updateCategorySchema
  }),
  categoryController.update
)

/**
 * @route   DELETE /api/categories/:id
 * @desc    Soft delete category (admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', auth(), authorize('admin'), validate({ params: idParamSchema }), categoryController.softDelete)

/**
 * @route   POST /api/categories/:id/restore
 * @desc    Restore soft deleted category (admin only)
 * @access  Private (Admin)
 */
router.post('/:id/restore', auth(), authorize('admin'), validate({ params: idParamSchema }), categoryController.restore)

export default router
