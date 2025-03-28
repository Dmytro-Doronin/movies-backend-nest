import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {sortFilter} from "../../../common/utils/sort-filter";
import {Actor} from "../domain/actor.entity";
import {QueryInputModel} from "../../../types/common-types";
import {ActorFinalOutputModel, ActorOutputModel, ActorOutputModelMapper} from "../models/actor-output.model";

@Injectable()
export class ActorQueryRepository {
    constructor(@InjectModel(Actor.name) private ActorModel: Model<Actor>) {}

    async getAllActors(
        sortData: QueryInputModel,
    ): Promise<ActorFinalOutputModel> {
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const filter: any = {
            ...(searchNameTerm && { name: { $regex: searchNameTerm, $options: 'i' } }),
        }

        try {
            const movie = await this.ActorModel.find(filter)
                .sort(sortFilter(sortBy, sortDirection))
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .lean()

            const totalCount = await this.ActorModel.countDocuments(filter)

            const pagesCount = Math.ceil(totalCount / +pageSize)

            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: movie.map(ActorOutputModelMapper),
            }
        } catch (e) {
            throw new Error('Movies was not found')
        }
    }

    async getActorById(id: string): Promise<ActorOutputModel | null> {
        try {
            const actor = await this.ActorModel
                .findOne({ id: id })

            if (!actor) {
                return null
            }

            return ActorOutputModelMapper(actor)
        } catch (e) {
            throw new Error('Actor was not found')
        }
    }
}