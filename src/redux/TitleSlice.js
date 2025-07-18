import {createSlice} from '@reduxjs/toolkit';

const TitleSlice = createSlice({
  name: 'title',
  initialState: {
    title: '',
    altTitle: '',
    termsPage: false,
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setAltTitle: (state, action) => {
      state.altTitle = action.payload;
    },
    setTermsPage: (state, action) => {
      state.termsPage = action.payload;
    },
  },
});

export const {setTitle, setAltTitle, setTermsPage} = TitleSlice.actions;
export default TitleSlice.reducer;
