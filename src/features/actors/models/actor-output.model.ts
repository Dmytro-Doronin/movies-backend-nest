import {ActorDocument} from "../domain/actor.entity";

export class ActorOutputModel {
    id: string
    name: string
    image: string | null
}

export class ActorFinalOutputModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ActorOutputModel[]
}

export const ActorOutputModelMapper = (actor: ActorDocument) => {
    const outputModel = new ActorOutputModel()
    outputModel.id = actor.id
    outputModel.name = actor.name
    outputModel.image = actor.image
    return outputModel
}