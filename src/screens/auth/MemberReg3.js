import {View, Text, Image, Pressable} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useIsFocused} from '@react-navigation/native';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {yupResolver} from '@hookform/resolvers/yup';
// file import:
import appColors from '../../utilities/appColors';
import {
  cleanTimeString,
  currencyConvertor,
  fontScalling,
  isTimeInRange,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import MemberRegCard from '../../components/Card/MemberRegCard';
import SelectDrop from '../../components/InputField/SelectDrop';
import {appFont} from '../../utilities/appFont';
import DatePick from '../../components/InputField/DatePick';
import ButtonDropDown from '../../components/InputField/ButtonDropDown';
import {
  setExpectedDeliveryTime,
  setMemberShipData,
  setRenewalCustomFood,
} from '../../redux/SummerySlice';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import RadioButton from '../../components/Buttons/RadioButton';
import {InputText} from '../../components/InputField/InputText';
import ExpectedTime from '../../components/InputField/ExpectedTime';

const MemberReg3 = ({navigation}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const {userSettings} = useSelector(state => state.setting);
  const {planAmmount} = useSelector(state => state.summary);
  const [vesselDropDown, setVesselDropDown] = useState(false);
  const [chooseDates, setChooseDates] = useState([]); //BN
  const [drop, setDrop] = useState(false);
  const [informations, setInformations] = useState({
    oil_preference: '',
    spice_preference: '',
    food_container: '',
    from_date: '',
    are_you_busy: '',
  });
  const [expectedTimes, setExpectedTimes] = useState({
    Breakfast: {
      time: '',
      devision: 'AM',
      isValid: false,
      isErrValid: false,
    },
    Lunch: {
      time: '',
      devision: 'PM',
      isValid: false,
      isErrValid: false,
    },
    Dinner: {
      time: '',
      devision: 'PM',
      isValid: false,
      isErrValid: false,
    },
  });

  const {
    customFoodDateCount,
    customFoodRenewal,
    summeryContent,
    onlyCustomPlan,
  } = useSelector(state => state.summary);
  const {PlanPriceInfo} = UserPlanPrice();

  // validation:
  const schema = yup
    .object()
    .shape({
      oil_preference: yup.string().required('Select Oil'),
      spice_preference: yup.string().required('Select spices'),
      food_container:
        summeryContent[8].oneTimePurchase == '1'
          ? yup.string()
          : yup.string().required('Select packaging type'),
      from_date: onlyCustomPlan
        ? yup.string().notRequired()
        : yup.string().required('Select Your subscribtion'),
      are_you_busy: yup.string().required('Please select any one Options'),
      cooking_comments: yup.string().required('please enter cooking comments '),
      dislikes: yup.string().required('please enter dislikes '),
    })
    .required();

  // form State:enterenter
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {errors, isValid},
  } = useForm({defaultValues: informations, resolver: yupResolver(schema)});

  // Watch for changes in form fields
  const currentValues = watch();

  // handleDrop //@@
  const handleDrop = () => {
    setDrop(true);
    setTimeout(() => setDrop(false), 100);
  };

  // navigation:
  const onPressSend = data => {
    if (
      isValid &&
      expectedTimes.Breakfast.isErrValid &&
      expectedTimes.Lunch.isErrValid &&
      expectedTimes.Dinner.isErrValid
    ) {
      dispatch(
        setMemberShipData({
          from_date: onlyCustomPlan ? '' : data.from_date,
          oil_preference: data.oil_preference,
          spice_preference: data.spice_preference,
          are_you_busy: data.are_you_busy,
          cooking_comments: data.cooking_comments,
          dislikes: data.dislikes,
        }),
        dispatch(
          setExpectedDeliveryTime({
            BreakfastTime: `${expectedTimes.Breakfast.time}`,
            LunchTime: `${expectedTimes.Lunch.time}`,
            DinnerTime: `${expectedTimes.Dinner.time}`,
          }),
        ),
      );
      navigation.navigate('summary', {screen: 'member3'});
    }

    // reset();
  };

  const handleValid = () => {
    handleSubmit(onPressSend)();
    setExpectedTimes(preData => {
      return {
        ...preData,
        Breakfast: {...preData.Breakfast, isValid: true},
        Lunch: {...preData.Lunch, isValid: true},
        Dinner: {...preData.Dinner, isValid: true},
      };
    });
  };

  // To Update Selected new date and replace old date
  const replaceKeyWithUpdatedDated = (renewalData, updatedDate) => {
    const dateKey = Object.keys(renewalData);
    const updateDate = {};
    updatedDate.forEach((date, index) => {
      if (index < dateKey.length) {
        updateDate[date] = renewalData[dateKey[index]];
      }
    });
    return updateDate;
  }; //BN

  // during date selection this will render
  useEffect(() => {
    if (
      chooseDates.length > 0 &&
      customFoodRenewal &&
      Object.keys(customFoodRenewal).length > 0
    ) {
      const replaceRenewDate = replaceKeyWithUpdatedDated(
        customFoodRenewal,
        chooseDates,
      );
      dispatch(setRenewalCustomFood(replaceRenewDate));
    }
  }, [chooseDates]); //BN

  return (
    <Pressable
      style={{flex: 1}}
      onPress={handleDrop} //@@
    >
      <MemberRegCard textFocus={textFocus}>
        {/* form */}
        <View style={{width: '100%', marginBottom: widthResponse ? 25 : 35}}>
          {/* from_date */}
          {!onlyCustomPlan && (
            <Controller
              name="from_date"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  // --BN--
                  <DatePick
                    singleSelection={
                      customFoodDateCount != '' && customFoodDateCount > 0
                        ? false
                        : true
                    }
                    value={value}
                    dark
                    // altStyle={{marginBottom: widthResponse ? 10 : 16}}
                    icon={'Feather'}
                    iconName={'star'}
                    iconSize={widthResponse ? 18 : 22}
                    title={
                      customFoodDateCount != '' && customFoodDateCount > 1
                        ? 'Select a available Dates'
                        : 'Start subscription date'
                    }
                    onChange={onChange}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                    chooseDates={setChooseDates}
                    maxDate={
                      customFoodDateCount != '' && customFoodDateCount > 0
                        ? customFoodDateCount
                        : Infinity
                    }
                    selectedDates={chooseDates}
                  />
                );
              }}
            />
          )}
          {errors.from_date && (
            <Text
              style={{
                marginTop: 3,
                color: appColor.formError,
                fontSize: fontScalling(1.6),
                fontFamily: appFont.rR,
              }}>
              {errors.from_date.message}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              marginVertical: widthResponse ? 10 : 16, //@@
              zIndex: 10,
            }}>
            {/* oil */}
            <View style={{flex: 1, marginRight: 10}}>
              {userSettings && //BN
                userSettings.spicy_list &&
                userSettings.spicy_list.length > 0 && (
                  <Controller
                    name="oil_preference"
                    control={control}
                    render={({field: {onChange, value, onBlur}}) => (
                      <SelectDrop
                        placeholder={'Select oil'}
                        title={'Choose your oil'}
                        value={value}
                        options={userSettings.spicy_list}
                        dark
                        optionsHeight={widthResponse ? 80 : 100} //@@
                        icon={'SimpleLineIcons'}
                        iconName={'drop'}
                        iconSize={widthResponse ? 18 : 22}
                        onChange={onChange}
                        onBlur={onBlur}
                        drop={drop}
                        altStyle={{
                          zIndex: 10, //@@
                        }}
                      />
                    )}
                  />
                )}
              {errors.oil_preference && (
                <Text
                  style={{
                    marginTop: 3,
                    color: appColor.formError,
                    fontSize: fontScalling(1.6),
                    fontFamily: appFont.rR,
                  }}>
                  {errors.oil_preference.message}
                </Text>
              )}
            </View>
            {/* spices */}
            <View style={{flex: 1}}>
              {userSettings && //BN
                userSettings.oilPreference &&
                userSettings.oilPreference.length > 0 && (
                  <Controller
                    name="spice_preference"
                    control={control}
                    render={({field: {onChange, value, onBlur}}) => (
                      <SelectDrop
                        placeholder={'Select Spices'}
                        title={'Spice prefrences'}
                        value={value}
                        options={userSettings.oilPreference}
                        dark
                        optionsHeight={widthResponse ? 80 : 100} //@@
                        icon={'MaterialCommunityIcons'}
                        iconName={'food-outline'}
                        iconSize={widthResponse ? 18 : 22}
                        onChange={onChange}
                        onBlur={onBlur}
                        drop={drop}
                        altStyle={{
                          zIndex: 10, //@@
                        }}
                      />
                    )}
                  />
                )}
              {errors.spice_preference && (
                <Text
                  style={{
                    marginTop: 3,
                    color: appColor.formError,
                    fontSize: fontScalling(1.6),
                    fontFamily: appFont.rR,
                  }}>
                  {errors.spice_preference.message}
                </Text>
              )}
            </View>
          </View>
          {/* Packaging type */}
          {summeryContent[8].oneTimePurchase != '1' && (
            <View style={{flex: 1}}>
              {userSettings &&
                userSettings.package &&
                userSettings.package.length > 0 && (
                  <>
                    <Text
                      style={{
                        fontFamily: appFont.rM,
                        color: appColor.white,
                        fontSize: fontScalling(1.7),
                        paddingBottom: 8,
                      }}>
                      Choose Your Container type
                    </Text>
                    <Controller
                      name="food_container"
                      control={control}
                      render={({field: {onChange, value, onBlur}}) => {
                        return (
                          <ButtonDropDown
                            onPress={() => {
                              setVesselDropDown(!vesselDropDown);
                              handleDrop();
                            }}
                            dark
                            dropDown={vesselDropDown}
                            title={
                              value && value != '' ? value : 'Package Type'
                            }
                            active={vesselDropDown}
                            altStyle={{
                              backgroundColor: appColor.bgBlack,
                            }}>
                            <>
                              <View
                                style={{
                                  borderRadius: 7,
                                  backgroundColor: appColor.bgBlack,
                                }}>
                                {userSettings.package.length > 0 &&
                                  vesselDropDown &&
                                  userSettings.package.map((data, index) => {
                                    const packagePrice =
                                      data.one_time_purchase == 1
                                        ? data.price
                                        : data.price * planAmmount.dishCount;

                                    return (
                                      <Pressable
                                        key={index}
                                        onPress={() => {
                                          onChange(data.name);
                                          if (planAmmount) {
                                            PlanPriceInfo(
                                              planAmmount.subTotal,
                                              {
                                                code: null,
                                                percent:
                                                  planAmmount.discount.percent,
                                              },
                                              planAmmount.sectionCount,
                                              planAmmount.km,
                                              'checkDistance',
                                              packagePrice,
                                              data.name,
                                              planAmmount.dishCount,
                                            );
                                          }
                                          dispatch(
                                            setMemberShipData({
                                              food_container: data,
                                            }),
                                          );
                                          setVesselDropDown(false);
                                        }}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'flex-start',
                                          marginHorizontal: 10,
                                          paddingTop: 5,
                                          borderBottomWidth:
                                            index !=
                                            userSettings.package.length - 1
                                              ? 0.2
                                              : 0,
                                          borderColor: appColor.borderColor,
                                        }}>
                                        <Image
                                          resizeMode="contain"
                                          source={{uri: data.image}}
                                          style={{width: 40, height: 40}}
                                        />
                                        <Text
                                          style={[
                                            {
                                              color: appColor.white,
                                              paddingLeft: 15,
                                              fontFamily: appFont.bR,
                                            },
                                          ]}>
                                          {data.name}
                                          {'  ' + currencyConvertor(data.price)}
                                        </Text>
                                      </Pressable>
                                    );
                                  })}
                              </View>
                            </>
                          </ButtonDropDown>
                        );
                      }}
                    />
                  </>
                )}
              {errors.food_container && (
                <Text
                  style={{
                    // marginTop: 3,
                    color: appColor.formError,
                    fontSize: fontScalling(1.6),
                    fontFamily: appFont.rR,
                  }}>
                  {errors.food_container.message}
                </Text>
              )}
            </View>
          )}
          {/* Cooking comments & Dislikes  */}
          <View
            style={{
              flexDirection: 'row',
              // alignItems: 'center',
              marginTop: 2,
            }}>
            {/* Cooking */}
            <Controller
              name="cooking_comments"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  value={value}
                  customStyle={{flex: 1, marginRight: 10}}
                  Title="Cooking Comments"
                  placeholder="Enter Cooking Comments"
                  leftIcon //@@
                  dark
                  icon="FontAwesome"
                  iconName="comments"
                  iconSize={widthResponse ? 18 : 25} //@@
                  // autoCapitalize="none"
                  onChangeText={onChange}
                  formError={errors.cooking_comments}
                  // onFocus={event => {
                  //   textFocus.current.scrollToFocusedInput(event.target);
                  // }}
                />
              )}
            />
            {/* Dislikes */}
            <Controller
              name="dislikes"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  value={value}
                  dark
                  customStyle={{flex: 1}}
                  leftIcon
                  Title="Dislikes"
                  placeholder="Enter Dislike Comments"
                  iconName="dislike2"
                  icon="AntDesign"
                  iconSize={widthResponse ? 18 : 25} //@@
                  onChangeText={onChange}
                  formError={errors.dislikes}
                  // onFocus={event => {
                  //   if (!formValid) {
                  //     textFocus.current.scrollToFocusedInput(event.target);
                  //   }
                  // }}
                />
              )}
            />
          </View>
          {userSettings &&
            userSettings.delivery_slots &&
            userSettings.delivery_slots[1][1] &&
            userSettings.delivery_slots[1][1].map((data, index) => {
              let time = data?.split(' ');
              const section = time?.shift();
              {
                print(expectedTimes[section].time, 'section Time');
              }
              const slot_times = time.join(' ').split('-');
              const startTime = cleanTimeString(slot_times[0]);
              const endTime = cleanTimeString(slot_times[1]);
              const expectedTime = `${expectedTimes[section].time}`;
              const timeValid = isTimeInRange(expectedTime, startTime, endTime);
              return (
                <View
                  key={index}
                  style={{
                    zIndex:
                      index == 0 ? 15 : index == 1 ? 10 : index == 2 ? 5 : null,
                  }}>
                  <ExpectedTime
                    dark={true}
                    title={`${data.split(' ')[0]} Expected delivery Time:`}
                    placeholder={`Enter Time btwn ${time.join(' ')}`}
                    value={expectedTimes[section]} // Bind devision value
                    onChange={setExpectedTimes}
                    error={timeValid}
                    section={section}
                  />
                </View>
              );
            })}

          <Controller
            name="are_you_busy"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <>
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: appFont.rR,
                      fontSize: fontScalling(1.8),
                      color: appColor.white,
                    }}>
                    Get delivered without OTP confirmation. (Contactless
                    delivery)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RadioButton
                      onPress={() => {
                        onChange('yes');
                      }}
                      dark
                      text={'Yes'}
                      altStyle={{
                        width: 'auto',
                        marginRight: widthResponse ? 10 : 15,
                      }}
                      isChecked={
                        currentValues.are_you_busy == 'yes' ? true : false
                      } //@@
                    />
                    <RadioButton
                      onPress={() => {
                        onChange('no');
                      }}
                      dark
                      text={'No'}
                      altStyle={{width: 'auto'}}
                      isChecked={
                        currentValues.are_you_busy == 'no' ? true : false
                      } //@@
                    />
                  </View>
                </>
              );
            }}
          />
          {errors.are_you_busy && (
            <Text
              style={{
                // marginTop: 3,
                color: appColor.formError,
                fontSize: fontScalling(1.6),
                fontFamily: appFont.rR,
              }}>
              {errors.are_you_busy.message}
            </Text>
          )}
        </View>
        {/* Next */}
        <PrimaryButton
          Title={'Summary'}
          onPress={handleValid}
          altStyle={{elevation: 10}}
        />
      </MemberRegCard>
    </Pressable>
  );
};

export default MemberReg3;
