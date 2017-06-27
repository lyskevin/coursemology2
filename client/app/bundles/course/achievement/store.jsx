import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

export default ({ achievements }) => {
  const initialStates = achievements;
  const storeCreator = compose(
    applyMiddleware(thunkMiddleware)
  )(createStore);

  return storeCreator(rootReducer, initialStates);
};
