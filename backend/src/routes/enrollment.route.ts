import { Router } from 'express'
import { enrollmentController } from '@/controllers'
import { auth, authorize } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  enrollmentQuerySchema,
  updateProgressSchema,
  bulkEnrollmentSchema,
  idParamSchema
} from '@/validations/roadmap.validation'

const router = Router()

/**
 * @route   POST /api/roadmaps/:roadmapId/enroll
 * @desc    Enroll user in roadmap
 * @access  Private
 */
router.post('/roadmaps/:roadmapId/enroll', auth(), validate({ params: idParamSchema }), enrollmentController.enrollUser)

/**
 * @route   DELETE /api/roadmaps/:roadmapId/enroll
 * @desc    Unenroll user from roadmap
 * @access  Private
 */
router.delete(
  '/roadmaps/:roadmapId/enroll',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.unenrollUser
)

/**
 * @route   GET /api/roadmaps/:roadmapId/enrollment-status
 * @desc    Check if user is enrolled in roadmap
 * @access  Private
 */
router.get(
  '/roadmaps/:roadmapId/enrollment-status',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.checkEnrollmentStatus
)

/**
 * @route   GET /api/roadmaps/:roadmapId/enrollment
 * @desc    Get user's enrollment details for a roadmap
 * @access  Private
 */
router.get(
  '/roadmaps/:roadmapId/enrollment',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.getEnrollmentDetails
)

/**
 * @route   GET /api/users/:userId/enrollments
 * @desc    Get user's all enrollments
 * @access  Private (Self or Admin)
 */
router.get(
  '/users/:userId/enrollments',
  auth(),
  validate({
    params: idParamSchema,
    query: enrollmentQuerySchema
  }),
  enrollmentController.getUserEnrollments
)

/**
 * @route   PUT /api/roadmaps/:roadmapId/progress
 * @desc    Update enrollment progress manually
 * @access  Private
 */
router.put(
  '/roadmaps/:roadmapId/progress',
  auth(),
  validate({
    params: idParamSchema,
    body: updateProgressSchema
  }),
  enrollmentController.updateEnrollmentProgress
)

/**
 * @route   POST /api/roadmaps/:roadmapId/recalculate-progress
 * @desc    Recalculate enrollment progress based on lesson completions
 * @access  Private
 */
router.post(
  '/roadmaps/:roadmapId/recalculate-progress',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.recalculateProgress
)

/**
 * @route   GET /api/users/:userId/stats
 * @desc    Get user's learning statistics
 * @access  Private (Self or Admin)
 */
router.get('/users/:userId/stats', auth(), validate({ params: idParamSchema }), enrollmentController.getUserStats)

/**
 * @route   GET /api/enrollments/recent
 * @desc    Get recent enrollments (admin/analytics)
 * @access  Private (Admin)
 */
router.get('/enrollments/recent', auth(), authorize('admin'), enrollmentController.getRecentEnrollments)

/**
 * @route   GET /api/roadmaps/:roadmapId/completion-rate
 * @desc    Get enrollment completion rate for roadmap
 * @access  Public
 */
router.get(
  '/roadmaps/:roadmapId/completion-rate',
  validate({ params: idParamSchema }),
  enrollmentController.getRoadmapCompletionRate
)

/**
 * @route   GET /api/users/:userId/streak
 * @desc    Get user's learning streak
 * @access  Private (Self or Admin)
 */
router.get(
  '/users/:userId/streak',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.getUserLearningStreak
)

/**
 * @route   POST /api/roadmaps/:roadmapId/bulk-enroll
 * @desc    Bulk enroll users in roadmap (admin feature)
 * @access  Private (Admin)
 */
router.post(
  '/roadmaps/:roadmapId/bulk-enroll',
  auth(),
  authorize('admin'),
  validate({
    params: idParamSchema,
    body: bulkEnrollmentSchema
  }),
  enrollmentController.bulkEnrollUsers
)

export default router
