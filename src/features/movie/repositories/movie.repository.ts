import { BadRequestException, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Movie } from '../domain/movie.entity'
import { ChangeMovieByIdTypes } from '../types/movie.types'

@Injectable()
export class MovieRepository {
  constructor(@InjectModel(Movie.name) private MovieModel: Model<Movie>) {}

  async createNewMovie(newMovie: Movie) {
    try {
      await this.MovieModel.create(newMovie)
      const createdMovie = await this.MovieModel.findOne({ id: newMovie.id })

      if (!createdMovie) {
        return null
      }
      return createdMovie
    } catch (e) {
      console.error(e)
      throw new BadRequestException('Validation failed: ' + e.message)
    }
  }

  async changeMovieById({ id, ...rest }: ChangeMovieByIdTypes) {
    try {
      const updatedMovie = await this.MovieModel.findOneAndUpdate(
        { id },
        { $set: rest },
        { new: true }
      )

      if (!updatedMovie) return null

      return updatedMovie
    } catch (e) {
      throw new Error('Movie was not changed by id')
    }
  }

  async getWishlist(movieIds: string[]) {
    try {
      return await this.MovieModel.find({ id: { $in: movieIds } })
    } catch (e) {
      throw new Error('User was not found')
    }
  }

  async deleteMovieById(id: string) {
    try {
      const deletedMovie = await this.MovieModel.findOneAndDelete({ id })

      if (!deletedMovie) return null

      return deletedMovie
    } catch (e) {
      console.error(e)
      throw new Error('Movie was not deleted')
    }
  }
}
