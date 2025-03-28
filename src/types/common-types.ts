type SortDirection = 'asc' | 'desc'

export type QueryInputModel = {
  searchNameTerm?: string
  sortBy?: string
  sortDirection?: SortDirection
  pageNumber?: string
  pageSize?: string
}

export type UserType = {
  id: string
  login: string
  email: string
  imageUrl: string | null
}
