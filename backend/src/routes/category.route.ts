import { Router } from 'express'
import { categoryController } from '@/controllers'
import { auth, authorize } from '@/middlewares/auth.middleware'
import { validateJoi, commonJoiSchemas } from '@/middlewares/joi.validation.middleware'
import {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
  paginationSchema
} from '@/validations/roadmap.validation'

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Programming"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Programming and software development courses"
 *
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *       example:
 *         name: "Web Development"
 *         description: "Modern web development technologies"
 *
 *     CategoryWithCount:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             roadmapCount:
 *               type: integer
 *               description: Number of roadmaps in this category
 *               example: 5
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories with roadmap count
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CategoryWithCount'
 */
router.get('/', categoryController.getAllWithCount)

/**
 * @swagger
 * /categories/stats:
 *   get:
 *     summary: Get categories with statistics (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/stats', auth(), authorize('admin'), categoryController.getCategoriesWithStatistics)

/**
 * @route   GET /api/categories/value/:value
 * @desc    Get category by value
 * @access  Public
 */
router.get('/value/:value', categoryController.getByValue)

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateJoi({ params: commonJoiSchemas.idParam }), categoryController.getById)

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', auth(), authorize('admin'), validateJoi({ body: createCategorySchema }), categoryController.create)

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category (admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  auth(),
  authorize('admin'),
  validateJoi({
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
router.delete(
  '/:id',
  auth(),
  authorize('admin'),
  validateJoi({ params: commonJoiSchemas.idParam }),
  categoryController.softDelete
)

/**
 * @route   POST /api/categories/:id/restore
 * @desc    Restore soft deleted category (admin only)
 * @access  Private (Admin)
 */
router.post(
  '/:id/restore',
  auth(),
  authorize('admin'),
  validateJoi({ params: commonJoiSchemas.idParam }),
  categoryController.restore
)

export default router
