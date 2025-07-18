import {
  Image,
  ImageBackground,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {
  diffTime,
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {url} from '../../utilities/appApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  setOtpStartTime,
  setProfileData,
  setUserType,
} from '../../redux/authSlice';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Otp_auth = ({navigation, route}) => {
  const appColor = appColors();
  const showToast = useShowToast();
  const dispatch = useDispatch();
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const {otpStartTime} = useSelector(state => state.auth);
  const isFocus = useIsFocused();

  const [timing, setTiming] = useState(0);
  const [digits, setDigits] = useState(['', '', '', '', '']);
  const [load, setLoad] = useState(false);

  const OtpTimeFunction = () => {
    const timer = setInterval(timerFun, 1000);

    function timerFun() {
      if (isFocus) {
        var startTime = new Date(otpStartTime);
        var currentTime = new Date();
        let differTime = diffTime(startTime, currentTime);
        const minutes = differTime.minutes;
        const seconds = differTime.seconds;
        const time = `Your OTP expires in ${
          minutes == '0' ? '' : minutes + ' minutes '
        }${seconds + ' seconds'}`;
        if (
          `${minutes}:${seconds}` == '0:00' ||
          Math.round(Number(minutes)) > 5 ||
          otpStartTime == 0
        ) {
          clearInterval(timer);
          setTiming('');
          dispatch(setOtpStartTime(0));
        } else {
          // console.log(minutes, seconds);
          setTiming(time);
        }
      } else if (!isFocus) {
        clearInterval(timer);
        dispatch(setOtpStartTime(0));
      }
    }
  };

  useEffect(() => {
    if (isFocus) {
      dispatch(setOtpStartTime(new Date().getTime()));
    }
    if (!isFocus) {
      dispatch(setOtpStartTime(0));
      OtpTimeFunction();
    }
  }, [isFocus]);

  useEffect(() => {
    if (Number(otpStartTime) != 0) {
      OtpTimeFunction();
    }
  }, [otpStartTime]);

  //OTP Validation
  const OtpValidation = async () => {
    let isEmpty = digits.join('').trim().length !== 5;
    let asFormat = /^[0-9]+$/.test(digits.join(''));

    if (isEmpty) {
      Keyboard.dismiss();
      showToast('error', '', 'OTP field is incomplete', 1600);
    } else if (!asFormat) {
      Keyboard.dismiss();
      showToast('error', '', 'OTP not in the format', 1600);
    } else if (!isEmpty && asFormat) {
      apiCall(digits.join(''));
    }
  };

  const changeDigit = (text, input) => {
    const newDigits = [...digits];
    newDigits[input] = text;

    if (text !== '' && input > 0 && input < refs.length - 1) {
      refs[input - 1].current.focus();
    }

    setDigits(newDigits);

    if (text !== '' && input < refs.length - 1) {
      refs[input + 1].current.focus();
    }
  };

  const KeyDigits = (event, index) => {
    if (
      event.nativeEvent.key === 'Backspace' &&
      index > 0 &&
      digits[index] === ''
    ) {
      event.preventDefault();
      refs[index - 1].current.focus();
      // Copy the value from the current input field to the previous input field
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
    }
  };

  // api
  const apiCall = async (otp = '') => {
    try {
      setLoad(true);
      const formData = new FormData();
      formData.append('email', route.params.email);
      if (otp != '') {
        formData.append('otp', otp);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // get the response:
      const response = await fetch(
        otp != '' ? url().authontication : url().login,
        requestOptions,
      );
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          Keyboard.dismiss();
          if (otp != '') {
            if (resparse.data) {
              dispatch(setUserType('user'));
              dispatch(
                setProfileData({
                  userId: resparse.data.user_id,
                  name: resparse.data.first_name,
                  email: resparse.data.email,
                  number: resparse.data.phone,
                  gender: resparse.data.gender,
                  flatNumber: resparse.data.flat,
                  pincode: resparse.data.pincode,
                  street: resparse.data.street,
                  city: resparse.data.city,
                  state: resparse.data.state,
                  profile_picture: {
                    uri: resparse.data.picture,
                    name: 'profile.jpeg',
                    type: 'image/jpeg',
                  },
                  weight: resparse.weight,
                  height: resparse.height,
                  age: resparse.age,
                  bmi: resparse.bmi,
                  activity: resparse.activity,
                  bmr: resparse.bmr,
                  tef: resparse.tef,
                  tdee: resparse.tdee,
                  goal: resparse.goal,
                  mac_protein: resparse.mac_protein,
                  mac_calories: resparse.mac_calories,
                  mac_fats: resparse.mac_fats,
                }),
              );
              setLoad(false);
            }
          }
          showToast('success', '', resparse.message, 10000);
          setLoad(false);
          if (otp != '') {
            navigation.navigate('main');
            setLoad(false);
          }
        } else if (resparse.status == 'warning') {
          showToast('info', '', resparse.message, 2500);
          setLoad(false);
        }
      } else if (response.status == 404) {
        Keyboard.dismiss();
        const resparse = await response.json();
        setDigits(['', '', '', '', '']);
        showToast('info', '', resparse.message, 2500);
        setLoad(false);
      } else {
        print(response.status, 'status in home screen');
        setLoad(false);
      }
    } catch (e) {
      console.log(e, 'error in home screen');
      setLoad(false);
    }
  };

  const {styles} = useStyle();

  return (
    <>
      {load && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            flex: 1,
            height: scrnHeight,
            width: scrnWidth,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LottieView
            autoPlay={true}
            style={{width: scrnWidth * 0.5, height: scrnWidth * 0.5}}
            source={require('../../../assets/lottieFiles/load.json')}
          />
        </View>
      )}
      <ImageBackground
        resizeMode="stretch"
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
        source={require('../../../assets/images/background_reg.png')}>
        <StatusBar backgroundColor={'transparent'} translucent />
        <Animatable.Image
          animation={'fadeInUp'}
          source={require('../../../assets/images/bean.png')}
          style={styles.bean}
          resizeMode="contain"
        />
        <Image
          source={require('../../../assets/images/curry_leaf.png')}
          style={styles.neam}
          resizeMode="contain"
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
            // paddingTop: widthResponse ? 100 : 120,
            paddingBottom: 10,
            flex: 1,
          }}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          extraHeight={300}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginBottom: widthResponse ? 15 : 25,
            }}>
            <Animatable.Image
              animation={'zoomIn'}
              source={require('../../../assets/images/orange.png')}
              resizeMode="contain"
              style={styles.main}
            />
          </View>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(3.5),
              color: appColor.textWhite,
              marginBottom: widthResponse ? 10 : 15,
            }}>
            otp verification
          </Text>
          <Text
            style={{
              fontSize: fontScalling(1.8),
              color: appColor.white,
              textAlign: 'center',
              fontFamily: appFont.rR,
              marginBottom: widthResponse ? 20 : 30,
            }}>
            Food is fuel, not therapy.
          </Text>
          <Text
            style={{
              fontSize: fontScalling(1.8),
              color: appColor.white,
              textAlign: 'center',
              fontFamily: appFont.rR,
              marginBottom: widthResponse ? 20 : 30,
            }}>
            Cras eros ligula, venenatis et consequat sed, efficitur non sem. In
            quis sapien
          </Text>
          <View style={{marginBottom: widthResponse ? 20 : 30}}>
            <View style={styles.digits}>
              {digits.map((digit, index) => {
                return (
                  <TextInput
                    autoFocus={index == 0 ? true : false}
                    key={index}
                    ref={refs[index]}
                    style={[
                      styles.inputDigits,
                      digit !== '' && styles.filedColour,
                    ]}
                    value={digit}
                    onChangeText={dig => changeDigit(dig, index)}
                    onKeyPress={event => KeyDigits(event, index)}
                    maxLength={1}
                    keyboardType="numeric"
                  />
                );
              })}
            </View>
          </View>
          <PrimaryButton
            onPress={() => {
              OtpValidation();
            }}
            Title={'Verify'}
            altStyle={{
              marginBottom: widthResponse ? 15 : 20,
            }}
          />
          {timing != 0 ? (
            <Text
              style={{
                fontFamily: appFont.BW_Bold,
                color: appColor.white,
                fontSize: fontScalling(2),
              }}>
              {timing}
            </Text>
          ) : (
            <TouchableOpacity
              style={{elevation: 10}}
              onPress={() => apiCall('')}
              activeOpacity={0.5}>
              <Text
                style={{
                  color: '#f3b652',
                  elevation: 5,
                  // textTransform: 'uppercase',
                }}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </KeyboardAwareScrollView>
      </ImageBackground>
    </>
  );
};

export default Otp_auth;

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    bean: {
      position: 'absolute',
      bottom: -40,
      left: 0,
      width: widthResponse ? 150 : 200,
      height: widthResponse ? 150 : 200,
    },
    neam: {
      position: 'absolute',
      top: -10,
      right: -25,
      width: widthResponse ? 100 : 200,
      height: widthResponse ? 100 : 200,
      transform: [
        {
          rotateY: '180deg',
        },
      ],
    },
    main: {
      width: widthResponse ? 180 : 250,
      height: widthResponse ? 190 : 350,
    },
    digits: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 15,
      color: appColor.gold,
      fontFamily: appFont.bB,
      fontSize: fontScalling(3.2),
    },

    inputDigits: {
      width: scrnWidth / 7.5,
      height: scrnHeight / 16,
      borderRadius: 10,
      textAlign: 'center',
      marginHorizontal: 5,
      fontFamily: appFont.bB,
      backgroundColor: appColor.lightBlackBack,
      color: appColor.gold,
      fontSize: fontScalling(3.2),
    },
    filedColour: {
      backgroundColor: '#ffffff',
    },
  });

  return {styles};
};
