import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { LocalStrategy } from './strategies/local.strategy'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './strategies/jwt.strategy'
import { BasicAuthStrategy } from './strategies/basic.strategy'
import { BasicAuthGuard } from './guards/basic-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'

import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth-guard.guard'
import { AuthController } from './controller/auth.controller'
import { AuthService } from './service/auth.service'
import { CustomJwtModule } from '../../common/jwt-module/jwt.module'
import { IsUserAlreadyExistConstraint } from '../../common/validator/validation-login-password.validator'
import {MongooseModule} from "@nestjs/mongoose";
import {RefreshTokenEntity, RefreshTokenSchema} from "./domain/refresh-token.entity";
import {TokenRepository} from "./repository/token.repository";
import {TokenService} from "./service/token.service";

@Module({
  imports: [
      UserModule,
      PassportModule,
      CustomJwtModule,
      MongooseModule.forFeature([
          { name: RefreshTokenEntity.name, schema: RefreshTokenSchema }
      ]),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    BasicAuthStrategy,
    BasicAuthGuard,
    JwtAuthGuard,
    LocalAuthGuard,
    OptionalJwtAuthGuard,
    AuthService,
    IsUserAlreadyExistConstraint,
    TokenRepository,
    TokenService
  ],
  exports: [BasicAuthGuard, JwtAuthGuard, LocalAuthGuard, OptionalJwtAuthGuard, AuthService, TokenService],
})
export class AuthModule {}
