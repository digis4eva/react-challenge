import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import forecast from './reducers/forecast';

const config = process.env.NODE_ENV;

const getStore = () =>
  createStore(
    combineReducers({
      forecast,
    }),
    applyMiddleware(thunk),
    config === 'development' ? applyMiddleware(logger) : null,
  );

export default getStore;
