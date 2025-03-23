import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { Observable } from 'rxjs'
import { CustomJwtService } from '../service/jwt.service'

@Injectable()
export class VerifyRefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: CustomJwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const refreshTokenFromCookie = request.cookies.refreshToken

    if (!refreshTokenFromCookie) {
      return false
    }

    try {
      const decodedToken = this.jwtService.verifyRefreshToken(refreshTokenFromCookie)
      request.userId = decodedToken.sub
      request.deviceId = decodedToken.deviceId
      return true
    } catch (error) {
      return false
    }
  }
}
