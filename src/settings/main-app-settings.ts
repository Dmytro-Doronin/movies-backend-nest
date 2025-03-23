import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { AppModule } from '../app.module'
import { HttpExceptionFilter } from '../common/exceptions/exception.filter'
const cookieParser = require('cookie-parser')
export const mainAppSettings = (app: INestApplication) => {
  app.use(cookieParser())

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: errors => {
        const errorsForResponse: any[] = []
        errors.forEach(err => {
          const keys = Object.keys(err.constraints!)
          keys.forEach(k => {
            errorsForResponse.push({
              message: err.constraints![k],
              field: err.property,
            })
          })
        })
        throw new BadRequestException(errorsForResponse)
      },
    })
  )

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
  app.useGlobalFilters(new HttpExceptionFilter())
}
