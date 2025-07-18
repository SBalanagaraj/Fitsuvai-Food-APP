import {Image, Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
} from '../../utilities/helperFunction';

import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import StepHeading from '../../components/Card/StepHeading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useDispatch} from 'react-redux';
import {setassesMentIds, setSummeryContent} from '../../redux/SummerySlice';
import SelectDrop from '../../components/InputField/SelectDrop';

const Step1 = ({handlePage}) => {
  const appColor = appColors();
  const textFocus = useRef();
  const dispatch = useDispatch();

  const [keyboardIsVisible, setKeyboardVisible] = useState(false);
  const activity = ['sedentary', 'moderate', 'very active'];
  const [drop, setDrop] = useState(false);

  // validation in personal info:
  const schema = yup
    .object()
    .shape({
      age: yup
        .number()
        .required('Please enter your current age')
        .min(13, 'Age must grater than 13')
        .max(90, 'Age must less than 90')
        .typeError('Age must be a number'),
      weight: yup
        .number()
        .required('Please enter your weight')
        .min(30, 'Please enter a value greater than or equal to 30.')
        .max(360, 'Please enter a value less than or equal to 360.')
        .typeError('Weight must be a number'),
      height: yup
        .number()
        .required('Please provide your height in foot')
        .min(121.92, 'Please enter a value greater than or equal to 121.92')
        .max(250, 'Please enter a value less than or equal to 250')
        .typeError('Height must be a number'),
      activity: yup.string().required('Select your activity'),
    })
    .required();

  //  useForms
  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: {errors, isValid},
  } = useForm({resolver: yupResolver(schema)});

  // Watch for changes in form fields
  const currentValues = watch();

  function calculateBMI(weight = 0, height = 0) {
    const bmi = (weight / (height / 100) ** 2).toFixed(1);
    let bmi_percentage = ((Number(bmi) - 18.5) * 100) / (30 - 18.5);
    bmi_percentage = bmi_percentage <= 100 ? bmi_percentage : 100;
    // dispatch(setSummeryContent({bmi: bmi}));
    return bmi; // Return BMI rounded to two decimal places
  }

  const handleNext = data => {
    if (isValid) {
      const bmi = calculateBMI(data.weight, data.height);
      if (bmi > 0) {
        dispatch(setSummeryContent({bmi: bmi}));
        dispatch(setSummeryContent(data));
        Keyboard.dismiss();
        handlePage(1);
      }
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    // Cleanup the listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: scrnHeight / 1.8,
        paddingHorizontal: 20,
        paddingBottom: 45,
        // borderWidth:1
      }}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{
          // paddingVertical: 60,
          paddingBottom: keyboardIsVisible ? 290 : 60,
        }}
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={400}
        ref={textFocus}
        showsVerticalScrollIndicator={false}>
        {/* Number */}
        <Controller
          name="age"
          control={control}
          render={({field: {onChange, value}}) => (
            <InputText
              autoFocus={true}
              row
              placeholder={'Enter Your age'}
              value={value}
              leftIcon
              keyboardType={'numeric'}
              Title={'Age'}
              onChangeText={onChange}
              formError={errors.age}
              onFocus={event => {
                textFocus.current.scrollToFocusedInput(event.target);
              }}
            />
          )}
        />

        {/* Number */}
        <Controller
          name="weight"
          control={control}
          render={({field: {onChange, value}}) => (
            <InputText
              row
              placeholder={'Enter your Weight'}
              value={value}
              leftIcon
              keyboardType={'numeric'}
              Title={'Weight(KG)'}
              onChangeText={onChange}
              formError={errors.weight}
              onFocus={event => {
                textFocus.current.scrollToFocusedInput(event.target);
              }}
            />
          )}
        />
        {/* Number */}
        <Controller
          name="height"
          control={control}
          render={({field: {onChange, value}}) => (
            <InputText
              row
              placeholder={'Enter your Height'}
              value={value}
              keyboardType={'numeric'}
              Title={'Height (CM)'}
              onChangeText={onChange}
              formError={errors.height}
              onFocus={event => {
                textFocus.current.scrollToFocusedInput(event.target);
              }}
            />
          )}
        />
        <Controller
          name="activity"
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <SelectDrop
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                title={'Select a Life Style'}
                placeholder={'Select your Activity level'}
                options={activity}
                optionsHeight={200}
                altStyle={{zIndex: 1000}}
                drop={drop}
              />
            </>
          )}
        />
        {errors.activity && (
          <Text
            style={{
              marginTop: 3,
              color: appColor.formError,
              fontSize: fontScalling(1.6),
              fontFamily: appFont.rR,
            }}>
            {errors.activity.message}
          </Text>
        )}
        <PrimaryButton
          Title={'NEXT'}
          onPress={handleSubmit(handleNext)}
          altStyle={{marginTop: 30, zIndex: -4}}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Step1;

const styles = StyleSheet.create({});
