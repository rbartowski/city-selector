
import CitiesResponse from "../types/CitiesResponse";
import { Action } from 'redux';
import { RootState } from "../types/RootState";
import PreferredCitiesPatch from "../types/PreferredCitiesPatch";
import PreferredCities from "../types/PreferredCities";
import { ThunkDispatch } from "redux-thunk";
import City from "../types/City";
import {PATCH_SUCCESS_CODE, GET_SUCCESS_CODE, API_RETRY_ATTEMPTS, fetch_retry} from "../helpers/fetch-retry";

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
  error
});

const getPreferredCitiesStart = () => ({
  type: GET_PREFERRED_CITIES_START
});

const getPreferredCitiesSuccess = (preferredCities: City[]) => ({
  type: GET_PREFERRED_CITIES_SUCCESS,
  preferredCities
});

const getPreferredCitiesError = (error: Error) => ({
  type: GET_PREFERRED_CITIES_ERROR,
  error

});

const updatePreferredCitiesStart = () => ({
  type: UPDATE_PREFERRED_CITIES_START
});

const updatePreferredCitiesSuccess = (preferredCities: City[]) => ({
  type: UPDATE_PREFERRED_CITIES_SUCCESS,
  preferredCities
});

const updatePreferredCitiesError = (error: Error) => ({
  type: UPDATE_PREFERRED_CITIES_ERROR,
  error
});

export const updateSearchText = (searchText: string) => ({
  type: UPDATE_SEARCH_TEXT,
  searchText
});

export const getFilteredCities = (searchText: string) => {
  return (dispatch: ThunkDispatch<RootState, void, Action>) => {
    dispatch(updateSearchText(searchText));
    dispatch(getCities());
  };
};

export const getCities = (isGetMore: boolean = false) => {
  return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => RootState) => {
    const { citiesState: { pagination }} = getState();
    const apiUrl = isGetMore ?
      pagination.next || API_URL :
      API_URL + `?offset=0&limit=${pagination.pageSize}&filter=${pagination.searchText}`;

      dispatch(getCitiesStart());

    try {
      const result = await fetch_retry(apiUrl, {}, API_RETRY_ATTEMPTS);
      const jsonRes = await result.json();

      return dispatch(getCitiesSuccess(jsonRes, isGetMore));
    } catch (error) {
      return dispatch(getCitiesError(error));
    }
  }
};

const getCityDetails = async(id: number) => {
  try {
    const cityRes = await fetch_retry(`${API_URL}/${id}`, {}, API_RETRY_ATTEMPTS);

    if (cityRes.status !== GET_SUCCESS_CODE) {
      throw new Error('Bad response from server');
    }

    const cityJson = await cityRes.json();

    return cityJson;
  }
  catch(error) {
    throw error;
  }
}

export const getPreferredCities = () => {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {

    dispatch(getPreferredCitiesStart());

    try {
      const preferredCities: City[] = [];
      const result = await fetch_retry(PREFERRED_API_URL, {}, API_RETRY_ATTEMPTS);

      if (result.status !== GET_SUCCESS_CODE) {
        throw new Error('Bad response from server');
      }

      const jsonRes: PreferredCities = await result.json();

      if (!jsonRes.data.length) {
        return dispatch(getPreferredCitiesSuccess([]));
      }

      await Promise.all(jsonRes.data.map(async(cityId: number) => {
        try {
          const city = await getCityDetails(cityId);
          preferredCities.push(city);
        } catch(error) {
          throw error;
        }
      }));

      return dispatch(getPreferredCitiesSuccess(preferredCities));
    } catch(error) {
      return dispatch(getPreferredCitiesError(error));
    }
  };
};

export const updatePreferredCities = (preferredCities: City[]) => {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
    dispatch(updatePreferredCitiesStart());

    try {
      const ids: PreferredCitiesPatch = Object.assign({},
        ...preferredCities.map(({geonameid, selected}) => ({[geonameid]: selected})));

      const res = await fetch_retry(PREFERRED_API_URL, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
      }, API_RETRY_ATTEMPTS);

      if (res.status !== PATCH_SUCCESS_CODE) {
        throw new Error('Bad response from server');
      }

      return dispatch(updatePreferredCitiesSuccess(preferredCities));
    } catch(error) {
      return dispatch(updatePreferredCitiesError(error));
    }
  };
};

