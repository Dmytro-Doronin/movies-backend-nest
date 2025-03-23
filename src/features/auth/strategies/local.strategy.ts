import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../service/auth.service'
import { UserDoesNotExistsException } from '../exceptions/input-data.exceptions'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' })
  }

  async validate(login: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(login, password)

    if (!user) {
      throw new UserDoesNotExistsException('Login')
    }
    return user
  }
}
