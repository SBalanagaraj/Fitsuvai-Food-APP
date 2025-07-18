import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Image} from 'react-native-animatable';
import {useForm, Controller} from 'react-hook-form';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
// file import:
import {appFont} from '../../utilities/appFont';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

const Register = ({navigation}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();

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
      fname: yup.string('must be string').required('Name is required'),
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
      number: yup
        .string()
        .required('Mobil Number is required')
        .min(10, 'invalid Mobile Number'),
      password: yup.string().required('Password is required'),
      confirm_password: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Not match password')
        .required('Confirm Password is required'),
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

  // navigation:
  const onPressSend = data => {
    reset();
    // isValid && navigation.goBack();
  };

  return (
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
          Regsiter Account
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
            <Controller
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
            />
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15,
            }}>
            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter password'}
                  value={value}
                  customStyle={{flex: 1, marginRight: 10}}
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
            />
            {/* Confirm Password */}
            <Controller
              name="confirm_password"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter password'}
                  value={value}
                  customStyle={{flex: 1}}
                  dark
                  leftIcon
                  icon={'Feather'}
                  iconName={'lock'}
                  iconSize={18}
                  autoCapitalize="none"
                  secureTextEntry
                  Title={'Confirm Password'}
                  onChangeText={onChange}
                  formError={errors.confirm_password}
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
        </Pressable>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default Register;
