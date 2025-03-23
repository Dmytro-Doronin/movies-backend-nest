import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { CustomJwtService } from '../service/jwt.service'
import { RequestWithUserId } from './types'

@Injectable()
export class CustomAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: CustomJwtService) {}

  async use(req: RequestWithUserId, res: Response, next: NextFunction) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtService.getUserIdByToken(token)
      req.userId = userId || ''
    } else {
      req.userId = ''
    }

    next()
  }
}
