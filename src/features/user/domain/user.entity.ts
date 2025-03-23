import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { UserServiceModel } from '../models/user-output.model'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ type: String, required: true })
  id: string

  @Prop({ type: String, required: true })
  login: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, required: true })
  passwordHash: string

  @Prop({ type: String, required: true })
  passwordSalt: string

  @Prop({ required: false, default: null, type: String })
  imageUrl: string | null

  static create({ id, login, email, passwordHash, passwordSalt, imageUrl }: UserServiceModel) {
    const user = new User()
    user.id = id
    user.login = login
    user.email = email
    user.passwordHash = passwordHash
    user.passwordSalt = passwordSalt
    user.imageUrl = imageUrl ?? null

    return user
  }
}

export const UserSchema = SchemaFactory.createForClass(User)
