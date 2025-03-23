import { CreateMovieDto } from '../models/create-movie.dto'

type SortDirection = 'asc' | 'desc'

export type QueryMovieInputModel = {
  searchNameTerm?: string
  sortBy?: string
  sortDirection?: SortDirection
  pageNumber?: string
  pageSize?: string
}

export type ChangeMovieByIdTypes = CreateMovieDto & { id: string }
