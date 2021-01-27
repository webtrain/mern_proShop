import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'

const orderFromStorage = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : {};

const initialState = {
  loading: false,
  error: false,
  errorMsg: null,
  success: false,
  order: orderFromStorage,
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
      state.success = false;
      state.error = true;
      state.errorMsg = payload;
    },
  },
});

export const { orderCreateRequest, orderCreateSuccess, orderCreateFail } = orderSlice.actions;

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
