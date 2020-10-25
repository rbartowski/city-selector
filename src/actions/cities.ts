
import CitiesResponse from "../types/CitiesResponse";
import { Dispatch } from 'redux';
import { RootState } from "../types/RootState";

export const GET_CITIES_START = 'GET_CITIES_START';
export const GET_CITIES_SUCCESS = 'GET_CITIES_SUCCESS';
export const GET_MORE_CITIES_SUCCESS = 'GET_MORE_CITIES_SUCCESS';
export const GET_CITIES_ERROR = 'GET_CITIES_ERROR';
export const UPDATE_SEARCH_TEXT = 'UPDATE_SEARCH_TEXT';
export const CLEAN_CITIES = 'CLEAN_CITIES';

const API_URL = 'http://localhost:3030/cities';

const getCitiesStart = () => ({
  type: GET_CITIES_START
});

const getCitiesSuccess = (response: CitiesResponse, isAppend: boolean = false) => ({
  type: GET_CITIES_SUCCESS,
  response,
  isAppend
});

const getCitiesError = (error: Error) => ({
  type: GET_CITIES_ERROR,
  payload: {
    error
  }
});

export const cleanCities = () => ({
  type: CLEAN_CITIES
});

export const updateSearchText = (searchText: string) => ({
  type: UPDATE_SEARCH_TEXT,
  searchText
});

export const getFilteredCities = (searchText: string) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(updateSearchText(searchText));
    dispatch(getCities());
  };
};

export const getCities = (isGetMore: boolean = false) => {

  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { citiesState: { pagination }} = getState();
    let apiUrl = isGetMore ?
      pagination.next || API_URL :
      API_URL + `?offset=0&limit=${pagination.pageSize}&filter=${pagination.searchText}`;

    dispatch(getCitiesStart());

    try {
      const result = await fetch(apiUrl);
      const jsonRes = await result.json();

      dispatch(getCitiesSuccess(jsonRes, isGetMore));
    } catch (error) {
      dispatch(getCitiesError(error));
    }
  }
};