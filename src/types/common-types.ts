type SortDirection = 'asc' | 'desc'

export type QueryMovieInputModel = {
  searchNameTerm?: string
  sortBy?: string
  sortDirection?: SortDirection
  pageNumber?: string
  pageSize?: string
}

export type UserType = {
  id: string
  name: string
  email: string
  password: string
  imageUrl: string | null
}
