import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './domain/user.entity'
import { UserController } from './controller/user.controller'
import { UserRepository } from './repositories/user.repository'
import { UserService } from './service/user.service'
import { UserQueryRepository } from './repositories/user-query.repository'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserRepository, UserService, UserQueryRepository],
  exports: [UserRepository, UserService, UserQueryRepository],
})
export class UserModule {}
