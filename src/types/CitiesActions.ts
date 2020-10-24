import CitiesResponse from "./CitiesResponse";

export const GET_CITIES_START = 'GET_CITIES_START';
export const GET_CITIES_SUCCESS = 'GET_CITIES_SUCCESS';
export const GET_CITIES_ERROR = 'GET_CITIES_ERROR';

interface GetCitiesStartAction {
  type: typeof GET_CITIES_START
}

interface GetCitiesErrorAction {
  type: typeof GET_CITIES_ERROR,
  payload: Error
}

interface GetCitiesSuccessAction {
  type: typeof GET_CITIES_SUCCESS,
  payload: CitiesResponse
}

export type CitiesActionTypes = GetCitiesStartAction | GetCitiesErrorAction | GetCitiesSuccessAction;