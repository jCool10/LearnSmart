import { Router } from 'express'
import { ProgressController } from '@/controllers/progress.controller'
import { auth, authorize } from '@/middlewares/auth.middleware'
import { validateJoi, commonJoiSchemas } from '@/middlewares/joi.validation.middleware'
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
  validateJoi({
    params: commonJoiSchemas.lessonIdParam,
    body: updateLessonProgressSchema
  }),
  progressController.updateLessonProgress
)

/**
 * @swagger
 * /lessons/{lessonId}/progress:
 *   get:
 *     summary: Get lesson progress for user
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LessonProgress'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lesson or progress not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/lessons/:lessonId/progress',
  auth(),
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.getLessonProgress
)

/**
 * @swagger
 * /roadmaps/{roadmapId}/progress:
 *   get:
 *     summary: Get all lesson progress for user in a roadmap
 *     tags: [Progress]
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
 *         description: User progress in roadmap retrieved successfully
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
 *                         $ref: '#/components/schemas/LessonProgress'
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
 *   delete:
 *     summary: Reset user progress in roadmap
 *     tags: [Progress]
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
 *         description: User progress reset successfully
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
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/roadmaps/:roadmapId/progress',
  auth(),
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.getUserProgressInRoadmap
)

/**
 * @swagger
 * /lessons/{lessonId}/complete:
 *   post:
 *     summary: Mark lesson as completed
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson marked as completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LessonProgress'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lesson not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/lessons/:lessonId/complete',
  auth(),
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.markLessonCompleted
)

/**
 * @swagger
 * /lessons/{lessonId}/incomplete:
 *   post:
 *     summary: Mark lesson as incomplete (reset progress)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson marked as incomplete successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LessonProgress'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lesson not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/lessons/:lessonId/incomplete',
  auth(),
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.markLessonIncomplete
)

/**
 * @swagger
 * /users/{userId}/learning-stats:
 *   get:
 *     summary: Get user's overall learning statistics
 *     tags: [Progress]
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
 *         description: User learning statistics retrieved successfully
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
 *                         totalLessonsCompleted:
 *                           type: integer
 *                           example: 127
 *                         totalTimeSpent:
 *                           type: integer
 *                           example: 3420
 *                           description: Total time spent in minutes
 *                         averageSessionTime:
 *                           type: number
 *                           format: float
 *                           example: 25.5
 *                         totalRoadmapsEnrolled:
 *                           type: integer
 *                           example: 8
 *                         completedRoadmaps:
 *                           type: integer
 *                           example: 3
 *                         currentStreak:
 *                           type: integer
 *                           example: 12
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
router.get(
  '/users/:userId/learning-stats',
  auth(),
  validateJoi({ params: commonJoiSchemas.userIdParam }),
  progressController.getUserOverallStats
)

/**
 * @swagger
 * /users/{userId}/recent-activity:
 *   get:
 *     summary: Get recent learning activity for user
 *     tags: [Progress]
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
 *         description: Recent activity retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 'activity-id-123'
 *                           type:
 *                             type: string
 *                             enum: [lesson_completed, lesson_started, roadmap_enrolled]
 *                             example: 'lesson_completed'
 *                           lessonId:
 *                             type: string
 *                             nullable: true
 *                             example: 'lesson-id-123'
 *                           roadmapId:
 *                             type: string
 *                             example: 'roadmap-id-123'
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not authorized to view this user's activity
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
  '/users/:userId/recent-activity',
  auth(),
  validateJoi({ params: commonJoiSchemas.userIdParam }),
  progressController.getRecentActivity
)

/**
 * @swagger
 * /roadmaps/{roadmapId}/lesson-completion-rates:
 *   get:
 *     summary: Get lesson completion rates for a roadmap
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: string
 *         description: Roadmap ID
 *     responses:
 *       200:
 *         description: Lesson completion rates retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           lessonId:
 *                             type: string
 *                             example: 'lesson-id-123'
 *                           title:
 *                             type: string
 *                             example: 'Introduction to React'
 *                           completionRate:
 *                             type: number
 *                             format: float
 *                             example: 78.5
 *                           totalEnrollments:
 *                             type: integer
 *                             example: 120
 *                           completions:
 *                             type: integer
 *                             example: 94
 *       404:
 *         description: Roadmap not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/roadmaps/:roadmapId/lesson-completion-rates',
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.getRoadmapLessonCompletionRates
)

/**
 * @swagger
 * /users/{userId}/learning-streak:
 *   get:
 *     summary: Get user's learning streak
 *     tags: [Progress]
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
  '/users/:userId/learning-streak',
  auth(),
  validateJoi({ params: commonJoiSchemas.userIdParam }),
  progressController.getUserLearningStreak
)

router.delete(
  '/roadmaps/:roadmapId/progress',
  auth(),
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.resetUserProgressInRoadmap
)

/**
 * @swagger
 * /lessons/{lessonId}/next:
 *   get:
 *     summary: Get next lesson for user in roadmap
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Current lesson ID
 *     responses:
 *       200:
 *         description: Next lesson retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lesson not found or no next lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/lessons/:lessonId/next',
  auth(),
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.getNextLesson
)

/**
 * @swagger
 * /lessons/{lessonId}/previous:
 *   get:
 *     summary: Get previous lesson for user in roadmap
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Current lesson ID
 *     responses:
 *       200:
 *         description: Previous lesson retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lesson not found or no previous lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/lessons/:lessonId/previous',
  auth(),
  validateJoi({ params: commonJoiSchemas.idParam }),
  progressController.getPreviousLesson
)

/**
 * @swagger
 * /progress/bulk-update:
 *   post:
 *     summary: Bulk update lesson progress (for admin/import features)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [updates]
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [userId, lessonId]
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 'user-id-123'
 *                     lessonId:
 *                       type: string
 *                       example: 'lesson-id-123'
 *                     completed:
 *                       type: boolean
 *                       example: true
 *                     timeSpent:
 *                       type: integer
 *                       example: 25
 *                       description: Time spent in minutes
 *     responses:
 *       200:
 *         description: Bulk progress update completed successfully
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
 *                         successfulUpdates:
 *                           type: integer
 *                           example: 45
 *                         failedUpdates:
 *                           type: integer
 *                           example: 2
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
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/progress/bulk-update',
  auth(),
  authorize('admin'),
  validateJoi({ body: bulkProgressUpdateSchema }),
  progressController.bulkUpdateProgress
)

export default router
