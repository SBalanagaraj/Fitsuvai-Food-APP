import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native-animatable';
import {useForm, Controller} from 'react-hook-form';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
// file import:
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  setProfileData,
  setUserSkipOption,
  setUserType,
} from '../../redux/authSlice';
import LottieView from 'lottie-react-native';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';

const Register = ({navigation}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const showToast = useShowToast();

  const {userSkipOption} = useSelector(state => state.auth);

  const [userData, setUserData] = useState({});
  const [load, setLoad] = useState(false);
  const [activeGL, setActiveGL] = useState(true);

  // reset the data:
  useEffect(() => {
    if (!isFocus) {
      reset();
    }
  }, [isFocus]);

  const currentClientid =
    '254995024595-mi5pijv1hngm1ibcp2l8uvkrrne7rr6b.apps.googleusercontent.com';

  useEffect(() => {
    if (activeGL) {
    SplashScreen.hide();
    GoogleSignin.configure({
      webClientId: currentClientid,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    googleLogin();
  }
  }, [activeGL]);
  // google login:

  const googleLogin = async () => {
    setLoad(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  
    // Try silent sign-in first
   let userInfo = await GoogleSignin.signIn();

    // if (!userInfo?.data?.user) {
    //   // If no saved credentials, trigger One Tap account creation
    //   userInfo = await GoogleSignin.signIn();
    // }
  
      if (userInfo?.data?.user) {
        console.log('Google One Tap Sign-In Successful:', userInfo);
        setActiveGL(false);
        apiCall(
          userInfo?.data?.user?.name,
          userInfo?.data?.user?.email,
          userInfo?.data?.user?.photo,
        );
        setUserData(userInfo?.data?.user);
      } else {
        setLoad(false);
      }
    } catch (error) {
      console.error('Google One Tap Sign-In Error:', error);
      setLoad(false);
    }
  };  

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      (async () => {
        await GoogleSignin.signOut();
      })();
    }
  }, [userData]);

  // validation:
  const schema = yup
    .object()
    .shape({
      fname: yup.string('must be string').required('Name is required'),
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
  const apiCall = async (name = '', email = '', photo = '') => {
    try {
      // var myHeaders = new Headers();
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
      // get the response:
      const response = await fetch(url().signUp, requestOptions);
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          Keyboard.dismiss();
          showToast('success', '', resparse.message, 1200);
          print(resparse.userId, 'userId----');
          dispatch(setUserType('user'));
          dispatch(
            setProfileData({
              userId: resparse.userId,
            }),
          );
          setTimeout(() => {
            setActiveGL(true);
          }, 950);
          setTimeout(() => {
            if (userSkipOption == 1) {
              navigation.navigate('main');
            } else {
              navigation.navigate('locationSearch');
            }
            dispatch(setUserSkipOption(1));
            setLoad(false);
          }, 700);

          // navigation.navigate('otpScreen', {email: email});
        } else if (
          resparse.status == 'error' &&
          resparse.message == 'user already exists'
        ) {
          showToast('info', '', resparse.message, 2500);
          // setTimeout(() => {
          //   setActiveGL(true);
          // }, 250);
          navigation.navigate('login', {email: email});
          setLoad(false);
        } else if (resparse.status == 'warning') {
          showToast('info', '', resparse.message, 2500);
          setLoad(false);

          // setTimeout(()=>{navigation.navigate('otpScreen');},1500)
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
    reset();
    apiCall(data.fname, data?.email, '');
  };

  return (
    <>
      <StatusBar backgroundColor={appColor.bgBlack} />
      <ImageBackground
        resizeMode="stretch"
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
        }}
        source={require('../../../assets/images/background_reg.png')}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: widthResponse ? 60 : 100,
            paddingBottom: 10,
          }}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          extraHeight={300}
          ref={textFocus}
          showsVerticalScrollIndicator={false}>
          {load && (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  paddingTop: 100,
                  backgroundColor: appColor.lightBackground,
                },
              ]}>
              <View
                style={{
                  paddingHorizontal: 20,
                  // paddingVertical: 10,
                  backgroundColor: appColor.white,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <LottieView
                  autoPlay={true}
                  style={{width: 100, height: 100}}
                  source={require('../../../assets/lottieFiles/load.json')}
                />
                <Text
                  style={{
                    fontFamily: appFont.bB,
                    color: appColor.textGrey,
                    fontSize: fontScalling(1.8),
                  }}>
                  Verifying credentials
                </Text>
              </View>
            </View>
          )}
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
            Welcome to Fitsuvai
          </Text>
          {/* form */}
          <View style={{width: '100%'}}>
            {/* Name */}
            <Controller
              name="fname"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter name'}
                  value={value}
                  row
                  dark
                  leftIcon
                  icon={'FontAwesome'}
                  iconName={'user-o'}
                  iconSize={18}
                  Title={'Your Name'}
                  onChangeText={onChange}
                  formError={errors.fname}
                  onFocus={event => {
                    textFocus.current.scrollToFocusedInput(event.target);
                  }}
                />
              )}
            />
            <View style={{flexDirection: 'row'}}>
              {/* Number */}
              {/* <Controller
              name="number"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter mobile number'}
                  value={value}
                  customStyle={{flex: 1, marginRight: 10}}
                  dark
                  leftIcon
                  keyboardType={'numeric'}
                  maxLength={10}
                  icon={'Feather'}
                  iconName={'phone'}
                  iconSize={18}
                  Title={'Mobile Number'}
                  onChangeText={onChange}
                  formError={errors.number}
                  onFocus={event => {
                    textFocus.current.scrollToFocusedInput(event.target);
                  }}
                />
              )}
            /> */}
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Enter email address'}
                    value={value}
                    customStyle={{flex: 1}}
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
          </View>
          {/* Register */}
          <PrimaryButton
            Title={'Register'}
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
              Already have an Account?{'  '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('login');
              }}>
              <Text
                style={{
                  color: appColor.themeYellow,
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.6),
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
          {/* Skip */}
          <Pressable
            style={{
              padding: 4,
              paddingHorizontal: 14,
              backgroundColor: appColor.greyBack,
              borderRadius: 10,
            }}
            onPress={() => {
              dispatch(setUserSkipOption(1));
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('main');
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
          </Pressable>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </>
  );
};

export default Register;