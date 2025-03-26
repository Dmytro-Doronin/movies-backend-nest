import {Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {UserType} from '../../../types/common-types'

const { v4: uuidv4 } = require('uuid')

@Injectable()
// export class CustomJwtService {
//   constructor(private jwtService: JwtService) {}
//
//   async createJWT(user: UserType, deviceId: string = uuidv4()) {
//     const currentDate = new Date()
//     const accessTokenPayload = {
//       sub: user.id,
//       deviceId: deviceId,
//       expireDate: currentDate.getTime() + 20 * 1000,
//     }
//     const refreshTokenPayload = {
//       sub: user.id,
//       lastActiveDate: currentDate,
//       expireDate: new Date(currentDate.getTime() + 20 * 1000),
//       deviceId: deviceId,
//     }
//     return {
//       accessToken: this.jwtService.sign(accessTokenPayload),
//       refreshToken: this.jwtService.sign(refreshTokenPayload),
//     }
//   }
//   verifyRefreshToken(refreshToken: string) {
//       return this.jwtService.verify(refreshToken)
//   }
//
//   async getUserIdByToken(token: string) {
//     try {
//       const result: any = this.jwtService.verify(token)
//       return result.sub
//     } catch (e) {
//       return false
//     }
//   }
// }
export class CustomJwtService {
    constructor(private jwtService: JwtService) {}

    async createJWT(user: UserType, deviceId: string = uuidv4()) {
        const payloadBase = {
            sub: user.id,
            deviceId,
        };

        const accessToken = this.jwtService.sign(payloadBase, {
            expiresIn: '1h',
        });

        const refreshToken = this.jwtService.sign(payloadBase, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    verifyRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = this.jwtService.verify(token);
            return result.sub;
        } catch (e) {
            return false;
        }
    }
}

