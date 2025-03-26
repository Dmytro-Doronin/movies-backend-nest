import { CreateMovieDto } from '../models/create-movie.dto'
import {Actor} from "../domain/actor.entity";

type SortDirection = 'asc' | 'desc'

export type QueryMovieInputModel = {
  searchNameTerm?: string
  sortBy?: string
  sortDirection?: SortDirection
  pageNumber?: string
  pageSize?: string
}

export type ChangeMovieByIdTypes = CreateMovieDto & { id: string }

export type MovieCreateInput = {
    id: string;
    userId: string;
    name: string;
    overview: string;
    image?: string;
    genres?: string[];
    rating?: number;
    releaseDate?: string;
    countries?: string[];
    status?: string;
    languages?: string[];
    budget?: string;
    revenue?: string;
    tagline?: string;
    companies?: string[];
    actors?: Actor[];
};