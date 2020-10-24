import { GET_CITIES_START, GET_CITIES_SUCCESS, GET_CITIES_ERROR, CitiesActionTypes } from "../types/CitiesActions";
import { CitiesState } from "../types/CitiesState";

const defaultState: CitiesState = {
  isLoading: false,
  error: null,
  cities: [],
};

const citiesReducer = (state = defaultState, action: CitiesActionTypes) => {

  switch (action.type) {
    case GET_CITIES_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case GET_CITIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload]
      }
    case GET_CITIES_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      return state;
  }

}

export default citiesReducer;