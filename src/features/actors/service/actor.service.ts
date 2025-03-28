import {Injectable} from "@nestjs/common";
import {v4 as uuidv4} from "uuid";
import {ActorRepository} from "../repositories/actor.repository";
import {ActorOutputModel, ActorOutputModelMapper} from "../models/actor-output.model";
import {CreateActorDto} from "../models/create-actor.dto";
import {ChangeActorByIdTypes} from "../types/actor.types";

@Injectable()
export class ActorService {
    constructor(
        private readonly actorRepository: ActorRepository,
    ) {}

    async createActorService({
         name,
         image
    }: CreateActorDto): Promise<ActorOutputModel | null> {

        const newActor = {
            id: uuidv4(),
            name,
            image,
        }

        const actor = await this.actorRepository.createNewActor(newActor)

        if (!actor) {
            return null
        }

        return ActorOutputModelMapper(actor)
    }

    async changeActorByIdService({ id, ...rest }: ChangeActorByIdTypes) {
        const updatedActor = await this.actorRepository.changeActorById({ id, ...rest })

        if (!updatedActor) {
            return null
        }

        return ActorOutputModelMapper(updatedActor)
    }
}