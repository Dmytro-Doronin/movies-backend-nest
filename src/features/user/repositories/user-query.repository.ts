import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../domain/user.entity'
import { Model } from 'mongoose'
import { UserOutputMapper } from '../models/user-output.model'

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async getUserByLogin(login: string) {
    try {
      const user = await this.UserModel.findOne({ login }).lean()

      if (!user) {
        return null
      }
      return user
    } catch (e) {
      throw new Error('User was not found')
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.UserModel.findOne({ id: userId })

      if (!user) {
        return null
      }
      return UserOutputMapper(user)
    } catch (e) {
      throw new Error('User was not found')
    }
  }
}
