import { combineReducers } from 'redux';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';
import userSlice from './slices/userSlice';
import orderSlice from './slices/orderSlice';

const rootReducer = combineReducers({
  productList: productSlice,
  cart: cartSlice,
  user: userSlice,
  order: orderSlice,
});

export default rootReducer;
