import { Test, TestingModule } from '@nestjs/testing';
import { ActorService } from './actor.service';

import { v4 as uuidv4 } from 'uuid';
import {ActorRepository} from "../repositories/actor.repository";
import {ActorOutputModelMapper} from "../models/actor-output.model";

jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));

describe('ActorService', () => {
    let service: ActorService;
    let mockActorRepository: Record<string, jest.Mock>;

    beforeEach(async () => {
        mockActorRepository = {
            createNewActor: jest.fn(),
            changeActorById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActorService,
                { provide: ActorRepository, useValue: mockActorRepository },
            ],
        }).compile();

        service = module.get<ActorService>(ActorService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('createActorService', () => {
        it('should create a new actor and return output model', async () => {
            const dto = { name: 'John Smith', image: 'url.jpg' };

            const createdActor = { id: 'mock-uuid', ...dto };

            mockActorRepository.createNewActor.mockResolvedValue(createdActor);

            const result = await service.createActorService(dto);

            expect(mockActorRepository.createNewActor).toHaveBeenCalledWith({
                id: 'mock-uuid',
                ...dto,
            });

            expect(result).toEqual(createdActor);
        });

        it('should return null if actor creation fails', async () => {
            mockActorRepository.createNewActor.mockResolvedValue(null);

            const result = await service.createActorService({ name: 'Fail', image: null });

            expect(result).toBeNull();
        });
    });

    describe('changeActorByIdService', () => {
        it('should update actor and return output model', async () => {
            const input = { id: 'actor-id', name: 'Updated', image: 'new.jpg' };
            const updatedActor = { ...input };

            mockActorRepository.changeActorById.mockResolvedValue(updatedActor);

            const result = await service.changeActorByIdService(input);

            expect(mockActorRepository.changeActorById).toHaveBeenCalledWith(input);
            expect(result).toEqual(updatedActor);
        });

        it('should return null if update fails', async () => {
            mockActorRepository.changeActorById.mockResolvedValue(null);

            const result = await service.changeActorByIdService({
                id: 'actor-id',
                name: 'NoChange',
                image: null,
            });

            expect(result).toBeNull();
        });
    });
});