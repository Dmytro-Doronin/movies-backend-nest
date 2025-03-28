import {
    BadRequestException,
    Body,
    Controller,
    Get, NotFoundException, Param,
    Post, Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {QueryInputModel} from "../../../types/common-types";
import {ActorQueryRepository} from "../repositories/actor-query.repository";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {imageFileFilter} from "../../../common/utils/file-filter.utils";
import {S3Service} from "../../../common/services/s3.service";
import {ActorService} from "../service/actor.service";
import {CreateActorDto} from "../models/create-actor.dto";

@Controller('/actors')
export class ActorController {
    constructor(
        private readonly actorQueryRepository: ActorQueryRepository,
        private readonly actorService: ActorService,
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

        return await this.actorQueryRepository.getAllActors(sortData)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: imageFileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async createNewActorController(
        @UploadedFile() file: Express.Multer.File,
        @Body(new ValidationPipe()) createActorDto: CreateActorDto
    ) {
        let imageUrl: string | null = null;

        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'movies');
        }

        const result = await this.actorService.createActorService({
            ...createActorDto,
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
        @Body(new ValidationPipe()) createActorDto: CreateActorDto,
        @Param('id') actorId: string
    ) {
        const existingActor = await this.actorQueryRepository.getActorById(actorId)

        if (!existingActor) {
            throw new NotFoundException('Movie not found')
        }

        const imageUrl = await this.s3Service.replaceImage(file, existingActor.image, 'movies');

        const result = await this.actorService.changeActorByIdService({
            id: actorId,
            ...createActorDto,
            image: imageUrl,
        })

        if (!result) {
            throw new NotFoundException('Movie was not changed')
        }

        return result
    }
}