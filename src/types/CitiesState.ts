import City from "./City";
import { Pagination } from "./Pagination";

export interface CitiesState {
  isLoading: boolean,
  isLoadingSelected: boolean,
  citiesError: Error | null,
  preferredError: Error | null,
  updateError: Error | null,
  cities: City[],
  preferredCities: City[],
  pagination: Pagination
}