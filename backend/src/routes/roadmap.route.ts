import { Router } from 'express'
import { roadmapController } from '@/controllers'
import { auth, authorize, optionalAuth } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  createRoadmapSchema,
  updateRoadmapSchema,
  roadmapQuerySchema,
  idParamSchema
} from '@/validations/roadmap.validation'

const router = Router()

/**
 * @route   GET /api/roadmaps
 * @desc    Get roadmaps with filtering and user enrollment data
 * @access  Public (with optional auth for user data)
 */
router.get('/', optionalAuth, validate({ query: roadmapQuerySchema }), roadmapController.getRoadmapsWithFilters)

/**
 * @route   GET /api/roadmaps/popular
 * @desc    Get popular roadmaps
 * @access  Public (with optional auth for user data)
 */
router.get('/popular', optionalAuth, roadmapController.getPopularRoadmaps)

/**
 * @route   GET /api/roadmaps/recommended
 * @desc    Get recommended roadmaps for user
 * @access  Private
 */
router.get('/recommended', auth(), roadmapController.getRecommendedRoadmaps)

/**
 * @route   GET /api/roadmaps/search
 * @desc    Search roadmaps
 * @access  Public (with optional auth for user data)
 */
router.get('/search', optionalAuth, roadmapController.searchRoadmaps)

/**
 * @route   GET /api/roadmaps/creator/:creatorId
 * @desc    Get roadmaps by creator
 * @access  Public (with optional auth for user data)
 */
router.get(
  '/creator/:creatorId',
  optionalAuth,
  validate({ params: idParamSchema }),
  roadmapController.getRoadmapsByCreator
)

/**
 * @route   GET /api/roadmaps/:id
 * @desc    Get roadmap by ID with comprehensive details
 * @access  Public (with optional auth for user data)
 */
router.get('/:id', optionalAuth, validate({ params: idParamSchema }), roadmapController.getRoadmapDetails)

/**
 * @route   GET /api/roadmaps/:id/stats
 * @desc    Get roadmap statistics
 * @access  Public
 */
router.get('/:id/stats', validate({ params: idParamSchema }), roadmapController.getRoadmapStatistics)

/**
 * @route   POST /api/roadmaps
 * @desc    Create roadmap with lessons and tags
 * @access  Private
 */
router.post('/', auth(), validate({ body: createRoadmapSchema }), roadmapController.createRoadmapWithContent)

/**
 * @route   PUT /api/roadmaps/:id
 * @desc    Update roadmap by ID
 * @access  Private (Creator or Admin)
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

/**
 * @route   DELETE /api/roadmaps/:id
 * @desc    Delete roadmap (soft delete)
 * @access  Private (Creator or Admin)
 */
router.delete('/:id', auth(), validate({ params: idParamSchema }), roadmapController.deleteRoadmap)

export default router
