import {
  Body,
  Controller,
  NotFoundException,
  Post,
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

  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(
  //     FileInterceptor('image', {
  //         fileFilter: imageFileFilter,
  //         limits: { fileSize: 5 * 1024 * 1024 },
  //     }),
  // )
  // // @HttpCode(204)
  // @Put()
  // async changeUser (
  //     @Body(new ValidationPipe()) changeUserDto: ChangeUserDto,
  //     @UploadedFile() file: Express.Multer.File,
  //     @Request() req,
  //     @Res() res: Response,
  // ) {
  //
  //     const userId = req.user.userId
  //
  //     const user = await this.userQueryRepository.getUserById(userId)
  //
  //     if (!user) {
  //         throw new NotFoundException('User was not found')
  //     }
  //
  //
  //     let imageUrl = user.imageUrl
  //
  //     if (file) {
  //         if (user.imageUrl) {
  //             let oldKey = user.imageUrl.split('.com/')[1];
  //             oldKey = decodeURIComponent(oldKey);
  //
  //             if (oldKey) {
  //                 try {
  //                     await this.s3Service.deleteFile(oldKey)
  //                 } catch (error) {
  //                     throw new InternalServerErrorException(
  //                         `Failed to delete old image with key: ${oldKey}. ${error.message}`)
  //                 }
  //             }
  //         }
  //
  //         if (file) {
  //             imageUrl = await this.s3Service.uploadFile(file, 'blogs');
  //         }
  //     }
  //
  //     const newUser = await this.userService.changeUserData(userId, changeUserDto.login, imageUrl)
  //
  //     if (!newUser) {
  //         throw new NotFoundException('User was not changed')
  //     }
  //
  //     return res.status(200).send(newUser)
  // }
  //
  //
  // // @UseGuards(BasicAuthGuard)
  // @UseGuards(JwtAuthGuard)
  // @HttpCode(204)
  // @Delete('/:id')
  // async deleteUserById (@Param('id') userId: string) {
  //     const result = await this.userService.deleteUserById(userId)
  //
  //     if (!result) {
  //         throw new NotFoundException('User was not deleted')
  //     }
  // }
}
