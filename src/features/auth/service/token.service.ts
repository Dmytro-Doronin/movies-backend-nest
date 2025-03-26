import { Injectable } from '@nestjs/common';
import {TokenRepository} from "../repository/token.repository";

@Injectable()
export class TokenService {
    constructor(
        private readonly tokenRepository: TokenRepository,
    ) {}

    async saveRefreshToken(userId: string, token: string) {
        return this.tokenRepository.saveRefreshToken(userId, token)
    }

    async deleteRefreshToken(userId: string) {
       return this.tokenRepository.deleteRefreshToken(userId)
    }

    async validateRefreshToken(userId: string, token: string) {
        return await this.tokenRepository.validateRefreshToken(userId, token)
    }
}