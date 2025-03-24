import {
    Body,
    Controller,
    NotFoundException,
    Post, Put, Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common'
import { CreateUserDto } from '../models/create-user.dto'
import { UserService } from '../service/user.service'
import { UserQueryRepository } from '../repositories/user-query.repository'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

@Controller('/user')
export class UserController {
  userService: UserService

  constructor(
    userService: UserService,
    private userQueryRepository: UserQueryRepository
  ) {
    this.userService = userService
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      login: createUserDto.login,
      email: createUserDto.email,
      password: createUserDto.password,
    })

    if (!user) {
      throw new NotFoundException('User was not create')
    }

    return user
  }


    @UseGuards(JwtAuthGuard)
    @Put('wishlist')
    async addToWishlist(
        @Request() req,
        @Body() body: { movieId: string }
    ) {

        const result=  await this.userService.addToWishlist(req.user.id, body.movieId);

        if (!result){
            throw new NotFoundException('User was not changed')
        }

        return result
    }

    @UseGuards(JwtAuthGuard)
    @Put('wishlist/order')
    async reorderWishlist(
        @Request() req,
        @Body() body: { order: string[] }
    ) {

        const result= await this.userService.reorderWishlist(req.user.id, body.order);

        if (!result){
            throw new NotFoundException('User was not changed')
        }

        return result

    }
}
