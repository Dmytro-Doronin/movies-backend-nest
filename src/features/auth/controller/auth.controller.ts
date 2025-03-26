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

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: CustomJwtService,
    ) {
    }

    // @UseFilters(UserDoesNotExistsFilter)
    // @UseGuards(LocalAuthGuard)
    // @Post('/login')
    // async login(@Request() req, @Res() res: Response) {
    //     const user = req.user
    //
    //     const {accessToken, refreshToken} = await this.authService.createJWT(user)
    //
    //     res.cookie('refreshToken', refreshToken, {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: 'none',
    //     })
    //     res.status(200).send({accessToken})
    // }

    @HttpCode(204)
    @Post('/registration')
    async registration(@Body(new ValidationPipe()) authInputDto: AuthInputDto) {
        await this.authService.registration({
            login: authInputDto.login,
            password: authInputDto.password,
            email: authInputDto.email,
        })
    }

    // @UseGuards(VerifyRefreshTokenGuard)
    // @Post('/logout')
    // async logout(@Res() res: Response) {
    //     res.clearCookie('refreshToken', {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: 'none',
    //     })
    //
    //     return res.sendStatus(204)
    // }

    // @UseGuards(VerifyRefreshTokenGuard)
    // @Post('/refresh-token')
    //
    // async refreshToken(@Request() req) {
    //     const user = await this.userQueryRepository.getUserById(req.userId)
    //     if (!user) throw new NotFoundException()
    //     const {accessToken, refreshToken} = await this.authService.createJWT(user)
    //     return {
    //         accessToken,
    //         refreshToken,
    //     }
    // }

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