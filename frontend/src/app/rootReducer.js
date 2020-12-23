import { combineReducers } from 'redux';
import appSlice from './slices/appSlice';

const rootReducer = combineReducers({
  app: appSlice,
});

export default rootReducer;
