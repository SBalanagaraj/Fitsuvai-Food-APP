import {View, Text, StyleSheet, TextInput, Pressable, BackHandler} from 'react-native';
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
  bmiBasedValues,
  isFloat,
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
import {Icon} from '../../utilities/icon';
import {CoupanBlock} from '../../components/Card/CouponCard';
import Coupon from './Coupon';

  const Summary = ({navigation, route}) => {
    const {styles} = useStyle();
    const appColor = appColors();
    const showToast = useShowToast();
 
  const [promoCode, setpromoCode] = useState('');
  const [paymentLoad, setPaymentLoad] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const dispatch = useDispatch();
  
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
      normalWeight: 24.9,
      overWeight: 22.9,
      overedWeight: 40,
      note: 'The Delivery Timing will be as per fitsuvai Standards!',
    };
  
    var merchantTransactionId = '';
    var merchantUserId = '';
    var PaymentStatus = 'paid';
    var paymentData = '';
  const {
    planDays,
    planAmmount,
    memberShipData,
    summeryContent,
    assesMentIds,
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

    let tef = bmr * 0.1;

    let tdee = (
      bmr *
        (memberData.activity == 'Sedentary'
          ? 1.2
          : memberData.activity == 'Moderately Active'
          ? 1.55
          : 1.725) +
      tef
    ).toFixed(isFloat ? 2 : 0);

    //   const goalNames = userSettings?.macro_formula
    //     ? userSettings?.macro_formula?.map(data => data.goal.toLowerCase())
    //     : [];
    //   const index = goalNames?.findIndex(data => {
    //     return data == (summeryContent[0]?.yourGoal).toLowerCase();
    //   });

    //   const macroObj =
    //     index != -1
    //       ? {
    //           protein: userSettings.macro_formula[index].protein / 100,
    //           carbs: userSettings.macro_formula[index].carbs / 100,
    //           fats: userSettings.macro_formula[index].fats / 100,
    //         }
    //       : {
    //           protein: 0,
    //           carbs: 0,
    //           fats: 0,
    //         };

    //   let proteins = ((tdee * macroObj.protein) / 4).toFixed(2);
    //   let carbs = ((tdee * macroObj.carbs) / 4).toFixed(2);
    //   let fats = ((tdee * macroObj.fats) / 9).toFixed(2);
    //   // console.log(proteins, carbs, fats, 'macro nutrients');

    let ideal_protein;
    let cdiff;
    let cdiffaction;
    let carb_fat_total;
    let carb_only;
    let fat_only;
    let protein_cal_gm = 4;
    let carb_cal_gm = 4;
    let fat_cal_gm = 9;

    if (tdee && summeryContent[0]?.yourGoal) {
      const goal = summeryContent[0]?.yourGoal?.toLowerCase();
      if (goal == 'fat loss') {
        ideal_protein = 2.5;
        cdiff = 500;
        cdiffaction = 1;
        carb_fat_total = 2.3;
        carb_only = 1.5;
        fat_only = 0.8;
      } else if (goal == 'muscle gain') {
        ideal_protein = 2;
        cdiff = 300;
        cdiffaction = 2;
        carb_fat_total = 3.5;
        carb_only = 2.5;
        fat_only = 1;
      } else if (goal == 'weight maintanence') {
        ideal_protein = 1.8;
        cdiff = 0;
        cdiffaction = 0;
        carb_fat_total = 2.8;
        carb_only = 2;
        fat_only = 0.8;
      }
    }

    const finalTdee =
      cdiffaction == 1
        ? Number(tdee) - Number(cdiff)
        : cdiffaction == 2
        ? Number(tdee) + Number(cdiff)
        : cdiffaction == 0
        ? tdee
        : 0;

    let protein_c =
      (memberShipData.weight * ideal_protein).toFixed(2) * protein_cal_gm;
    let protein_p = (protein_c / finalTdee) * 100;
    let carbs_p = ((100 - protein_p) / carb_fat_total) * carb_only;
    let fats_p = ((100 - protein_p) / carb_fat_total) * fat_only;
    let carbs_c = (finalTdee + carbs_p / 100) / carb_cal_gm;
    let fats_c = (finalTdee + fats_p / 100) / fat_cal_gm;

    let proteins = (memberShipData.weight * ideal_protein).toFixed(
      isFloat ? 2 : 0,
    );
    let carbs = ((finalTdee * (carbs_p / 100)) / carb_cal_gm).toFixed(
      isFloat ? 2 : 0,
    );
    let fats = ((finalTdee * (fats_p / 100)) / fat_cal_gm).toFixed(
      isFloat ? 2 : 0,
    );

    tdee = Number(finalTdee).toFixed(isFloat ? 2 : 0);
    //   console.log(tdee, 'tdee');
    //   console.log(proteins, 'proteins');
    //   console.log(carbs, 'carbs');
    //   console.log(fats, 'fats');
    //   console.log(ideal_protein, 'ideal_protein');

    dispatch(
      setMemberShipData({
        bmr: bmr.toFixed(isFloat ? 2 : 0),
        tef: tef.toFixed(isFloat ? 2 : 0),
        tdee: tdee,
        proteins: proteins,
        carbs: carbs,
        fats: fats,
      }),
    );
  };
  calculateFitness(memberShipData);
}, []);

  const ifComparePrice =
    summeryContent[6].context == 'edit' &&
    parseFloat(planAmmount.totalamt) -
      parseFloat(editPlanDetails.totalAmount) <=
      0;
  const ifComparePriceIsMore =
    summeryContent[6].context == 'edit' &&
    parseFloat(planAmmount.totalamt) - parseFloat(editPlanDetails.totalAmount) >
      0;

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
                  setBtnDisabled(false);
                }
                console.log(resp, 'transsaction status in phonepe');
              })
              .catch(err => {
                setPaymentLoad(false);
                setBtnDisabled(false);
                console.log(err, 'error in transsaction');
              });
          }
        })
        .catch(err => {
          setPaymentLoad(false);
          setBtnDisabled(false);
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
        <View
          style={{
            width: '58%',
            paddingLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text style={[styles.roboto_light]}>{value}</Text>
          {keys.toLowerCase() == 'bmi' && (
            <Text
              style={[
                styles.roboto_light,
                {color: bmiBasedValues(value).bmiColor},
              ]}>
              {`  ( ${bmiBasedValues(value).bmiCategory} )`}
            </Text>
          )}
        </View>
      </View>
    );
  };

  //apply Promo code -------------//
  const toapplyPromocode = async () => {
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
      console.log(err, 'check-err');
    }
  };
  
  // handlepromoCode
  const handlepromoCode = async () => {
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

  // ------------- BMI indicator Fn -------
  // BMI Percentage
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
    setBtnDisabled(true);
    if (isValid && !btnDisabled) {
      if (ifComparePrice) {
        apiCall();
      } else {
        toPhonepeSubmit();
      }
    }
  };

  // print(customFoodRenewal, 'finalCustomizeFood');
  const transformStructure = finalCustomizeFood.reduce((acc, curr, index) => {
    const dateKey = Object.keys(curr)[0];
    const dateValue = curr[dateKey];
    const keyWord =
      summeryContent[6].context === 'edit' ? 'breakfast' : 'Breakfast';
    // print(finalCustomizeFood, 'finalCustomizeFood');
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
                        main_image,
                        offer,
                        cname,
                        count,
                        offer_price,
                      }) => ({
                          id,
                          name,
                          image,
                          main_image,
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
                        main_image,
                        offer,
                        cname,
                        count,
                        offer_price,
                      }) => ({
                          id,
                          name,
                          image,
                          main_image,
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
                        main_image,
                        offer,
                        cname,
                        count,
                        offer_price,
                      }) => ({
                          id,
                          name,
                          image,
                          main_image,
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

  // customFoodPlan day's finding function
  const datesWithId =
    Object.keys(transformStructure).length > 0
      ? Object.keys(transformStructure).filter(date =>
          Object.values(transformStructure[date]).some(
            meal => Array.isArray(meal) && meal.some(item => item.id),
          ),
        )
      : 0;

  const allPlanDays = datesWithId?.length > 0 ? datesWithId?.length : planDays;

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
              trainerStatus: memberShipData.trainerStatus,
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
        if (resparse.status == 'success') {
          if (resparse?.user_data) {
            dispatch(setUserType('user'));
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
                weight: resparse.weight,
                height: resparse.height,
                age: resparse.age,
                bmi: resparse.bmi,
                activity: resparse.activity,
                bmr: resparse.bmr,
                tef: resparse.tef,
                tdee: resparse.tdee,
                goal: resparse.goal,
                mac_protein: resparse.mac_protein,
                mac_calories: resparse.mac_calories,
                mac_fats: resparse.mac_fats,
              }),
            );

            dispatch(userSettingApi());
          }
          // setPaymentLoad(false);
          // navigation.navigate('thanksScreen', {
          //   page: 'summary',
          //   id: resparse?.id,
          // });
          setPaymentLoad(false);
          showToast('success', '', resparse.message, 2000);
          navigation.reset({
            index: 0,
            routes: [{name: 'home'}],
          });
          navigation.navigate('thanksScreen', {
            page: 'summary',
            id: resparse?.id,
          });

        }
        setBtnDisabled(false);
      } else {
        print(response.status, 'status in summary screen');
      }
      setPaymentLoad(false);
      setBtnDisabled(false);
    } catch (e) {
      setPaymentLoad(false);
      setBtnDisabled(false);
      console.log(e, 'error in summary screen');
    }
  };

  useEffect(() => {
    dispatch(userSettingApi());
  }, []);

  return paymentLoad ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
          <LottieView
            autoPlay={true}
            style={{width: 200, height: 200, top: 5}}
            source={require('../../../assets/lottieFiles/load.json')}
          />
        </View>
      ) : (
        <MainOverflowCard borderRadius={40} altStyle={{paddingTop: 22}}>
          <>
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
              <DetailCard
                keys={'Height'}
                value={`${memberShipData.height}' cm`}
              />
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
                <BMIValue val={summary.overedWeight} name={'Obese Weight'} />
              </View>
            </View>
          </View>

          <View
            style={{
                 width: scrnWidth,
                 left: -23,
            }}>
            {allPlanDays && (
              <View style = {{marginHorizontal: 20}}>
              <NutritionCard
                perDayValue={true}
                data={nutrientsList}
                days={Number(allPlanDays)}
              />
              </View>
            )}
            {/* Coupon code block */}
                      <View
                        style={{
                          marginHorizontal: 25,
                          borderRadius: 10,
                          marginBottom: 15,
                        }}>
                        <OrderPriceContainer
                          data={planAmmount}
                          km={planAmmount.km}
                          pinkColor={true}
                          feePerMeal={true}
                        />
                      </View>
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
            {/* Voucher */}
          {summeryContent[6].context != 'edit' &&
            ifComparePriceIsMore &&
            userType == 'user' && (
              <View
                style={{
                  paddingTop: widthResponse ? 10 : 20, //@@
                  paddingHorizontal: 20,
                }}>
                <CoupanBlock
                  applied={planAmmount?.discount?.code == null}
                  type={'assessment'}
                  onpress={() => {
                    navigation.navigate('coupon', {
                      type: 'assessment',
                      days: allPlanDays,
                    });
                  }}
                />
                              {planAmmount?.discount?.code == null && (
                  <Coupon
                    route={{
                      params: {
                        distance: '',
                        type: 'assessment',
                        days: allPlanDays,
                      },
                    }}
                  />
                )}
              </View>
            )}
          {summeryContent[6].context != 'edit' && userType == 'user' && (
            <View
              style={{
                paddingTop: widthResponse ? 10 : 20, //@@
                paddingHorizontal: 20,
              }}>
                <CoupanBlock
                  applied={planAmmount?.discount?.code == null}
                  type={'assessment'}
                  onpress={() => {
                    navigation.navigate('coupon', {
                      type: 'assessment',
                      days: allPlanDays,
                    });
                  }}
                />
              {planAmmount?.discount?.code == null && (
                <Coupon
                  route={{
                    params: {
                      distance: '',
                      type: 'assessment',
                      days: allPlanDays,
                    },
                  }}
              />
                )}
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
    </>
    </MainOverflowCard>
  );
};

export default Summary;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    dots: {
      width: widthResponse ? 15 : 23,
      height: widthResponse ? 15 : 23,
      borderWidth: widthResponse ? 4.5 : 6.3,
      borderRadius: 30,
      borderColor: appColor.themeYellow,
      backgroundColor: appColor.bgWhite,
    },
    trackCont: {
      width: '80%',
      alignSelf: 'center',
      alignItems: 'center',
      height: widthResponse ? 10 : 14,
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
      height: widthResponse ? 5 : 7,
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
