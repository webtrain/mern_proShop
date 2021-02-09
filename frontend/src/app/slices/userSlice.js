import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { orderListMyReset } from './orderSlice';

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
  users: [],
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
    userListRequest: (state) => void (state.loading = true),
    userListSuccess: (state, { payload }) => {
      state.loading = false;
      state.users = payload;
    },
    userListReset: (state) => {
      state.users = [];
    },
    userListFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
    },
    userDeleteRequest: (state) => void (state.loading = true),
    userDeleteSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    userDeleteFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.success = false;
    },
    userUpdateRequest: (state) => void (state.loading = true),
    userUpdateSuccess: (state, { payload }) => {
      state.loading = false;
      state.success = true;
    },
    userUpdateReset: (state) => {
      state.loading = false;
      state.error = false;
      state.errorMsg = null;
      state.success = false;
    },
    userUpdateFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = payload;
      state.success = false;
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
  userListRequest,
  userListSuccess,
  userListReset,
  userListFail,
  userDeleteRequest,
  userDeleteSuccess,
  userDeleteFail,
  userUpdateRequest,
  userUpdateSuccess,
  userUpdateReset,
  userUpdateFail
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
  dispatch(orderListMyReset());
  dispatch(userListReset());
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

    localStorage.setItem('userDetails', JSON.stringify(data));
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

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch(userListSuccess());

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

    const { data } = await axios.get(`/api/users`, config);

    dispatch(userListSuccess(data));

  } catch (err) {
    const error = err.response && err.response.data.message ? err.response.data.message : err.message;
    dispatch(userListFail(error));
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch(userDeleteRequest());

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

    await axios.delete(`/api/users/${id}`, config);

    dispatch(userDeleteSuccess());
  } catch (err) {
    const error = err.response && err.response.data.message ? err.response.data.message : err.message;
    dispatch(userDeleteFail(error));
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch(userUpdateRequest());

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

    const { data } = await axios.put(`/api/users/${user._id}`, user, config);

    dispatch(userUpdateSuccess());
    dispatch(userDetailsSuccess(data));

  } catch (err) {
    const error = err.response && err.response.data.message ? err.response.data.message : err.message;
    dispatch(userUpdateFail(error));
  }
};