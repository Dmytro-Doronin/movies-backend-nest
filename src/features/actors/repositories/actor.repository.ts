import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Actor} from "../domain/actor.entity";
import {ChangeActorByIdTypes} from "../types/actor.types";

@Injectable()
export class ActorRepository {
    constructor(@InjectModel(Actor.name) private ActorModel: Model<Actor>) {}

    async createNewActor(newActor: Actor) {
        try {
            await this.ActorModel.create(newActor)
            const createdActor = await this.ActorModel
                .findOne({ id: newActor.id })

            if (!createdActor) {
                return null
            }
            return createdActor
        } catch (e) {
            console.error(e)
            throw new BadRequestException('Validation failed: ' + e.message)
        }
    }

    async changeActorById({ id, ...rest }: ChangeActorByIdTypes) {
        try {
            const updatedActor = await this.ActorModel.findOneAndUpdate(
                { id },
                { $set: rest },
                { new: true }
            )

            if (!updatedActor) return null

            return updatedActor
        } catch (e) {
            throw new Error('Movie was not changed by id')
        }
    }

    async deleteActorById(id: string) {
        try {
            const deletedActor = await this.ActorModel
                .findOneAndDelete({ id })

            if (!deletedActor) return null

            return deletedActor
        } catch (e) {
            console.error(e)
            throw new Error('Movie was not deleted')
        }
    }

}