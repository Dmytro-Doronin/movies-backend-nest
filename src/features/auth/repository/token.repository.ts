import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {RefreshTokenEntity} from "../domain/refresh-token.entity";

@Injectable()
export class TokenRepository {
    constructor(
        @InjectModel(RefreshTokenEntity.name)
        private readonly tokenModel: Model<RefreshTokenEntity>,
    ) {}


    async saveRefreshToken(userId: string, token: string) {
        try {
            const result = await this.tokenModel.updateOne(
                { userId },
                { token, createdAt: new Date() },
                { upsert: true },
            );

            return result.modifiedCount === 1;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async deleteRefreshToken(userId: string) {
        try {
            const result =  await this.tokenModel.deleteOne({ userId });
            console.log(result.deletedCount === 1)
            return result.deletedCount === 1;
        } catch (e) {
            throw new Error(e.message);
        }

    }

    async validateRefreshToken(userId: string, token: string) {
        try {
            const tokenEntry = await this.tokenModel.findOne({ userId });
            return tokenEntry?.token === token;
        } catch (e) {
            throw new Error(e.message);
        }

    }
}