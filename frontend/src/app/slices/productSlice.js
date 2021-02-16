import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  errorMsg: null,
  success: false,
  createdSuccess: false,
  reviewSuccess: false,
  products: [],
  topProducts: [],
  productById: {},
  pages: null,
  page: null
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
      state.products = payload.products;
      state.pages = payload.pages;
      state.page = payload.page;
    },
    productsListFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
    productByIdRequest: (state) => {
      state.loading = true;
    },
    productByIdSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.productById = payload;
    },
    productByIdFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },

    productDeleteRequest: (state) => {
      state.loading = true;
    },
    productDeleteSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    productDeleteReset: (state) => {
      state.success = false;
    },
    productDeleteFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
    productCreateRequest: (state) => {
      state.loading = true;
    },
    productCreateSuccess: (state, { payload }) => {
      state.loading = false;
      state.productById = payload;
      state.createdSuccess = true;
    },
    productCreateReset: (state) => {
      state.createdSuccess = false;
      state.productById = {};
    },
    productCreateFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.createdSuccess = false;
    },
    productEditRequest: (state) => {
      state.loading = true;
    },
    productEditSuccess: (state, { payload }) => {
      state.loading = false;
      state.productById = payload;
      state.success = true;
    },
    productEditReset: (state) => {
      state.success = false;
      state.productById = {};
    },
    productEditFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.success = false;
    },
    productCreateReviewRequest: (state) => {
      state.loading = true;
    },
    productCreateReviewSuccess: (state, { payload }) => {
      state.loading = false;
      state.reviewSuccess = true;
    },
    productCreateReviewReset: (state) => {
      state.reviewSuccess = false;
    },
    productCreateReviewFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.reviewSuccess = false;
    },
    productTopRequest: (state) => {
      state.loading = true;
      state.topProducts = [];
    },
    productTopSuccess: (state, { payload }) => {
      state.loading = false;
      state.topProducts = payload;
    },
    productTopFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.topProducts = [];
    },
  },
});

export const {
  productListRequest,
  productListSuccess,
  productsListFail,
  productByIdRequest,
  productByIdSuccess,
  productByIdFail,
  productDeleteRequest,
  productDeleteSuccess,
  productDeleteReset,
  productDeleteFail,
  productCreateRequest,
  productCreateSuccess,
  productCreateReset,
  productCreateFail,
  productEditRequest,
  productEditSuccess,
  productEditReset,
  productEditFail,
  productCreateReviewRequest,
  productCreateReviewSuccess,
  productCreateReviewReset,
  productCreateReviewFail,
  productTopRequest,
  productTopSuccess,
  productTopFail
} = productSlice.actions;

export default productSlice.reducer;

// Get all products from server
export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => {
  try {
    dispatch(productListRequest());
    const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);
    dispatch(productListSuccess(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productsListFail(msg));
  }
};

// Get product by id
export const listProductById = (id) => async (dispatch) => {
  try {
    dispatch(productByIdRequest());
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch(productByIdSuccess(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productsListFail(msg));
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch(productDeleteRequest());

    const {
      user: {
        userInfo: { token },
      },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`/api/products/${id}`, config);

    dispatch(productDeleteSuccess());
    dispatch(productDeleteReset());
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productDeleteFail(msg));
  }
};

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch(productCreateRequest());

    const {
      user: {
        userInfo: { token },
      },
    } = getState();

    const config = {
      headers: {
        // 'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`/api/products`, {}, config);

    dispatch(productCreateSuccess(data));
    dispatch(productCreateReset());
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productCreateFail(msg));
  }
};

export const editProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch(productEditRequest());
    
    const {
      user: {
        userInfo: { token },
      },
    } = getState();

    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`/api/products/${product._id}`, product, config);

    dispatch(productEditSuccess(data));
    dispatch(productEditReset());
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productEditFail(msg));
  }
};

export const createProductReview = (productId, review) => async (dispatch, getState) => {
  try {
    dispatch(productCreateReviewRequest());

    const {
      user: {
        userInfo: { token },
      },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.post(`/api/products/${productId}/reviews`, review, config);

    dispatch(productCreateReviewSuccess());
    dispatch(productCreateReviewReset());
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productCreateReviewFail(msg));
  }
};

export const getTopRatedProducts = () => async (dispatch, getState) => {
  try {
    dispatch(productTopRequest());

    

    const {data} = await axios.get(`/api/products/top`);

    dispatch(productTopSuccess(data));

  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(productTopFail(msg));
  }
};
