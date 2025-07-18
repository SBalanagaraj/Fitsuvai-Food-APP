import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {useForm, Controller} from 'react-hook-form';
import {useIsFocused} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputField/InputText';
import {
  fontScalling,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '../../components/InputField/CheckBox';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import WebView from 'react-native-autoheight-webview';
import * as Animatable from 'react-native-animatable';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

const ContactUs = () => {
  const appColor = appColors();
  const styles = useStyle();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();
  const showToast = useShowToast();
  const {userSettings} = useSelector(state => state.setting);
  const [captchaImg, setCaptchaImg] = useState('');

  // reset the data:
  useEffect(() => {
    generateCaptcha();
    if (!isFocus) {
      reset();
    }
  }, [isFocus]);

  // validation:
  const schema = yup
    .object()
    .shape({
      fname: yup.string('Must be string').required('Name is required'),
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
      number: yup
        .string()
        .required('Mobile Number is required')
        .min(10, 'Invalid Mobile Number'),
      subject: yup.string('Must be string').required('Subject is required'),
      message: yup.string('Must be string').required('Type a message for us'),
      checkbox: yup
        .boolean()
        .required()
        .oneOf([true], 'You must accept the terms and conditions'),
      captcha: yup
        .string()
        .required('Captcha is required')
        .test('empty-or-valid', 'Invalid Captcha', function (value) {
          // Check if captcha is not the same as the number
          return value == captchaImg;
        }),
    })
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // navigation:
  const onPressSend = data => {
    apiCall(data);
  };

  // api
  const apiCall = async datas => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('name', datas.fname);
      formData.append('email', datas.email);
      formData.append('subject', datas.subject);
      formData.append('message', datas.message);
      formData.append('mobile', datas.number);
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // get the response:
      const response = await fetch(url().contact, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          reset();
          generateCaptcha();
          showToast('success', resparse.status, resparse.message, 1500);
        }
      } else {
        console.log('Contact us status code:', response.status);
      }
    } catch (e) {
      console.log(e, 'error Contact us');
    }
  };

  const generateCaptcha = () => {
    setCaptchaImg(Math.round(Math.random() * 1000000));
    setValue('captcha', '');
  };

  return (
    <View style={{backgroundColor: appColor.white}}>
      <View style={{backgroundColor: appColor.bgBlack}}>
        <View
          style={[
            {
              marginHorizontal: 10,
              backgroundColor: appColor.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 20,
              paddingTop: 10,
              height: 50,
              zIndex: 1,
            },
          ]}
        />
      </View>
      <Animatable.View
        animation={'zoomIn'}
        duration={1000}
        style={[styles.searchContainer]}>
        <Text style={styles.head}>contact information</Text>
      </Animatable.View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          paddingBottom: widthResponse ? 90 : 120,
        }}
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={300}
        ref={textFocus}
        showsVerticalScrollIndicator={false}>
        {/* contact info //@@ */}
        <View
          style={{
            width: '100%',
            // marginBottom: 15,
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {userSettings?.SITEINFO?.phone &&
            userSettings?.SITEINFO?.phone != '' && (
              <View style={[styles.flex]}>
                <View style={styles.icon}>
                  <Icon
                    name={'phone-call'}
                    ComponentName={'Feather'}
                    size={widthResponse ? 20 : 35} //@@
                    color={appColor.white}
                  />
                </View>
                <View>
                  <Text style={styles.subHead}>Call This Now!</Text>
                  <Text style={styles.content}>
                    {userSettings?.SITEINFO?.phone}
                  </Text>
                </View>
              </View>
            )}
          {userSettings?.SITEINFO?.email &&
            userSettings?.SITEINFO?.email != '' && (
              <View style={[styles.flex]}>
                <View style={styles.icon}>
                  <Icon
                    name={'envelope'}
                    ComponentName={'EvilIcons'}
                    size={widthResponse ? 27 : 50} //@@
                    color={appColor.white}
                  />
                </View>
                <View>
                  <Text style={styles.subHead}>Mail us</Text>
                  <Text style={[styles.content]}>
                    {userSettings?.SITEINFO?.email}
                  </Text>
                </View>
              </View>
            )}
          {userSettings?.SITEINFO?.address &&
            userSettings?.SITEINFO?.address != '' && (
              <View style={[styles.flex, {width: '100%', marginBottom: 0}]}>
                <View style={styles.icon}>
                  <Icon
                    name={'location-pin'}
                    ComponentName={'SimpleLineIcons'}
                    size={widthResponse ? 20 : 35} //@@
                    color={appColor.white}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.subHead}>Our Location</Text>
                  <Text style={styles.content}>
                    {userSettings?.SITEINFO?.address},{' '}
                    {userSettings?.SITEINFO?.city}-
                    {userSettings?.SITEINFO?.postcode}
                  </Text>
                </View>
              </View>
            )}
        </View>
        {/* form */}
        <View
          style={{
            backgroundColor: appColor.cardbg,
            width: scrnWidth,
            alignSelf: 'center',
            paddingTop: 20,
            paddingHorizontal: 15,
            paddingBottom: 15,
            marginTop: 20,
          }}>
          <Text style={[styles.head, {textAlign: 'left'}]}>Contact us</Text>
          <View
            style={{
              backgroundColor: appColor.white,
              padding: 15,
              paddingBottom: 0,
              borderRadius: 10,
            }}>
            {/* Name */}
            <Controller
              name="fname"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter name'}
                  value={value}
                  row
                  noelevation
                  Title={'Your Name'}
                  onChangeText={onChange}
                  formError={errors.fname}
                  onFocus={event => {
                    if (textFocus.current) {
                      // textFocus.current.scrollToFocusedInput(event.target);
                    }
                  }}
                />
              )}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Enter email address'}
                    value={value}
                    noelevation
                    customStyle={{flex: 1, marginRight: 10}}
                    keyboardType={'email-address'}
                    autoCapitalize
                    Title={'Email Address'}
                    onChangeText={onChange}
                    formError={errors.email}
                    onFocus={event => {
                      if (textFocus.current) {
                        // textFocus.current.scrollToFocusedInput(event.target);
                      }
                    }}
                  />
                )}
              />
              {/* Number */}
              <Controller
                name="number"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Enter mobile number'}
                    value={value}
                    noelevation
                    customStyle={{flex: 1}}
                    keyboardType={'numeric'}
                    maxLength={10}
                    Title={'Mobile Number'}
                    onChangeText={onChange}
                    formError={errors.number}
                    onFocus={event => {
                      if (textFocus.current) {
                        // textFocus.current.scrollToFocusedInput(event.target);
                      }
                    }}
                  />
                )}
              />
            </View>
            {/* subject */}
            <Controller
              name="subject"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter subject'}
                  value={value}
                  row
                  noelevation
                  Title={'Subject'}
                  onChangeText={onChange}
                  formError={errors.subject}
                  onFocus={event => {
                    if (textFocus.current) {
                      // textFocus.current.scrollToFocusedInput(event.target);
                    }
                  }}
                />
              )}
            />
            {/* your message */}
            <Controller
              name="message"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter your message...'}
                  value={value}
                  row
                  textVertical
                  numberOfLines={6}
                  noelevation
                  multiline={true}
                  Title={'Message'}
                  onChangeText={onChange}
                  formError={errors.message}
                  onFocus={event => {
                    if (textFocus.current) {
                      // textFocus.current.scrollToFocusedInput(event.target);
                    }
                  }}
                />
              )}
            />
            {/* checkbox */}

            <Controller
              name="checkbox"
              control={control}
              render={({field: {onChange, value}}) => (
                <CheckBox
                  checkBox={value}
                  altStyle={{marginRight: 'auto'}}
                  onPress={() => onChange(!value)}
                  // multiLabel
                  terms
                  color
                />
              )}
            />
            {errors.checkbox && (
              <Text style={[styles.errors]}>{errors.checkbox.message}</Text>
            )}
            {/* captcha */}
            <View
              removeClippedSubviews
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View>
                <FastImage
                  source={require('../../../assets/images/captcha.webp')}
                  resizeMode="cover"
                  style={[{...StyleSheet.absoluteFillObject}]}
                />
                <Text
                  selectable={false}
                  style={[styles.content, {padding: 5, color: appColor.white}]}>
                  {captchaImg}
                </Text>
              </View>
              <Controller
                name="captcha"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Captcha'}
                    value={value}
                    noelevation
                    customStyle={{
                      flex: 1,
                      paddingBottom: 0,
                      marginHorizontal: 5,
                    }}
                    contextMenuHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={onChange}
                    onFocus={event => {
                      if (textFocus.current) {
                        // textFocus.current.scrollToFocusedInput(event.target);
                      }
                    }}
                  />
                )}
              />
              <TouchableOpacity onPress={() => generateCaptcha()}>
                <Icon
                  ComponentName={'Ionicons'}
                  name={'reload'}
                  size={widthResponse ? 20 : 25}
                  color={appColor.bgBlack}
                />
              </TouchableOpacity>
            </View>
            {errors.captcha && (
              <Text style={[styles.errors]}>{errors.captcha.message}</Text>
            )}
            <PrimaryButton
              Title={'Contact us'}
              parentStyle={{flex: 1}}
              altStyle={{marginVertical: 20}}
              onPress={handleSubmit(onPressSend)}
            />
          </View>
        </View>
        {/* Map */}
        {/* //@@ */}
        {userSettings?.SITEINFO?.map_iframe &&
          userSettings?.SITEINFO?.map_iframe != '' && (
            <View
              style={{
                paddingTop: widthResponse ? 10 : 20,
                marginBottom: widthResponse ? 80 : 100,
              }}>
              <View
                style={{
                  flex: 1,
                  elevation: 8,
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  shadowOffset: {height: 1},
                }}>
                <WebView
                  showsVerticalScrollIndicator={false}
                  originWhitelist={['*']}
                  source={{
                    html: `
                  <html>
                    <body>
                      <iframe src="${userSettings?.SITEINFO?.map_iframe}" 
                        width="${scrnWidth - 30}"
                        height="${scrnWidth - 30}"
                        style="border: 0; border-radius: 20px;"
                        loading="lazy">
                      </iframe>
                    </body>
                  </html>`,
                  }}
                />
              </View>
            </View>
          )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ContactUs;

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    flex: {
      minWidth: '50%', //@@
      alignItems: 'center',
      flexDirection: 'row',
      paddingRight: widthResponse ? 5 : 10, //@@
      marginBottom: widthResponse ? 30 : 50, //@@
    },
    head: {
      color: appColor.bgBlack,
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      textAlign: 'center',
      paddingVertical: 13,
    },
    subHead: {
      color: appColor.bgBlack,
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.8),
      marginBottom: 5,
    },
    icon: {
      width: scrnWidth / 9,
      height: scrnWidth / 9,
      backgroundColor: appColor.bgBlack,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      marginRight: 10,
    },
    content: {
      color: appColor.bgBlack,
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
    },
    errors: {
      marginTop: 8,
      color: appColor.formError,
      fontSize: fontScalling(1.45),
      fontFamily: appFont.rR,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingTop: 12,
      borderRadius: 15,
      justifyContent: 'center',
      marginHorizontal: 20,
      marginTop: -55,
      zIndex: 3,
      overflow: 'visible',
    },
  });
  return styles;
};
