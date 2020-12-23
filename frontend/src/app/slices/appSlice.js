import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appLoading: (state) => (state.loading = true),
  },
});

export const { appLoading } = appSlice.actions;

export default appSlice.reducer;
