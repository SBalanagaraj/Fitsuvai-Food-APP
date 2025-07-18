import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
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
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CheckBox from '../../components/InputField/CheckBox';

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
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
    })
    .required();

  // form State:
  const {
    control,
    reset,
    handleSubmit,
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
          paddingTop: widthResponse ? 110 : 140,
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
            height: widthResponse ? 200 : 250,
            width: widthResponse ? 270 : 320,
            marginBottom: 50,
          }}>
          <Image
            resizeMode="contain"
            style={{height: '100%', width: '100%'}}
            source={require('../../../assets/images/forgot_img.png')}
          />
        </View>
        {/* Title */}
        <Text
          style={{
            fontFamily: appFont.bB,
            fontSize: fontScalling(3),
            color: appColor.textWhite,
            marginBottom: 25,
          }}>
          Forgot Password
        </Text>
        {/* form */}
        <View style={{width: '100%', marginBottom: 10}}>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({field: {onChange, value}}) => (
              <InputText
                placeholder={'Enter your email address'}
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
          Title={'Forgot Password'}
          onPress={handleSubmit(onPressSend)}
          altStyle={{elevation: 10}}
        />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default Register;
