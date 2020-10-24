import { Action } from 'redux';

export interface MyAction extends Action {
  [index: string]: any
}

export type ReducerHandler<S> = (state: S, action: MyAction) => S

export type HandlersMap<S> = {
  [action: string]: ReducerHandler<S>
}

export function createReducer<S>(initialState: S, handlers: HandlersMap<S>) {
  return function reducer(state: S = initialState, action: MyAction) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  }
}