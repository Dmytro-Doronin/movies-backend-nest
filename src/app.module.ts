import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { appSettings } from './settings/app-settings'
import { MovieModule } from './features/movie/movie.module'
import { AuthModule } from './features/auth/auth.module'
import { UserModule } from './features/user/user.module'

@Module({
  imports: [MongooseModule.forRoot(appSettings.api.MONGO_URL), MovieModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
