import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../../user/service/user.service'
import { UserQueryRepository } from '../../user/repositories/user-query.repository'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import {TokenService} from "./token.service"
import {CustomJwtService} from "../../../common/jwt-module/service/jwt.service"

describe('AuthService', () => {
    let service: AuthService;

    const mockUser = {
        id: 'user-id',
        login: 'test',
        email: 'test@test.com',
        passwordHash: 'hashedPassword',
        passwordSalt: 'salt',
        imageUrl: 'test',
    };

    const mockUserService = {
        createUser: jest.fn(),
    }

    const mockUserQueryRepository = {
        getUserByLogin: jest.fn(),
        getUserById: jest.fn(),
    }

    const mockTokenService = {
        saveRefreshToken: jest.fn(),
        deleteRefreshToken: jest.fn(),
        validateRefreshToken: jest.fn(),
    }

    const mockJwtService = {
        createJWT: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: mockUserService },
                { provide: UserQueryRepository, useValue: mockUserQueryRepository },
                { provide: TokenService, useValue: mockTokenService },
                { provide: CustomJwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService)
    })

    afterEach(() => jest.clearAllMocks())

    describe('login', () => {
        it('should return tokens and save refresh token', async () => {
            mockJwtService.createJWT.mockResolvedValue({
                accessToken: 'access',
                refreshToken: 'refresh',
            });

            const result = await service.login(mockUser)

            expect(mockJwtService.createJWT).toHaveBeenCalledWith(mockUser)
            expect(mockTokenService.saveRefreshToken).toHaveBeenCalledWith(mockUser.id, 'refresh')
            expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' })
        })
    })

    describe('logout', () => {
        it('should call deleteRefreshToken', async () => {
            await service.logout('user-id');
            expect(mockTokenService.deleteRefreshToken).toHaveBeenCalledWith('user-id')
        })
    })

    describe('refresh', () => {
        it('should return new tokens if token is valid and user exists', async () => {
            mockTokenService.validateRefreshToken.mockResolvedValue(true)
            mockUserQueryRepository.getUserById.mockResolvedValue(mockUser)
            mockJwtService.createJWT.mockResolvedValue({
                accessToken: 'newAccess',
                refreshToken: 'newRefresh',
            })

            const result = await service.refresh('user-id', 'token')

            expect(mockJwtService.createJWT).toHaveBeenCalledWith(mockUser);
            expect(mockTokenService.saveRefreshToken).toHaveBeenCalledWith('user-id', 'newRefresh')
            expect(result).toEqual({ accessToken: 'newAccess', refreshToken: 'newRefresh' })
        })

        it('should throw if token is invalid', async () => {
            mockTokenService.validateRefreshToken.mockResolvedValue(false)

            await expect(service.refresh('user-id', 'token')).rejects.toThrow(UnauthorizedException)
        })

        it('should throw if user not found', async () => {
            mockTokenService.validateRefreshToken.mockResolvedValue(true)
            mockUserQueryRepository.getUserById.mockResolvedValue(null)

            await expect(service.refresh('user-id', 'token')).rejects.toThrow(UnauthorizedException);
        })
    })

    describe('registration', () => {
        it('should call createUser', async () => {
            const dto = { login: 'test', email: 'test@test.com', password: '123456' }
            mockUserService.createUser.mockResolvedValue({ ...mockUser, ...dto })

            const result = await service.registration(dto)
            expect(mockUserService.createUser).toHaveBeenCalledWith(dto)
            expect(result).toEqual({ ...mockUser, ...dto })
        })
    })

    describe('validateUser', () => {
        it('should return user if password is correct', async () => {
            mockUserQueryRepository.getUserByLogin.mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword')

            const result = await service.validateUser('test', '123456')
            expect(result).toEqual(mockUser)
        })

        it('should return null if user not found', async () => {
            mockUserQueryRepository.getUserByLogin.mockResolvedValue(null)

            const result = await service.validateUser('no-user', '123456')
            expect(result).toBeNull()
        })

        it('should return null if password is incorrect', async () => {
            mockUserQueryRepository.getUserByLogin.mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'wrong-hash')

            const result = await service.validateUser('test', 'wrong')
            expect(result).toBeNull()
        })
    })
})