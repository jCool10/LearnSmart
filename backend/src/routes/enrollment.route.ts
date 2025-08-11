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
 * @swagger
 * /roadmaps/{roadmapId}/enroll:
 *   delete:
 *     summary: Unenroll user from roadmap
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: User unenrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - not enrolled
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
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/roadmaps/:roadmapId/enroll',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.unenrollUser
)

/**
 * @swagger
 * /roadmaps/{roadmapId}/enrollment-status:
 *   get:
 *     summary: Check if user is enrolled in roadmap
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Enrollment status retrieved successfully
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
 *                         isEnrolled:
 *                           type: boolean
 *                           example: true
 *                         enrollmentId:
 *                           type: string
 *                           nullable: true
 *                           example: 'enrollment-id-123'
 *       401:
 *         description: Unauthorized
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
router.get(
  '/roadmaps/:roadmapId/enrollment-status',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.checkEnrollmentStatus
)

/**
 * @swagger
 * /roadmaps/{roadmapId}/enrollment:
 *   get:
 *     summary: Get user's enrollment details for a roadmap
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Enrollment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/roadmaps/:roadmapId/enrollment',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.getEnrollmentDetails
)

/**
 * @swagger
 * /users/{userId}/enrollments:
 *   get:
 *     summary: Get user's all enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, all]
 *         description: Filter by enrollment status
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
 *         description: User enrollments retrieved successfully
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
 *                         $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not authorized to view this user's enrollments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /roadmaps/{roadmapId}/progress:
 *   put:
 *     summary: Update enrollment progress manually
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [progress]
 *             properties:
 *               progress:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 75.5
 *                 description: Progress percentage
 *     responses:
 *       200:
 *         description: Enrollment progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Bad request - invalid progress value
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
 *       404:
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /roadmaps/{roadmapId}/recalculate-progress:
 *   post:
 *     summary: Recalculate enrollment progress based on lesson completions
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Progress recalculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/roadmaps/:roadmapId/recalculate-progress',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.recalculateProgress
)

/**
 * @swagger
 * /users/{userId}/stats:
 *   get:
 *     summary: Get user's learning statistics
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
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
 *                           example: 5
 *                         completedRoadmaps:
 *                           type: integer
 *                           example: 2
 *                         totalLessonsCompleted:
 *                           type: integer
 *                           example: 45
 *                         averageProgress:
 *                           type: number
 *                           format: float
 *                           example: 65.4
 *                         learningStreak:
 *                           type: integer
 *                           example: 7
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not authorized to view this user's stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/users/:userId/stats', auth(), validate({ params: idParamSchema }), enrollmentController.getUserStats)

/**
 * @swagger
 * /enrollments/recent:
 *   get:
 *     summary: Get recent enrollments (admin/analytics)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent enrollments retrieved successfully
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
 *                         $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/enrollments/recent', auth(), authorize('admin'), enrollmentController.getRecentEnrollments)

/**
 * @swagger
 * /roadmaps/{roadmapId}/completion-rate:
 *   get:
 *     summary: Get enrollment completion rate for roadmap
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Completion rate retrieved successfully
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
 *                         completionRate:
 *                           type: number
 *                           format: float
 *                           example: 68.5
 *                         totalEnrollments:
 *                           type: integer
 *                           example: 150
 *                         completedEnrollments:
 *                           type: integer
 *                           example: 103
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/roadmaps/:roadmapId/completion-rate',
  validate({ params: idParamSchema }),
  enrollmentController.getRoadmapCompletionRate
)

/**
 * @swagger
 * /users/{userId}/streak:
 *   get:
 *     summary: Get user's learning streak
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Learning streak retrieved successfully
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
 *                         currentStreak:
 *                           type: integer
 *                           example: 7
 *                         longestStreak:
 *                           type: integer
 *                           example: 21
 *                         lastActivityDate:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not authorized to view this user's streak
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/users/:userId/streak',
  auth(),
  validate({ params: idParamSchema }),
  enrollmentController.getUserLearningStreak
)

/**
 * @swagger
 * /roadmaps/{roadmapId}/bulk-enroll:
 *   post:
 *     summary: Bulk enroll users in roadmap (admin feature)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userIds]
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user-id-1", "user-id-2", "user-id-3"]
 *                 description: Array of user IDs to enroll
 *     responses:
 *       200:
 *         description: Users enrolled successfully
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
 *                         successfulEnrollments:
 *                           type: integer
 *                           example: 3
 *                         failedEnrollments:
 *                           type: integer
 *                           example: 0
 *                         enrollments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Bad request - invalid user IDs
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
 *         description: Forbidden - admin access required
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
