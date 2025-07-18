import {createSlice} from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    statusTheme: 'light',
  },
  reducers: {
    setStatusTheme: (state, action) => {
      state.statusTheme = action.payload;
    },
  },
});

export const {setStatusTheme} = themeSlice.actions;
export default themeSlice.reducer;
