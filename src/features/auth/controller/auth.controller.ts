import {
    Body,
    Controller,
    HttpCode,
    NotFoundException,
    Post,
    Request,
    Res, UploadedFile,
    UseFilters,
    UseGuards, UseInterceptors,
    ValidationPipe,
} from '@nestjs/common'
import { Response } from 'express'

import { AuthService } from '../service/auth.service'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { UserDoesNotExistsFilter } from '../filter/global.filter'
import { AuthInputDto } from '../models/auth-input.dto'
import { VerifyRefreshTokenGuard } from '../../../common/jwt-module/guards/verify-token.guard'
import { UserQueryRepository } from '../../user/repositories/user-query.repository'
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";
import {CustomJwtService} from "../../../common/jwt-module/service/jwt.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {imageFileFilter} from "../../../common/utils/file-filter.utils";
import {S3Service} from "../../../common/services/s3.service";

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: CustomJwtService,
        private readonly s3Service: S3Service,

    ) {
    }



    @HttpCode(204)
    @Post('/registration')
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: imageFileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async registration(
        @UploadedFile() file: Express.Multer.File,
        @Body(new ValidationPipe()) authInputDto: AuthInputDto
    ) {

        let imageUrl: string | null = null;

        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'movies');
        }

        await this.authService.registration({
            login: authInputDto.login,
            password: authInputDto.password,
            email: authInputDto.email,
            imageUrl
        })
    }


    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Res() res: Response) {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.status(200).json({ accessToken });
    }

    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    async logout(@Request() req, @Res() res: Response) {
        await this.authService.logout(req.user.userId);
        res.clearCookie('refreshToken');
        res.sendStatus(204);
    }

    @UseGuards(VerifyRefreshTokenGuard)
    @Post('/refresh-token')
    async refresh(@Request() req, @Res() res: Response) {
        const refreshToken = req.user.refreshToken
        const userId = req.user.id;

        const { accessToken, refreshToken: newToken } = await this.authService.refresh(userId, refreshToken);

        res.cookie('refreshToken', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.status(200).json({ accessToken });
    }
}