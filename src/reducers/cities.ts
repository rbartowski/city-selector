import {
  GET_CITIES_START,
  GET_CITIES_SUCCESS,
  GET_CITIES_ERROR,
  UPDATE_SEARCH_TEXT
} from "../actions/cities";
import { CitiesState } from "../types/CitiesState";
import { createReducer } from '../types/Reducer';

const defaultState: CitiesState = {
  isLoading: false,
  error: null,
  cities: [],
  pagination: {
    total: 0,
    pageSize: 10,
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
    const { response: { data, links }, isAppend } = action;
    return {
      ...state,
      isLoading: false,
      error: null,
      cities: isAppend ? [...state.cities, ...data] : [...data],
      pagination: {
        ...state.pagination,
        first: links.first,
        last: links.last,
        total: links.total,
        next: links.next,
        prev: links.prev
      }
    }
  },
  [GET_CITIES_ERROR]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload
  }),
  [UPDATE_SEARCH_TEXT]: (state, action) => ({
    ...state,
    pagination: {
      ...state.pagination,
      searchText: action.searchText
    }
  })
});