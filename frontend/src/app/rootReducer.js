import { combineReducers } from 'redux';
import productSlice from './slices/productSlice';

const rootReducer = combineReducers({
  productList: productSlice,
});

export default rootReducer;
