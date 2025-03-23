import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {appSettings} from "./settings/app-settings";
import {MovieModule} from "./features/movie/movie.module";


@Module({
  imports: [
      MongooseModule.forRoot(appSettings.api.MONGO_URL),
      MovieModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
