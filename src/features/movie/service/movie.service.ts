import {Injectable} from "@nestjs/common";
import {MovieRepository} from "../repositories/movie.repository";
import {CreateMovieDto} from "../models/create-movie.dto";
import {MovieOutputModel, MovieOutputModelMapper} from "../models/movie-output.model";
import {Movie} from "../domain/movie.entity";
import { v4 as uuidv4 } from 'uuid';
import {ChangeMovieByIdTypes} from "../types/movie.types";

@Injectable()
export class MovieService {
    constructor(private readonly movieRepository: MovieRepository) {}


    async createMovieService({userId, ...rest} : CreateMovieDto & {userId: string}): Promise<MovieOutputModel | null>  {
        const user = '123'

        if(!user) {
            return null
        }
        const newMovie = Movie.create({id: uuidv4(), userId: userId, ...rest})

        const movie = await this.movieRepository.createNewMovie(newMovie)

        if (!movie) {
            return null
        }

        return MovieOutputModelMapper(movie)
    }

    async changeMovieByIdService ({id, ...rest} : ChangeMovieByIdTypes) {

        const updatedMovie = await this.movieRepository.changeMovieById({id, ...rest})

        if (!updatedMovie) {
            return null
        }

        return MovieOutputModelMapper(updatedMovie)
    }

    async deleteBlogByIdService(id: string) {

        const deletedMovie = await this.movieRepository.deleteMovieById(id)

        if (!deletedMovie) {
            return null
        }

        return MovieOutputModelMapper(deletedMovie)
    }
}