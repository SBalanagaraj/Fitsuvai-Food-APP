import {
  BackHandler,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import {
  scrnWidth,
  fontScalling,
  print,
  currencyConvertor,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {url} from '../../utilities/appApi';
import {SvgCssUri} from 'react-native-svg';
import {SubscriptionOverviewShimmer} from '../../utilities/appShimmer';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import FilterButton from '../../components/Buttons/FilterButton';
import {
  setCustomFoodDateCount,
  setEditPlanDetails,
  setMemberShipData,
  setNutrients,
  setOnlyCustomPlan,
  setRenewalCustomFood,
  setSummeryContent,
} from '../../redux/SummerySlice';
import {userSettingApi} from '../../redux/SettingSlice';
import {formatedDate} from '../../utilities/helperFunction';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const SubscribedPlanDetail = ({route}) => {
  const {styles} = useStyles();
  const appColor = appColors();
  const [planDetails, setPlanDetail] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [foodModal, setFoodModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [ordered_foods, setOrderedFoods] = useState({});
  const [renewData, setRenewData] = useState([]); //BN
  const [renewalPrice, setRenewalPrice] = useState(0); //BN
  const [updatedFoodData, setUpdatedFoodData] = useState({}); //BN

  const navigation = useNavigation();

  const {userSettings} = useSelector(state => state.setting);
  const {planAmmount, nutrientsList} = useSelector(state => state.summary);
  const showToast = useShowToast();
  const {PlanPriceInfo} = UserPlanPrice();
  const activity = {sedentary: 1.2, moderate: 1.55, 'very active': 1.725};

  const isFocus = useIsFocused();

  const dispatch = useDispatch();

  const deleteAnimRef = useRef(null);

  // ----- BN -----
  const apiCall = async context => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      if (Object.keys(planDetails).length == 0) {
        setLoad(true);
      }
      // myHeaders.append('Content-Type', 'multipart/form-data');
      const formData = new FormData();
      formData.append('context', context);
      if (route.params.id) {
        formData.append('id', route.params.id);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
        // header: myHeaders,
      };
      // get the response:
      const response = await fetch(url().subscriptions, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          if (context == 'planDetail') {
            setPlanDetail(resparse.data);
            if (resparse?.renew_data?.food_data) {
              setRenewData(resparse?.renew_data);
            }
          } else if (context == 'cancel') {
            if (deleteAnimRef.current) {
              deleteAnimRef.current.play(0, 150);
            }
            setTimeout(() => {
              navigation.navigate('subscriptionPlanHistory');
            }, 1000);
          }
        }
        setLoad(false);
        setRefresh(false);
      } else {
        print(response.status, 'status in supscription detail');
        setLoad(false);
        setRefresh(false);
      }
    } catch (e) {
      console.log(e, 'error in supscription detail');
      setLoad(false);
      setRefresh(false);
    }
  };

  const DetailCard = ({keys, value}) => {
    const {styles} = useStyles();
    const appColor = appColors();
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: widthResponse ? 5 : 10,
        }}>
        <View style={{width: '55%', paddingRight: widthResponse ? 5 : 10}}>
          <Text style={[styles.roboto_light]}>{keys}</Text>
        </View>
        <Text style={[styles.roboto_light, {flex: 1}]}>:</Text>
        <View style={{width: '44%', paddingLeft: 15}}>
          <Animatable.Text
            style={[
              styles.roboto_light,
              {
                color: appColor.gold,
                fontFamily: appFont.rR,
                // textTransform: 'capitalize',
              },
            ]}>
            {Object.keys(activity).includes(value)
              ? `${activity[value]} ( ${
                  value == 'moderate' ? 'Moderately Active' : value //this value only to show modified this name
                } )`
              : value}
          </Animatable.Text>
        </View>
      </View>
    );
  };

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      apiCall('planDetail');
      dispatch(userSettingApi());
    }
  }, [refresh]);

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall('planDetail');
    }
  }, []);

  print(renewData, 'renewData');

  // useEffect(() => {
  //   if (isFocus) {
  //     const backHandler = () => {
  //       navigation.navigate('Profile', {
  //         screen: 'subscriptionPlanHistory',
  //       });
  //     };
  //     BackHandler.addEventListener('hardwareBackPress', backHandler);
  //     return () => {
  //       BackHandler.removeEventListener('hardwareBackPress', backHandler);
  //     };
  //   }
  // }, [isFocus]);

  // BN
  const PriceCard = ({title, value, symbol, color = appColor.black}) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          paddingBottom: 10,
          paddingHorizontal: 10,
        }}>
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

  function handleMenu(date) {
    if (planDetails && planDetails?.menu) {
      setOrderedFoods({date: date, sections: planDetails.menu[date]});
      setFoodModal(true);
    }
  }

  // Here we Renewal the old Price to Updated Price
  function updateFoodDataPriceWithSuggestions(food_data, suggestions) {
    // Create a map of suggestions based on their ID for quick lookup
    const suggestionsMap = suggestions.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});
    // Iterate through each date in the food_data structure
    for (const date in food_data) {
      const meals = food_data[date];

      // Iterate through each meal type (e.g., breakfast, lunch, dinner) on the current date
      for (const mealType in meals) {
        const mealItems = meals[mealType];

        // Check if meal items are not 'false' (i.e., meal has food items)
        if (mealItems && Array.isArray(mealItems)) {
          // Update each food item in the meal with the latest data from suggestions, if available
          meals[mealType] = mealItems
            .filter(item => {
              return item.id == suggestionsMap[item.id]?.id;
            })
            .map(item => {
              const suggestion = suggestionsMap[item.id];
              // If a matching suggestion is found, update the item's properties
              if (suggestion) {
                return {
                  ...item,
                  name: suggestion.name,
                  image: suggestion.image,
                  offer_price: suggestion.offer,
                  category: suggestion.category,
                  vitamins: suggestion.vitamins,
                  minerals: suggestion.minerals,
                  fats: suggestion.fats,
                  carbs: suggestion.carbs,
                  calories: suggestion.calories,
                  protein: suggestion.protein,
                  // add other properties as needed
                };
              }
              return item; // If no suggestion found, keep the item unchanged
            });
        }
      }
    }
    return calculateTotalPrice(food_data);
  }

  // This function will calculate Total price of updated Food
  function calculateTotalPrice(food_data) {
    let totalPrice = 0;
    let totalCount = 0;
    let totalProtein = 0;
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    if (food_data) {
      setUpdatedFoodData(food_data);
    }
    // Iterate through each date in the food_data structure
    for (const date in food_data) {
      const meals = food_data[date];

      // Iterate through each meal type (e.g., breakfast, lunch, dinner)
      for (const mealType in meals) {
        const mealItems = meals[mealType];

        // Check if meal items are not 'false' (i.e., meal has food items)
        if (mealItems && Array.isArray(mealItems)) {
          // Add up the total price for each item in the meal
          mealItems.forEach(item => {
            const itemPrice = parseFloat(item.offer_price) || 0; // Ensure price is a number
            const itemCount = item.count || 1; // Default count to 1 if not provided
            const itemProtein = item.protein;
            const itemCarbs = item.carbs;
            const itemCalories = item.calories;
            const itemFats = item.fats;

            totalPrice += itemPrice * itemCount; // Multiply price by count
            totalCount += itemCount;
            totalProtein += itemProtein * itemCount;
            totalCalories += itemCalories * itemCount;
            totalCarbs += itemCarbs * itemCount;
            totalFats += itemFats * itemCount;
          });
        }
      }
    }
    return {
      updatedPrice: totalPrice.toFixed(2),
      totalCount,
      totalProtein,
      totalCalories,
      totalCarbs,
      totalFats,
    }; // Return the total price as a string with two decimal places
  }

  // Renew Plan Updated Price
  useEffect(() => {
    if (
      renewData &&
      renewData?.food_data &&
      userSettings &&
      userSettings?.suggestions
    ) {
      // Example usage
      const updatedFoodDataPrice = updateFoodDataPriceWithSuggestions(
        renewData?.food_data,
        userSettings?.suggestions,
      );
      setRenewalPrice(updatedFoodDataPrice);
    }
  }, [renewData, userSettings]);

  return (
    <>
      {load ? (
        <SubscriptionOverviewShimmer />
      ) : (
        <>
          {Object.keys(planDetails).length > 0 ? (
            <MainOverflowCard
              onRefresh={onRefresh}
              refresh={refresh}
              altStyle={{paddingHorizontal: 5}}>
              <Text
                style={[
                  styles.HeadingText,
                  {textAlign: 'center', paddingTop: 20},
                ]}>
                Subscription
              </Text>
              {planDetails?.id && (
                <Text
                  style={[
                    styles.subText,
                    {
                      textAlign: 'center',
                      paddingBottom: 5,
                      color: appColor.greyBack,
                      textDecorationLine: 'underline',
                      fontSize: fontScalling(1.8),
                    },
                  ]}>
                  Order ID : {`#${planDetails?.id}`}
                </Text>
              )}
              <Text style={[styles.subText, {textAlign: 'center'}]}>
                Enjoy Complete benefits by subscribing for exclusive food
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: appColor.borderColor,
                  borderRadius: 10,
                  marginVertical: 15,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: appColor.borderColor,
                    backgroundColor: appColor.cardbg,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      ComponentName={'FontAwesome6'}
                      name={'crown'}
                      size={20}
                      color={appColor.themeYellow}
                    />
                    <Text
                      style={{
                        fontFamily: appFont.bB,
                        fontSize: fontScalling(3),
                        marginBottom: widthResponse ? -3 : -6, //@@
                        color: appColor.black,
                        marginLeft: 10,
                        marginRight: 10,
                      }}>
                      best deal
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View //@@
                      style={{
                        borderRadius: 50,
                        overflow: 'hidden',
                        // marginRight: 5,
                      }}>
                      <Text
                        style={[
                          styles.billing,
                          {
                            backgroundColor: appColor.lightBlue2,
                            marginRight: 10,
                          },
                        ]}>
                        {planDetails.membership}
                      </Text>
                    </View>
                    {planDetails.plan_status && (
                      <View //@@
                        style={{
                          borderRadius: 50,
                          overflow: 'hidden',
                        }}>
                        <Text
                          style={[
                            styles.billing,
                            {
                              backgroundColor:
                                planDetails.plan_status == 'Active'
                                  ? appColor.active
                                  : planDetails.plan_status == 'Pending'
                                  ? appColor.gold
                                  : appColor.deactive,
                            },
                          ]}>
                          {planDetails.plan_status}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: appColor.borderColor,
                  }}>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      // justifyContent: 'space-between',
                      paddingBottom: 5,
                    }}>
                    <Text
                      onPress={() => {
                        setPriceModal(!priceModal);
                      }}
                      style={{
                        fontFamily: appFont.rB,
                        fontSize: fontScalling(3),
                        color: appColor.black,
                        marginLeft: 5,
                        marginRight: 10,
                        letterSpacing: -0.5,
                      }}>
                      {currencyConvertor(planDetails.amount_paid)}
                    </Text>
                    {/* BN */}
                    <Pressable
                      onPress={() => {
                        setPriceModal(!priceModal);
                      }}>
                      <Icon
                        ComponentName={'Entypo'}
                        name={'info-with-circle'}
                        size={22}
                        color={appColor.gold} //BN
                      />
                    </Pressable>
                  </Pressable>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}>
                    <Text style={styles.subText}>
                      Subscribed on{' '}
                      <Text
                        style={{
                          fontFamily: appFont.rB,
                          color: appColor.boldBlacktext,
                        }}>
                        {formatedDate(planDetails.start_date)}
                      </Text>
                    </Text>
                    <Text style={[styles.subText, {marginHorizontal: 8}]}>
                      |
                    </Text>
                    <Text style={styles.subText}>
                      End on{' '}
                      <Text
                        style={{
                          fontFamily: appFont.rB,
                          color: appColor.boldBlacktext,
                        }}>
                        {formatedDate(planDetails.end_date)}
                      </Text>
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.HeadingText,
                      {
                        fontSize: fontScalling(2.4),
                        color: appColor.gold,
                        paddingTop: 10,
                      },
                    ]}>
                    According to your goal:
                  </Text>
                  <Text style={[styles.subText, {paddingBottom: 5}]}>
                    {'          '} Below are the energy(kcal), macro nutrients
                    expectations that you need to meet!
                  </Text>
                  {renewData.bmi && renewData.bmi != '' && (
                    <DetailCard
                      keys={'Body Mass Index (BMI)'}
                      value={renewData.bmi}
                    />
                  )}
                  {renewData.bmr && renewData.bmr != '' && (
                    <DetailCard
                      keys={'Basal Metabolic Rate (BMR))'}
                      value={renewData.bmr}
                    />
                  )}
                  {renewData.activity && renewData.activity != '' && (
                    <DetailCard
                      keys={'Physical Activity Level (PAL)'}
                      value={renewData.activity}
                    />
                  )}
                  {renewData.tef && renewData.tef != '' && (
                    <DetailCard
                      keys={'Thermic Effect of food (TEF)'}
                      value={renewData.tef}
                    />
                  )}
                  {renewData.tdee && renewData.tdee != '' && (
                    <DetailCard
                      keys={'Total Daily Energy Expenditure ( TDEE )'}
                      value={renewData.tdee}
                    />
                  )}
                  {(renewData.proteins ||
                    renewData.carbs ||
                    renewData.fats) && (
                    <>
                      <Text
                        style={[
                          styles.HeadingText,
                          {
                            fontSize: fontScalling(2.4),
                            color: appColor.gold,
                            paddingTop: 10,
                          },
                        ]}>
                        {renewData.goal} Macro Distribution :
                      </Text>

                      <Text style={[styles.subText, {paddingBottom: 5}]}>
                        {'          '}
                        {renewData.goal == 'Fat loss'
                          ? 'For fat loss, the goal is to maintain lean muscle while reducing body fat. Therefore, you’ll consume more protein, moderate carbohydrates, and keep fats at a lower level.'
                          : renewData.goal == 'Muscle gain'
                          ? 'When aiming for muscle gain, the body needs extra energy to build muscle, so carbohydrates are increased, and protein is crucial for muscle repair and growth. A calorie surplus is typically required.'
                          : renewData.goal == 'Weight Maintanence'
                          ? 'For weight maintenance, the goal is to keep the body weight stable by consuming a balanced distribution of macronutrients.'
                          : ''}
                      </Text>
                    </>
                  )}

                  {renewData.proteins && renewData.proteins != '' && (
                    <DetailCard
                      keys={'Proteins'}
                      value={`${renewData.proteins} g`}
                    />
                  )}
                  {renewData.carbs && renewData.carbs != '' && (
                    <DetailCard
                      keys={'Carbohydrates'}
                      value={`${renewData.carbs} g`}
                    />
                  )}
                  {renewData.fats && renewData.fats != '' && (
                    <DetailCard keys={'Fats'} value={`${renewData.fats} g`} />
                  )}
                </View>

                <View
                  style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: appColor.borderColor,
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(2.3),
                      color: appColor.black,
                      marginLeft: 5,
                      marginRight: 20,
                      marginBottom: 10,
                      letterSpacing: -0.5,
                    }}>
                    Your food will deliver for
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}>
                    {planDetails.food_sessions &&
                      planDetails.food_sessions.length > 0 &&
                      planDetails.food_sessions.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: appColor.textBlack,
                              paddingVertical: 2,
                              paddingRight: 10,
                              paddingLeft: 4,
                              borderRadius: 50,
                              marginRight: 8,
                            }}>
                            <Icon
                              ComponentName={'FontAwesome'}
                              name={'check-circle'}
                              size={20}
                              color={appColor.activegreen}
                            />
                            <Text
                              style={[
                                styles.subText,
                                {marginLeft: 6, textTransform: 'capitalize'},
                              ]}>
                              {item}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                </View>

                <View
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(2.3),
                      color: appColor.black,
                      marginLeft: 5,
                      marginRight: 20,
                      letterSpacing: -0.5,
                      verticalAlign: 'bottom',
                    }}>
                    Your Payment method
                  </Text>
                  {planDetails.payment_method != '-' && (
                    <>
                      {planDetails.payment_method &&
                      planDetails.payment_method != null &&
                      planDetails.payment_method != '' &&
                      planDetails.payment_method != '-' &&
                      planDetails.payment_method
                        .split('.')
                        .pop()
                        .toUpperCase() == 'SVG' ? (
                        <SvgCssUri
                          fill={appColor.black}
                          width={80}
                          height={40}
                          uri={planDetails.payment_method}
                          onError={error => {
                            console.error('Failed to load SVG:', error);
                          }}
                        />
                      ) : (planDetails.payment_method != '-' &&
                          planDetails.payment_method
                            .split('.')
                            .pop()
                            .toUpperCase() == 'PNG') ||
                        'JPG' ||
                        'JPEG' ||
                        'WEBG' ? (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            width: 60,
                            height: 40,
                            borderRadius: 10,
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{width: '100%', height: '100%'}}
                            source={{uri: planDetails.payment_method}}
                          />
                        </View>
                      ) : null}
                    </>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                {planDetails?.plan_status != 'Suspended' &&
                planDetails?.plan_status != 'Cancelled' ? (
                  <>
                    <PrimaryButton
                      Title="Cancel subscription"
                      black
                      profile
                      parentStyle={{flex: 1, marginRight: 10}}
                      textStyle={{fontSize: fontScalling(2)}}
                      onPress={() => {
                        setDeleteModal(true);
                      }}
                    />

                    <PrimaryButton
                      download={true}
                      iconName="edit"
                      iconComponent="FontAwesome"
                      Title="Edit Food"
                      profile
                      parentStyle={{flex: 1}}
                      textStyle={{fontSize: fontScalling(2)}}
                      onPress={() => {
                        dispatch(setOnlyCustomPlan(false));
                        if (planDetails.id) {
                          dispatch(
                            setSummeryContent({
                              yourGoal: renewData.goal,
                              context: 'edit',
                              subscriptionId: planDetails.id,
                              oneTimePurchase: '',
                            }),
                          );
                        }

                        PlanPriceInfo(
                          renewalPrice.updatedPrice,
                          {
                            code: null,
                            percent: renewData.discount_percent,
                          },
                          0,
                          0,
                          'dummy',
                          0,
                          '',
                        );

                        dispatch(
                          setEditPlanDetails({
                            vesselPrice: Number(renewData.cointainer_fee),
                            vesselName: renewData.container_name,
                            distance: renewData.distance,
                            totalAmount: renewData.total_amount,
                            OTP_Status: renewData.onetime_purchase,
                            puchasedContainer:
                              renewData.already_purchased_container == '1'
                                ? true
                                : false,
                          }),
                        );
                        dispatch(
                          setMemberShipData({
                            subtotal: renewalPrice.updatedPrice,
                            age: renewData.age,
                            weight: renewData.weight,
                            height: renewData.height,
                            bmi: renewData.bmi,
                            email: renewData.email,
                            name: renewData.name,
                            gender: renewData.gender,
                            number: renewData.phone,
                            oil_preference: renewData.oil_preference,
                            spice_preference: renewData.spice_preference,
                            cooking_comments: renewData.comments,
                            dislikes: renewData.dislikes,
                            activity: renewData.activity,
                            membership: '',
                          }),
                        );

                        navigation.navigate('editFood', {
                          editFoods: updatedFoodData,
                          foodPrice: renewData.subtotal,
                          planId: planDetails?.id,
                        });
                      }}
                    />
                  </>
                ) : (
                  planDetails?.plan_status != 'Cancelled' && (
                    <Animatable.View
                      style={{flexDirection: 'row', flex: 1, marginBottom: 20}}
                      animation={'zoomInDown'}
                      duration={500}>
                      {/* ---BN--- */}
                      <FilterButton
                        load={
                          Object.keys(renewalPrice).length > 0 ? false : true
                        }
                        onPress={() => {
                          PlanPriceInfo(
                            renewalPrice.updatedPrice,
                            {
                              code: null,
                              percent: null,
                            },
                            renewData.section_count,
                            0,
                            'dummy',
                            0,
                            planAmmount.vesselName,
                            renewalPrice.totalCount,
                          );
                          dispatch(setOnlyCustomPlan(false));
                          if (planDetails.id) {
                            dispatch(
                              setSummeryContent({
                                yourGoal: renewData.goal,
                                context: 'renew',
                                subscriptionId: planDetails.id,
                                oneTimePurchase: renewData.onetime_purchase,
                              }),
                            );
                            dispatch(
                              ///@@
                              setMemberShipData({
                                subtotal: renewalPrice.updatedPrice,
                                age: renewData.age,
                                weight: renewData.weight,
                                height: renewData.height,
                                bmi: renewData.bmi,
                                email: renewData.email,
                                name: renewData.name,
                                gender: renewData.gender,
                                number: renewData.phone,
                                oil_preference: renewData.oil_preference,
                                spice_preference: renewData.spice_preference,
                                cooking_comments: renewData.comments,
                                dislikes: renewData.dislikes,
                                activity: renewData.activity,
                                membership: '',
                              }),
                            );
                          }
                          if (
                            planDetails?.membership == 'CUSTOM' &&
                            renewData &&
                            renewData.food_data &&
                            Object.keys(renewData.food_data).length > 0 &&
                            updatedFoodData &&
                            Object.keys(updatedFoodData).length > 0
                          ) {
                            dispatch(setRenewalCustomFood(updatedFoodData));
                            dispatch(
                              setCustomFoodDateCount(
                                Object.keys(renewData.food_data).length,
                              ),
                            );
                          } else {
                            dispatch(setCustomFoodDateCount(''));
                          }

                          if (renewalPrice) {
                            dispatch(
                              setNutrients({
                                totalProtein: renewalPrice.totalProtein,
                                totalCalories: renewalPrice.totalCalories,
                                totalFats: renewalPrice.totalFats,
                                totalCarbs: renewalPrice.totalCarbs,
                              }),
                            );
                          }
                          if (renewalPrice.updatedPrice > 0) {
                            navigation.navigate('noTab', {
                              screen: 'member_1',
                              params: {
                                memberShipData: {
                                  subtotal: renewalPrice.updatedPrice,
                                  age: renewData.age,
                                  weight: renewData.weight,
                                  height: renewData.height,
                                  bmi: renewData.bmi,
                                  food_container: '',
                                },
                              },
                            });
                          } else if (renewalPrice.updatedPrice == 0) {
                            showToast(
                              'custom',
                              'product Out of stock',
                              '',
                              2000,
                            );
                          }
                        }}
                        title={`Renew plan  ${
                          Object.keys(renewalPrice).length > 0
                            ? currencyConvertor(renewalPrice.updatedPrice) +
                              ' For Food'
                            : null
                        }`}
                        altTextStyle={{
                          color: appColor.white,
                          fontFamily: appFont.bB,
                          fontSize: fontScalling(2.5),
                        }}
                        altStyle={{
                          marginVertical: 10,
                          backgroundColor: appColor.gold,
                          paddingVertical: 10,
                          justifyContent: 'center',
                          opacity: 1,
                          borderWidth: 0,
                          flex: 1,
                          borderRadius: 10,
                        }}
                      />
                    </Animatable.View>
                  )
                )}
              </View>

              <View
                style={{
                  width: scrnWidth,
                  backgroundColor: appColor.cardbg,
                  alignSelf: 'center',
                  // marginTop: 20,
                  padding: 20,
                }}>
                <Text
                  style={[
                    styles.HeadingText,
                    {textAlign: 'center', paddingBottom: 10},
                  ]}>
                  Ordered Foods
                </Text>
                {planDetails.ordered_foods &&
                  planDetails.ordered_foods.length > 0 && (
                    <FlatList
                      scrollEnabled={false}
                      data={planDetails.ordered_foods}
                      keyExtractor={(item, index) => index}
                      style={{}}
                      renderItem={({item, index}) => {
                        const foodPresent =
                          item.breakfast != '-' ||
                          item.lunch != '-' ||
                          item.breakfast != '-';
                        // print(item, 'item');
                        return (
                          <View
                            key={index}
                            style={{
                              borderRadius: 10,
                              overflow: 'hidden',
                              marginBottom: 10,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center', //@@
                                backgroundColor: appColor.bgBlack,
                                paddingVertical: 10,
                                paddingHorizontal: 15,
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: appColor.bgBlack,
                                }}>
                                <Text
                                  style={[
                                    styles.subText,
                                    {
                                      color: appColor.white,
                                      fontFamily: appFont.rR,
                                    },
                                  ]}>
                                  Food ordered for -
                                </Text>
                                <Text
                                  style={[
                                    styles.subText,
                                    {
                                      color: appColor.white,
                                      fontFamily: appFont.rB,
                                    },
                                  ]}>
                                  {' '}
                                  {item.date}
                                </Text>
                              </View>
                              {foodPresent && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    // width: '30%',
                                    alignItems: 'center', //@@
                                  }}>
                                  <Text
                                    style={[
                                      styles.subText,
                                      {marginRight: 5, color: appColor.white},
                                    ]}>
                                    Menu
                                  </Text>
                                  <Text
                                    style={[
                                      styles.subText,
                                      {marginRight: 15, color: appColor.white},
                                    ]}>
                                    :
                                  </Text>
                                  {foodPresent && (
                                    <Pressable
                                      onPress={() => handleMenu(item.date)}>
                                      <SvgCssUri
                                        fill={appColor.black}
                                        width={25}
                                        height={25}
                                        uri={url().subscriptionMenuIcon}
                                        // uri={url().qualitySVG}
                                        onError={error => {
                                          console.error(
                                            'Failed to load SVG:',
                                            error,
                                          );
                                        }}
                                      />
                                    </Pressable>
                                  )}
                                </View>
                              )}
                            </View>
                            <View
                              style={{
                                backgroundColor: appColor.white,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: appColor.white,
                                  paddingVertical: 5,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: appColor.white,
                                    justifyContent: 'flex-start',
                                    width: '50%',
                                  }}>
                                  <Text
                                    style={[
                                      styles.subText,
                                      {width: widthResponse ? 80 : 120},
                                    ]}>
                                    Breakfast
                                  </Text>
                                  <Text
                                    style={[styles.subText, {marginRight: 15}]}>
                                    :
                                  </Text>
                                  <Text style={[styles.subText]}>
                                    {item.breakfast}
                                  </Text>
                                </View>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: appColor.white,
                                  paddingVertical: 5,
                                }}>
                                <Text
                                  style={[
                                    styles.subText,
                                    {width: widthResponse ? 80 : 120},
                                  ]}>
                                  Lunch
                                </Text>
                                <Text
                                  style={[styles.subText, {marginRight: 15}]}>
                                  :
                                </Text>
                                <Text style={[styles.subText, {width: '50%'}]}>
                                  {item.lunch}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: appColor.white,
                                  paddingVertical: 5,
                                }}>
                                <Text
                                  style={[
                                    styles.subText,
                                    {width: widthResponse ? 80 : 120},
                                  ]}>
                                  Dinner
                                </Text>
                                <Text
                                  style={[styles.subText, {marginRight: 15}]}>
                                  :
                                </Text>
                                <Text style={[styles.subText, {width: '50%'}]}>
                                  {item.dinner}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                    />
                  )}
              </View>
              {/* ------- food modal --------- */}
              <Modal
                animationType="slide"
                onBackdropPress={() => {
                  setFoodModal(false);
                }}
                backdropColor={appColor.overlayBg}
                backdropOpacity={1}
                transparent={true}
                isVisible={foodModal}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 5,
                  // width: scrnWidth / 1.1,
                  marginHorizontal: 15,
                }}>
                <View
                  style={{
                    backgroundColor: appColor.cardbg,
                    paddingBottom: 15,
                    borderRadius: widthResponse ? 15 : 20, //@@
                    alignItems: 'flex-start',
                    paddingTop: 0,
                    width: '100%',
                    maxHeight: '70%',
                    overflow: 'hidden',
                  }}>
                  {/* Title bar */}
                  <View
                    style={{
                      width: '100%',
                      padding: widthResponse ? 10 : 20, //@@
                      backgroundColor: appColor.gold,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                    {ordered_foods && ordered_foods.date && (
                      <Text
                        style={[
                          styles.subText,
                          {color: appColor.white, fontSize: fontScalling(2.5)},
                        ]}>
                        {`Dishes on ${ordered_foods.date}`}
                      </Text>
                    )}
                    <Pressable
                      onPress={() => {
                        setFoodModal(false);
                      }}>
                      <Icon
                        size={widthResponse ? 22 : 40} //@@
                        color={appColor.white}
                        ComponentName={'AntDesign'}
                        name={'close'}
                      />
                    </Pressable>
                  </View>
                  {/* content bar */}
                  <ScrollView style={{width: '100%'}}>
                    {ordered_foods &&
                      ordered_foods?.sections &&
                      Object.keys(ordered_foods?.sections).map(
                        (item, index) => {
                          // print(ordered_foods?.sections[item], 'sections');
                          return (
                            <View
                              key={index}
                              style={{
                                marginHorizontal: widthResponse ? 15 : 25, //@@
                                // width: scrnWidth / 1.2,
                                // marginBottom: 10,
                              }}>
                              <Text
                                style={[
                                  styles.subText,
                                  {
                                    textTransform: 'capitalize',
                                    paddingBottom: 5,
                                    fontSize: fontScalling(2),
                                  },
                                ]}>
                                {item}
                              </Text>
                              {ordered_foods?.sections[item].map(
                                (data, index) => {
                                  return (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderWidth: 0.5,
                                        borderColor: appColor.borderColor,
                                        padding: widthResponse ? 10 : 15, //@@
                                        borderRadius: 15,
                                        backgroundColor: appColor.white,
                                        marginBottom: 10,
                                        elevation: 1.2,
                                      }}
                                      key={index}>
                                      {data.image != '' && (
                                        <View
                                          style={{
                                            // padding: 10,
                                            backgroundColor: appColor.white,
                                            borderRadius: 10,
                                          }}>
                                          <FastImage
                                            resizeMode="cover"
                                            style={{
                                              width: widthResponse ? 65 : 100, //@@
                                              height: widthResponse ? 65 : 100, //@@
                                              borderRadius: 10,
                                            }}
                                            source={{
                                              priority: FastImage.priority.high,
                                              uri: data.image,
                                            }}
                                          />
                                        </View>
                                      )}
                                      <View
                                        style={{
                                          paddingLeft: widthResponse ? 15 : 25, //@@
                                        }}>
                                        {data.dishname &&
                                          data.dishname != '' && ( //@@
                                            <Text
                                              style={[
                                                styles.normalText,
                                                {
                                                  width: '70%',
                                                  marginBottom: widthResponse
                                                    ? 5
                                                    : 10, //@@
                                                },
                                              ]}>
                                              {`Name : ${data.dishname}`}
                                            </Text>
                                          )}
                                        {data.price &&
                                          data.price != '' && ( //@@
                                            <>
                                              <Text
                                                style={[
                                                  styles.price,
                                                  {
                                                    marginBottom: widthResponse
                                                      ? 5
                                                      : 10, //@@
                                                  },
                                                ]}>
                                                {`Price : ${currencyConvertor(
                                                  Number(
                                                    data.price.split('(')[0],
                                                  ),
                                                )}`}
                                              </Text>
                                              <Text
                                                style={
                                                  styles.price
                                                }>{`(count : ${
                                                data.price.split('(')[1]
                                              }`}</Text>
                                            </>
                                          )}
                                      </View>
                                    </View>
                                  );
                                },
                              )}
                            </View>
                          );
                        },
                      )}
                  </ScrollView>
                </View>
              </Modal>
              {/* -------delete modal--------- */}
              <Modal
                animationType="slide"
                onBackdropPress={() => setDeleteModal(false)}
                backdropColor={appColor.overlayBg}
                backdropOpacity={1}
                transparent={true}
                isVisible={deleteModal}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 5,
                  // width: scrnWidth / 1,
                  marginHorizontal: 10,
                }}>
                <View
                  style={{
                    backgroundColor: appColor.white,
                    paddingHorizontal: widthResponse ? 15 : 25, //@@
                    paddingBottom: 25,
                    borderRadius: widthResponse ? 5 : 25,
                    alignItems: 'center',
                    paddingTop: 0,
                  }}>
                  <LottieView
                    ref={deleteAnimRef}
                    resizeMode="contain"
                    style={{
                      width: scrnWidth / 2,
                      height: scrnWidth / 3, //@@
                      // marginTop: -35,
                    }}
                    source={require('../../../assets/lottieFiles/trash_1.json')}
                    loop={false}
                  />
                  <Text
                    style={{
                      marginBottom: 10,
                      fontFamily: appFont.rB,
                      width: widthResponse ? 'auto' : scrnWidth - 150, //@@
                      fontSize: fontScalling(2.1),
                      color: appColor.textBlack,
                      paddingBottom: 10,
                    }}>
                    Do you really want to cancel this subscription? This action
                    cannot be undo.
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // width: '100%',
                      // backgroundColor:appColor.black
                    }}>
                    <Pressable
                      onPress={() => {
                        setDeleteModal(false);
                      }}
                      style={{
                        backgroundColor: appColor.black,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          fontFamily: appFont.rB,
                          fontSize: fontScalling(1.7), //@@
                          color: appColor.white,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        }}>
                        no
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        apiCall('cancel');
                      }}
                      style={{
                        backgroundColor: appColor.themeYellow,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginLeft: 15,
                      }}>
                      <Text
                        style={{
                          fontFamily: appFont.rB,
                          fontSize: fontScalling(1.7), //@@
                          color: appColor.white,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        }}>
                        yes
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              {/* ------- Price details --------- */}
              <Modal
                animationType="slide"
                onBackdropPress={() => setPriceModal(false)}
                backdropColor={appColor.overlayBg}
                backdropOpacity={1}
                transparent={true}
                isVisible={priceModal}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 5,
                  marginHorizontal: 10,
                  elevation: 2,
                }}>
                <View
                  style={{
                    backgroundColor: appColor.white,
                    paddingHorizontal: 15,
                    paddingBottom: 10,
                    borderRadius: 20,
                    alignItems: 'center',
                    width: '100%',
                    padding: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginBottom: 10,
                      borderBottomWidth: 0.8,
                      paddingBottom: 5,
                    }}>
                    <Text style={[styles.HeadingText, {color: appColor.gold}]}>
                      Price details
                    </Text>
                    <Pressable onPress={() => setPriceModal(false)}>
                      <Icon
                        ComponentName={'AntDesign'}
                        name={'close'}
                        size={30}
                        color={appColor.bgBlack}
                      />
                    </Pressable>
                  </View>
                  <PriceCard
                    title={'Sub Total'}
                    value={Number(renewData.subtotal)}
                    symbol={null}
                  />
                  <PriceCard
                    title={`CGST (${renewData.cgst_percent}%)`}
                    value={Number(renewData.cgst)}
                    symbol={'+'}
                  />
                  <PriceCard
                    title={`SGST (${renewData.sgst_percent}%)`}
                    value={Number(renewData.sgst)}
                    symbol={'+'}
                  />
                  {renewData.discount_amount &&
                    renewData.discount_amount != null &&
                    renewData.discount_amount != 0 && (
                      <PriceCard
                        title={`Discount Amount (${Number(
                          renewData.discount_percent,
                        ).toFixed(0)}%)`}
                        value={Number(renewData.discount_amount)}
                        symbol={'-'}
                      />
                    )}
                  {/* {print(renewData, 'renewData')} */}
                  {renewData.delivery_fee && renewData.delivery_fee != 0 && (
                    <PriceCard
                      title={`Delivery Fee (${Number(
                        renewData.distance,
                      ).toFixed(1)} KM)`}
                      value={Number(renewData.delivery_fee)}
                      symbol={'+'}
                    />
                  )}
                  {renewData.cointainer_fee && renewData.onetime_purchase && (
                    <PriceCard
                      color={
                        renewData.already_purchased_container == '1'
                          ? appColor.gold
                          : appColor.bgBlack
                      }
                      title={`Package Price  (${renewData.container_name}) ${
                        renewData.already_purchased_container == '1'
                          ? renewData.onetime_purchase == 0
                            ? currencyConvertor(
                                renewData.cointainer_fee *
                                  renewData.dishes_count,
                              )
                            : currencyConvertor(renewData.cointainer_fee)
                          : ''
                      }`}
                      symbol={
                        renewData.already_purchased_container == '1'
                          ? null
                          : '+'
                      }
                      value={
                        renewData.already_purchased_container == '1'
                          ? '---'
                          : Number(
                              renewData.onetime_purchase == 0
                                ? renewData.cointainer_fee *
                                    renewData.dishes_count
                                : renewData.cointainer_fee,
                            )
                      }
                    />
                  )}
                  <View
                    style={{
                      marginTop: 5,
                      width: '100%',
                    }}
                  />
                  {renewData.total_amount && (
                    <PriceCard
                      title={'Total Amount'}
                      symbol={null}
                      color={appColor.gold}
                      value={Number(renewData.total_amount)}
                    />
                  )}
                </View>
              </Modal>
            </MainOverflowCard>
          ) : (
            Object.keys(planDetails).length == 0 &&
            !load && (
              <ScrollView
                contentContainerStyle={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.normalText}>
                  Subscription Data Not available
                </Text>
              </ScrollView>
            )
          )}
        </>
      )}
    </>
  );
};

export default SubscribedPlanDetail;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      paddingBottom: 5,
    },
    timerText: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    labelText: {
      fontSize: 18,
      marginTop: 10,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.8),
      color: appColor.black,
    },
    billing: {
      //@@
      color: appColor.white,
      fontSize: fontScalling(1.7), //@@
      fontFamily: appFont.rM, //@@
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 50,
      textTransform: 'capitalize', //@@
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
    normalText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(2),
      color: appColor.black,
    },
    price: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.2),
      color: appColor.textGrey,
    },
    line: {
      width: scrnWidth,
      height: 0.5,
      backgroundColor: appColor.textGrey,
      alignSelf: 'center',
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.bgBlack,
      marginTop: 5,
    },
    dotWhite: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.white,
      marginTop: 5,
    },
  });

  return {styles};
};
