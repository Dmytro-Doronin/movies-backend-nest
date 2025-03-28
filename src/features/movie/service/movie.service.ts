import {Injectable, NotFoundException} from '@nestjs/common'
import { MovieRepository } from '../repositories/movie.repository'
import { CreateMovieDto } from '../models/create-movie.dto'
import { MovieOutputModel, MovieOutputModelMapper } from '../models/movie-output.model'
import { v4 as uuidv4 } from 'uuid'
import { ChangeMovieByIdTypes } from '../types/movie.types'
import {UserQueryRepository} from "../../user/repositories/user-query.repository";

@Injectable()
export class MovieService {
  constructor(
      private readonly movieRepository: MovieRepository,
      private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async createMovieService({
    userId,
    image,
    ...rest
  }: CreateMovieDto & { userId: string }): Promise<MovieOutputModel | null> {

  const user = await this.userQueryRepository.getUserById(userId)

    if (!user) {
        throw new NotFoundException('User not found')
    }
      const newMovie = {
          id: uuidv4(),
          image,
          userId,
          ...rest,
      }

    const movie = await this.movieRepository.createNewMovie(newMovie)

    if (!movie) {
      return null
    }

    return MovieOutputModelMapper(movie)
  }

  async changeMovieByIdService({ id, ...rest }: ChangeMovieByIdTypes) {
    const updatedMovie = await this.movieRepository.changeMovieById({ id, ...rest })

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
