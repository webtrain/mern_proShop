import { combineReducers } from 'redux';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';

const rootReducer = combineReducers({
  productList: productSlice,
  cart: cartSlice,
});

export default rootReducer;
