import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
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
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';

const Register = ({navigation}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();
  const showToast = useShowToast();

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
      const formData = new FormData();
      formData.append('email', email);
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
          showToast('success', '', resparse.message, 1200);
          navigation.navigate('otpScreen', {email: email});
        } else if (resparse.status == 'warning') {
          showToast('info', '', resparse.message, 2500);
          // setTimeout(()=>{navigation.navigate('otpScreen');},1500)
        }
      } else if (response.status == 404) {
        Keyboard.dismiss();
        const resparse = await response.json();
        showToast('info', '', resparse.message, 2500);
      } else {
        print(response.status, 'status in home screen');
      }
    } catch (e) {
      console.log(e, 'error in home screen');
    }
  };

  // navigation:
  const onPressSend = data => {
    reset();
    apiCall(data.email);
  };

  return (
    <ImageBackground
      resizeMode="stretch"
      style={{
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
          {/* Password */}
          {/* <Controller
            name="password"
            control={control}
            render={({field: {onChange, value}}) => (
              <InputText
                placeholder={'Enter password'}
                value={value}
                dark
                leftIcon
                secureTextEntry={true}
                icon={'Feather'}
                iconName={'lock'}
                iconSize={18}
                Title={'Enter Password'}
                autoCapitalize="none"
                onChangeText={onChange}
                formError={errors.password}
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
              />
            )}
          /> */}
          {/* Checkbox && Forgot Password */}
          {/* <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
            }}>
            <Controller
              name="checkbox"
              control={control}
              render={({field: {onChange, value}}) => (
                <CheckBox
                  checkBox={value}
                  onPress={() => onChange(!value)}
                  label={'Remember me'}
                />
              )}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('forgot');
              }}>
              <Text
                style={{
                  color: appColor.textWhite,
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.6),
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View> */}
          {/* {errors.checkbox && (
            <Text
              style={{
                marginTop: 8,
                color: appColor.formError,
                fontSize: fontScalling(1.6),
                fontFamily: appFont.rR,
              }}>
              {errors.checkbox.message}
            </Text>
          )} */}
        </View>
        {/* Register */}
        <PrimaryButton
          Title={'Login'}
          onPress={handleSubmit(onPressSend)}
          altStyle={{elevation: 10}}
        />
        {/* login Redirect */}
        {/* <View
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
        </View> */}
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
  );
};

export default Register;
