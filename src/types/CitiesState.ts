import City from "./City";
import { Pagination } from "./Pagination";

export interface CitiesState {
  isLoading: boolean,
  isLoadingSelected: boolean,
  error: Error | null,
  cities: City[],
  preferredCities: number[],
  pagination: Pagination
}