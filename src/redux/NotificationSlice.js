import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {print} from '../utilities/helperFunction';
import {url} from '../utilities/appApi';

export const notificationApi = createAsyncThunk(
  'notificationApi',
  async (_, {getState, dispatch}) => {
    try {
      const state = getState();
      const formData = new FormData();
      if (state?.auth?.profileData?.userId != '') {
        formData.append('userId', state?.auth?.profileData?.userId);
      }
      formData.append('context', 'all');
      if (state?.notification?.context == 'delete') {
        formData.append('msgId', state?.notification?.delId);
        formData.append('deleteMode', 'single');
      }
      formData.append('start', state.notification.allStart);

      print(formData, 'form');
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // get the response:
      const response = await fetch(url().notification, requestOptions);
      const resparse = await response.json();
      // print(resparse, 'resparse');
      return resparse;
    } catch (error) {
      console.log(error, 'error in notification');
    }
  },
);

export const notificationOtpApi = createAsyncThunk(
  'notificationOtpApi',
  async (_, {getState, dispatch}) => {
    try {
      const state = getState();
      const formData = new FormData();
      if (state?.auth?.profileData?.userId != '') {
        formData.append('userId', state?.auth?.profileData?.userId);
      }
      formData.append('context', 'otp');
      formData.append('start', state.notification.otpStart);
      if (state?.notification?.context == 'delete') {
        formData.append('msgId', state?.notification?.delId);
        formData.append('deleteMode', 'single');
      }
      print(formData, 'form data in OTP');
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // get the response:
      const response = await fetch(url().notification, requestOptions);
      const resparse = await response.json();
      return resparse;
    } catch (error) {
      console.log(error, 'error in notification');
    }
  },
);

const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState: {
    context: 'all',
    load: false,
    otpLoad: false,
    allNotification: {
      data: [],
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    },
    otpNotification: {
      data: [],
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    },
    allStart: 0,
    otpStart: 0,
    allRefresh: false,
    otpRefresh: false,
    notifeeDelModal: false,
  },
  reducers: {
    setAllNotification: (state, action) => {
      state.allNotification = action.payload;
    },
    setOtpNotification: (state, action) => {
      state.otpNotification = action.payload;
    },
    setAllRefresh: (state, action) => {
      state.allRefresh = action.payload;
    },
    setOtpRefresh: (state, action) => {
      state.otpRefresh = action.payload;
    },
    setAllStart: (state, action) => {
      state.allStart = action.payload;
    },
    setOtpStart: (state, action) => {
      state.otpStart = action.payload;
    },
    setLoad: (state, action) => {
      state.load = action.payload;
    },
    setNotifeeDelModal: (state, action) => {
      state.notifeeDelModal = action.payload;
    },
  },
  extraReducers: builder => {
    // all Notification
    builder.addCase(notificationApi.fulfilled, (state, action) => {
      if (
        state.allNotification &&
        state.allNotification.data &&
        action.payload.data != 'Empty Result'
      ) {
        state.allNotification = {
          data: state.allRefresh
            ? action.payload.data.all
            : [...state.allNotification.data, ...action.payload.data.all],
          start: Number(action.payload.start),
          limit: Number(action.payload.limit),
          totalPages: Number(action.payload.totalpages),
          page: state.allRefresh ? 1 : Number(state.allNotification.page + 1),
        };
      }
      state.load = false;
      state.allRefresh = false;
    });
    builder.addCase(notificationApi.pending, (state, action) => {
      if (state.allNotification.data.length == 0) {
        state.load = true;
      }
    });
    builder.addCase(notificationApi.rejected, (state, action) => {
      if (
        state.allNotification &&
        state.allNotification.data &&
        state.allNotification.data.length == 0
      ) {
        state.load = true;
      }
    });

    // Otp Notification
    builder.addCase(notificationOtpApi.fulfilled, (state, action) => {
      if (
        state.otpNotification &&
        state.otpNotification.data &&
        action.payload.data != 'Empty Result'
      ) {
        state.otpNotification = {
          data: state.otpRefresh
            ? action.payload.data.otp_notify
            : [
                ...state.otpNotification.data,
                ...action.payload.data.otp_notify,
              ],
          start: Number(action.payload.start),
          limit: Number(action.payload.limit),
          totalPages: Number(action.payload.totalpages),
          page: state.otpRefresh ? 1 : Number(state.otpNotification.page + 1),
        };
      }
      state.otpRefresh = false;
      state.otpLoad = false;
    });
    builder.addCase(notificationOtpApi.pending, (state, action) => {
      if (
        state.otpNotification &&
        state.otpNotification.data &&
        state.otpNotification.data.length == 0
      ) {
        state.otpLoad = true;
      }
    });
    builder.addCase(notificationOtpApi.rejected, (state, action) => {
      if (
        state.otpNotification &&
        state.otpNotification.data &&
        state.otpNotification.data.length == 0
      ) {
        state.otpLoad = true;
      }
    });
  },
});

export default notificationSlice.reducer;
export const {
  setLoad,
  setAllStart,
  setOtpStart,
  setAllNotification,
  setOtpNotification,
  setAllRefresh,
  setOtpRefresh,
  setNotifeeDelModal,
} = notificationSlice.actions;
