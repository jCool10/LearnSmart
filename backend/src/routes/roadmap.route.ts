import { Router } from 'express'
import { roadmapController } from '@/controllers'
import { auth, optionalAuth } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  createRoadmapSchema,
  updateRoadmapSchema,
  roadmapQuerySchema,
  idParamSchema
} from '@/validations/roadmap.validation'

const router = Router()

/**
 * @swagger
 * /roadmaps:
 *   get:
 *     summary: Get roadmaps with filtering and user enrollment data
 *     tags: [Roadmaps]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query for roadmap title/description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Roadmaps retrieved successfully
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
 *                         $ref: '#/components/schemas/Roadmap'
 */
router.get('/', optionalAuth, validate({ query: roadmapQuerySchema }), roadmapController.getRoadmapsWithFilters)

/**
 * @swagger
 * /roadmaps/popular:
 *   get:
 *     summary: Get popular roadmaps
 *     tags: [Roadmaps]
 *     responses:
 *       200:
 *         description: Popular roadmaps retrieved successfully
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
 *                         $ref: '#/components/schemas/Roadmap'
 */
router.get('/popular', optionalAuth, roadmapController.getPopularRoadmaps)

/**
 * @swagger
 * /roadmaps/recommended:
 *   get:
 *     summary: Get recommended roadmaps for user
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended roadmaps retrieved successfully
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
 *                         $ref: '#/components/schemas/Roadmap'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/recommended', auth(), roadmapController.getRecommendedRoadmaps)

/**
 * @swagger
 * /roadmaps/search:
 *   get:
 *     summary: Search roadmaps
 *     tags: [Roadmaps]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
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
 *                         $ref: '#/components/schemas/Roadmap'
 */
router.get('/search', optionalAuth, roadmapController.searchRoadmaps)

/**
 * @swagger
 * /roadmaps/creator/{creatorId}:
 *   get:
 *     summary: Get roadmaps by creator
 *     tags: [Roadmaps]
 *     parameters:
 *       - in: path
 *         name: creatorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Creator's user ID
 *     responses:
 *       200:
 *         description: Creator's roadmaps retrieved successfully
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
 *                         $ref: '#/components/schemas/Roadmap'
 *       404:
 *         description: Creator not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/creator/:creatorId',
  optionalAuth,
  validate({ params: idParamSchema }),
  roadmapController.getRoadmapsByCreator
)

/**
 * @swagger
 * /roadmaps/{id}:
 *   get:
 *     summary: Get roadmap by ID with comprehensive details
 *     tags: [Roadmaps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Roadmap details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RoadmapDetails'
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', optionalAuth, validate({ params: idParamSchema }), roadmapController.getRoadmapDetails)

/**
 * @swagger
 * /roadmaps/{id}/stats:
 *   get:
 *     summary: Get roadmap statistics
 *     tags: [Roadmaps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Roadmap statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalEnrollments:
 *                           type: integer
 *                           example: 150
 *                         completionRate:
 *                           type: number
 *                           format: float
 *                           example: 75.5
 *                         averageRating:
 *                           type: number
 *                           format: float
 *                           example: 4.3
 *                         totalLessons:
 *                           type: integer
 *                           example: 12
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/stats', validate({ params: idParamSchema }), roadmapController.getRoadmapStatistics)

/**
 * @swagger
 * /roadmaps:
 *   post:
 *     summary: Create roadmap with lessons and tags
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoadmapRequest'
 *     responses:
 *       201:
 *         description: Roadmap created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Roadmap'
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
 */
router.post('/', auth(), validate({ body: createRoadmapSchema }), roadmapController.createRoadmapWithContent)

/**
 * @swagger
 * /roadmaps/{id}:
 *   put:
 *     summary: Update roadmap by ID
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoadmapRequest'
 *     responses:
 *       200:
 *         description: Roadmap updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Roadmap'
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
 *         description: Forbidden - not creator or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete roadmap (soft delete)
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Roadmap deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not creator or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  auth(),
  validate({
    params: idParamSchema,
    body: updateRoadmapSchema
  }),
  roadmapController.updateRoadmap
)

router.delete('/:id', auth(), validate({ params: idParamSchema }), roadmapController.deleteRoadmap)

export default router
