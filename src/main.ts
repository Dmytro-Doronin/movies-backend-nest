import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { mainAppSettings } from './settings/main-app-settings'

async function bootstrap() {
  dotenv.config()

  const app = await NestFactory.create(AppModule)
  mainAppSettings(app)
  await app.listen(process.env.PORT ?? 3000)


}
bootstrap()
