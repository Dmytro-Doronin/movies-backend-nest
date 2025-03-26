jest.mock('../../movie/models/movie-output.model', () => ({
    MovieOutputModelMapper: jest.fn(movie => ({
        ...movie,
        mapped: true,
    })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import {User} from "../domain/user.entity";
import {UserRepository} from "../repositories/user.repository";
import {UserQueryRepository} from "../repositories/user-query.repository";
import {MovieRepository} from "../../movie/repositories/movie.repository";
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';


jest.mock('bcryptjs');
jest.mock('uuid', () => ({
    v4: jest.fn(),
}));


const mockUserRepository = {
    createUser: jest.fn(),
    changeWishlist: jest.fn(),
    deleteMovieFromWishlist: jest.fn(),
};
const mockUserQueryRepository = {
    getUserById: jest.fn()
};
const mockMovieRepository = {
    getWishlist: jest.fn(),
};

describe('UserService', () => {
    let userService: UserService;
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findById: jest.fn(),
                        updateOne: jest.fn(),
                    },
                },
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: UserQueryRepository,
                    useValue: mockUserQueryRepository,
                },
                {
                    provide: MovieRepository,
                    useValue: mockMovieRepository,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userModel = module.get<Model<User>>(getModelToken(User.name));
    });



    describe('createUser', () => {
        it('should create user with hashed password and return mapped output', async () => {
            const dto = {
                login: 'test',
                email: 'test@example.com',
                password: 'password123',
            };

            const salt = 'random_salt';
            const hash = 'hashed_password';
            const userId = 'uuid-abc';

            (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hash);
            (uuidv4 as jest.Mock).mockReturnValue(userId);

            const mockUserEntity = {
                id: userId,
                login: dto.login,
                email: dto.email,
                passwordSalt: salt,
                passwordHash: hash,
                imageUrl: 'asd',
                wishlist: [],
            };

            mockUserRepository.createUser.mockResolvedValue(mockUserEntity);

            const result = await userService.createUser(dto);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, salt);
            expect(mockUserRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
                id: userId,
                login: dto.login,
                email: dto.email,
                passwordSalt: salt,
                passwordHash: hash,
            }));
            expect(result).toEqual({
                id: userId,
                login: dto.login,
                email: dto.email,
                imageUrl: 'asd',
                wishlist: [],
            });
        });
    });


    describe('addToWishlist', () => {
        it('should throw NotFoundException if user not found', async () => {
            mockUserRepository.changeWishlist.mockResolvedValue(null);

            await expect(userService.addToWishlist('user-id', 'movie-id')).rejects.toThrow(NotFoundException);
        });

        it('should do nothing if movie already in wishlist', async () => {
            const mockUser = {
                wishlist: [{ movieId: 'movie-id', order: 0 }],
            };

            mockUserQueryRepository.getUserById.mockResolvedValue(mockUser);

            const result = await userService.addToWishlist('user-id', 'movie-id');

            expect(userModel.updateOne).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('should add movie to wishlist with correct order', async () => {
            const mockUser = {
                wishlist: [{ movieId: 'movie-1', order: 0 }, { movieId: 'movie-2', order: 1 }],
            };

            mockUserQueryRepository.getUserById.mockResolvedValue(mockUser);

            await userService.addToWishlist('user-id', 'movie-3');

            expect(mockUserRepository.changeWishlist).toHaveBeenCalledWith(
                'user-id',
                [
                    ...mockUser.wishlist,
                    { movieId: 'movie-3', order: 2 },
                ]
            );
        });
    });


    describe('getWishlistWithMovies', () => {
        it('should throw NotFoundException if user not found', async () => {
            mockUserQueryRepository.getUserById.mockResolvedValue(null);

            await expect(userService.getWishlistWithMovies('user-1')).rejects.toThrow(NotFoundException);
        });

        it('should return wishlist with movies in correct order', async () => {
            const userId = 'user-1';

            const mockWishlist = [
                { movieId: 'm3', order: 2 },
                { movieId: 'm1', order: 0 },
                { movieId: 'm2', order: 1 },
            ];

            const mockMovies = [
                { id: 'm1', title: 'Movie 1' },
                { id: 'm2', title: 'Movie 2' },
                { id: 'm3', title: 'Movie 3' },
            ];

            mockUserQueryRepository.getUserById.mockResolvedValue({ wishlist: mockWishlist });
            mockMovieRepository.getWishlist.mockResolvedValue(mockMovies);

            const result = await userService.getWishlistWithMovies(userId);
            const ids = result
                .filter(item => item.movie)
                .map(item => item.movie!.id);

            expect(mockMovieRepository.getWishlist).toHaveBeenCalledWith(['m3', 'm1', 'm2']);

            expect(ids).toEqual(['m1', 'm2', 'm3']);
            expect(result.map(item => item.order)).toEqual([0, 1, 2]);

            expect(result[0].movie && 'mapped' in result[0].movie).toBe(true);
        });
    });


    describe('reorderWishlist', () => {
        it('should reorder wishlist and call changeWishlist with new order', async () => {
            const userId = 'user-123';
            const newOrder = ['m1', 'm2', 'm3'];

            const expectedReordered = [
                { movieId: 'm1', order: 0 },
                { movieId: 'm2', order: 1 },
                { movieId: 'm3', order: 2 },
            ];

            mockUserRepository.changeWishlist.mockResolvedValue({
                id: userId,
                wishlist: expectedReordered,
            });

            const result = await userService.reorderWishlist(userId, newOrder);

            expect(result).not.toBeNull();
            expect(mockUserRepository.changeWishlist).toHaveBeenCalledWith(userId, expectedReordered);
            expect(result!.id).toBe(userId);
        });
    });

    describe('deleteFromWishList', () => {
        const userId = 'user-1';
        const movieId = 'movie-123';

        it('should throw NotFoundException if user does not exist', async () => {
            mockUserQueryRepository.getUserById.mockResolvedValue(null);

            await expect(userService.deleteFromWishList(userId, movieId))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should call deleteMovieFromWishlist and return true if movie was deleted', async () => {
            mockUserQueryRepository.getUserById.mockResolvedValue({ id: userId });
            mockUserRepository.deleteMovieFromWishlist = jest.fn().mockResolvedValue(true);

            const result = await userService.deleteFromWishList(userId, movieId);

            expect(mockUserRepository.deleteMovieFromWishlist).toHaveBeenCalledWith(userId, movieId);
            expect(result).toBe(true);
        });

        it('should return false if movie was not in wishlist (nothing deleted)', async () => {
            mockUserQueryRepository.getUserById.mockResolvedValue({ id: userId });
            mockUserRepository.deleteMovieFromWishlist = jest.fn().mockResolvedValue(false);

            const result = await userService.deleteFromWishList(userId, movieId);

            expect(result).toBe(false);
        });
    });

});