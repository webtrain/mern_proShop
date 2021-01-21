import { combineReducers } from 'redux';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';
import userSlice from './slices/userSlice';

const rootReducer = combineReducers({
  productList: productSlice,
  cart: cartSlice,
  user: userSlice,
});

export default rootReducer;
