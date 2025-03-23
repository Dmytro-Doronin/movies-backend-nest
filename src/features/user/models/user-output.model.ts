import { UserDocument } from '../domain/user.entity'

export class UserOutputModel {
  id: string
  login: string
  email: string
  imageUrl: string | null
}

export class UserServiceModel {
  id: string
  login: string
  email: string
  passwordSalt: string
  passwordHash: string
  imageUrl: string | null
}

export const UserOutputMapper = (user: UserDocument): UserOutputModel => {
  const userOutputModel = new UserOutputModel()

  userOutputModel.id = user.id
  userOutputModel.login = user.login
  userOutputModel.email = user.email
  userOutputModel.imageUrl = user.imageUrl

  return userOutputModel
}

export const UserServiceMapper = (user: UserDocument): UserServiceModel => {
  const userServiceModel = new UserServiceModel()

  userServiceModel.id = user.id
  userServiceModel.login = user.login
  userServiceModel.email = user.email
  userServiceModel.passwordSalt = user.passwordSalt
  userServiceModel.passwordHash = user.passwordHash

  return userServiceModel
}
