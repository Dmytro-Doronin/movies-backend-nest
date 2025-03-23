
type SortDirection = 'asc' | 'desc'

export type QueryMovieInputModel = {
    searchNameTerm? : string
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: string
    pageSize?: string
}