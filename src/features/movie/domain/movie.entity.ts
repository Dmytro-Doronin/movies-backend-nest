import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Actor } from './actor.entity'
import { Type } from 'class-transformer'
import { MovieOutputModel } from '../models/movie-output.model'

export type MovieDocument = HydratedDocument<Movie>

@Schema()
export class Movie {
  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  overview: string

  @Prop({ required: true })
  userId: string

  @Prop({ required: false, default: null, type: String })
  image?: string | null

  @Prop({ required: false, default: null, type: [String] })
  genres?: string[] | null

  @Prop({ required: false, default: null, type: String })
  rating?: number | null

  @Prop({ required: false, default: null, type: String })
  releaseDate?: string | null

  @Prop({ required: false, default: null, type: [String] })
  countries?: string[] | null

  @Prop({ required: false, default: null, type: String })
  status?: string | null

  @Prop({ required: false, default: null, type: [String] })
  languages?: string[] | null

  @Prop({ required: false, default: null, type: String })
  budget?: string | null

  @Prop({ required: false, default: null, type: String })
  revenue?: string | null

  @Prop({ required: false, default: null, type: String })
  tagline?: string | null

  @Prop({ required: false, default: null, type: [String] })
  companies?: string[] | null

  @Prop({ required: false, default: null, type: [Object] })
  @Type(() => Actor)
  actors?: Actor[] | null

  static create({
    id,
    name,
    image,
    userId,
    genres,
    overview,
    rating,
    releaseDate,
    countries,
    status,
    languages,
    budget,
    revenue,
    tagline,
    companies,
    actors,
  }: MovieOutputModel) {
    const movie = new Movie()
    movie.id = id
    movie.name = name
    movie.overview = overview
    movie.userId = userId
    movie.image = image ?? null
    movie.genres = genres ?? null
    movie.rating = rating ?? null
    movie.releaseDate = releaseDate ?? null
    movie.countries = countries ?? null
    movie.status = status ?? null
    movie.languages = languages ?? null
    movie.budget = budget ?? null
    movie.revenue = revenue ?? null
    movie.tagline = tagline ?? null
    movie.companies = companies ?? null
    movie.actors = actors ?? null
    return movie
  }
}

export const MovieSchema = SchemaFactory.createForClass(Movie)
