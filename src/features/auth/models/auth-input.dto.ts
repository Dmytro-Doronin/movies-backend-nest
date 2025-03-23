import { IsEmail, IsString, IsUrl, Length, MaxLength, MinLength } from 'class-validator'

import { Trim } from '../../../common/decorators/trim'
import { IsUserAlreadyExist } from '../../../common/validator/validation-login-password.validator'

export class AuthInputDto {
  @Trim()
  @IsString()
  @Length(3, 10)
  @IsUserAlreadyExist({
    message: 'User already exists. Choose another name.',
  })
  readonly login: string

  @Trim()
  @IsString()
  @Length(6, 20)
  readonly password: string

  @Trim()
  @IsString()
  @Length(1, 100)
  @IsEmail()
  @IsUserAlreadyExist({
    message: 'Email already exists. Choose another email.',
  })
  readonly email: string
}

export class AccessTokenDto {
  @Trim()
  @IsString()
  @Length(1)
  readonly accessToken: string
}
