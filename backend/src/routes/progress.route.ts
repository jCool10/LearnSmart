import { Router } from 'express'
import { ProgressController } from '@/controllers/progress.controller'
import { auth, authorize } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validation.middleware'
import { updateLessonProgressSchema, bulkProgressUpdateSchema, idParamSchema } from '@/validations/roadmap.validation'

const router = Router()
const progressController = new ProgressController()

/**
 * @route   PUT /api/lessons/:lessonId/progress
 * @desc    Update lesson progress for user
 * @access  Private
 */
router.put(
  '/lessons/:lessonId/progress',
  auth(),
  validate({
    params: idParamSchema,
    body: updateLessonProgressSchema
  }),
  progressController.updateLessonProgress
)

/**
 * @route   GET /api/lessons/:lessonId/progress
 * @desc    Get lesson progress for user
 * @access  Private
 */
router.get(
  '/lessons/:lessonId/progress',
  auth(),
  validate({ params: idParamSchema }),
  progressController.getLessonProgress
)

/**
 * @route   GET /api/roadmaps/:roadmapId/progress
 * @desc    Get all lesson progress for user in a roadmap
 * @access  Private
 */
router.get(
  '/roadmaps/:roadmapId/progress',
  auth(),
  validate({ params: idParamSchema }),
  progressController.getUserProgressInRoadmap
)

/**
 * @route   POST /api/lessons/:lessonId/complete
 * @desc    Mark lesson as completed
 * @access  Private
 */
router.post(
  '/lessons/:lessonId/complete',
  auth(),
  validate({ params: idParamSchema }),
  progressController.markLessonCompleted
)

/**
 * @route   POST /api/lessons/:lessonId/incomplete
 * @desc    Mark lesson as incomplete (reset progress)
 * @access  Private
 */
router.post(
  '/lessons/:lessonId/incomplete',
  auth(),
  validate({ params: idParamSchema }),
  progressController.markLessonIncomplete
)

/**
 * @route   GET /api/users/:userId/learning-stats
 * @desc    Get user's overall learning statistics
 * @access  Private (Self or Admin)
 */
router.get(
  '/users/:userId/learning-stats',
  auth(),
  validate({ params: idParamSchema }),
  progressController.getUserOverallStats
)

/**
 * @route   GET /api/users/:userId/recent-activity
 * @desc    Get recent learning activity for user
 * @access  Private (Self or Admin)
 */
router.get(
  '/users/:userId/recent-activity',
  auth(),
  validate({ params: idParamSchema }),
  progressController.getRecentActivity
)

/**
 * @route   GET /api/roadmaps/:roadmapId/lesson-completion-rates
 * @desc    Get lesson completion rates for a roadmap
 * @access  Public
 */
router.get(
  '/roadmaps/:roadmapId/lesson-completion-rates',
  validate({ params: idParamSchema }),
  progressController.getRoadmapLessonCompletionRates
)

/**
 * @route   GET /api/users/:userId/learning-streak
 * @desc    Get user's learning streak
 * @access  Private (Self or Admin)
 */
router.get(
  '/users/:userId/learning-streak',
  auth(),
  validate({ params: idParamSchema }),
  progressController.getUserLearningStreak
)

/**
 * @route   DELETE /api/roadmaps/:roadmapId/progress
 * @desc    Reset user progress in roadmap
 * @access  Private
 */
router.delete(
  '/roadmaps/:roadmapId/progress',
  auth(),
  validate({ params: idParamSchema }),
  progressController.resetUserProgressInRoadmap
)

/**
 * @route   GET /api/lessons/:lessonId/next
 * @desc    Get next lesson for user in roadmap
 * @access  Private
 */
router.get('/lessons/:lessonId/next', auth(), validate({ params: idParamSchema }), progressController.getNextLesson)

/**
 * @route   GET /api/lessons/:lessonId/previous
 * @desc    Get previous lesson for user in roadmap
 * @access  Private
 */
router.get(
  '/lessons/:lessonId/previous',
  auth(),
  validate({ params: idParamSchema }),
  progressController.getPreviousLesson
)

/**
 * @route   POST /api/progress/bulk-update
 * @desc    Bulk update lesson progress (for admin/import features)
 * @access  Private (Admin)
 */
router.post(
  '/progress/bulk-update',
  auth(),
  authorize('admin'),
  validate({ body: bulkProgressUpdateSchema }),
  progressController.bulkUpdateProgress
)

export default router
