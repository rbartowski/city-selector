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
import { createReducer } from '../types/Reducer';

const defaultState: CitiesState = {
  isLoading: false,
  isScrolling: false,
  error: null,
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
    error: null
  }),
  [GET_CITIES_SUCCESS]: (state, action) => {
    const { response: { data, links }, isGetMore } = action;
    return {
      ...state,
      isLoading: false,
      error: null,
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
    error: action.payload
  }),
  [GET_PREFERRED_CITIES_START]: state => ({
    ...state,
    isLoading: true,
    error: null
  }),
  [GET_PREFERRED_CITIES_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    preferredCities: [...action.preferredCities.data]
  }),
  [GET_PREFERRED_CITIES_ERROR]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error
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
    error: null
  }),
  [UPDATE_PREFERRED_CITIES_SUCCESS]: (state, action) => {
    const newPreferred: number[] = Object.keys(action.preferredCities)
                                          .filter(id => action.preferredCities[id])
                                          .map(id => parseInt(id));

    const toRemove: number[] = Object.keys(action.preferredCities)
                                      .filter(id => !action.preferredCities[id])
                                      .map(id => parseInt(id));

    return {
      ...state,
      isLoading: false,
      preferredCities: [...state.preferredCities.filter(id => !toRemove.includes(id)), ...newPreferred]
    };
  },
  [UPDATE_PREFERRED_CITIES_ERROR]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error
  })
});