import { createSelector } from "reselect";
import { RootState } from '../types/RootState';

const isLoading = (state: RootState) => state.citiesState.isLoading;
const isLoadingSelected = (state: RootState) => state.citiesState.isLoadingSelected;

export const isLoadingSelector = createSelector(
  isLoading,
  isLoadingSelected,
  (globalLoading, selectedLoading) => globalLoading || selectedLoading
);