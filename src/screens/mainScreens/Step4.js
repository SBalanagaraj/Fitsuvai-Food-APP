import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  currencyConvertor,
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {FlatList} from 'react-native-gesture-handler';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import CheckBox from '../../components/InputField/CheckBox';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {Icon} from '../../utilities/icon';
import {useDispatch, useSelector} from 'react-redux';
import {
  setassesMentIds,
  setCustomFoodDateCount,
  setFinalCustomizeFood,
  setNutrients,
  setOnlyCustomPlan,
  setStoreCustomizeFood,
  setSummeryContent,
} from '../../redux/SummerySlice';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {url} from '../../utilities/appApi';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import {SvgUri} from 'react-native-svg'; //@@

const Step4 = ({handlePage}) => {
  const [activeCard, setActiveCard] = useState('');
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([
    'breakfast',
    'lunch',
    'dinner',
  ]);
  const [cardData, setcardData] = useState([]);
  const [foodTime, setFoodTime] = useState(['breakfast', 'lunch', 'dinner']);

  const {assesMentIds, summeryContent, planAmmount} = useSelector(
    state => state.summary,
  );

  const {PlanPriceInfo} = UserPlanPrice();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const appColor = appColors();

  // in filter Modal request Change CheckBox
  const handleCheckBoxClick = name => {
    if (selectedIndices.includes(name)) {
      if (selectedIndices.length > 1) {
        const checkedList = selectedIndices.filter(val => val !== name);
        dispatch(setassesMentIds({foodSessions: checkedList}));
        setSelectedIndices(selectedIndices.filter(val => val !== name));
      }
    } else {
      const checkedList = [...selectedIndices, name];
      dispatch(setassesMentIds({foodSessions: checkedList}));
      setSelectedIndices([...selectedIndices, name]);
    }
  };

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      const formData = new FormData();
      formData.append('context', 'membership');
      if (assesMentIds.length > 0) {
        formData.append('assessment', Number(assesMentIds[0].assessmentId));
        formData.append('foodType', Number(assesMentIds[1].yourMealId));
        formData.append('goal', Number(assesMentIds[2].yourGoalId));
        formData.append(
          'foodSessions',
          JSON.stringify(assesMentIds[3].foodSessions),
        );
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (cardData && cardData.length < 1) {
        setLoad(true);
      }
      // get the response:
      const response = await fetch(url().assesment, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setcardData(resparse.data.cards);
          setSelectedIndices(resparse.data.food_sessions);
        }
      } else {
        print(response.status, 'status in assesmentScreen');
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error in assesmentScreen');
      setRefresh(false);
      setLoad(false);
    }
  };

  useEffect(() => {
    if (isFocus) {
      apiCall();
    }
  }, [assesMentIds]);

  return (
    <View
      style={{
        width: '100%',
        paddingLeft: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        {foodTime &&
          foodTime.map((val, ind) => {
            return (
              <CheckBox
                ind={ind}
                key={ind}
                label={val}
                color={true}
                onPress={() => handleCheckBoxClick(val)}
                checkBox={selectedIndices.includes(val)}
                altStyle={{paddingRight: 15, paddingBottom: 15}}
              />
            );
          })}
      </View>

      {cardData && cardData.length > 0 && (
        <View
          style={{
            overflow: 'hidden',
            borderRadius: 10,
            marginTop: 10,
          }}>
          <FlatList
            data={cardData}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    marginBottom: 15,
                    paddingRight: widthResponse ? 10 : 20, //@@
                  }}
                />
              );
            }}
            renderItem={({item, index}) => {
              const active = index == activeCard;
              return (
                <Pressable
                  onPress={() => {
                    PlanPriceInfo(
                      item.totalAmount.toFixed(0),
                      {
                        code: null,
                        percent: null,
                      },
                      item.section_count, //Need to change in Food Sections Count *****
                      planAmmount.delfee,
                      'dummy',
                      planAmmount.vesselPrice,
                      planAmmount.vesselName,
                      item.dish_count,
                    );
                    dispatch(
                      setNutrients({
                        totalProtein: item.total_protein,
                        totalCalories: item.total_calories,
                        totalVitamins: item.total_vitamins,
                        totalCarbs: item.total_carbs,
                      }),
                    );
                    // oneTimePurchase: planDetails.onetime_purchase,
                    dispatch(
                      setSummeryContent({
                        context: 'save_assessment',
                        oneTimePurchase: '',
                      }),
                    ); //BN
                    dispatch(setOnlyCustomPlan(false));
                    dispatch(setCustomFoodDateCount('')); //BN
                    navigation.navigate('noTab', {
                      screen: 'member_1', //@@
                      params: {
                        memberShipData: {
                          membership: item.id,
                          food_session: selectedIndices,
                          subtotal: item.totalAmount.toFixed(0),
                          food_preference: Number(assesMentIds[1].yourMealId),
                          goal: Number(assesMentIds[2].yourGoalId),
                          age: summeryContent[1].age,
                          weight: summeryContent[2].weight,
                          height: summeryContent[3].height,
                          bmi: summeryContent[4].bmi,
                          activity: summeryContent[10].activity,
                        },
                      },
                    });
                    setActiveCard(index);
                  }}
                  style={{
                    width: (scrnWidth - 40) / 2.05,
                    paddingVertical: widthResponse ? 10 : 20, //@@
                    paddingHorizontal: widthResponse ? 10 : 15, //@@
                    borderRadius: 15,
                    backgroundColor: active ? appColor.gold : appColor.cartBg,
                    marginLeft: index == 0 ? 0 : 10,
                    marginRight: cardData.length - 1 == index ? 20 : 0,
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                  {false && (
                    <View
                      style={{
                        backgroundColor: active
                          ? appColor.bgBlack
                          : appColor.gold,
                        width: 150,
                        height: 20,
                        position: 'absolute',
                        transform: [{rotate: '-55deg'}],
                        zIndex: 100,
                        left: -60,
                        top: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: appFont.bB,
                          fontSize: fontScalling(1.5),
                          paddingLeft: 20,
                          color: appColor.white,
                          zIndex: 150,
                        }}>
                        save 20%
                      </Text>
                    </View>
                  )}

                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(2.5),
                      color: active ? appColor.white : appColor.black,
                      paddingBottom: 15,
                    }}>
                    {item.membership}
                  </Text>
                  {item.menu_card && (
                    <Pressable
                      style={{
                        position: 'absolute',
                        right: widthResponse ? 7 : 12, //@@
                        top: widthResponse ? 7 : 12, //@@
                      }}
                      onPress={() => {
                        navigation.navigate('menuScreen', {
                          menuPdf: item.menu_card,
                        });
                      }}>
                      <Image
                        resizeMode="cover"
                        style={{
                          width: widthResponse ? 25 : 55, //@@
                          height: widthResponse ? 25 : 55, //@@
                          borderRadius: 200, //@@
                        }}
                        source={{
                          uri: 'https://fitsuvai.bugtreat.org/assets/user/images/gif/menu_2.gif',
                        }}
                      />
                    </Pressable>
                  )}
                  <Text
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(1.8),
                      color: active ? appColor.white : appColor.black,
                      textAlign: 'center',
                    }}>
                    {item.days && (
                      <>
                        its period (
                        <Text
                          style={{
                            // fontFamily: appFont.bB,
                            fontSize: fontScalling(1.5),
                            color: active ? appColor.white : appColor.black,
                            fontWeight: '800',
                          }}>
                          {item.days} days
                        </Text>
                        )
                      </>
                    )}
                  </Text>
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: appColor.bgBlack,
                      paddingHorizontal: 15,
                      paddingVertical: widthResponse ? 5 : 13, //@
                      borderRadius: 10,
                      width: '100%',
                      // marginTop: 10,
                      marginTop: widthResponse ? 10 : 20, //@@
                    }}>
                    <Text
                      style={{
                        fontFamily: appFont.rM,
                        fontSize: fontScalling(2.8),
                        color: appColor.gold,
                        textAlign: 'center',
                      }}>
                      {item && item?.per_meal
                        ? currencyConvertor(item?.per_meal.toFixed(0))
                        : '₹...'}
                      <Text
                        style={{
                          fontFamily: appFont.rM,
                          fontSize: fontScalling(1.5),
                          color: appColor.white,
                          textAlign: 'center',
                        }}>
                        /meal
                      </Text>
                    </Text>
                  </View>

                  {/* Total plan amount */}
                  <View
                    style={{
                      borderWidth: 0.5,
                      width: '90%',
                      paddingHorizontal: 10,
                      paddingVertical: widthResponse ? 7 : 10, //@@
                      borderBottomLeftRadius: widthResponse ? 20 : 100, //@@
                      borderBottomRightRadius: widthResponse ? 20 : 100, //@@
                      marginTop: -3,
                      marginBottom:
                        item.title == 'custom' ? 0 : widthResponse ? 15 : 25, //@@
                    }}>
                    <Text
                      style={{
                        fontFamily: appFont.rM,
                        fontSize: fontScalling(1.5),
                        color: active ? appColor.white : appColor.black,
                        textAlign: 'center',
                      }}>
                      {item && item?.totalAmount && item?.totalAmount > 0
                        ? currencyConvertor(item.totalAmount.toFixed(0)) +
                          ' for ' +
                          item.days +
                          ' Days'
                        : 'select number of days'}
                    </Text>
                  </View>
                  {/* meal count */}
                  {item.dish_count && (
                    <>
                      {/* totally change this */}
                      <SvgUri
                        width={widthResponse ? 20 : 50} //@@
                        height={widthResponse ? 20 : 50} //@@
                        fill={active ? appColor.white : appColor.black}
                        uri={active ? url().step_4_1 : url().step_4_1hov}
                        onError={error => {
                          console.error('Failed to load SVG:', error);
                        }}
                      />

                      <Text
                        style={{
                          fontFamily: appFont.rM,
                          fontSize: fontScalling(1.5),
                          color: active ? appColor.white : appColor.black,
                          paddingBottom: widthResponse ? 7 : 20, //@@
                          paddingTop: widthResponse ? 0 : 5, //@@
                          textAlign: 'center',
                        }}>
                        {item.dish_count + ' '}Meals
                      </Text>
                    </>
                  )}
                  {/* Personal Nutritionist */}
                  <View
                    style={{
                      borderTopColor: active
                        ? appColor.white
                        : appColor.lightGreyLine,
                      borderTopWidth: item.title == 'custom' ? 0 : 0.4,
                      width: '100%',
                      marginTop: item.title != 'custom' ? 2 : 7,
                      paddingTop:
                        item.title == 'custom' ? 0 : widthResponse ? 7 : 15, //@@
                      marginBottom: item.title != 'custom' ? 5 : 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      ComponentName={'MaterialIcons'}
                      name={'person-outline'}
                      size={widthResponse ? 24 : 58}
                      color={active ? appColor.white : appColor.bgBlack}
                    />
                    <Text
                      style={{
                        fontFamily: appFont.rM,
                        fontSize: fontScalling(1.5),
                        color: active ? appColor.white : appColor.black,
                        paddingTop: widthResponse ? 0 : 5, //@@
                        textAlign: 'center',
                      }}>
                      Personal Nutritionist
                    </Text>
                  </View>
                  {/* {item.title == 'custom' && (
                    <PrimaryButton
                      Title={'Get Custom'}
                      fonSize={1.8}
                      parentStyle={{
                        marginVertical: 7,
                        paddingHorizontal: 5,
                        paddingVertical: 0,
                      }}
                    />
                  )} */}
                </Pressable>
              );
            }}
            horizontal={true}
          />
        </View>
      )}
      <View
        style={{
          backgroundColor: appColor.bgBlack,
          borderRadius: 10,
          padding: widthResponse ? 20 : 30, //@@
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: cardData && cardData.length > 0 ? 40 : 5,
          marginRight: 20,
          flexDirection: 'row',
        }}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: fontScalling(3),
              fontFamily: appFont.bB,
              color: appColor.white,
            }}>
            Custom
          </Text>
          <Text
            style={{
              fontSize: fontScalling(1.5),
              fontFamily: appFont.rR,
              color: appColor.white,
            }}>
            let's customize your meal
          </Text>
        </View>
        <PrimaryButton
          onPress={() => {
            PlanPriceInfo(
              0,
              {
                code: null,
                percent: null,
              },
              0, //Need to change in Food Sections Count *****
              0,
              'dummy',
              0,
              '',
              0,
            );
            dispatch(setStoreCustomizeFood([]));
            setTimeout(() => {
              navigation.navigate('step7');
            }, 200);
          }}
          Title={'GET CUSTOMIZE'}
          parentStyle={{flex: 1}}
        />
      </View>
    </View>
  );
};

export default Step4;

const styles = StyleSheet.create({});
