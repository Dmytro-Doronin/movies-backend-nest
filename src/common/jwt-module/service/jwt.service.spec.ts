import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import {CustomJwtService} from "./jwt.service";

describe('CustomJwtService', () => {
    let service: CustomJwtService;
    let jwtService: JwtService;

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const mockUser = {
        id: 'user-123',
        login: 'test',
        email: 'test@example.com',
        imageUrl: 'https://example.com/avatar.png',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomJwtService,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<CustomJwtService>(CustomJwtService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('createJWT', () => {
        it('should return access and refresh tokens', async () => {
            mockJwtService.sign
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');

            const result = await service.createJWT(mockUser, 'device-1');

            expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
            expect(result).toEqual({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            });

            expect(mockJwtService.sign).toHaveBeenCalledWith(
                { sub: mockUser.id, deviceId: 'device-1' },
                { expiresIn: '1h' },
            );

            expect(mockJwtService.sign).toHaveBeenCalledWith(
                { sub: mockUser.id, deviceId: 'device-1' },
                { expiresIn: '7d' },
            );
        });
    });

    describe('verifyRefreshToken', () => {
        it('should return payload if token is valid', () => {
            mockJwtService.verify.mockReturnValue({ sub: 'user-123' });

            const result = service.verifyRefreshToken('valid-token');
            expect(result).toEqual({ sub: 'user-123' });
        });

        it('should throw if token is invalid', () => {
            mockJwtService.verify.mockImplementation(() => {
                throw new Error('invalid');
            });

            expect(() => service.verifyRefreshToken('bad-token')).toThrow(UnauthorizedException);
        });
    });

    describe('getUserIdByToken', () => {
        it('should return userId from token', async () => {
            mockJwtService.verify.mockReturnValue({ sub: 'user-123' });

            const result = await service.getUserIdByToken('token');
            expect(result).toBe('user-123');
        });

        it('should return false if token is invalid', async () => {
            mockJwtService.verify.mockImplementation(() => {
                throw new Error('bad');
            });

            const result = await service.getUserIdByToken('bad-token');
            expect(result).toBe(false);
        });
    });
});