import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userType: 'guest',
    profileData: {
      userId: '',
      name: '',
      email: '',
      number: '',
      gender: '',
      flatNumber: '',
      pincode: '',
      street: '',
      city: '',
      state: '',
      profile_picture: {
        name: 'profile.jpeg',
        uri: '',
        type: 'image/jpeg',
      },
    },
    alert: [],
    otpStartTime: 0,
  },
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setAlert: (state, action) => {
      state.alert = action.payload;
    },
    setOtpStartTime: (state, action) => {
      state.otpStartTime = action.payload;
    },
  },
});

export const {setUserType, setAlert, setProfileData, setOtpStartTime} =
  authSlice.actions;
export default authSlice.reducer;
