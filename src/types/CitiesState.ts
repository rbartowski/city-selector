import City from "./City";

export interface CitiesState {
  isLoading: boolean,
  error: Error | null,
  cities: City[]
}