import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Movie } from '../domain/movie.entity'
import { Model } from 'mongoose'
import {
  MovieFinalOutputModel,
  MovieOutputModel,
  MovieOutputModelMapper,
} from '../models/movie-output.model'
import { QueryMovieInputModel } from '../types/movie.types'
import { sortFilter } from '../../../common/utils/sort-filter'

@Injectable()
export class MovieQueryRepository {
  constructor(@InjectModel(Movie.name) private MovieModel: Model<Movie>) {}

  async getAllMovies(
    sortData: QueryMovieInputModel,
    userId?: string
  ): Promise<MovieFinalOutputModel> {
    const searchNameTerm = sortData.searchNameTerm ?? null
    const sortBy = sortData.sortBy ?? 'createdAt'
    const sortDirection = sortData.sortDirection ?? 'desc'
    const pageNumber = sortData.pageNumber ?? 1
    const pageSize = sortData.pageSize ?? 10

    const filter: any = {
      ...(searchNameTerm && { name: { $regex: searchNameTerm, $options: 'i' } }),
      ...(userId && { userId }),
    }

    try {
      const movie = await this.MovieModel.find(filter)
        .sort(sortFilter(sortBy, sortDirection))
        .skip((+pageNumber - 1) * +pageSize)
        .limit(+pageSize)
        .lean()

      const totalCount = await this.MovieModel.countDocuments(filter)

      const pagesCount = Math.ceil(totalCount / +pageSize)

      return {
        pagesCount,
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount,
        items: movie.map(MovieOutputModelMapper),
      }
    } catch (e) {
      throw new Error('Movies was not found')
    }
  }

  async getMovieById(id: string): Promise<MovieOutputModel | null> {
    try {
      const movie = await this.MovieModel.findOne({ id: id })
      if (!movie) {
        return null
      }
      return MovieOutputModelMapper(movie)
    } catch (e) {
      throw new Error('Movie was not found')
    }
  }
}
