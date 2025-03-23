import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../domain/user.entity'
import { Model } from 'mongoose'
import { UserServiceMapper } from '../models/user-output.model'

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async createUser(newUser: User) {
    try {
      await this.UserModel.create(newUser)
      const findUser = await this.UserModel.findOne({ id: newUser.id })

      if (!findUser) {
        return null
      }

      return findUser
    } catch (e) {
      console.log(e)
      throw new Error('User was not created')
    }
  }

  async getUserById(userId: string) {
    try {
      const res = await this.UserModel.findOne({ id: userId }).lean()

      return res
    } catch (e) {
      throw new Error('User was not found')
    }
  }

  async deleteUser(userId: string) {
    try {
      const res = await this.UserModel.deleteOne({ id: userId })

      return res.deletedCount === 1
    } catch (e) {
      throw new Error('User was not deleted')
    }
  }
}
