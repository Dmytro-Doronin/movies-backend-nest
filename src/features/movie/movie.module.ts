import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Movie, MovieSchema} from "./domain/movie.entity";
import {MovieController} from "./controller/movie.controller";
import {MovieService} from "./service/movie.service";
import {MovieRepository} from "./repositories/movie.repository";
import {MovieQueryRepository} from "./repositories/movies-query.repository";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ],
    providers:[MovieService, MovieRepository, MovieQueryRepository],
    controllers: [MovieController],
    exports: [MovieRepository],
})
export class MovieModule {}