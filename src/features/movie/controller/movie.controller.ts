import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { MovieService } from '../service/movie.service'
import { CreateMovieDto } from '../models/create-movie.dto'
import { QueryMovieInputModel } from '../../../types/common-types'
import { MovieQueryRepository } from '../repositories/movies-query.repository'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

@Controller('/movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly movieQueryRepository: MovieQueryRepository
  ) {}

  @Get()
  async getAllMoviesController(
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string
  ) {
    const sortData: QueryMovieInputModel = {
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    }

    return await this.movieQueryRepository.getAllMovies(sortData)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewBlogController(@Body(new ValidationPipe()) createMovieDto: CreateMovieDto) {
    const result = await this.movieService.createMovieService({
      userId: '123',
      ...createMovieDto,
    })

    if (!result) {
      throw new BadRequestException('Invalid input')
    }

    return result
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async changeBlogByIdController(
    @Body(new ValidationPipe()) createMovieDto: CreateMovieDto,
    @Param('id') movieId: string
  ) {
    const existingMovie = await this.movieQueryRepository.getMovieById(movieId)

    if (!existingMovie) {
      throw new NotFoundException('Movie not found')
    }

    const result = await this.movieService.changeMovieByIdService({
      id: movieId,
      ...createMovieDto,
    })

    if (!result) {
      throw new NotFoundException('Movie was not changed')
    }

    return result
  }

  @Get('/:id')
  async getMovieController(@Param('id') movieId: string) {
    const movie = await this.movieQueryRepository.getMovieById(movieId)

    if (!movie) {
      throw new NotFoundException('Movie not found')
    }

    return movie
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMovieController(@Param('id') movieId: string) {
    const movie = await this.movieService.deleteBlogByIdService(movieId)

    if (!movie) {
      throw new NotFoundException('Movie was not deleted')
    }

    return movie
  }
}
