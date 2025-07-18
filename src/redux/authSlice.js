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
      weight: '',
      height: '',
      age: '',
      bmi: '',
      activity: '',
      bmr: '',
      tef: '',
      tdee: '',
      goal: '',
      mac_protein: '',
      mac_calories: '',
      mac_fats: '',
    },
    alert: [],
    otpStartTime: 0,
    userSkipOption: 0,
    // userLocation: {},
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
    setUserSkipOption: (state, action) => {
      state.userSkipOption = action.payload;
    },
    // setUserLocation: (state, action) => {
    //   state.userLocation = action.payload;
    // },
  },
});

export const {
  setUserType,
  setAlert,
  setProfileData,
  setOtpStartTime,
  setUserSkipOption,
  // setUserLocation,
} = authSlice.actions;
export default authSlice.reducer;
