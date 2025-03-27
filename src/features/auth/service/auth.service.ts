import {Injectable, UnauthorizedException} from '@nestjs/common'
import { UserService } from '../../user/service/user.service'
import * as bcrypt from 'bcryptjs'
import { CustomJwtService } from '../../../common/jwt-module/service/jwt.service'
import { AuthInputDto } from '../models/auth-input.dto'
import { UserServiceModel } from '../../user/models/user-output.model'
import { UserQueryRepository } from '../../user/repositories/user-query.repository'
import { UserType } from '../../../types/common-types'
import {TokenService} from "./token.service";


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private userQueryRepository: UserQueryRepository,
        private jwtService: CustomJwtService,
        private readonly tokenService: TokenService,
    ) {}

    async login(user: UserType) {
        const { accessToken, refreshToken } = await this.createJWT(user);
        await this.tokenService.saveRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }

    async logout(userId: string) {
        await this.tokenService.deleteRefreshToken(userId);
    }

    async refresh(userId: string, token: string) {
        const isValid = await this.tokenService.validateRefreshToken(userId, token);

        if (!isValid) {
            throw new UnauthorizedException()
        }

        const user = await this.userQueryRepository.getUserById(userId);

        if (!user) {
            throw new UnauthorizedException()
        }

        const { accessToken, refreshToken } = await this.createJWT(user);
        await this.tokenService.saveRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
    }

    async createJWT(user: UserType) {
        const { refreshToken, accessToken } = await this.jwtService.createJWT(user);
        return { accessToken, refreshToken };
    }

    async registration({ login, password, email, imageUrl }: AuthInputDto & {imageUrl: string | null}) {
        return await this.userService.createUser({ login, password, email, imageUrl });
    }

    async validateUser(login: string, password: string): Promise<UserServiceModel | null> {
        const user = await this.userQueryRepository.getUserByLogin(login);
        if (!user) {
            return null
        }

        const passwordHash = await this._generateHash(password, user.passwordSalt);
        return user.passwordHash === passwordHash ? user : null;
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}