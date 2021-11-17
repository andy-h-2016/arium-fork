import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from '../reducers/root_reducer';
import axios from 'axios';

const getGit = store => next => action => {
  axios
    .get('/version')
    .then(res => console.log(res))
  next(action);
}

const configureStore = (preloadedState = {}) => (
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk)
    // applyMiddleware(thunk, logger)
  )
);

export default configureStore;