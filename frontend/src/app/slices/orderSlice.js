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
  orderListMy: [],
  orders: [],
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
    orderListMyRequest: (state) => {
      state.loading = true;
      state.success = false;
    },
    orderListMySuccess: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.orderListMy = payload;
    },
    orderListMyReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.errorMsg = null;
      state.orderListMy = [];
    },
    orderListMyFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.orderListMy = [];
    },
    orderListRequest: (state) => {
      state.loading = true;
    },
    orderListSuccess: (state, { payload }) => {
      state.loading = false;
      state.orders = payload;
    },
    orderListFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.orders = [];
    },
    orderDeliverRequest: (state) => {
      state.loading = true;
    },
    orderDeliverSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    orderDeliverReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.errorMsg = null;
    },
    orderDeliverFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
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
  orderListMyRequest,
  orderListMySuccess,
  orderListMyReset,
  orderListMyFail,
  orderListRequest,
  orderListSuccess,
  orderListFail,
  orderDeliverRequest,
  orderDeliverSuccess,
  orderDeliverReset,
  orderDeliverFail,
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

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch(orderListMyRequest());

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

    const { data } = await axios.get(`/api/orders/myorders`, config);

    dispatch(orderListMySuccess(data));

    localStorage.setItem('finalOrder', JSON.stringify(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(orderListMyFail(msg));
  }
};

export const getOrders = () => async (dispatch, getState) => {
  try {
    dispatch(orderListRequest());

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

    const { data } = await axios.get(`/api/orders`, config);

    dispatch(orderListSuccess(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(orderListFail(msg));
  }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch(orderDeliverRequest());

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

    const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config);

    dispatch(orderDeliverReset());
    dispatch(orderDeliverSuccess(data));
  } catch (error) {
    const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch(orderDeliverFail(msg));
  }
};
