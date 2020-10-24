import City from "./City";

export interface CitiesState {
  isLoading: boolean,
  error: Error | null,
  cities: City[],
  pagination: {
    total: number,
    next?: string,
    prev?: string,
    last: string,
    first: string,
    pageSize: number,
    searchText: string
  }
}