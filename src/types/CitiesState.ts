import City from "./City";

export interface CitiesState {
  isLoading: boolean,
  isScrolling: boolean,
  error: Error | null,
  cities: City[],
  pagination: {
    total: number,
    next?: string,
    prev?: string,
    last: string,
    first: string,
    pageSize: number,
    currentPage: number,
    searchText: string,
  }
}