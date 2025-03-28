import {CreateActorDto} from "../models/create-actor.dto";

export type ChangeActorByIdTypes = CreateActorDto & { id: string }
