import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { appSettings } from './settings/app-settings'
import { MovieModule } from './features/movie/movie.module'
import { AuthModule } from './features/auth/auth.module'
import { UserModule } from './features/user/user.module'
import {CustomAuthMiddleware} from "./common/jwt-module/middleware/custom-auth.middleware";
import {CustomJwtModule} from "./common/jwt-module/jwt.module";

@Module({
  imports: [MongooseModule.forRoot(appSettings.api.MONGO_URL), MovieModule, UserModule, AuthModule, CustomJwtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CustomAuthMiddleware)
            .forRoutes(
                { path: '/movies/:id', method: RequestMethod.DELETE },
                { path: '/movies/:id', method: RequestMethod.PUT },
            )
    }
}
