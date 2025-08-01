import { Router } from 'express'
import { HealthController } from '../controllers/health.controller'

const healthRouter = Router()
const healthController = new HealthController()

// Health check endpoints
healthRouter.get('/', healthController.getHealth)
healthRouter.get('/detailed', healthController.getDetailedHealth)

export { healthRouter }
