import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewBase,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  arrayLength,
  currencyConvertor,
  fontScalling,
  formatedDate,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ButtonDropDown from '../../components/InputField/ButtonDropDown';
import MainCard from '../../components/Card/MainCard';
import StepHeading from '../../components/Card/StepHeading';
import {useNavigation} from '@react-navigation/native';
import {setPosition} from '../../redux/SettingSlice';
import {useDispatch, useSelector} from 'react-redux';
import DatePick from '../../components/InputField/DatePick';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import {
  setCustomFoodDateCount,
  setFinalCustomizeFood,
  setNutrients,
  setOnlyCustomPlan,
  setStoreCustomizeFood,
  setSummeryContent,
} from '../../redux/SummerySlice';
import {useShowToast} from '../../components/Toast/ToastAlert';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import FastImage from 'react-native-fast-image';

const Step7 = ({route}) => {
  const [deleteDate, setDeleteDate] = useState('');
  const [date, setDate] = useState('');
  const [dateIndex, setDateIndex] = useState(0);
  const [foodTypeIndex, setFoodIndex] = useState(0);
  const [cloneIndex, setCloneIndex] = useState(0);
  const [totalAmount, setTotAmt] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalCount, setTotCount] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [foodCustomize, setCustomizeFood] = useState([]);
  const [dishDropDown, setDishDropDown] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [editFoodPrice, setEditFoodPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [foodEditTC, setFoodEditTC] = useState('');
  const [totalFoodSections, setFoodSection] = useState('');
  const [dropDown, setDropDown] = useState(true);
  const [fieldEdit, setFieldEdit] = useState(false);
  const [catDropDown, setCatDropDown] = useState('');
  // this for Catogory dropDown Scroll Animation
  const [scrollYValue, setScrollYValue] = useState(0);

  const {styles} = useStyles();
  const appColor = appColors();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const {PlanPriceInfo} = UserPlanPrice();

  // ----- ref ----------
  const scrollRef = useRef(null);
  const containerScrollref = useRef(null);
  const selectBlockRef = useRef(null);

  const foodEdit =
    route &&
    route?.params &&
    route?.params?.editFoods &&
    Object.keys(route?.params?.editFoods).length > 0
      ? true
      : false;

  const {userSettings} = useSelector(state => state.setting);
  const {
    customizeFood,
    summeryContent,
    assesMentIds,
    planAmmount,
    nutrientsList,
    editPlanDetails,
  } = useSelector(state => state.summary);

  const slideDown = {
    0: {
      transform: [{translateY: 0}],
      opacity: 1,
    },
    0.5: {
      transform: [{translateY: -10}],
      opacity: 0.8,
    },
    1: {
      transform: [{translateY: 0}],
      opacity: 1,
    },
  };

  // productCard $
  const ListSection = ({allProducts, item, sections, CI}) => {
    return (
      <View
        style={{
          maxHeight: scrnHeight / 3,
          borderRadius: 15,
          overflow: 'hidden',
          zIndex: -1,
        }}>
        <ScrollView
          nestedScrollEnabled={true}
          style={{
            maxHeight: widthResponse ? scrnHeight / 3 : scrnHeight / 2.5,
            backgroundColor: appColor.white,
            borderRadius: widthResponse ? 8 : 15,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: widthResponse ? 5 : 20,
          }}>
          {allProducts.map((list, listIndex) => {
            const lastIndex = listIndex == allProducts.length - 1;
            return (
              <Pressable
                onPress={() => {
                  handleSelect(item.date, sections, list, CI);
                  setFieldEdit(true);
                  setDishDropDown(false);
                }}
                key={listIndex}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingVertical: 10,
                  paddingTop: 10,
                  borderBottomWidth: lastIndex ? 0 : 0.8,
                  borderBlockColor: appColor.greyBg,
                }}>
                {list.main_image && (
                  <FastImage
                    resizeMode="cover"
                    source={{
                      priority: FastImage.priority.high,
                      uri: list.main_image,
                    }}
                    style={{
                      width: widthResponse ? 45 : 50, //@@
                      height: widthResponse ? 45 : 50, //@@
                      borderRadius: widthResponse ? 10 : 8, //@@
                      // marginRight: 15,
                    }}
                  />
                )}
                <View
                  style={{
                    paddingLeft: 10,

                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: widthResponse ? '85%' : '88%', //@@,
                  }}>
                  <Text style={[styles.subText]}>{list.name}</Text>
                  {list.offer != 0 && (
                    <Text
                      style={[
                        styles.subText,
                        {
                          fontFamily: appFont.rB,
                        },
                      ]}>
                      {`( ${currencyConvertor(list.offer)} )`}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // catogary card $
  const CatListSection = ({catogary, allProducts, item, sections, CI}) => {
    return (
      <View
        key={CI}
        style={{
          maxHeight: scrnHeight / 2.5,
          borderRadius: 15,
          marginBottom: 10,
          overflow: 'hidden',
          zIndex: -1,
        }}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          nestedScrollEnabled={true}
          style={{
            maxHeight: widthResponse ? scrnHeight / 2 : scrnHeight / 2.5,
            backgroundColor: appColor.white,
            borderRadius: widthResponse ? 8 : 15,
            marginBottom: 10,
          }}
          ref={scrollRef}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingHorizontal: widthResponse ? 5 : 20,
            //paddingVertical: 5,
            marginVertical: 5,
          }}>
          {catogary.map((list, listIndex) => {
            const lastIndex = listIndex == catogary.length - 1;
            const enableDropDown = list.id == catDropDown.id;
            const catFilterProduct = allProducts.filter(
              data => data.cname == catDropDown.name,
            ); //$
            return (
              <View
                onLayout={({nativeEvent}) => {
                  if (listIndex == 0) {
                    setScrollYValue(
                      catDropDown.id == list.id ? 0 : nativeEvent.layout.height,
                    );
                  }
                }}
                key={listIndex}>
                <Pressable
                  onPress={() => {
                    setCatDropDown(predata =>
                      predata.id == list.id ? '' : list,
                    );
                    if (catDropDown.id != list.id) {
                      setTimeout(() => {
                        scrollRef.current?.scrollTo({
                          y: Math.round(scrollYValue * listIndex),
                          duration: 2000,
                          animated: true,
                        });
                      }, 100);
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingVertical: 7,
                    borderBottomWidth: lastIndex ? 0 : 0.8,
                    borderBlockColor: appColor.greyBg,
                    flex: 1,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    overflow: 'hidden',
                    backgroundColor: enableDropDown
                      ? appColor.borderColor
                      : appColor.white,
                  }}>
                  {list.image && (
                    <FastImage
                      resizeMode="cover"
                      source={{
                        priority: FastImage.priority.high,
                        uri: list.image,
                      }}
                      style={{
                        width: widthResponse ? 40 : 50, //@@
                        height: widthResponse ? 30 : 50, //@@
                        borderRadius: widthResponse ? 5 : 8, //@@,
                        borderWidth: 2,
                        borderColor: appColor.sliderGreyBg,
                        // marginRight: 15,
                      }}
                    />
                  )}
                  <View
                    style={{
                      paddingLeft: 10,

                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: appFont.bB,
                        fontSize: fontScalling(2),
                        color: enableDropDown
                          ? appColor.gold
                          : appColor.textGrey,
                      }}>
                      {list.name}
                    </Text>
                    <Pressable
                      onPress={() => {
                        setCatDropDown(predata =>
                          predata.id == list.id ? '' : list,
                        ); //$
                      }}
                      style={{
                        padding: 5,
                        backgroundColor: appColor.cartBg,
                        borderRadius: 10,
                      }}>
                      <Icon
                        ComponentName={'AntDesign'}
                        name={enableDropDown ? 'upcircle' : 'downcircle'}
                        size={18}
                        color={
                          enableDropDown ? appColor.activegreen : appColor.gold
                        }
                      />
                    </Pressable>
                  </View>
                </Pressable>
                {enableDropDown && (
                  <ListSection
                    allProducts={catFilterProduct}
                    item={item}
                    sections={sections}
                    CI={CI}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // increament,decrement Block $
  const SelectBlock = ({
    CI,
    data,
    selectDish,
    dayValid,
    index,
    ind,
    item,
    sections,
  }) => {
    return (
      <View key={CI}>
        {/* + incrent - decrement block */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            paddingHorizontal: 5,
          }}>
          {/* Dish Selection Button */}
          <Pressable
            onPress={() => {
              if (dayValid) {
                setDateIndex(index);
                setFoodIndex(ind);
                setDishDropDown(!dishDropDown);
                setCloneIndex(CI);
                setCatDropDown('');
                // setTimeout(() => {
                //   selectBlockRef?.current?.scrollToIndex({
                //     animation: true,
                //     index: CI,
                //   });
                // }, 500);
              }
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: appColor.white,
              borderRadius: 10,
              flex: 1,
              // borderWidth: 1,
              width: widthResponse ? '70%' : '80%', //@@
            }}>
            {data.image != ''
              ? data.image
              : data.main_image && (
                  <FastImage
                    resizeMode="cover"
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                    source={{
                      priority: FastImage?.priority?.high,
                      uri: data.image != '' ? data.image : data.main_image,
                    }}
                  />
                )}
            <Text
              numberOfLines={2}
              style={[
                styles.normalText,
                {
                  color: appColor.bgBlack,
                  flex: 1,
                  fontSize: fontScalling(1.9), //@@
                },
              ]}>
              {data.name
                ? `${data.name} ( ${currencyConvertor(
                    data.offer ? data.offer : data.offer_price,
                  )} ${data.count > 1 ? ' X' + ' ' + data.count + ' ' : ''})`
                : 'select Dish'}
            </Text>

            <Icon
              ComponentName={'AntDesign'}
              name={selectDish ? 'upcircle' : 'downcircle'}
              size={widthResponse ? 15 : 25} //@@
              color={appColor.Textlightblack}
            />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                if (dayValid) {
                  setFieldEdit(true);
                  handleDish_Count('decrement', index, ind, CI);
                }
              }}
              style={{
                borderRadius: 100, //@@
                width: widthResponse ? 30 : 38, //@@
                height: widthResponse ? 30 : 38, //@@
                backgroundColor: appColor.white,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Icon
                ComponentName={'Entypo'}
                name={'minus'}
                size={widthResponse ? 18 : 25} //@@
                color={appColor.bgBlack}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                if (dayValid) {
                  handleDish_Count('increment', index, ind, CI);
                }
              }}
              style={{
                borderRadius: 100, //@@
                width: widthResponse ? 30 : 38, //@@
                height: widthResponse ? 30 : 38, //@@
                backgroundColor: appColor.white,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Icon
                ComponentName={'Entypo'}
                name={'plus'}
                size={widthResponse ? 18 : 25} //@@
                color={appColor.bgBlack}
              />
            </Pressable>
          </View>
        </View>
        {/* DropDown Block */}
        {arrayLength(validCatogary) && selectDish && (
          <CatListSection
            catogary={validCatogary}
            allProducts={allProducts}
            item={item}
            sections={sections}
            CI={CI}
          />
        )}
      </View>
    );
  };

  // All Products Sections $
  const filteredSuggestions =
    (userSettings?.suggestions &&
      userSettings?.suggestions.filter(item => {
        return item.type === 1;
      })) ||
    [];

  // catogary section $
  const filterCatogary =
    (userSettings?.suggestions &&
      userSettings?.suggestions.filter(item => {
        return item.type === 2;
      })) ||
    [];

  const holidayDates =
    userSettings && userSettings?.HOLIDAY && userSettings?.HOLIDAY.split(',');

  filteredSuggestions.unshift({
    id: '0',
    name: 'Select Dish',
    image: '',
    cname: 'Bodybuilding Meals',
    offer: '0',
    type: 1,
  });

  // console.log(containerScrollref?.current, 'containerScrollref');

  // Food List For DropDowns
  const allProducts =
    userSettings?.suggestions && userSettings?.suggestions.length > 0
      ? filteredSuggestions.map(data => {
          return {
            ...data,
            count: 1,
          };
        })
      : [];
     //print(allProducts, 'allProducts');
 

  // Filter empty product catogary $
  const validCatogary = filterCatogary
    .filter(data => data.show_on_otherproducts == '0')
    .filter(data =>
      allProducts.some(product => {
        return product.cname == data.name;
      }),
    );

  // Date Based list array creation;
  function dateBasedListCreation() {
    if (userSettings?.dishes_list) {
      const listCreation = selectedDates
        .filter(date => !holidayDates.includes(date))
        .map((date, index) => {
          return {
            date: date,
            foodSections: {
              Breakfast: [{}],
              lunch: [{}],
              dinner: [{}],
            },
          };
        });
      // dispatch(setStoreCustomizeFood(listCreation));
      setCustomizeFood(listCreation);
      setTotAmt(0);
    }
  }

  // select a specific dish
  const handleSelect = (date, mealType, item, cloneId) => {
    setCustomizeFood(preData => {
      return preData.map(day => {
        if (day.date === date) {
          // Create a shallow copy of foodSections for immutability
          const updatedFoodSections = {...day.foodSections};
          // Create a shallow copy of the selected meal type's dish array
          const currentDish = [...updatedFoodSections[mealType]];
          // ----- it will update [ {} , {} , {} ]
          if (cloneId >= 0 && cloneId < currentDish.length) {
            // Replace existing item at cloneId if it exists in the dish array
            currentDish.splice(cloneId, 1, item.id == '0' ? {} : item);
          } else {
            // Append item if cloneId is out of bounds
            currentDish.push(item.id == '0' ? {} : item);
          }

          // Update the count and assign the modified dish array
          updatedFoodSections[mealType] = currentDish;
          // ------------ it will update count increment ------------------
          const consolidatedData = {};

          Object.keys(updatedFoodSections).forEach(section => {
            const items = updatedFoodSections[section];
            const itemMap = {};

            // Loop through each item in the section
            if (items && items.length > 0) {
              items.forEach(item => {
                if (item.id > 0) {
                  if (item.id in itemMap) {
                    // If item with the same id exists, increment its count
                    itemMap[item.id].count = (itemMap[item.id].count || 1) + 1;
                  } else {
                    // If item is new, add it to the map with a count of 1
                    itemMap[item.id] = {...item, count: 1};
                  }
                }
              });
            }

            // Convert itemMap back to an array for the section
            consolidatedData[section] = Object.values(itemMap);
          });

          return {
            ...day,
            foodSections: updatedFoodSections,
            countFoodSection: consolidatedData,
          };
        }
        // Return the unmodified day object if date doesn't match
        return day;
      });
    });
  };

  // Increment & Decrement a dropDown count
  const handleDish_Count = (count, dateIndex, sectionIndex, cloneId) => {
    const updatedFood = JSON.parse(JSON.stringify(foodCustomize));
    const selectedSection = Object.keys(updatedFood[dateIndex].foodSections)[
      sectionIndex
    ];
    if (count == 'increment') {
      updatedFood[dateIndex].foodSections[selectedSection].splice(
        cloneId + 1,
        0,
        {},
      );
    } else {
      if (
        updatedFood[dateIndex].countFoodSection[selectedSection][0].count == 1
      ) {
        updatedFood[dateIndex].countFoodSection[selectedSection][0] = {};
      } else if (
        updatedFood[dateIndex].countFoodSection[selectedSection][0].count > 1
      ) {
        updatedFood[dateIndex].countFoodSection[selectedSection][0].count -= 1;
      }
      if (updatedFood[dateIndex].foodSections[selectedSection].length == 1) {
        updatedFood[dateIndex].foodSections[selectedSection].splice(
          cloneId,
          1,
          {},
        );
      }
      if (updatedFood[dateIndex].foodSections[selectedSection].length > 1) {
        updatedFood[dateIndex].foodSections[selectedSection].splice(cloneId, 1);
        setDishDropDown(false); //@@
      }
    }
    setCustomizeFood(updatedFood);
  };

  function allDatesPriceCalculations(selectedFoods) {
    let grantTotal = 0;
    let grantCount = 0;
    let totalFoodSections = 0;
    let grantTotalProtein = 0;
    let grantTotalCalories = 0;
    let grantTotalFats = 0;
    let grantTotalCarbs = 0;

    selectedFoods.forEach(element => {
      let totalPrice = 0;
      let totalProtein = 0;
      let totalCalories = 0;
      let totalFats = 0;
      let totalCarbs = 0;

      // Process foodSections
      if (element.foodSections) {
        Object.values(element.foodSections).forEach(dish => {
          let calcCount = 0;
          let isNotEmptySection = false;

          dish.forEach(item => {
            if (Object.keys(item).length > 0) {
              isNotEmptySection = true;
            }
            // Calculate Price
            if (item.offer || item.offer_price) {
              totalPrice += parseFloat(
                (item.offer ? item.offer : item.offer_price) * item.count,
              );
            }
            // Calculate Nutrients
            if (item.protein) {
              totalProtein += parseFloat(item.protein * item.count);
            }
            if (item.carbs) {
              totalCarbs += parseFloat(item.carbs * item.count);
            }
            if (item.calories) {
              totalCalories += parseFloat(item.calories * item.count);
            }
            if (item.fats) {
              totalFats += parseFloat(item.fats * item.count);
            }
            // Count Total Items
            if (item.count && foodEdit) {
              calcCount += parseFloat(item.count);
            }
          });

          // Update section count
          if (isNotEmptySection) {
            totalFoodSections++;
          }

          grantCount += calcCount;
        });
        // Accumulate nutrients to grand totals
        grantTotalProtein += totalProtein;
        grantTotalCarbs += totalCarbs;
        grantTotalCalories += totalCalories;
        grantTotalFats += totalFats;
      }

      // Process countFoodSection
      if (element.countFoodSection && !foodEdit) {
        Object.values(element.countFoodSection).forEach(dish => {
          let calcCount = 0;
          dish.forEach(item => {
            if (item.count) {
              calcCount += parseFloat(item.count);
            }
          });
          grantCount += calcCount;
        });
      }

      // Grand totals
      grantTotal += totalPrice;
    });

    // Set all final states in one go
    setFoodSection(totalFoodSections);
    setFoodEditTC(grantCount);
    setTotCount(grantCount);
    setTotAmt(grantTotal);
    setTotalCalories(grantTotalCalories);
    setTotalFats(grantTotalFats);
    setTotalProtein(grantTotalProtein);
    setTotalCarbs(grantTotalCarbs);
    dispatch(
      setNutrients({
        totalProtein: grantTotalProtein,
        totalCalories: grantTotalCalories,
        totalFats: grantTotalFats,
        totalCarbs: grantTotalCarbs,
      }),
    );

    if (editFoodPrice !== '') {
      setComparePrice(
        Number(grantTotal).toFixed(0) - Number(editFoodPrice).toFixed(0),
      );
    }
  }

  // delete particular Dish list
  const handleDelete = date => {
    setCustomizeFood(preData => {
      const filterDate = preData.filter(data => data.date != date);
      return filterDate;
    });
  };

  // Empty dish Remove
  const filterEmptyDish = () => {
    const changeData = foodCustomize
      .map(data => {
        return {
          [data.date]: foodEdit ? data.foodSections : data.countFoodSection,
        };
      })
      .filter((data, index) => {
        const isValid = Object.values(data).includes('undefined');
        return !isValid;
      });
    dispatch(setFinalCustomizeFood(changeData));
    return changeData;
  };

  // update redux State & price calc fn's
  useEffect(() => {
    if (arrayLength(foodCustomize)) {
      allDatesPriceCalculations(foodCustomize);
    }
  }, [foodCustomize]);
   const NutritionText = ({text = '', val = ''}) => {
      return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 2,
            }}>
              <Text style={[styles.NutrientsText, {width: '55%'}]}>
                Total {text}
              </Text>
            <Text
              style={[styles.NutrientsText, {width: '5%', textAlign: 'center'}]}>
              -
            </Text>
              <Text
                style={[
                  styles.NutrientsText,
                  {width: '40%', textAlign: 'right'},
                ]}>
                {Number(val).toFixed(2)} {text == 'Calories' ? 'Kcal' : 'gm'}
              </Text>
          </View>
        )
    };

  return (
    <MainCard altStyle={{paddingTop: 0}}>
      {/* Side Heading */}
      <StepHeading
        title={foodEdit ? 'Ordered Foods' : 'customize'}
        onPress={() => {
          dispatch(setPosition('right'));
          navigation.getParent().openDrawer();
        }}
        btnInActive={foodEdit ? true : false}
        showBtn={foodEdit ? false : true}
      />

      <View
        style={{
          flex: 1, //@@
          height: scrnHeight,
        }}>
        {/* Date and CustomFood Block */}
        <View style={{flex: 1}}>
          {/* Date Range Selection */}
          {!foodEdit && (
            <>
              <DatePick
                // on
                placeholder={'Select date'}
                value={date}
                altStyle={{marginBottom: widthResponse ? 10 : 16}}
                onChange={setDate}
                chooseDates={setSelectedDates}
                selectedDates={selectedDates}
                onPress={dateBasedListCreation}>
                {date == '' && foodCustomize.length == 0 && (
                  <Animatable.View
                    animation={slideDown}
                    // duration={10}
                    easing={'linear'}
                    iterationCount={'infinite'}
                    style={{
                      backgroundColor: appColor.gold,
                      padding: 10,
                      paddingHorizontal: 20,
                      alignSelf: 'flex-end',
                      shadowOpacity: 0.4,
                      shadowRadius: 5,
                      elevation: 5,
                      shadowOffset: {height: 2},
                      borderRadius: widthResponse ? 5 : 10,
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        right: widthResponse ? 5 : 10,
                        top: !widthResponse ? 19.5 : -14.5,
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderLeftWidth: widthResponse ? 8 : 10,
                        borderRightWidth: widthResponse ? 8 : 10,
                        borderBottomWidth: widthResponse ? 15 : 20,
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderBottomColor: appColor.gold,
                      }}
                    />
                    <Text style={[styles.subText, {color: appColor.white}]}>
                      Please Choose the dates
                    </Text>
                  </Animatable.View>
                )}
              </DatePick>
            </>
          )}
          {/* @@ */}
          {foodCustomize && foodCustomize.length > 0 ? (
            <FlatList
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
              ref={containerScrollref}
              data={foodCustomize}
              renderItem={({item, index}) => {
                const currentDate = new Date().toISOString().split('T')[0];
                const dayValid = currentDate < item.date;
                return (
                  // dropDownContainer
                  <View
                    key={index}
                    style={[
                      styles.cardContainer,
                      {
                        backgroundColor:
                          index == dateIndex
                            ? appColor.lightGreen
                            : appColor.cardBack,
                        opacity: dayValid ? 1 : 0.3,
                      },
                    ]}>
                    {/* Delete Icon Block */}
                    {customizeFood && customizeFood.length !== 1 && (
                      <Pressable
                        onPress={
                          !dayValid
                            ? () => {}
                            : () => {
                                setdeleteModal(true);
                                setDeleteDate(item.date);
                              }
                        }
                        style={styles.deleteIconContainer}>
                        <Icon
                          ComponentName={'MaterialIcons'}
                          name={'delete-sweep'}
                          size={widthResponse ? 25 : 30} //@@
                          color={appColor.white}
                        />
                      </Pressable>
                    )}

                    {/* Date section  */}
                    <Pressable
                      onPress={() => {
                        setTimeout(() => {
                          containerScrollref?.current?.scrollToIndex({
                            animation: true,
                            index: index,
                          });
                        }, 500);
                      }}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.normalText}>Selected Dates -</Text>
                      <Text
                        style={
                          ([styles.subText],
                          {
                            fontFamily: appFont.rB,
                            color: appColor.bgBlack,
                            fontSize: fontScalling(1.9),
                          })
                        }>
                        {' ' + formatedDate(item.date)}
                      </Text>
                    </Pressable>

                    {/* Food Selection Container */}
                    <View style={{marginTop: 15}}>
                      {item &&
                        item.foodSections &&
                        Object.keys(item.foodSections).map((sections, ind) => {
                          // print(sections, ' food sections');
                          const isDateIndex = index == dateIndex;
                          const isFoodIndex = ind == foodTypeIndex;
                          const isSection =
                            foodTypeIndex == ind &&
                            dateIndex == index &&
                            dropDown;
                          const selectSections = isDateIndex && isFoodIndex;

                          return (
                            // BreakFast,Lunch,Dinner Button
                            <ButtonDropDown
                              onPress={
                                !dayValid
                                  ? () => {}
                                  : () => {
                                      setDropDown(!dropDown);
                                      setDropDown(
                                        selectSections ? !dropDown : true,
                                      );
                                      setDateIndex(index);
                                      setFoodIndex(ind);
                                      setTimeout(() => {
                                        containerScrollref?.current?.scrollToIndex(
                                          {animation: true, index: index},
                                        );
                                      }, 500);
                                    }
                              }
                              key={ind}
                              title={sections}
                              active={isSection}>
                              {/* Dish DropDown Selection ,+,- Block  */}
                              {dropDown &&
                                // selectSections &&
                                item?.foodSections[sections] &&
                                item?.foodSections[sections].length > 0 &&
                                item.foodSections[sections].map((data, CI) => {
                                  const cloneValid = CI == cloneIndex;
                                  let selectDish =
                                    isDateIndex &&
                                    isFoodIndex &&
                                    // dropDown &&
                                    dishDropDown &&
                                    cloneValid;
                                  return (
                                    <SelectBlock
                                      CI={CI}
                                      data={data}
                                      selectDish={selectDish}
                                      dayValid={dayValid}
                                      index={index}
                                      ind={ind}
                                      item={item}
                                      sections={sections}
                                    />
                                  );
                                })}
                            </ButtonDropDown>
                          );
                        })}
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View
              style={{
                flex: 0.7,
                height: scrnHeight / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LottieView
                source={require('../../../assets/lottieFiles/calender.json')}
                style={{width: scrnWidth / 1.7, height: scrnHeight / 4.5}}
                autoPlay
                loop={true}
              />
              <Text
                style={[
                  styles.normalText,
                  {alignSelf: 'center', marginBottom: 10},
                ]}>
                Set your dates and meals for your plan
              </Text>
            </View>
          )}
        </View>
        {/* Payment Block */}
        {foodCustomize.length > 0 && (
         <View style={[styles.paymentBlock]}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                flexDirection: 'row-reverse',
                marginBottom: 20,
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Animatable.Text
                animation={'bounceInLeft'}
                duration={1000}
                style={[styles.HeadingText, {color: appColor.gold}]}>
                {currencyConvertor(totalAmount > 0 ? totalAmount : 0)}
              </Animatable.Text>
              <Text style={[styles.subText]}>Total Price</Text>
              {comparePrice != '' && Number(comparePrice).toFixed(0) != 0 && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <Animatable.Text
                      animation={'bounceInLeft'}
                      duration={1000}
                      style={[
                        styles.HeadingText,
                        {
                          color: appColor.gold,
                          fontSize: fontScalling(2),
                          paddingRight: 10,
                        },
                      ]}>
                      {currencyConvertor(
                        Number(comparePrice).toFixed(0) == 0
                          ? 0
                          : Number(comparePrice).toFixed(0),
                      )}
                    </Animatable.Text>
                    {
                      <Icon
                        ComponentName={'AntDesign'}
                        name={comparePrice > 0 ? 'arrowup' : 'arrowdown'}
                        color={
                          comparePrice > 0
                            ? appColor.active
                            : appColor.formError
                        }
                        size={15}
                      />
                    }
                  </View>
                  <Text style={[styles.subText]}>Price Variation</Text>
                </>
                
              )}
            </View>
                <View style={[styles.nutritionContainer]}>
                <NutritionText text="Calories" val={totalCalories} />
                <NutritionText text="Proteins" val={totalProtein} />
                <NutritionText text="Carbs" val={totalCarbs} />
                <NutritionText text="Fats" val={totalFats} />
                </View>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row-reverse',
                alignItems: 'center',
              }}>
              {foodEdit ? (
                fieldEdit && (
                  <PrimaryButton
                    altStyle={{
                      marginBottom: widthResponse ? 5 : 10, //@@
                      paddingVertical: 5,
                    }}
                    parentStyle={{flex: 1}}
                    onPress={() => {
                      filterEmptyDish();
                      setTimeout(() => {
                        if (totalAmount && totalAmount > 0) {
                          if (!foodEdit) {
                            PlanPriceInfo(
                              Number(totalAmount),
                              {
                                code: null,
                                percent: planAmmount.discount.percent,
                              },
                              totalFoodSections,
                              planAmmount.delfee,
                              'dummy',
                              planAmmount.vesselPrice,
                              planAmmount.vesselName,
                              totalCount,
                            );
                          } else if (foodEdit) {
                            const vesselPrice =
                              editPlanDetails?.OTP_Status == '1'
                                ? editPlanDetails?.puchasedContainer
                                  ? 0
                                  : editPlanDetails?.vesselPrice
                                : editPlanDetails?.vesselPrice * foodEditTC;
                            PlanPriceInfo(
                              Number(totalAmount),
                              {
                                code: null,
                                percent: planAmmount.discount.percent,
                              },
                              totalFoodSections,
                              Number(editPlanDetails?.distance),
                              'checkDistance',
                              vesselPrice,
                              editPlanDetails?.vesselName,
                              totalCount,
                            );
                          }
                          dispatch(
                            setSummeryContent({
                              context: foodEdit ? 'edit' : 'save_assessment',
                              oneTimePurchase: '',
                              comparisionPrice: foodEdit ? comparePrice : '',
                            }),
                          );
                          dispatch(setCustomFoodDateCount(''));
                          if (foodEdit) {
                            dispatch(setOnlyCustomPlan(false));
                            navigation.navigate('summary');
                          } else {
                            navigation.navigate('noTab', {
                              screen: 'member_1',
                              params: {
                                memberShipData: {
                                  subtotal: totalAmount,
                                  membership: '',
                                  food_session: [
                                    'breakfast',
                                    'lunch',
                                    'dinner',
                                  ],
                                  food_preference: Number(
                                    assesMentIds[1].yourMealId,
                                  ),
                                  goal: Number(assesMentIds[2].yourGoalId),
                                  age: summeryContent[1].age,
                                  weight: summeryContent[2].weight,
                                  height: summeryContent[3].height,
                                  bmi: summeryContent[4].bmi,
                                  activity: summeryContent[10].activity,
                                },
                              },
                            });
                          }
                        } else {
                          showToast(
                            'error',
                            '',
                            'Please Select any one dish',
                            2500,
                          );
                        }
                      }, 500);
                    }}
                    Title={'Next'}
                  />
                )
              ) : (
                <PrimaryButton
                  altStyle={{
                    marginBottom: widthResponse ? 5 : 10,
                    paddingVertical: 5,
                  }}
                  parentStyle={{flex: 1}}
                  onPress={() => {
                    filterEmptyDish();
                    setTimeout(() => {
                      if (totalAmount && totalAmount > 0) {
                        if (!foodEdit) {
                          dispatch(setStoreCustomizeFood(foodCustomize));
                          dispatch(setOnlyCustomPlan(true));
                          PlanPriceInfo(
                            Number(totalAmount),
                            {
                              code: null,
                              percent: planAmmount.discount.percent,
                            },
                            totalFoodSections,
                            planAmmount.delfee,
                            'dummy',
                            planAmmount.vesselPrice,
                            planAmmount.vesselName,
                            totalCount,
                          );
                        } else if (foodEdit) {
                          // print(totalCount, 'totalCount');
                          const vesselPrice =
                            editPlanDetails?.OTP_Status == '1'
                              ? editPlanDetails?.puchasedContainer
                                ? 0
                                : editPlanDetails?.vesselPrice
                              : editPlanDetails?.vesselPrice * foodEditTC;
                          PlanPriceInfo(
                            Number(totalAmount),
                            {
                              code: null,
                              percent: planAmmount.discount.percent,
                            },
                            totalFoodSections,
                            Number(editPlanDetails?.distance),
                            'checkDistance',
                            vesselPrice,
                            editPlanDetails?.vesselName,
                            totalCount,
                          );
                        }
                        dispatch(
                          setSummeryContent({
                            context: foodEdit ? 'edit' : 'save_assessment',
                            oneTimePurchase: '',
                            comparisionPrice: foodEdit ? comparePrice : '',
                          }),
                        );
                        dispatch(setCustomFoodDateCount(''));
                        if (foodEdit) {
                          navigation.navigate('summary');
                        } else {
                          navigation.navigate('noTab', {
                            screen: 'member_1',
                            params: {
                              memberShipData: {
                                subtotal: totalAmount,
                                membership: '',
                                food_session: ['breakfast', 'lunch', 'dinner'],
                                food_preference: Number(
                                  assesMentIds[1].yourMealId,
                                ),
                                goal: Number(assesMentIds[2].yourGoalId),
                                age: summeryContent[1].age,
                                weight: summeryContent[2].weight,
                                height: summeryContent[3].height,
                                bmi: summeryContent[4].bmi,
                                activity: summeryContent[10].activity,
                              },
                            },
                          });
                        }
                      } else {
                        showToast(
                          'error',
                          '',
                          'Please Select any one dish',
                          2500,
                        );
                      }
                    }, 500);
                  }}
                  Title={'Next'}
                />
              )}
              <PrimaryButton
                altStyle={{paddingVertical: 5}}
                black
                parentStyle={{flex: 1, marginRight: 10}}
                onPress={() => {
                  if (!foodEdit) {
                    dateBasedListCreation();
                  }
                }}
                Title={'Reset Plan'}
              />
            </View>
          </View>
        )}
      </View>
      {/* -------delete modal--------- */}
      <Modal
        animationType="slide"
        onBackdropPress={() => {
          setdeleteModal(!deleteModal);
        }}
        backdropColor={appColor.overlayBg}
        backdropOpacity={1}
        transparent={true}
        isVisible={deleteModal}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
          width: scrnWidth / 1.2,
          marginHorizontal: 'auto',
          zIndex: 1000,
        }}>
        <View
          style={{
            backgroundColor: appColor.white,
            paddingHorizontal: 15,
            paddingBottom: 15,
            borderRadius: 5,
            alignItems: 'center',
            paddingTop: 0,
            width: '100%',
          }}>
          <LottieView
            resizeMode="contain"
            style={{
              width: scrnWidth / 2,
              height: scrnHeight / 7,
              borderWidth: 1,
            }}
            source={require('../../../assets/lottieFiles/trash_1.json')}
            loop={false}
          />
          {
            <Text
              style={{
                marginBottom: 10,
                fontFamily: appFont.rB,
                fontSize: fontScalling(2.1),
                color: appColor.textBlack,
                paddingBottom: 10,
              }}>
              Are you sure you want to delete?
            </Text>
          }
          {
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Pressable
                style={{
                  backgroundColor: appColor.cancel,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setTimeout(() => {
                    handleDelete(deleteDate);
                    setdeleteModal(false);
                    setDeleteDate('');
                    setFieldEdit(true);

                    if (foodCustomize && foodCustomize.length == 1) {
                      setDate('');
                      setSelectedDates([]);
                    }
                  }, 50);
                }}>
                <Text
                  style={{
                    fontFamily: appFont.rB,
                    fontSize: fontScalling(1.5),
                    color: appColor.white,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}>
                  delete
                </Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: appColor.themeYellow,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginLeft: 10,
                }}
                onPress={() => setdeleteModal(false)}>
                <Text
                  style={{
                    fontFamily: appFont.rB,
                    fontSize: fontScalling(1.5),
                    color: appColor.white,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          }
        </View>
      </Modal>
    </MainCard>
  );
};

export default Step7;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      // paddingBottom: 5,
    },
    cardContainer: {
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 20,
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 10,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.7),
      color: appColor.black,
    },
    normalText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(2.1),
      color: appColor.black,
    },

    commenStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    deleteIconContainer: {
      position: 'absolute',
      backgroundColor: appColor.bgBlack,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
      borderRadius: 30,
      top: -15,
      right: -15,
      alignItems: 'flex-end',
    },
    paymentBlock: {
      marginTop: 8, //@@
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      paddingHorizontal: 10,
      paddingBottom: widthResponse ? 90 : 140, //@@
    },
    nutritionContainer: {
      padding: 4,
      paddingHorizontal: 6,
      backgroundColor: appColor.greyBg,
      borderRadius: 8,
      width: widthResponse ? '60%' : '35%',
    },
    NutrientsText: {
      fontSize: fontScalling(widthResponse ? 1.4 : 1.6),
      color: appColor.black,
      fontFamily: appFont.rM,
    },
  });

  return {styles};
};
