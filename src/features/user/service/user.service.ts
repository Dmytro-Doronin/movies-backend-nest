import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../models/create-user.dto'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../domain/user.entity'
import { UserRepository } from '../repositories/user.repository'
import { UserOutputMapper, UserServiceMapper } from '../models/user-output.model'
import { add } from 'date-fns'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser({ login, password, email }: CreateUserDto) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser = User.create({
      id: uuidv4(),
      login,
      email,
      passwordSalt,
      passwordHash,
      imageUrl: 'asd',
    })

    const user = await this.userRepository.createUser(newUser)

    if (!user) {
      return null
    }

    return UserOutputMapper(user)
  }

  async deleteUserById(userId: string) {
    return await this.userRepository.deleteUser(userId)
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }
}
