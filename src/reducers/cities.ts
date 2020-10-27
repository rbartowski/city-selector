import {
  GET_CITIES_START,
  GET_CITIES_SUCCESS,
  GET_CITIES_ERROR,
  UPDATE_SEARCH_TEXT,
  UPDATE_PREFERRED_CITIES_START,
  UPDATE_PREFERRED_CITIES_SUCCESS,
  UPDATE_PREFERRED_CITIES_ERROR,
  GET_PREFERRED_CITIES_START,
  GET_PREFERRED_CITIES_SUCCESS,
  GET_PREFERRED_CITIES_ERROR
} from "../actions/cities";
import { CitiesState } from "../types/CitiesState";
import City from "../types/City";
import { createReducer } from '../types/Reducer';

const defaultState: CitiesState = {
  isLoading: false,
  isLoadingSelected: false,
  citiesError: null,
  preferredError: null,
  updateError: null,
  cities: [],
  preferredCities: [],
  pagination: {
    total: 0,
    pageSize: 10,
    currentPage: 0,
    first: '',
    last: '',
    searchText: ''
  }
};

export default createReducer<CitiesState>(defaultState, {
  [GET_CITIES_START]: state => ({
    ...state,
    isLoading: true,
    citiesError: null
  }),
  [GET_CITIES_SUCCESS]: (state, action) => {
    const { response: { data, links }, isGetMore } = action;
    return {
      ...state,
      isLoading: false,
      citiesError: null,
      isScrolling: isGetMore,
      cities: isGetMore ? [...state.cities, ...data] : [...data],
      pagination: {
        ...state.pagination,
        first: links.first,
        last: links.last,
        total: links.total,
        next: links.next,
        prev: links.prev,
        currentPage: isGetMore ? state.pagination.currentPage + 1 : 0
      }
    }
  },
  [GET_CITIES_ERROR]: (state, action) => ({
    ...state,
    isLoading: false,
    citiesError: action.error.message
  }),
  [GET_PREFERRED_CITIES_START]: state => ({
    ...state,
    isLoadingSelected: true,
    preferredError: null
  }),
  [GET_PREFERRED_CITIES_SUCCESS]: (state, action) => ({
    ...state,
    isLoadingSelected: false,
    preferredCities: [...action.preferredCities]
  }),
  [GET_PREFERRED_CITIES_ERROR]: (state, action) => ({
    ...state,
    isLoadingSelected: false,
    preferredError: action.error.message
  }),
  [UPDATE_SEARCH_TEXT]: (state, action) => ({
    ...state,
    pagination: {
      ...state.pagination,
      searchText: action.searchText
    }
  }),
  [UPDATE_PREFERRED_CITIES_START]: state => ({
    ...state,
    isLoading: true,
    updateError: null
  }),
  [UPDATE_PREFERRED_CITIES_SUCCESS]: (state, action) => {
    const newPreferred: City[] = action.preferredCities.filter((city: City) => city.selected);
    const toRemove: number[] = action.preferredCities.filter((city: City) => !city.selected)
                                                     .map((city: City) => city.geonameid);

    return {
      ...state,
      isLoading: false,
      preferredCities: [
        ...state.preferredCities.filter(city => !toRemove.includes(city.geonameid)),
        ...newPreferred]
    };
  },
  [UPDATE_PREFERRED_CITIES_ERROR]: (state, action) => ({
    ...state,
    isLoading: false,
    updateError: action.error.message,
    preferredCities: [...state.preferredCities]
  })
});