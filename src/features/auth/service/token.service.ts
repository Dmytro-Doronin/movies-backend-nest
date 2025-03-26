import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {RefreshTokenEntity} from "../domain/refresh-token.entity";
import {TokenRepository} from "../repository/token.repository";

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(RefreshTokenEntity.name)
        private readonly tokenModel: Model<RefreshTokenEntity>,
        private readonly tokenRepository: TokenRepository,
    ) {}

    async saveRefreshToken(userId: string, token: string) {
        return this.tokenRepository.saveRefreshToken(userId, token);
    }

    async deleteRefreshToken(userId: string) {
       return this.tokenRepository.deleteRefreshToken(userId)
    }

    async validateRefreshToken(userId: string, token: string) {
        return await this.tokenRepository.validateRefreshToken(userId, token);

    }
}