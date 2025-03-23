import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '../constants/jwt-constants'
import { CustomJwtService } from './service/jwt.service'
import { VerifyRefreshTokenGuard } from './guards/verify-token.guard'
import { CustomAuthMiddleware } from './middleware/custom-auth.middleware'

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [],
  providers: [CustomJwtService, VerifyRefreshTokenGuard, CustomAuthMiddleware],
  exports: [CustomJwtService, VerifyRefreshTokenGuard, CustomAuthMiddleware],
})
export class CustomJwtModule {}
