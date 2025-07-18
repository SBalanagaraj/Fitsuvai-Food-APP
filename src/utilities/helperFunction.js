import {
  Dimensions,
  StatusBar,
  View,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import moment from 'moment';
import {setFcmToken, userSettingApi} from '../redux/SettingSlice';
import messaging from '@react-native-firebase/messaging';
import appColors from './appColors';

//Android FIles

const {width} = Dimensions.get('screen');

export const scrnWidth = Dimensions.get('screen').width;
export const scrnHeight = Dimensions.get('screen').height;
export const bottom_Height = scrnWidth < 500 ? 60 : 70;
export const widthResponse = scrnWidth < 500 ? true : false;

export const print = (data, str) => {
  console.log(JSON.stringify(data, undefined, 2), str);
};

export const objectLength = (obj = {}) => {
  return Object.keys(obj).length > 0;
};

export const arrayLength = (array = []) => {
  return array.length > 0;
};

// first letter caps:
export const Capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fontScalling = size => {
  if (size > 0) {
    return width > 500
      ? responsiveFontSize(size - 0.8)
      : responsiveFontSize(size);
  }
};

//format -> January
export const getsMonth = date => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const d = new Date(date);
  return monthNames[d.getMonth()];
};

export function currencyConvertor(number, fraction = 0) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      minimumFractionDigits: fraction,
      currency: 'INR',
    }).format(number);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return '₹ ' + number.toFixed(2);
  }
}

export const arrayHPosition = (array = [], targetValue = 0) => {
  const closestValue = array.reduce((prev, curr) =>
    Math.abs(curr - targetValue) < Math.abs(prev - targetValue) ? curr : prev,
  );

  // Convert numbers to strings and mark the closest value
  const resultArray = array.map(value => {
    if (value === closestValue) {
      return 'H'; // Mark the closest value to the target
    } else {
      return String(value); // Convert other numbers to strings
    }
  });

  // Insert 'Score' at the beginning of the array
  resultArray.unshift('Score');

  return resultArray;
};

//format -> 04-oktober-2024
export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {year: 'numeric', month: 'short', day: 'numeric'};
  return date.toLocaleDateString('en-IN', options); // 'nl-NL' is the code for Dutch (Netherlands)
}

//format -> 04/03/24
export function formatedDate(dateString) {
  const date = new Date(dateString);
  const dates = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const year = String(date.getFullYear()).slice(2);
  return `${dates}/${month}/${year}`;
}

//format -> 24-01-24
export function formatedDates(dateString) {
  const date = new Date(dateString);
  const dates = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const year = String(date.getFullYear());
  return `${year}-${month}-${dates}`;
}

// Convert time format from "10:00:00" to "10:00"
export function convertTimeFormat(inputTime) {
  // Split the input time string by space to separate time and "uur"
  const [time] = inputTime.split(' ');

  // Split the time string by colon to extract hours and minutes
  const [hours, minutes, sec] = time.split(':');

  // Format the hours and minutes
  const formattedHours = parseInt(hours, 10).toString().padStart(2, '0');
  const formattedMinutes = parseInt(minutes, 10).toString().padStart(2, '0');

  // Concatenate the formatted hours and minutes
  const formattedTime = `${formattedHours}:${formattedMinutes}`;

  return formattedTime;
}

export const diffTime = (then, now) => {
  const duration = 301000; // 5minutes in ms
  const ms =
    duration -
    moment(now, 'MM/DD/YYYY HH:mm:ss').diff(
      moment(then, 'MM/DD/YYYY HH:mm:ss'),
    );
  const minutes = moment.utc(ms).format('m');
  const seconds = moment.utc(ms).format('ss');
  return {minutes: minutes, seconds: seconds};
};

export const destructureDate = (dt, type) => {
  const date = dt.split(type);
  const formateDate =
    date[2].trim() + '-' + date[1].trim() + '-' + date[0].trim();
  return formateDate;
};

export function convertTo24HourFormat(timeString) {
  // const [time, period] = timeString.trim().split(' ');
  const time = timeString.slice(0, 8).trim();
  const period = timeString.slice(8).trim();
  const [hour, minute, sec] = time.split(':');
  let formattedHour = parseInt(hour);

  if (period.toLowerCase() === 'pm' && formattedHour != '12') {
    formattedHour += 12;
  }

  return `${formattedHour}:${minute}:${sec}`;
}

export const TabReset = (navigation, deletePage = true) => {
  navigation.reset({
    index: 0,
    routes: [{name: 'home'}],
  });
  navigation.reset({
    index: 1,
    routes: [{name: 'cart'}],
  });
  navigation.reset({
    index: 2,
    routes: [{name: 'menu'}],
  });
  navigation.reset({
    index: 3,
    routes: [{name: 'order'}],
  });
  if (deletePage) {
    navigation.reset({
      index: 4,
      routes: [{name: 'profile'}],
    });
  }
};

