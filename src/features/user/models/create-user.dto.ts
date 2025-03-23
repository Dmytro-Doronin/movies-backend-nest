import { IsEmail, IsString, Length } from 'class-validator'
import { Trim } from '../../../common/decorators/trim'

export class CreateUserDto {
  @Trim()
  @IsString()
  @Length(3, 10)
  readonly login: string

  @Trim()
  @IsString()
  @Length(6, 20)
  readonly password: string

  @Trim()
  @IsString()
  @Length(1)
  @IsEmail()
  readonly email: string
}
