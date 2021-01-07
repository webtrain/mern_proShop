import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  errorMsg: null,
  products: [],
  productById: {},
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productListRequest: (state) => {
      state.loading = true;
    },
    productListSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.products = payload;
    },
    productByIdSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.productById = payload;
    },
    productsListFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
  },
});

export const { productListRequest, productListSuccess, productByIdSuccess, productsListFail } = productSlice.actions;

export default productSlice.reducer;

// Get all products from server
export const listProducts = () => async (dispatch) => {
  try {
    dispatch(productListRequest());
    const { data } = await axios.get('/api/products');
    dispatch(productListSuccess(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productsListFail(msg));
  }
};

// Get product by id
export const listProductById = (id) => async (dispatch) => {
  try {
    dispatch(productListRequest());
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch(productByIdSuccess(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productsListFail(msg));
  }
};
