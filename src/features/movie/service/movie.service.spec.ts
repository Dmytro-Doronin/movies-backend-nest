import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieRepository } from '../repositories/movie.repository';
import { UserQueryRepository } from '../../user/repositories/user-query.repository';
import { NotFoundException } from '@nestjs/common';

jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));
jest.mock('../models/movie-output.model', () => ({
    MovieOutputModelMapper: jest.fn(movie => ({ ...movie, mapped: true })),
}));

const mockMovieRepository = {
    createNewMovie: jest.fn(),
    changeMovieById: jest.fn(),
    deleteMovieById: jest.fn(),
};

const mockUserQueryRepository = {
    getUserById: jest.fn(),
};

describe('MovieService', () => {
    let movieService: MovieService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieService,
                { provide: MovieRepository, useValue: mockMovieRepository },
                { provide: UserQueryRepository, useValue: mockUserQueryRepository },
            ],
        }).compile();

        movieService = module.get<MovieService>(MovieService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('createMovieService', () => {
        it('should throw NotFoundException if user not found', async () => {
            mockUserQueryRepository.getUserById.mockResolvedValue(null);

            await expect(
                movieService.createMovieService({
                    userId: 'non-existent-user',
                    name: 'Movie',
                } as any),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return null if movie creation fails', async () => {
            mockUserQueryRepository.getUserById.mockResolvedValue({ id: 'user-1' });
            mockMovieRepository.createNewMovie.mockResolvedValue(null);

            const result = await movieService.createMovieService({
                userId: 'user-1',
                name: 'Movie',
            } as any);

            expect(result).toBeNull();
        });

        it('should return mapped movie on success', async () => {
            const movieData = { id: 'mock-uuid', userId: 'user-1', name: 'Test' };

            mockUserQueryRepository.getUserById.mockResolvedValue({ id: 'user-1' });
            mockMovieRepository.createNewMovie.mockResolvedValue(movieData);

            const result = await movieService.createMovieService({
                userId: 'user-1',
                name: 'Test',
            } as any);

            expect(mockUserQueryRepository.getUserById).toHaveBeenCalledWith('user-1');
            expect(mockMovieRepository.createNewMovie).toHaveBeenCalledWith(expect.objectContaining({
                id: 'mock-uuid',
                userId: 'user-1',
                name: 'Test',
            }));
            expect(result).toEqual({ ...movieData, mapped: true });
        });
    });

    describe('changeMovieByIdService', () => {
        it('should return mapped movie if updated', async () => {
            const movie = { id: '1', name: 'Updated' };
            mockMovieRepository.changeMovieById.mockResolvedValue(movie);

            const result = await movieService.changeMovieByIdService(movie as any);

            expect(result).toEqual({ ...movie, mapped: true });
        });

        it('should return null if update fails', async () => {
            mockMovieRepository.changeMovieById.mockResolvedValue(null);

            const result = await movieService.changeMovieByIdService({ id: '1' } as any);

            expect(result).toBeNull();
        });
    });

    describe('deleteBlogByIdService', () => {
        it('should return mapped movie if deleted', async () => {
            const movie = { id: '1', name: 'Deleted' };
            mockMovieRepository.deleteMovieById.mockResolvedValue(movie);

            const result = await movieService.deleteBlogByIdService('1');

            expect(result).toEqual({ ...movie, mapped: true });
        });

        it('should return null if delete fails', async () => {
            mockMovieRepository.deleteMovieById.mockResolvedValue(null);

            const result = await movieService.deleteBlogByIdService('1');

            expect(result).toBeNull();
        });
    });
});
