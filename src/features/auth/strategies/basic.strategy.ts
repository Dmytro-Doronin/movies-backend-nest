import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { BasicStrategy } from 'passport-http'
import { AuthService } from '../service/auth.service'

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
  constructor(private readonly authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const isValid = username === 'admin' && password === 'qwerty'
    // const isValid = await this.authService.validateUser(username, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return { username }
  }
}
