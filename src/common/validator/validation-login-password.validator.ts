import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { Inject } from '@nestjs/common'
import { UserQueryRepository } from '../../features/user/repositories/user-query.repository'

//registration in IoC
@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private userQueryRepository: UserQueryRepository) {}

  async validate(userName: any, args: ValidationArguments) {
    const userEmail = await this.userQueryRepository.getUserByLogin(userName)

    if (userEmail) {
      return false
    }

    return true
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    })
  }
}