export function cleanTimeString(timeStr) {
  // Remove extra spaces from the string
  if (timeStr && timeStr.length > 0) {
    return timeStr.trim().replace(/\s+/g, ' ');
  } else {
    ('');
  } // Ensures single space between components
}

export function isValidTimeFormat(timeStr) {
  // Regex to validate HH:MM AM/PM format
  if (timeStr) {
    const timeRegex = /^(0?[1-9]|1[0-2])[:.][0-5][0-9]\s?(AM|PM)$/i;
    return timeRegex.test(timeStr.trim());
  }
}

export function convertToMinutes(timeStr) {
  // Split time into hours, minutes, and period (AM/PM)
  const [time, period] = timeStr.toUpperCase().split(' ');
  const [hours, minutes] = time
    .split(time.includes(':') ? ':' : '.')
    .map(Number);

  // Convert hours to 24-hour format
  let totalMinutes = (hours % 12) * 60 + minutes; // `% 12` handles 12 AM and PM
  if (period === 'PM') {
    totalMinutes += 12 * 60; // Add 12 hours for PM
  }

  return totalMinutes;
}

export function isTimeInRange(time, startTime, endTime) {
  if (!isValidTimeFormat(time)) {
    return 'Invalid time format. Use HH:MM AM/PM.';
  }

  // Convert all times to minutes
  const inputMinutes = convertToMinutes(time);
  const startMinutes = convertToMinutes(startTime);
  const endMinutes = convertToMinutes(endTime);

  // Check if the input time is within the range
  if (inputMinutes >= startMinutes && inputMinutes <= endMinutes) {
    return true;
  } else {
    return `Time is out of the range choose BTWN ${startTime} - ${endTime}.`;
  }
}

export const requestPermissions = async (type, fn = () => {}) => {
  let types =
    type == 'storage'
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : type == 'camera'
      ? PERMISSIONS.ANDROID.CAMERA
      : null;
  const req = await request(types);
  print(types, 'types');
  print(req, 'req');
  const status =
    type == 'storage' && req == 'unavailable'
      ? await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      : req;
  console.log(status, type, 'status');
  if (status == 'granted') {
    fn();
  } else if (status == 'blocked') {
    Alert.alert(
      'Permission Required',
      `${type} permission is required. Please enable it in the app settings.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  }
  return status;
};

export const checkNotificationPermission = (
  dispatch,
  setTriggerFcmToken = () => {},
) => {
  const checkPermission = async () => {
    await messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled != -1) {
          registerRemoteMessage();
        } else {
          requestUserPermission();
        }
      })
      .catch(error => {
        console.log('error checking permisions ' + error);
      });
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      registerRemoteMessage();
    } else {
      console.log('auth failed');
    }
  }

  const registerRemoteMessage = async () => {
    try {
      const registered = messaging().isDeviceRegisteredForRemoteMessages;

      if (registered) {
        getFCMToken();
      } else {
        await messaging()
          .registerDeviceForRemoteMessages()
          .then(value => {
            if (value) {
              getFCMToken();
            }
          });
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  const getFCMToken = async () => {
    try {
      await messaging()
        .getToken()
        .then(token => {
          dispatch(setFcmToken(token));
          dispatch(userSettingApi());
        })
        .catch(error => {
          console.log(error, 'error');
          // setTriggerFcmToken(pre => pre + 1);
        });
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  checkPermission();
};

export function bmiBasedValues(bmi) {
  let bmiCategory = '';
  let bmiColor = '';
  if (bmi < 18.5) {
    bmiCategory = 'Under weight';
    bmiColor = '#43bbd9';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    bmiCategory = 'healthy Weight';
    bmiColor = '#06a23a';
  } else if (bmi >= 25 && bmi <= 29.9) {
    bmiCategory = 'Over weight';
    bmiColor = '#f4a045';
  } else {
    bmiCategory = 'Obese Weight';
    bmiColor = '#e51313';
  }
  return {bmiCategory, bmiColor};
}

// Convert time format from "10:00:00" to "10:00: Am"
export function convert12HrTimeFormat(inputTime) {
  // Split the input time string by space to separate time and "uur"
  const [time] = inputTime.split(' ');

  // Split the time string by colon to extract hours and minutes
  const [hours, minutes, sec] = time.split(':');
  let section = '';

  // Format the hours and minutes
  const formattedHours = parseInt(hours, 10).toString().padStart(2, '0');
  if (formattedHours > 12) {
    section = 'PM';
  } else {
    section = 'AM';
  }
  const convertHour =
    formattedHours > 12 ? formattedHours - 12 : formattedHours;
  const formattedMinutes = parseInt(minutes, 10).toString().padStart(2, '0');

  // Concatenate the formatted hours and minutes
  const formattedTime = `${convertHour}:${formattedMinutes}:${section}`;
  // print(formattedTime, 'formattedTime');
  return formattedTime;
}
export const percentAmt = (total, percent) => {
  return (total * percent) / 100;
};

export const percentage = (total, amount) => {
  return (100 * amount) / total;
};

export const isFloat = num => {
  return !Number.isInteger(num);
};

