import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Movie, MovieSchema } from './domain/movie.entity'
import { MovieController } from './controller/movie.controller'
import { MovieService } from './service/movie.service'
import { MovieRepository } from './repositories/movie.repository'
import { MovieQueryRepository } from './repositories/movies-query.repository'
import {UserModule} from "../user/user.module";
import {S3Service} from "../../common/services/s3.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]), UserModule],
  providers: [MovieService, MovieRepository, MovieQueryRepository, S3Service],
  controllers: [MovieController],
  exports: [MovieRepository, S3Service],
})
export class MovieModule {}
