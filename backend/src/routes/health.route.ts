import { Router } from 'express'
import { HealthController } from '../controllers/health.controller'

const healthRouter = Router()
const healthController = new HealthController()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Service is healthy"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "OK"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                       description: "Server uptime in seconds"
 */
// Health check endpoints
healthRouter.get('/', healthController.getHealth)

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check with system information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed service health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Detailed health check completed"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "OK"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                       description: "Server uptime in seconds"
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "connected"
 *                         responseTime:
 *                           type: number
 *                           description: "Database response time in ms"
 *                     memory:
 *                       type: object
 *                       properties:
 *                         used:
 *                           type: number
 *                           description: "Used memory in MB"
 *                         total:
 *                           type: number
 *                           description: "Total memory in MB"
 *                     cpu:
 *                       type: object
 *                       properties:
 *                         usage:
 *                           type: number
 *                           description: "CPU usage percentage"
 */
healthRouter.get('/detailed', healthController.getDetailedHealth)

export { healthRouter }
