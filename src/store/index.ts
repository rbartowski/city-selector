import { create } from 'domain';
import { applyMiddleware, compose, createStore } from 'redux';
import reducers from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export default createStore(reducers, composeWithDevTools(
  applyMiddleware()
));