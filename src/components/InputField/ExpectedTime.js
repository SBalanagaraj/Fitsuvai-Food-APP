import {Pressable, StyleSheet, Text, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../utilities/appColors';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Icon} from '../../utilities/icon';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedTime} from '../../redux/SettingSlice';

const ExpectedTime = ({
  expectedTime = {devision: 'AM', time: ''},
  placeholder = '',
  onChange = () => {},
  value = '',
  error,
  dark = false,
  title = '',
  section = '',
}) => {
  const {styles} = useStyles();
  const appColor = appColors();
  const dispath = useDispatch();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateObj, setDateObj] = useState(false);
  // const {selectedTime} = useSelector(state => state.setting);

  const hideDatePicker = () => {
    if (dark) {
      onChange(preData => {
        return {
          ...preData,
          [section]: {
            ...preData[section],
            // time: '',
            isValid: false,
            // isErrValid: true,
          },
        };
      });
    } else if (!dark) {
      onChange(preData => ({
        ...preData,
        // time: '',
        isValid: false,
      }));
    }
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensure 2-digit minutes
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleConfirm = (event, date) => {
    // dispath(setSelectedTime(date));
    setDateObj(date);
    if (dark) {
      onChange(preData => {
        return {
          ...preData,
          [section]: {
            ...preData[section],
            time: formatTime(date),
            isValid: true,
            // isErrValid: true,
          },
        };
      });
    } else if (!dark) {
      onChange(preData => ({
        ...preData,
        time: formatTime(date),
        isValid: true,
      }));
    }
    console.log('handle');
    setDatePickerVisibility(false);
  };
  console.log(isDatePickerVisible,'isDatePickerVisible');

  useEffect(() => {
    if (dark) {
      setTimeout(() => {
        onChange(preData => {
          // print(preData, 'preData');
          return {
            ...preData,
            [section]: {
              time: preData[section].time,
              isValid: preData[section].isValid,
              isErrValid:
                typeof error == 'boolean' && error == true ? true : false,
              // devision: preData[section].devision,
            },
          };
        });
      }, 500);
    }
  }, [error]);

  return (
    <>
      <Pressable
        style={[
          {
            borderBottomWidth: 0,
            flexDirection: 'column',
            paddingVertical: dark ? 0 : 5,
            zIndex: 100,
          },
        ]}>
        <Text
          style={[
            styles.HeadingText,
            {
              color: dark ? appColor.white : appColor.bgBlack,
              fontSize: dark ? fontScalling(1.7) : fontScalling(2.2),
              fontFamily: dark ? appFont.rM : appFont.bB,
            },
          ]}>
          {dark ? title : 'Select your expected delivery time:'}
        </Text>
        <Pressable
          onPress={hideDatePicker}
          style={{
            borderWidth: 1.5,
            borderColor: dark ? appColor.bgBlack : appColor.borderColor,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // backgroundColor: dark && appColor.bgBlack,
            backgroundColor: dark ? appColor.bgBlack : appColor.greyBg,
            paddingRight: 10,
            elevation: 0.4,
          }}>
          <Text
            style={{
              // paddingHorizontal: 15,
              paddingVertical: 15,
              marginHorizontal: 15,
              flex: 1,
              fontFamily: appFont.bR,
              fontSize: fontScalling(2),
              color: dark
                ? value.time == ''
                  ? dark
                    ? appColor.lightGreyLine
                    : appColor.TextInputborderbg
                  : appColor.white
                : value.time == ''
                ? appColor.Textlightblack
                : appColor.bgBlack,
              opacity: value.time == '' ? 0.4 : 1,
            }}>
            {value.time == '' ? placeholder : value.time}
          </Text>
          <Icon
            ComponentName={'Entypo'}
            name={'back-in-time'}
            size={25}
            color={dark ? appColor.white : appColor.Textlightblack}
          />
        </Pressable>
        {/* form errors */}
        {error && value.isValid && error != true && (
          <Text
            style={{
              marginTop: 3,
              marginLeft: 3,
              color: appColor.formError,
              fontSize: fontScalling(1.45),
              fontFamily: appFont.rR,
              zIndex: -2,
            }}>
            {error}
          </Text>
        )}
      </Pressable>
      {isDatePickerVisible && (
        <DateTimePicker
          mode="time"
          value={new Date(dateObj)}
          onChange={handleConfirm}
          onCancel={hideDatePicker}
          display={Platform.OS == 'ios' ? 'spinner' : 'default'}
        />
      )}
    </>
  );
};

export default ExpectedTime;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      paddingBottom: 5,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(2),
      color: appColor.black,
    },
    normalText: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(2),
      color: appColor.black,
      paddingBottom: 5,
    },
    price: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.2),
      color: appColor.black,
    },

    SideHeadingCont: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingVertical: widthResponse ? 10 : 15,
      borderBottomWidth: 0.5,
      marginBottom: widthResponse ? 10 : 15,
      // marginHorizontal: 20,
      borderBottomColor: appColor.greyBack,
      width: '100%',
    },
  });

  return {styles};
};
