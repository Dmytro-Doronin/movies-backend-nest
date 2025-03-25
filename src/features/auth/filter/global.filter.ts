import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import {
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from '../exceptions/input-data.exceptions'

@Catch(UserAlreadyExistsException)
export class UserAlreadyExistsFilter implements ExceptionFilter {
  catch(exception: UserAlreadyExistsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(exception.getStatus()).json({
      errorsMessages: [
        {
          message: 'User with this email already exists',
          field: exception.message,
        },
      ],
    })
  }
}

@Catch(UserDoesNotExistsException)
export class UserDoesNotExistsFilter implements ExceptionFilter {
  catch(exception: UserDoesNotExistsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(exception.getStatus()).json({
      errorsMessages: [
        {
          message: 'User with this login does not exists',
          field: exception.message,
        },
      ],
    })
  }
}
