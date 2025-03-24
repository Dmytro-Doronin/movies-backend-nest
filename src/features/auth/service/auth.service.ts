import { Injectable } from '@nestjs/common'
import { UserService } from '../../user/service/user.service'
import * as bcrypt from 'bcryptjs'
import { add } from 'date-fns'
import { UserRepository } from '../../user/repositories/user.repository'
import { CustomJwtService } from '../../../common/jwt-module/service/jwt.service'
import { AuthInputDto } from '../models/auth-input.dto'
import { UserOutputModel, UserServiceModel } from '../../user/models/user-output.model'
import { UserQueryRepository } from '../../user/repositories/user-query.repository'
import { UserType } from '../../../types/common-types'
const { v4: uuidv4 } = require('uuid')

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userQueryRepository: UserQueryRepository,
    private jwtService: CustomJwtService,
    private userRepository: UserRepository
  ) {}

  async validateUser(login: string, password: string): Promise<UserServiceModel | null> {
    const user = await this.userQueryRepository.getUserByLogin(login)

    if (!user) return null

    const passwordHash = await this._generateHash(password, user.passwordSalt)

    if (user.passwordHash === passwordHash) {
      return user
    }

    return null
  }

  async createJWT(user: UserType) {
    const { refreshToken, accessToken } = await this.jwtService.createJWT(user)
    return {
      accessToken,
      refreshToken,
    }
  }

  async registration({ login, password, email }: AuthInputDto) {
    return await this.userService.createUser({ login, password, email })
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }
}
