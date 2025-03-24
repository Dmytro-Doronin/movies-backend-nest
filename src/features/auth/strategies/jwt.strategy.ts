import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { jwtConstants } from '../../../common/constants/jwt-constants'
import { UserQueryRepository } from '../../user/repositories/user-query.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userQueryRepository: UserQueryRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: any) {
    const user = await this.userQueryRepository.getUserById(payload.sub)
    if (!user) {
      throw new UnauthorizedException()
    }
    return { userId: payload.sub }
  }
}
