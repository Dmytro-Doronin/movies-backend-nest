import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { getModelToken } from '@nestjs/mongoose';
import {RefreshTokenEntity} from "../domain/refresh-token.entity";
import {TokenRepository} from "../repository/token.repository";

describe('TokenService', () => {
    let service: TokenService;

    const mockTokenRepository = {
        saveRefreshToken: jest.fn(),
        deleteRefreshToken: jest.fn(),
        validateRefreshToken: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenService,
                {
                    provide: TokenRepository,
                    useValue: mockTokenRepository,
                },
                {
                    provide: getModelToken(RefreshTokenEntity.name),
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<TokenService>(TokenService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('saveRefreshToken', () => {
        it('should call tokenRepository.saveRefreshToken', async () => {
            await service.saveRefreshToken('user-1', 'refresh-token-abc');
            console.log('MOCK:', mockTokenRepository.saveRefreshToken);
            expect(mockTokenRepository.saveRefreshToken).toHaveBeenCalledWith('user-1', 'refresh-token-abc');
        });
    });

    describe('deleteRefreshToken', () => {
        it('should call tokenRepository.deleteRefreshToken', async () => {
            await service.deleteRefreshToken('user-1');

            expect(mockTokenRepository.deleteRefreshToken).toHaveBeenCalledWith('user-1');
        });
    });

    describe('validateRefreshToken', () => {
        it('should return true if token is valid', async () => {
            mockTokenRepository.validateRefreshToken.mockResolvedValue(true);

            const result = await service.validateRefreshToken('user-1', 'some-token');
            expect(result).toBe(true);
            expect(mockTokenRepository.validateRefreshToken).toHaveBeenCalledWith('user-1', 'some-token');
        });

        it('should return false if token is invalid', async () => {
            mockTokenRepository.validateRefreshToken.mockResolvedValue(false);

            const result = await service.validateRefreshToken('user-1', 'wrong-token');
            expect(result).toBe(false);
        });
    });
});
