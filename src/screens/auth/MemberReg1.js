import {Pressable, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useIsFocused} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
// file import:
import appColors from '../../utilities/appColors';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import MemberRegCard from '../../components/Card/MemberRegCard';
import {useDispatch, useSelector} from 'react-redux';
import {setTermsPage} from '../../redux/TitleSlice';
import {setMemberShipData} from '../../redux/SummerySlice';
import SelectDrop from '../../components/InputField/SelectDrop';
import {appFont} from '../../utilities/appFont';

const MemberReg1 = ({navigation, route}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const {userType, profileData} = useSelector(state => state.auth);
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    gender: '',
    email: '',
    number: '',
  });
  const [drop, setDrop] = useState(false);

  // update ProfileDate if UserExist

  const gender = ['female', 'male', 'Transgender'];

  useEffect(() => {
    if (userType == 'user' && profileData) {
      setMemberInfo({
        name: profileData.name,
        gender: profileData.gender,
        email: profileData.email,
        number: profileData.number,
      });
    }
    if (route.params.memberShipData) {
      dispatch(setMemberShipData(route.params.memberShipData));
    }
  }, [profileData]);

  // useEffect(() => {
  //   if (isFocus) {
  //     setTimeout(() => {
  //       dispatch(setTermsPage(true));
  //     }, 100);
  //   } else if (!isFocus) {
  //     dispatch(setTermsPage(false));
  //   }
  // }, [isFocus]);

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
      name: yup.string('must be string').required('Name is required'),
      gender: yup.string().required('select gender'),
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
      number: yup
        .string()
        .required('Mobil Number is required')
        .min(10, 'invalid Mobile Number'),
    })
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: memberInfo,
    resolver: yupResolver(schema),
  });

  // reset data for state updation in useForms
  useEffect(() => {
    reset(memberInfo);
  }, [memberInfo, reset]);

  // navigation:
  const onPressSend = data => {
    reset();
    dispatch(setMemberShipData(data));
    isValid && navigation.navigate('member_2');
  };

  // handleDrop //@@
  const handleDrop = () => {
    setDrop(true);
    setTimeout(() => setDrop(false), 100);
  };

  // onFocus input:   //@@
  const onFocus = event => {
    if (textFocus.current) {
      textFocus.current.scrollToFocusedInput(event.target);
    }
    handleDrop();
  };

  return (
    <Pressable
      style={{flex: 1}}
      onPress={handleDrop} //@@
    >
      <MemberRegCard textFocus={textFocus}>
        {/* form */}
        <View style={{width: '100%', marginBottom: widthResponse ? 25 : 35}}>
          {/* Name */}
          <Controller
            name="name"
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
                iconSize={widthResponse ? 18 : 22}
                Title={'Your Name'}
                onChangeText={onChange}
                formError={errors.name}
                onFocus={onFocus} //@@
              />
            )}
          />
          <View style={{marginBottom: 10}}>
            <Controller
              name="gender"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <>
                  <SelectDrop
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    title={'Gender'}
                    placeholder={'Select your gender'}
                    options={gender}
                    dark
                    drop={drop}
                  />
                </>
              )}
            />
            {errors.gender && (
              <Text
                style={{
                  marginTop: 3,
                  color: appColor.formError,
                  fontSize: fontScalling(1.6),
                  fontFamily: appFont.rR,
                }}>
                {errors.gender.message}
              </Text>
            )}
          </View>
          {/* Number */}
          <Controller
            name="number"
            control={control}
            render={({field: {onChange, value}}) => (
              <InputText
                placeholder={'Enter mobile number'}
                value={value}
                customStyle={{flex: 1}}
                dark
                leftIcon
                keyboardType={'numeric'}
                maxLength={10}
                icon={'Feather'}
                iconName={'phone'}
                iconSize={widthResponse ? 18 : 22}
                Title={'Mobile Number'}
                onChangeText={onChange}
                formError={errors.number}
                onFocus={onFocus} //@@
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
                iconSize={widthResponse ? 18 : 22}
                Title={'Email Address'}
                onChangeText={onChange}
                formError={errors.email}
                onFocus={onFocus} //@@
              />
            )}
          />
        </View>
        {/* Next */}
        <PrimaryButton
          Title={'Next'}
          onPress={handleSubmit(onPressSend)}
          altStyle={{elevation: 10}}
        />
      </MemberRegCard>
    </Pressable>
  );
};

export default MemberReg1;
