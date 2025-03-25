import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../domain/user.entity'
import { Model } from 'mongoose'
import { wishlistType } from '../models/user-output.model'

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

  async changeWishlist(id: string, updatedWishlist: wishlistType[]) {
    try {
      return await this.UserModel.findOneAndUpdate(
        { id },
        { $set: { wishlist: updatedWishlist } },
        { new: true }
      )
    } catch (e) {
      throw new Error('User was not found')
    }
  }
}
