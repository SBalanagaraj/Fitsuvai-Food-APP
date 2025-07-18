import {View, Text, StyleSheet, TextInput, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import * as Animatable from 'react-native-animatable';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  print,
  currencyConvertor,
} from '../../utilities/helperFunction';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useShowToast} from '../../components/Toast/ToastAlert';
import CheckBox from '../../components/InputField/CheckBox';
import {StackActions, useIsFocused} from '@react-navigation/native';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import OrderPriceContainer from '../../components/Card/OrderPriceContainer';
import {useDispatch, useSelector} from 'react-redux';
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import sha256 from 'sha256';
import base64 from 'react-native-base64';
import {url} from '../../utilities/appApi';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import {setProfileData, setUserType} from '../../redux/authSlice';
import {userSettingApi} from '../../redux/SettingSlice';
import LottieView from 'lottie-react-native';
import NutritionCard from '../../components/Card/NutritionCard';
import {setMemberShipData} from '../../redux/SummerySlice';

const Summary = ({navigation, route}) => {
  const {styles} = useStyle();
  const appColor = appColors();
  const showToast = useShowToast();
  const [promoCode, setpromoCode] = useState('');
  const dispatch = useDispatch();

  const [paymentLoad, setPaymentLoad] = useState(false);

  const {PlanPriceInfo} = UserPlanPrice();
  const screen =
    route && route?.params && route?.params?.screen
      ? route?.params?.screen
      : '';

  useEffect(() => {
    if (screen != '' && screen == 'member3') {
      const backEvent = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.dispatch(StackActions.popToTop());
          navigation.navigate('noTab', {screen: 'member_3'});
          // navigation.goBack();
          return true;
        },
      );
      return () => backEvent.remove();
    }
  }, []);

  const summary = {
    underWeight: 18.5,
    normalWeight: 22,
    overWeight: 25,
    overedWeight: 30,
    note: 'The Delivery Timing will be as per fitsuvai Standards!',
  };

  var merchantTransactionId = '';
  var merchantUserId = '';
  var PaymentStatus = 'paid';
  var paymentData = '';

  const {
    planAmmount,
    memberShipData,
    summeryContent,
    finalCustomizeFood,
    customFoodDateCount,
    customFoodRenewal,
    editPlanDetails,
    nutrientsList,
    expectedDishTime,
  } = useSelector(state => state.summary);

  const {userSettings} = useSelector(state => state.setting);
  const {userType} = useSelector(state => state.auth);
  const isFocus = useIsFocused();

  // calculate the fitness function:
  useEffect(() => {
    const calculateFitness = memberData => {
      let bmr =
        10 * memberData.weight + 6.25 * memberData.height - 5 * memberData.age;
      bmr = memberData.gender == 'Female' ? bmr - 161 : bmr + 5;
      console.log(bmr, 'bmr');

      let tef = bmr * 0.1;
      console.log(tef, 'tef');

      let tdee = (
        bmr *
          (memberData.activity == 'Sedentary'
            ? 1.2
            : memberData.activity == 'Moderately Active'
            ? 1.55
            : 1.725) +
        tef
      ).toFixed(2);
      console.log(tdee, 'tdee');

      const calories =
        (summeryContent[0]?.yourGoal).toLowerCase() ==
        'Muscle gain'.toLowerCase()
          ? [0.3, 0.5, 0.2]
          : (summeryContent[0]?.yourGoal).toLowerCase() ==
            'Fat Loss'.toLowerCase()
          ? [0.4, 0.3, 0.3]
          : (summeryContent[0]?.yourGoal).toLowerCase() ==
            'Weight Maintanence'.toLowerCase()
          ? [0.3, 0.4, 0.3]
          : [0, 0, 0];

      let proteins = ((tdee * calories[0]) / 4).toFixed(2);
      let carbs = ((tdee * calories[1]) / 4).toFixed(2);
      let fats = ((tdee * calories[2]) / 9).toFixed(2);
      console.log(proteins, carbs, fats, 'macro nutrients');

      dispatch(
        setMemberShipData({
          bmr: bmr.toFixed(2),
          tef: tef.toFixed(2),
          tdee: tdee,
          proteins: proteins,
          carbs: carbs,
          fats: fats,
        }),
      );
    };
    calculateFitness(memberShipData);
  }, []);

  // print(expectedDishTime,'edt');

  const ifComparePrice =
    summeryContent[6].context == 'edit' &&
    parseFloat(planAmmount.totalamt) -
      parseFloat(editPlanDetails.totalAmount) <=
      0;
  const ifComparePriceIsMore =
    summeryContent[6].context == 'edit' &&
    parseFloat(planAmmount.totalamt) - parseFloat(editPlanDetails.totalAmount) >
      0;

  // BN
  const PriceCard = ({
    title,
    value,
    symbol,
    color = appColor.black,
    altStyle,
  }) => {
    return (
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
            paddingBottom: 10,
            paddingHorizontal: 10,
          },
          altStyle,
        ]}>
        <Text style={[styles.subText, {flex: 1}]}>{title} </Text>
        <Text>:</Text>
        {
          <Text
            style={[
              styles.subText,
              {
                flex: 1,
                textAlign: 'right',
                fontFamily: appFont.rB,
                color: color,
                fontSize:
                  color == appColor.gold
                    ? fontScalling(2.2)
                    : fontScalling(1.8),
              },
            ]}>
            {symbol == '+' ? '+ ' : symbol == null ? null : '- '}
            {typeof value == 'number'
              ? currencyConvertor(Number(value).toFixed(2))
              : '---'}
          </Text>
        }
      </View>
    );
  };

  // reset the data:
  useEffect(() => {
    if (!isFocus) {
      reset();
    }
  }, [isFocus]);

  // for phonePe payment
  const generateTransactionId = () => {
    const timeStamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000000);
    const merchantPrefix = 'T';
    return `${merchantPrefix}${timeStamp}${randomNumber}`;
  };

  const generateUserId = () => {
    const timeStamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000000);
    const merchantPrefix = 'UI';
    return `${merchantPrefix}${timeStamp}${randomNumber}`;
  };

  // phone pe payment start function
  const toPhonepeSubmit = async () => {
    if (userSettings && userSettings.PHONEPE) {
      const environment =
        userSettings.PHONEPE.mode == 0 ? 'SANDBOX' : 'PRODUCTION';
      const merchantId = userSettings.PHONEPE.merchantId;
      merchantTransactionId = generateTransactionId();
      merchantUserId = generateUserId();
      const appId = 'grocarto';
      const enableLoggin = true;
      setPaymentLoad(true);
      PhonePePaymentSDK.init(environment, merchantId, appId, enableLoggin)
        .then(resp => {
          if (resp && planAmmount?.totalamt) {
            const requestBody = {
              merchantId: merchantId,
              merchantTransactionId: merchantTransactionId,
              merchantUserId: merchantUserId,
              amount:
                Number(
                  ifComparePriceIsMore
                    ? parseFloat(planAmmount.totalamt) -
                        parseFloat(editPlanDetails.totalAmount)
                    : parseFloat(planAmmount?.totalamt),
                ).toFixed(0) * 100, //BN
              callbackUrl: 'https://webhook.site/callback-url',
              mobileNumber: memberShipData.number,
              paymentInstrument: {
                type: 'PAY_PAGE',
              },
            };
            const saltKey = userSettings.PHONEPE.api;
            const saltIndex = userSettings.PHONEPE.saltIndex;
            const payload = JSON.stringify(requestBody);
            const payloadMain = base64.encode(payload);
            const string = payloadMain + '/pg/v1/pay' + saltKey;
            const checkSum = sha256(string) + '###' + saltIndex;
            PhonePePaymentSDK.startTransaction(
              payloadMain,
              checkSum,
              'com.fitsuvai',
              null,
            )
              .then(resp => {
                if (resp.status == 'SUCCESS') {
                  PaymentStatus = 'paid';
                  paymentData = payload;
                  apiCall(paymentData);
                } else {
                  setPaymentLoad(false);
                }
                console.log(resp, 'transsaction status in phonepe');
              })
              .catch(err => {
                setPaymentLoad(false);
                console.log(err, 'error in transsaction');
              });
          }
        })
        .catch(err => {
          setPaymentLoad(false);
          console.log(err, 'init ERROR');
        });
    }
  };

  const DetailCard = ({keys, value}) => {
    const {styles} = useStyle();
    const appColor = appColors();

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: widthResponse ? 5 : 10,
        }}>
        <View style={{width: '35%', paddingRight: widthResponse ? 5 : 10}}>
          <Text style={[styles.roboto_light]}>{keys}</Text>
        </View>
        <Text style={[styles.roboto_light]}>:</Text>
        <View style={{width: '58%', paddingLeft: 15}}>
          <Text style={[styles.roboto_light]}>{value}</Text>
        </View>
      </View>
    );
  };

  //apply Promo code -------------//
  const toapplyPromocode = async () => {
    // setLoad(true);
    const fdata = new FormData();
    if (userSettings?.userInfo?.user_id) {
      fdata.append('userId', userSettings?.userInfo?.user_id);
    }
    fdata.append('code', promoCode);
    fdata.append('context', 'assessment');
    try {
      const apply = await fetch(url().promoCode, {
        method: 'POST',
        body: fdata,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let respo = await apply.json();

      if (respo.message) {
        // setLoad(false);
        if (respo.percent) {
          if (planAmmount) {
            PlanPriceInfo(
              planAmmount.subTotal,
              {
                code: promoCode,
                percent: parseInt(respo.percent),
              },
              planAmmount.sectionCount,
              planAmmount.km,
              'checkDistance',
              planAmmount.vesselPrice,
              planAmmount.vesselName,
              planAmmount.dishCount,
            );
          }
        } else {
          setpromoCode('');
        }
        showToast('custom', respo.message, '', 1500);
      }
    } catch (err) {
      // setLoad(false);
      console.error(err, 'check-err');
    }
  };

  // handlepromoCode
  const handlepromoCode = async () => {
    console.log(promoCode, 'promoCode');
    const validpromoCode = promoCode && promoCode.trim().length != 0;
    if (!validpromoCode) {
      validpromoCode
        ? null
        : showToast('error', 'promoCode field is Empty', 1000);
    } else {
      validpromoCode
        ? null
        : showToast('error', 'promoCode field is Empty', 1000);
      toapplyPromocode();
    }
  };

  function calculateBMIPercentage(bmi) {
    const lowerLimit = 18.5;
    const upperLimit = 30;

    // Ensure BMI is within the range of interest
    if (bmi < lowerLimit) {
      return 0; // Below healthy range
    } else if (bmi > upperLimit) {
      return 100; // Above healthy range
    }

    // Calculate the BMI as a percentage within the healthy range
    const bmiPercentage =
      ((bmi - lowerLimit) / (upperLimit - lowerLimit)) * 100;
    return bmiPercentage.toFixed(2); // Return percentage rounded to 2 decimal places
  }

  // Example usage:
  const bmi = memberShipData.bmi;
  const percentage = calculateBMIPercentage(bmi);

  let bmi_percentage =
    ((Number(memberShipData.bmi) - 18.5) * 100) / (30 - 18.5);
  bmi_percentage = bmi_percentage <= 100 ? bmi_percentage : 100;

  const BMIValue = ({val, name}) => {
    return (
      <View style={{paddingHorizontal: 5, width: '25%'}}>
        <Text style={[styles.baby_blk, {textAlign: 'center'}]}>{val}</Text>
        <Text style={[styles.roboto_light, {textAlign: 'center'}]}>{name}</Text>
      </View>
    );
  };

  // validation:
  const schema = yup
    .object()
    .shape({
      checkbox: yup
        .boolean()
        .required()
        .oneOf([true], 'You must accept the terms and conditions'),
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
    if (isValid) {
      if (ifComparePrice) {
        apiCall();
      } else {
        toPhonepeSubmit();
      }
      reset();
    }
  };

  const transformStructure = finalCustomizeFood.reduce((acc, curr, index) => {
    const dateKey = Object.keys(curr)[0];
    const dateValue = curr[dateKey];
    const keyWord =
      summeryContent[6].context === 'edit' ? 'breakfast' : 'Breakfast';

    if (dateValue) {
      acc[dateKey] = {
        breakfast:
          dateValue[keyWord]?.length > 0
            ? (() => {
                const filteredBreakFast = dateValue[keyWord]?.filter(
                  data => Object.keys(data).length !== 0,
                );
                return filteredBreakFast.length > 0
                  ? filteredBreakFast.map(
                      ({
                        id,
                        name,
                        image,
                        offer,
                        cname,
                        count,
                        offer_price,
                      }) => ({
                        id,
                        name,
                        image,
                        offer_price: offer ? offer : offer_price,
                        category: cname,
                        count,
                      }),
                    )
                  : false; // Set to false if the resulting array is empty
              })()
            : false, // Set to false if array is empty initially
        lunch:
          dateValue['lunch']?.length > 0
            ? (() => {
                const filteredLunch = dateValue['lunch']?.filter(
                  data => Object.keys(data).length !== 0,
                );
                return filteredLunch.length > 0
                  ? filteredLunch.map(
                      ({
                        id,
                        name,
                        image,
                        offer,
                        cname,
                        count,
                        offer_price,
                      }) => ({
                        id,
                        name,
                        image,
                        offer_price: offer ? offer : offer_price,
                        category: cname,
                        count,
                      }),
                    )
                  : false; // Set to false if the resulting array is empty
              })()
            : false, // Set to false if array is empty initially
        dinner:
          dateValue['dinner']?.length > 0
            ? (() => {
                const filteredDinner = dateValue['dinner']?.filter(
                  data => Object.keys(data).length !== 0,
                );
                return filteredDinner.length > 0
                  ? filteredDinner.map(
                      ({
                        id,
                        name,
                        image,
                        offer,
                        cname,
                        count,
                        offer_price,
                      }) => ({
                        id,
                        name,
                        image,
                        offer_price: offer ? offer : offer_price,
                        category: cname,
                        count,
                      }),
                    )
                  : false; // Set to false if the resulting array is empty
              })()
            : false, // Set to false if array is empty initially
      };
    }
    return acc;
  }, {});

  // print(transformStructure, 'transformStructure');
  // print(planAmmount, 'planAmmount');

  //BN
  const apiCall = async (paymentData = '') => {
    try {
      const isRenewCustomPlan =
        customFoodDateCount != '' && customFoodDateCount > 0;

      // request data for backend:
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      const formData = new FormData();
      formData.append('context', summeryContent[6].context);
      if (
        summeryContent[6].context != 'renew' &&
        summeryContent[6].context != 'edit'
      ) {
        formData.append('membershipInfo', JSON.stringify(memberShipData));
      } else if (
        summeryContent[6].context == 'renew' ||
        summeryContent[6].context == 'edit'
      ) {
        if (summeryContent[7]?.subscriptionId) {
          formData.append('id', summeryContent[7].subscriptionId);
        }
        if (
          ifComparePrice &&
          parseFloat(planAmmount.totalamt) -
            parseFloat(editPlanDetails.totalAmount) !=
            0
        ) {
          formData.append(
            'returnAmount',
            Math.abs(
              parseFloat(planAmmount.totalamt) -
                parseFloat(editPlanDetails.totalAmount),
            ),
          );
        }
        if (summeryContent[6].context != 'edit') {
          formData.append(
            'summaryInfo',
            JSON.stringify({
              email: memberShipData.email,
              name: memberShipData.name,
              gender: memberShipData.gender,
              number: memberShipData.number,
              flatno: memberShipData.flatno,
              pincode: memberShipData.pincode,
              street: memberShipData.street,
              city: memberShipData.city,
              state: memberShipData.state,
              nearLocation: memberShipData.nearLocation,
              is_weekEnd: memberShipData.is_weekEnd,
              from_date: isRenewCustomPlan
                ? memberShipData.from_date.split(' - ')[0]
                : memberShipData.from_date,
              to_date: isRenewCustomPlan
                ? memberShipData.from_date.split(' - ')[1]
                : '',
              oil_preference: memberShipData.oil_preference,
              spice_preference: memberShipData.spice_preference,
              food_container: memberShipData.food_container,
              are_you_busy: memberShipData.are_you_busy,
            }),
          );
        }
      }
      formData.append('orderTot', JSON.stringify(planAmmount));
      if (summeryContent[6].context == 'edit' && ifComparePriceIsMore) {
        formData.append('payment', 'phonepe');
        formData.append('paymentStatus', PaymentStatus);
      } else if (
        summeryContent[6].context == 'renew' ||
        summeryContent[6].context == 'save_assessment'
      ) {
        formData.append('payment', 'phonepe');
        formData.append('paymentStatus', PaymentStatus);
        if (expectedDishTime && expectedDishTime.BreakfastTime != '') {
          formData.append(
            'breakfast_delivery_time',
            expectedDishTime.BreakfastTime,
          );
          formData.append('lunch_delivery_time', expectedDishTime.LunchTime);
          formData.append('dinner_delivery_time', expectedDishTime.DinnerTime);
        }
      }
      if (
        memberShipData?.membership == '' &&
        finalCustomizeFood?.length > 0 &&
        summeryContent[6].context != 'renew' &&
        customFoodDateCount == ''
      ) {
        formData.append('menu_card', JSON.stringify(transformStructure));
      }
      if (
        customFoodDateCount != '' &&
        customFoodDateCount > 0 &&
        summeryContent[6].context != 'edit'
      ) {
        formData.append('menu_card', JSON.stringify(customFoodRenewal));
      }
      if (userSettings?.userInfo?.user_id && userType == 'user') {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      if (paymentData != '') {
        formData.append('paymentData', JSON.stringify(paymentData));
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
        header: myHeaders,
      };
      // get the response:
      const response = await fetch(
        summeryContent[6].context == 'renew'
          ? url().subscriptions
          : summeryContent[6].context == 'edit'
          ? url().subscriptions
          : url().assesment,
        requestOptions,
      );
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'success') {
          if (resparse?.user_data) {
            dispatch(
              setProfileData({
                userId: resparse.user_data.user_id,
                name: resparse.user_data.first_name,
                email: resparse.user_data.email,
                number: resparse.user_data.phone,
                gender: resparse.user_data.gender,
                flatNumber: resparse.user_data.flat,
                pincode: resparse.user_data.pincode,
                street: resparse.user_data.street,
                city: resparse.user_data.city,
                state: resparse.user_data.state,
                profile_picture: {
                  uri: resparse.user_data.picture,
                  name: 'profile.jpeg',
                  type: 'image/jpeg',
                },
              }),
            );
            dispatch(setUserType('user'));
            dispatch(userSettingApi());
          }
          setPaymentLoad(false);
          navigation.navigate('thanksScreen', {page: 'summary'});
          showToast('success', '', resparse.message, 2000);
        }
      } else {
        setPaymentLoad(false);
        showToast('info', '', 'Something went wrong', 2000);
        print(response.status, 'status in checkout screen');
      }
    } catch (e) {
      setPaymentLoad(false);
      console.log(e, 'error in checkout screen');
    }
  };

  return (
    <>
      {paymentLoad ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            autoPlay={true}
            style={{width: 200, height: 200, top: 5}}
            source={require('../../../assets/lottieFiles/load.json')}
          />
        </View>
      ) : (
        <MainOverflowCard borderRadius={40} altStyle={{paddingTop: 22}}>
          <View
            style={{
              borderRadius: 20,
              borderWidth: 1,
              width: '100%',
              marginBottom: widthResponse ? 20 : 30,
              overflow: 'hidden',
              borderColor: appColor.TextInputborderbg,
            }}>
            {/* details */}
            <View
              style={{
                paddingVertical: widthResponse ? 10 : 15,
                paddingHorizontal: widthResponse ? 15 : 20,
              }}>
              <DetailCard keys={'Name'} value={memberShipData.name} />
              <DetailCard keys={'Email Address'} value={memberShipData.email} />
              <DetailCard keys={'Phone'} value={memberShipData.number} />
              <DetailCard keys={'Gender'} value={memberShipData.gender} />
              <DetailCard keys={'Age'} value={memberShipData.age} />
              {summeryContent[0]?.yourGoal && (
                <DetailCard keys={'Goal'} value={summeryContent[0]?.yourGoal} />
              )}
              <DetailCard
                keys={'Weight'}
                value={`${memberShipData.weight}' Kg`}
              />
              <DetailCard keys={'Height'} value={memberShipData.height} />
              <DetailCard keys={'BMI'} value={memberShipData.bmi} />
            </View>
            {/* BMI scale */}
            <View
              style={{
                backgroundColor: appColor.greyBg,
                padding: widthResponse ? 15 : 20,
              }}>
              <Text
                style={[
                  styles.baby_blk,
                  {
                    textAlign: 'center',
                    fontSize: fontScalling(2.7),
                    marginBottom: fontScalling(2.2),
                  },
                ]}>
                BMI Scale
              </Text>
              {/* BMI track */}
              <View style={[styles.trackCont]}>
                <View
                  style={[
                    styles.track,
                    {
                      width: `${percentage}%`,
                    },
                  ]}
                />
                <View style={[styles.dots]} />
                <View style={[styles.dots]} />
                <View style={[styles.dots]} />
                <View style={[styles.dots]} />
              </View>
              {/* BMI values */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <BMIValue val={summary.underWeight} name={'Under Weight'} />
                <BMIValue val={summary.normalWeight} name={'Normal Weight'} />
                <BMIValue val={summary.overWeight} name={'Over Weight'} />
                <BMIValue val={summary.overedWeight} name={'Overed Weight'} />
              </View>
            </View>
          </View>
          {/* bill details */}
          {/* <Text
            style={[
              styles.baby_blk,
              {
                fontSize: fontScalling(2.7),
                marginBottom: widthResponse ? 15 : 20,
              },
            ]}>
            Bill Details
          </Text> */}
          <View
            style={{
              width: scrnWidth,
              left: -23,
            }}>
            <NutritionCard data={nutrientsList} />
            {/* overflow view */}
            <OrderPriceContainer
              data={planAmmount}
              km={planAmmount.km}
              pinkColor={true}
              feePerMeal={true}
              // orders={true}
            />
            {summeryContent[6]?.context == 'edit' && editPlanDetails && (
              <Animatable.View
                animation={'zoomIn'}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  backgroundColor: appColor.subtotalBack,
                  marginVertical: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <PriceCard
                  title={'Already Paid amount '}
                  value={parseFloat(editPlanDetails.totalAmount)}
                />
                <PriceCard
                  title={
                    parseFloat(planAmmount.totalamt) -
                      parseFloat(editPlanDetails.totalAmount) <
                    0
                      ? 'Return amount	'
                      : 'Remaining amount to Pay	'
                  }
                  value={Math.abs(
                    parseFloat(planAmmount.totalamt) -
                      parseFloat(editPlanDetails.totalAmount),
                  )}
                  altStyle={{paddingBottom: 0}}
                />
              </Animatable.View>
            )}
            {/* Voucher */}
            {summeryContent[6].context != 'edit' && ifComparePriceIsMore && (
              <View
                style={{
                  backgroundColor: appColor.black,
                  paddingVertical: widthResponse ? 15 : 20,
                  paddingHorizontal: 23,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    backgroundColor: appColor.Textlightblack,
                    borderRadius: 30,
                    padding: 5,
                    paddingLeft: 20,
                  }}>
                  <TextInput
                    placeholder="Enter code / voucher"
                    placeholderTextColor={appColor.placeHolderText}
                    style={{
                      flex: 1,
                      paddingHorizontal: 15,
                      fontSize: fontScalling(1.8),
                      fontFamily: appFont.rR,
                      color: appColor.textWhite,
                    }}
                    value={promoCode}
                    onChangeText={value => {
                      setpromoCode(value);
                    }}
                  />
                  <Animatable.View
                    animation={'slideInLeft'}
                    duration={1000}
                    onTouchEnd={() => {
                      handlepromoCode();
                    }}
                    style={{
                      justifyContent: 'center',
                      borderRadius: 30,
                      backgroundColor: appColor.white,
                    }}>
                    <Text
                      style={[
                        styles.baby_blk,
                        {paddingHorizontal: 30, fontSize: fontScalling(2.5)},
                      ]}>
                      Apply code
                    </Text>
                  </Animatable.View>
                </View>
              </View>
            )}
            {summeryContent[6].context != 'edit' && (
              <View
                style={{
                  backgroundColor: appColor.black,
                  paddingVertical: widthResponse ? 15 : 20,
                  paddingHorizontal: 23,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    backgroundColor: appColor.Textlightblack,
                    borderRadius: 30,
                    padding: 5,
                    paddingLeft: 20,
                  }}>
                  <TextInput
                    placeholder="Enter code / voucher"
                    placeholderTextColor={appColor.placeHolderText}
                    style={{
                      flex: 1,
                      paddingHorizontal: 15,
                      fontSize: fontScalling(1.8),
                      fontFamily: appFont.rR,
                      color: appColor.textWhite,
                    }}
                    value={promoCode}
                    onChangeText={value => {
                      setpromoCode(value);
                    }}
                  />
                  <Animatable.View
                    animation={'slideInLeft'}
                    duration={1000}
                    onTouchEnd={() => {
                      handlepromoCode();
                    }}
                    style={{
                      justifyContent: 'center',
                      borderRadius: 30,
                      backgroundColor: appColor.white,
                    }}>
                    <Text
                      style={[
                        styles.baby_blk,
                        {paddingHorizontal: 30, fontSize: fontScalling(2.5)},
                      ]}>
                      Apply code
                    </Text>
                  </Animatable.View>
                </View>
              </View>
            )}
          </View>
          <Controller
            name="checkbox"
            control={control}
            render={({field: {onChange, value}}) => (
              <CheckBox
                checkBox={value}
                color
                onPress={() => {
                  onChange(!value);
                }}
                altStyle={{
                  marginTop: widthResponse ? 20 : 25,
                }}
                terms
                // label={'I agree to the terms and conditions of Fitsuvai'}
              />
            )}
          />
          {errors.checkbox && (
            <Text
              style={{
                marginTop: 8,
                color: appColor.formError,
                fontSize: fontScalling(1.6),
                fontFamily: appFont.rR,
              }}>
              {errors.checkbox.message}
            </Text>
          )}
          {/* Pay now */}
          {summeryContent[6].context != 'edit' && (
            <PrimaryButton
              Title={'Pay now'}
              onPress={handleSubmit(onPressSend)}
              parentStyle={{marginVertical: widthResponse ? 15 : 20}}
            />
          )}
          {summeryContent[6].context == 'edit' && ifComparePriceIsMore ? (
            <PrimaryButton
              Title={'Pay now'}
              onPress={handleSubmit(onPressSend)}
              parentStyle={{marginVertical: widthResponse ? 15 : 20}}
            />
          ) : summeryContent[6].context == 'edit' ? (
            <PrimaryButton
              Title={'Apply Now'}
              onPress={handleSubmit(onPressSend)}
              parentStyle={{marginVertical: widthResponse ? 15 : 20}}
            />
          ) : null}
          {/* note */}
          <View style={{marginBottom: 20}}>
            <Text
              style={[
                styles.roboto_light,
                {
                  textTransform: 'uppercase',
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.9),
                  marginBottom: widthResponse ? 5 : 10,
                },
              ]}>
              NOTE:
            </Text>
            <Text style={styles.roboto_light}>{summary.note}</Text>
          </View>
        </MainOverflowCard>
      )}
    </>
  );
};

export default Summary;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    dots: {
      width: 15,
      height: 15,
      borderWidth: 4.5,
      borderRadius: 30,
      borderColor: appColor.themeYellow,
      backgroundColor: appColor.bgWhite,
    },
    trackCont: {
      width: '80%',
      alignSelf: 'center',
      alignItems: 'center',
      height: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: appColor.black,
      borderRadius: 10,
      marginBottom: 15,
    },
    track: {
      position: 'absolute',
      left: 0,
      borderRadius: 50,
      backgroundColor: appColor.themeYellow,
      height: 5,
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.8),
      color: appColor.black,
    },
  });

  return {styles};
};
