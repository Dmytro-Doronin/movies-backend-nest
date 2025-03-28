import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {MovieCreateInput} from "../../movie/types/movie.types";
import {HydratedDocument} from "mongoose";


export type ActorDocument = HydratedDocument<Actor>


export class
Actor {
  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: false, default: null, type: String })
  image: string | null


    static create({
      id,
      name,
      image,
    }: MovieCreateInput) {
        const actor = new Actor()
        actor.id = id
        actor.name = name
        actor.image = image ?? null
        return actor
    }
}

export const ActorSchema = SchemaFactory.createForClass(Actor)


