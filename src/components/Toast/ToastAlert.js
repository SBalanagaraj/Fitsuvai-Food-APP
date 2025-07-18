import Toast, {
  InfoToast,
  BaseToast,
  ErrorToast,
} from 'react-native-toast-message';
import {View, Text, StyleSheet} from 'react-native';
// file import:
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {hapticFeedSound} from '../hapticSound/HaticFeedSound';
import {bottom_Height} from '../../utilities/helperFunction';

// Toast function:
export const useShowToast = () => {
  const appColor = appColors();
  return (type, text1, text2, duration) => {
    Toast.hide();
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      props: {message: text2},
      swipeable: false,
      position: 'bottom',
      bottomOffset: bottom_Height + 40,
      visibilityTime: duration ? duration : 3000,
      text1Style: {
        fontFamily: appFont.bB,
        fontSize: fontScalling(1.8),
        textTransform: 'uppercase',
        color: appColor.textBlack,
      },
      text2Style: {
        fontFamily: appFont.rR,
        color: appColor.textBlack,
        fontSize: fontScalling(1.7),
      },
      onShow: () => {
        type == 'success' && hapticFeedSound('click_ringtone.wav');
        type == 'info' && hapticFeedSound('click_ringtone.wav');
        type == 'error' && hapticFeedSound('click_ringtone.wav');
        type == 'custom' && hapticFeedSound('click_ringtone.wav');
      },
    });
  };
};

// Toast custom style:
export const ToastConfig = () => {
  const appColor = appColors();
  return {
    success: props => (
      <BaseToast
        {...props}
        text2NumberOfLines={10}
        contentContainerStyle={{
          // backgroundColor: appColor.bgWhite,
          height: '100%',
        }}
        style={{
          borderLeftColor: appColor.ToastSuccess,
          backgroundColor: appColor.ToastSuccessBack,
          elevation: 0,
          paddingVertical: 10,
          height: '100%',
        }}
        renderLeadingIcon={() => {
          return (
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                marginLeft: 15,
                marginRight: -10,
              }}>
              <View
                style={{
                  padding: 3,
                  backgroundColor: appColor.bgWhite,
                  borderRadius: 50,
                }}>
                <Icon
                  name={'done'}
                  ComponentName={'MaterialIcons'}
                  color={appColor.ToastSuccess}
                  size={25}
                />
              </View>
            </View>
          );
        }}
      />
    ),
    info: props => (
      <InfoToast
        text2NumberOfLines={10}
        {...props}
        style={{
          borderLeftColor: appColor.ToastInfo,
          backgroundColor: appColor.ToastInfoBack,
          height: '100%',
          paddingVertical: 10,
          elevation: 0,
        }}
        renderLeadingIcon={() => {
          return (
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                marginLeft: 15,
                marginRight: -10,
                padding: 3,
              }}>
              <Icon
                name={'warning'}
                ComponentName={'AntDesign'}
                color={appColor.ToastInfo}
                size={25}
              />
            </View>
          );
        }}
      />
    ),
    error: props => (
      <ErrorToast
        text2NumberOfLines={10}
        {...props}
        style={{
          borderLeftColor: appColor.ToastError,
          backgroundColor: appColor.ToastErrorBack,
          height: '100%',
          paddingVertical: 10,
          elevation: 0,
        }}
        renderLeadingIcon={() => {
          return (
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                marginLeft: 15,
                marginRight: -10,
              }}>
              <View
                style={{
                  padding: 3,
                  backgroundColor: appColor.bgWhite,
                  borderRadius: 50,
                }}>
                <Icon
                  name={'close'}
                  ComponentName={'AntDesign'}
                  color={appColor.ToastError}
                  size={25}
                />
              </View>
            </View>
          );
        }}
      />
    ),
    custom: props => <CustomToast {...props} />,
  };
};

export const CustomToast = ({text1, props}) => {
  const appColor = appColors();
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: appColor.bgBlack,
          backgroundColor: appColor.greyBack,
          zIndex: 20000,
        },
      ]}>
      <Text
        style={[
          styles.title,
          {
            color: appColor.textWhite,
            fontFamily: appFont.rM,
          },
        ]}>
        {text1}
      </Text>
      <Text style={[styles.message, {color: appColor.textWhite}]}>
        {props.message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '90%',
    padding: 10,
    borderLeftWidth: 6,
    borderRadius: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
  },
});

export default CustomToast;
