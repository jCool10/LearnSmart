import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { checkDatabaseHealth } from '../configs/database.config'
import catchAsync from '../utils/catchAsync'
import { ResponseHandler } from '../cores/response.handler'
import { HealthCheckDto } from '@/types/dto.types'
import { configs } from '@/configs'

export class HealthController {
  getHealth = catchAsync(async (req: Request, res: Response) => {
    const healthData: HealthCheckDto = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: configs.app.env,
      version: configs.app.version
    }

    ResponseHandler.success(res, {
      message: 'Service is healthy',
      data: healthData
    })
  })

  getDetailedHealth = catchAsync(async (req: Request, res: Response) => {
    const startTime = Date.now()
    const isDatabaseHealthy = await checkDatabaseHealth()
    const dbResponseTime = Date.now() - startTime

    const memoryUsage = process.memoryUsage()
    const memoryUsedMB = Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100
    const memoryTotalMB = Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100
    const memoryPercentage = Math.round((memoryUsedMB / memoryTotalMB) * 100)

    const healthData: HealthCheckDto = {
      status: isDatabaseHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: configs.app.env,
      version: configs.app.version,
      database: {
        status: isDatabaseHealthy ? 'connected' : 'disconnected',
        responseTime: dbResponseTime
      },
      memory: {
        used: memoryUsedMB,
        total: memoryTotalMB,
        percentage: memoryPercentage
      }
    }

    const statusCode = isDatabaseHealthy ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE
    const message = isDatabaseHealthy ? 'All services are healthy' : 'Some services are unavailable'

    ResponseHandler.success(res, {
      message,
      data: healthData,
      statusCode
    })
  })
}
