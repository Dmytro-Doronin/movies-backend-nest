import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get, InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, Request, UploadedFile,
    UseGuards, UseInterceptors,
    ValidationPipe,
} from '@nestjs/common'
import { MovieService } from '../service/movie.service'
import { CreateMovieDto } from '../models/create-movie.dto'
import { QueryInputModel } from '../../../types/common-types'
import { MovieQueryRepository } from '../repositories/movies-query.repository'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import {FileInterceptor} from "@nestjs/platform-express";
import {imageFileFilter} from "../../../common/utils/file-filter.utils";
import {S3Service} from "../../../common/services/s3.service";

@Controller('/movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly movieQueryRepository: MovieQueryRepository,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  async getAllMoviesController(
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string
  ) {
    const sortData: QueryInputModel = {
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
  @UseInterceptors(
      FileInterceptor('image', {
          fileFilter: imageFileFilter,
          limits: { fileSize: 5 * 1024 * 1024 },
      }),
  )
  async createNewMovieController(
      @UploadedFile() file: Express.Multer.File,
      @Request() req,
      @Body(new ValidationPipe()) createMovieDto: CreateMovieDto
  ) {
    const user = req.user.userId
    let imageUrl: string | null = null;

      if (file) {
          imageUrl = await this.s3Service.uploadFile(file, 'movies');
      }

      const result = await this.movieService.createMovieService({
          userId: user,
          ...createMovieDto,
          image: imageUrl,
      });

    if (!result) {
      throw new BadRequestException('Invalid input')
    }

    return result
  }


  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @UseInterceptors(
      FileInterceptor('image', {
          fileFilter: imageFileFilter,
          limits: { fileSize: 5 * 1024 * 1024 },
      }),
  )
  async changeMovieByIdController(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) createMovieDto: CreateMovieDto,
    @Param('id') movieId: string
  ) {
    const existingMovie = await this.movieQueryRepository.getMovieById(movieId)

    if (!existingMovie) {
      throw new NotFoundException('Movie not found')
    }


    const imageUrl = await this.s3Service.replaceImage(file, existingMovie.image, 'movies');

    const result = await this.movieService.changeMovieByIdService({
      id: movieId,
      ...createMovieDto,
      image: imageUrl,
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

    if (movie.image) {
      await this.s3Service.deleteImageByUrl(movie.image);
    }

    return movie
  }
}
