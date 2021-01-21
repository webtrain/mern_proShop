import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
  loading: false,
  loggedIn: false,
  error: false,
  errorMsg: null,
  userInfo: userInfoFromStorage,
  registeredUser: {},
  userDetails: {},
  userIsUpdated: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userLoginRequest: (state) => void (state.loading = true),
    userLoginSuccess: (state, { payload }) => {
      state.loading = false;
      state.loggedIn = true;
      state.userInfo = payload;
    },
    userLoginFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
    userLogout: (state) => {
      state.loading = false;
      state.loggedIn = false;
      state.error = false;
      state.errorMsg = null;
      state.userInfo = userInfoFromStorage;
      state.registeredUser = {};
      state.userDetails = {};
      state.userIsUpdated = false;
    },
    userRegisterRequest: (state) => void (state.loading = true),
    userRegisterSuccess: (state, { payload }) => {
      state.loading = false;
      state.registeredUser = payload;
    },
    userRegisterFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
    userDetailsRequest: (state) => void (state.loading = true),
    userDetailsSuccess: (state, { payload }) => {
      state.loading = false;
      state.userDetails = payload;
    },
    userDetailsFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
    userUpdateProfileRequest: (state) => void (state.loading = true),
    userUpdateProfileSuccess: (state, { payload }) => {
      state.loading = false;
      state.userIsUpdated = true;
      state.userInfo = payload;
    },
    userUpdateProfileReset: (state, { payload }) => {
      state.loading = false;
    },
    userUpdateProfileFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
  },
});

export const {
  userLoginRequest,
  userLoginSuccess,
  userLogout,
  userLoginFail,
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,
  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFail,
  userUpdateProfileRequest,
  userUpdateProfileSuccess,
  userUpdateProfileReset,
  userUpdateProfileFail,
} = userSlice.actions;

export default userSlice.reducer;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(userLoginRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post('/api/users/login', { email, password }, config);

    dispatch(userLoginSuccess(data));
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    const error = err.response && err.response.data.message ? err.response.data.message : err.message;
    dispatch(userLoginFail(error));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch(userLogout());
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch(userRegisterRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post('/api/users', { name, email, password }, config);

    dispatch(userRegisterSuccess(data));
    dispatch(userLoginSuccess(data));
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    const error = err.response && err.response.data.message ? err.response.data.message : err.message;
    dispatch(userRegisterFail(error));
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(userDetailsRequest());

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

    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch(userDetailsSuccess(data));
  } catch (err) {
    const error = err.response && err.response.data.message ? err.response.data.message : err.message;
    dispatch(userDetailsFail(error));
  }
};

export const userUpdateProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch(userUpdateProfileRequest());

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

    const { data } = await axios.put(`/api/users/profile`, user, config);

    dispatch(userUpdateProfileSuccess(data));
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    const error = err.response && err.response.data.message ? err.response.data.message : err.message;
    dispatch(userUpdateProfileFail(error));
  }
};
