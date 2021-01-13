import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const initialState = {
  loading: false,
  error: false,
  errorMsg: null,
  products: cartItemsFromStorage,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartOperationRequest: (state) => {
      state.loading = true;
    },
    cartAddItem: (state, { payload }) => {
      state.loading = false;
      state.products = payload;
    },
    cartRemoveItem: (state, { payload }) => {
      state.loading = false;
      state.products = payload;
    },
    cartOperationFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
  },
});

export const { cartAddItem, cartRemoveItem, cartOperationRequest, cartOperationFail } = cartSlice.actions;

export default cartSlice.reducer;

export const addToCart = (product) => async (dispatch, getState) => {
  const {
    cart: { products },
  } = getState();

  dispatch(cartOperationRequest());

  const existItem = products.find((p) => p.id === product.id);

  try {
    if (existItem) {
      const cartWithExistItems = products.map((p) => (p === existItem ? product : p));
      await dispatch(cartAddItem(cartWithExistItems));
      localStorage.setItem('cartItems', JSON.stringify(cartWithExistItems));
    } else {
      const tempCart = [...products];
      tempCart.push(product);
      await dispatch(cartAddItem(tempCart));
      localStorage.setItem('cartItems', JSON.stringify(tempCart));
    }
  } catch (err) {
    dispatch(cartOperationFail(err));
  }
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  const {
    cart: { products },
  } = getState();

  dispatch(cartOperationRequest());

  try {
    const filteredCart = products.filter((p) => p.id !== id);
    await dispatch(cartRemoveItem(filteredCart));
    localStorage.setItem('cartItems', JSON.stringify(filteredCart));
  } catch (err) {
    dispatch(cartOperationFail(err));
  }
};
