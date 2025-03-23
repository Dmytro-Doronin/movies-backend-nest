import { HttpStatus, HttpException } from '@nestjs/common'

export class UserAlreadyExistsException extends HttpException {
  constructor(field: string) {
    super(
      {
        message: 'User with this email already exists',
        field: field,
      },
      HttpStatus.BAD_REQUEST
    )
  }
}

export class UserDoesNotExistsException extends HttpException {
  constructor(field: string) {
    super(
      {
        message: 'Invalid credentials',
        field: field,
      },
      HttpStatus.BAD_REQUEST
    )
  }
}
