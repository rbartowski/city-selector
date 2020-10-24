
import CitiesResponse from "../types/CitiesResponse";
import { GET_CITIES_START, GET_CITIES_SUCCESS, GET_CITIES_ERROR } from '../types/CitiesActions';
import { Dispatch } from 'redux';


const getCitiesStart = () => ({
  type: GET_CITIES_START
});

const getCitiesSuccess = (results: CitiesResponse) => ({
  type: GET_CITIES_SUCCESS,
  payload: {
    results
  }
});

const getCitiesError = (error: Error) => ({
  type: GET_CITIES_ERROR,
  payload: {
    error
  }
});

export const getCities = () => {

  return async (dispatch: Dispatch) => {
    //const { pagination } = getState();
    dispatch(getCitiesStart());

    try {
      const result = await fetch('http://localhost:3030/cities');
      const jsonRes = await result.json();

      dispatch(getCitiesSuccess(jsonRes.results));
    } catch (error) {
      dispatch(getCitiesError(error));
    }
  }
};