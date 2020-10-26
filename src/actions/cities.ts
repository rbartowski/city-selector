
import CitiesResponse from "../types/CitiesResponse";
import { Action, Dispatch } from 'redux';
import { RootState } from "../types/RootState";
import PreferredCitiesPatch from "../types/PreferredCitiesPatch";
import PreferredCities from "../types/PreferredCities";
import { ThunkDispatch } from "redux-thunk";

export const GET_CITIES_START = 'GET_CITIES_START';
export const GET_CITIES_SUCCESS = 'GET_CITIES_SUCCESS';
export const GET_CITIES_ERROR = 'GET_CITIES_ERROR';
export const GET_PREFERRED_CITIES_START = 'GET_PREFERRED_CITIES_START';
export const GET_PREFERRED_CITIES_SUCCESS = 'GET_PREFERRED_CITIES_SUCCESS';
export const GET_PREFERRED_CITIES_ERROR = 'GET_PREFERRED_CITIES_ERROR';
export const UPDATE_PREFERRED_CITIES_START = 'UPDATE_PREFERRED_CITIES_START';
export const UPDATE_PREFERRED_CITIES_SUCCESS = 'UPDATE_PREFERRED_CITIES_SUCCESS';
export const UPDATE_PREFERRED_CITIES_ERROR = 'UPDATE_PREFERRED_CITIES_ERROR';
export const UPDATE_SEARCH_TEXT = 'UPDATE_SEARCH_TEXT';

const API_URL = 'http://localhost:3030/cities';
const PREFERRED_API_URL = 'http://localhost:3030/preferences/cities';

const getCitiesStart = () => ({
  type: GET_CITIES_START
});

const getCitiesSuccess = (response: CitiesResponse, isGetMore: boolean = false) => ({
  type: GET_CITIES_SUCCESS,
  response,
  isGetMore
});

const getCitiesError = (error: Error) => ({
  type: GET_CITIES_ERROR,
  payload: {
    error
  }
});

const getPreferredCitiesStart = () => ({
  type: GET_PREFERRED_CITIES_START
});

const getPreferredCitiesSuccess = (preferredCities: PreferredCities) => ({
  type: GET_PREFERRED_CITIES_SUCCESS,
  preferredCities
});

const getPreferredCitiesError = (error: Error) => ({
  type: GET_PREFERRED_CITIES_ERROR,
  payload: {
    error
  }
});

const updatePreferredCitiesStart = () => ({
  type: UPDATE_PREFERRED_CITIES_START
});

const updatePreferredCitiesSuccess = (preferredCities: PreferredCitiesPatch) => ({
  type: UPDATE_PREFERRED_CITIES_SUCCESS,
  preferredCities
});

const updatePreferredCitiesError = (error: Error) => ({
  type: UPDATE_PREFERRED_CITIES_SUCCESS,
  error
});

export const updateSearchText = (searchText: string) => ({
  type: UPDATE_SEARCH_TEXT,
  searchText
});

export const getFilteredCities = (searchText: string) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(updateSearchText(searchText));
    dispatch(getCities(true));
  };
};

export const getCities = (showLoader: boolean = false, isGetMore: boolean = false) => {
  return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => RootState) => {
    const { citiesState: { pagination }} = getState();
    const apiUrl = isGetMore ?
      pagination.next || API_URL :
      API_URL + `?offset=0&limit=${pagination.pageSize}&filter=${pagination.searchText}`;

      dispatch(getCitiesStart());

    try {
      const result = await fetch(apiUrl);
      const jsonRes = await result.json();

      return dispatch(getCitiesSuccess(jsonRes, isGetMore));
    } catch (error) {
      return dispatch(getCitiesError(error));
    }
  }
};

export const getPreferredCities = (showLoader: boolean = false) => {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {

    dispatch(getPreferredCitiesStart());

    try {
      const result = await fetch(PREFERRED_API_URL);
      const jsonRes = await result.json();

      return dispatch(getPreferredCitiesSuccess(jsonRes));
    } catch(error) {
      return dispatch(getPreferredCitiesError(error));
    }
  };
};

export const updatePreferredCities = (preferredCities: PreferredCitiesPatch) => {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
    dispatch(updatePreferredCitiesStart());

    try {
      await fetch(PREFERRED_API_URL, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferredCities)
      });

      return dispatch(updatePreferredCitiesSuccess(preferredCities));
    } catch (error) {
      return dispatch(updatePreferredCitiesError(error));
    }
  };
};

export const getInitialData = () => {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
    await dispatch(getPreferredCities());
    await dispatch(getCities());
  }
};

