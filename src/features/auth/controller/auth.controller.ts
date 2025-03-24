import {
    Body,
    Controller,
    HttpCode,
    NotFoundException,
    Post,
    Request,
    Res,
    UseFilters,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {Response} from 'express';

import {AuthService} from "../service/auth.service";
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {UserDoesNotExistsFilter} from "../filter/global.filter";
import {AuthInputDto} from "../models/auth-input.dto";
import {VerifyRefreshTokenGuard} from "../../../common/jwt-module/guards/verify-token.guard";
import {UserQueryRepository} from "../../user/repositories/user-query.repository";

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userQueryRepository: UserQueryRepository,
    ) {}

    @UseFilters(UserDoesNotExistsFilter)
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(
        @Request() req,
        @Res() res: Response
    ) {
        const user = req.user

        const { accessToken, refreshToken } = await this.authService.createJWT(user)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.status(200).send({ accessToken });
    }

    @HttpCode(204)
    @Post('/registration')
    async registration (
        @Body(new ValidationPipe()) authInputDto: AuthInputDto,
    ) {
        await this.authService.registration({
            login: authInputDto.login,
            password: authInputDto.password,
            email: authInputDto.email
        })


    }

    @UseGuards(VerifyRefreshTokenGuard)
    @Post('/logout')
    async logout (
        @Res() res: Response,
    ) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.send(204);
    }

    @UseGuards(VerifyRefreshTokenGuard)
    @Post('/refresh-token')
    async refreshToken (
        @Request() req,
        @Res() res: Response,
    ) {
        const userId = req.userId;

        const user = await this.userQueryRepository.getUserById(userId)

        if (!user) {
            throw new NotFoundException('User data was not found')
        }

        const { accessToken, refreshToken } = await this.authService.createJWT(user)

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
        res.send({ accessToken });
    }
}
