import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const orderFromStorage = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : {};
const finalOrderFromStorage = localStorage.getItem('finalOrder') ? JSON.parse(localStorage.getItem('finalOrder')) : {};

const initialState = {
  loading: false,
  error: false,
  errorMsg: null,
  success: false,
  order: orderFromStorage,
  finalOrder: finalOrderFromStorage,
  orderPay: {},
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderCreateRequest: (state) => {
      state.loading = true;
    },
    orderCreateSuccess: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.order = payload;
    },
    orderCreateFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
    orderDetailsRequest: (state) => {
      state.loading = true;
    },
    orderDetailsSuccess: (state, { payload }) => {
      state.loading = false;
      state.finalOrder = payload;
    },
    orderDetailsFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.success = false;
    },
    orderPayRequest: (state) => {
      state.loading = true;
      state.success = false;
    },
    orderPaySuccess: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.orderPay = payload;
    },
    orderPayReset: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.errorMsg = null;
      state.orderPay = {};
    },
    orderPayFail: (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = true;
      state.errorMsg = payload;
      state.orderPay = {};
    },
  },
});

export const {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  orderPayRequest,
  orderPaySuccess,
  orderPayReset,
  orderPayFail,
} = orderSlice.actions;

export default orderSlice.reducer;

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch(orderCreateRequest());

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

    const { data } = await axios.post(`/api/orders`, order, config);

    dispatch(orderCreateSuccess(data));
    localStorage.setItem('order', JSON.stringify(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(orderCreateFail(msg));
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(orderDetailsRequest());

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

    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch(orderDetailsSuccess(data));
    localStorage.setItem('finalOrder', JSON.stringify(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(orderDetailsFail(msg));
  }
};

export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch(orderPayRequest());

    const {
      user: {
        userInfo: { token },
      },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);

    dispatch(orderPayReset());
    dispatch(orderPaySuccess(data));

    localStorage.setItem('finalOrder', JSON.stringify(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(orderPayFail(msg));
  }
};
