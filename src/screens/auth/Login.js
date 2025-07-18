import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useIsFocused} from '@react-navigation/native';
// file import:
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import LottieView from 'lottie-react-native';
import {useDispatch} from 'react-redux';
import {
  setUserSkipOption,
  setProfileData,
  setUserType,
} from '../../redux/authSlice';
import SplashScreen from 'react-native-splash-screen';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({navigation, route}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();
  const showToast = useShowToast();
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [activeGL, setActiveGL] = useState(true);

  // const currentClientid =
  //   '254995024595-mi5pijv1hngm1ibcp2l8uvkrrne7rr6b.apps.googleusercontent.com';
  const regEmail =
    route && route?.params && route?.params?.email && route?.params?.email != ''
      ? route?.params?.email
      : '';

  useEffect(() => {
    if (regEmail == '' && activeGL) {
      SplashScreen.hide();
      GoogleSignin.configure({
        webClientId: url().currentClientid,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
      googleLogin(true);
    }
  }, []);

  const googleLogin = async (silent = false) => {
    setLoad(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Try silent sign-in first
      let userInfo = await GoogleSignin.signIn();
      console.log('Google One Tap Sign-In Silently:', userInfo);

      // if (!userInfo?.data?.user) {
      //   // If no saved credentials, trigger One Tap account creation
      //   userInfo = await GoogleSignin.signIn();
      // }

      if (userInfo?.data?.user) {
        setActiveGL(false);
        console.log('Google One Tap Sign-In Successful:', userInfo);

        // Retrieve last logged-in user from local storage
        const lastLoggedInUserEmail = await AsyncStorage.getItem(
          'lastLoggedInUserEmail',
        ); // or AsyncStorage
        console.log('Last Logged-In User Email:', lastLoggedInUserEmail);

        // Check if the current user is the same as the last logged-in user
        regApiCall(
          userInfo?.data?.user?.name,
          userInfo?.data?.user?.email,
          userInfo?.data?.user?.photo,
        );

        // If the user is different, proceed with normal login flow
        AsyncStorage.setItem(
          'lastLoggedInUserEmail',
          userInfo?.data?.user?.email,
        ); // Save the new user email
      } else {
        setLoad(false);
      }
    } catch (error) {
      console.error('Google One Tap Sign-In Error:', error);
      setLoad(false);
    }
  };

  // useEffect(() => {
  //   if (userData && Object.keys(userData).length > 0) {
  //     (async () => {
  //       await GoogleSignin.signOut();
  //     })();
  //   }
  // }, [userData]);

  // reset the data:
  useEffect(() => {
    if (!isFocus) {
      reset();
    }
  }, [isFocus]);

  // validation:
  const schema = yup
    .object()
    .shape({
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
    })
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // api
  const apiCall = async (email = '') => {
    try {
      // request data for backend:
      // var myHeaders = new Headers();
      setLoad(true);
      const formData = new FormData();
      email && email !== '' && formData.append('email', email);
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // get the response:
      const response = await fetch(url().login, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // Keyboard.dismiss();
          showToast('success', '', `${resparse.message} ${email}`, 8200);
          reset();
          setLoad(false);
          dispatch(setUserSkipOption(1));
          setTimeout(() => {
            setActiveGL(true);
          }, 200);
          navigation.navigate('otpScreen', {email: email});
        } else if (resparse.status == 'warning') {
          setLoad(false);
          showToast('info', '', resparse.message, 2500);
        }
      } else if (response.status == 404) {
        Keyboard.dismiss();
        const resparse = await response.json();
        showToast('info', '', resparse.message, 2500);
        setLoad(false);
      } else {
        print(response.status, 'status in Login Screen');
        setLoad(false);
      }
    } catch (e) {
      console.log(e, 'error in Login Screen');
      setLoad(false);
    }
  };

  useEffect(() => {
    if (regEmail != '') {
      apiCall(regEmail);
    }
  }, [regEmail]);

  // register Login
  const regApiCall = async (name = '', email = '', photo = '') => {
    try {
      setLoad(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('name', name);

      if (photo != '') {
        formData.append('image', photo);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      print(formData, 'formData');
      // get the response:
      const response = await fetch(url().signUp, requestOptions);
      print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        print(resparse, 'resparse');
        if (resparse.status == 'success') {
          Keyboard.dismiss();
          showToast('success', '', resparse.message, 1200);
          dispatch(setUserType('user'));
          dispatch(
            setProfileData({
              userId: resparse.userId,
            }),
          );
          setTimeout(() => {
            setActiveGL(true);
          }, 200);
          navigation.navigate('main');
        } else if (
          resparse.status == 'error' &&
          resparse.message == 'user already exists'
        ) {
          console.log('email---:::', email);
          apiCall(email);
        } else if (resparse.status == 'warning') {
          showToast('info', '', resparse.message, 2500);
          setLoad(false);
        }
      } else if (response.status == 404) {
        Keyboard.dismiss();
        const resparse = await response.json();
        showToast('info', '', resparse.message, 2500);
        setLoad(false);
      } else {
        print(response.status, 'status in home screen');
        setLoad(false);
      }
    } catch (e) {
      console.log(e, 'error in Register screen');
      setLoad(false);
    }
  };

  // navigation:
  const onPressSend = data => {
    apiCall(data.email);
  };

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
          height: '100%',
          width: '100%',
          backgroundColor: appColor.bgBlack,
          opacity: load ? 0.8 : 1,
        }}
        source={require('../../../assets/images/background_reg.png')}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: widthResponse ? 100 : 120,
            paddingBottom: 10,
            flex: 1,
          }}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          extraHeight={300}
          ref={textFocus}
          showsVerticalScrollIndicator={false}>
          {/* image */}
          <View
            style={{
              height: widthResponse ? 180 : 250,
              width: widthResponse ? 250 : 350,
              marginBottom: 15,
            }}>
            <Image
              resizeMode="contain"
              style={{height: '100%', width: '100%'}}
              source={require('../../../assets/images/reg_img.png')}
            />
          </View>
          {/* Title */}
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(3),
              color: appColor.textWhite,
              marginBottom: 15,
            }}>
            Login Account
          </Text>
          {/* form */}
          <View style={{width: '100%', marginBottom: 30}}>
            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter email address'}
                  value={value}
                  dark
                  leftIcon
                  keyboardType={'email-address'}
                  autoCapitalize
                  icon={'Feather'}
                  iconName={'mail'}
                  iconSize={18}
                  Title={'Email Address'}
                  onChangeText={onChange}
                  formError={errors.email}
                  onFocus={event => {
                    textFocus.current.scrollToFocusedInput(event.target);
                  }}
                />
              )}
            />
          </View>
          {/* Register */}
          <PrimaryButton
            Title={'Login'}
            onPress={handleSubmit(onPressSend)}
            altStyle={{elevation: 10}}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 12.5,
            }}>
            <View
              style={{
                height: 0.4,
                backgroundColor: appColor.borderColor,
                width: '40%',
              }}
            />
            <Text
              style={{
                color: appColor.greyBg,
                fontFamily: appFont.rR,
                fontSize: fontScalling(2.2),
                paddingHorizontal: 8,
              }}>
              or
            </Text>
            <View
              style={{
                height: 0.4,
                backgroundColor: appColor.borderColor,
                width: '40%',
              }}
            />
          </View>
          <PrimaryButton
            img={true}
            Title={'Sign in with Google'}
            onPress={() => {
              googleLogin();
            }}
            // onPress={handleSubmit(onPressSend)}
            altStyle={{elevation: 10}}
          />
          {/* login Redirect */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 20,
              marginTop: 15,
            }}>
            <Text
              style={{
                color: appColor.textWhite,
                fontFamily: appFont.rM,
                fontSize: fontScalling(1.6),
              }}>
              Dont't have an Account?{'  '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('register');
              }}>
              <Text
                style={{
                  color: appColor.themeYellow,
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.6),
                }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          {/* Skip */}
          <TouchableOpacity
            style={{
              padding: 4,
              paddingHorizontal: 14,
              backgroundColor: appColor.greyBack,
              borderRadius: 10,
              marginTop: 20,
            }}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Dashboard', {screen: 'home'});
              }
            }}>
            <Text
              style={{
                color: appColor.textWhite,
                fontFamily: appFont.rM,
                fontSize: fontScalling(1.6),
                paddingBottom: 3,
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </>
  );
};

export default Register;
