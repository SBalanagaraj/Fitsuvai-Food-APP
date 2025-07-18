import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

// file import:
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useShowToast} from '../../components/Toast/ToastAlert';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  arrayLength,
  fontScalling,
  objectLength,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import ProductCard from '../../components/Card/ProductCard';
import {FlatList} from 'react-native-gesture-handler';
import SideHeading from '../../components/Card/SideHeading';
import {SvgUri} from 'react-native-svg';
import SliderCarosal from '../../components/Sliders/SliderCarosal';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {url} from '../../utilities/appApi';
import SplashScreen from 'react-native-splash-screen';
import {DashShimmer} from '../../utilities/appShimmer';
import Carousel from 'react-native-reanimated-carousel';
import {
  setAssesmentRoute,
  setBottomTabPress,
  userSettingApi,
} from '../../redux/SettingSlice';
import {setSummeryContent} from '../../redux/SummerySlice';
import {duration} from 'moment';

const baseOptions = {
  vertical: false,
  width: scrnWidth * 0.4,
  height: scrnWidth * 0.45,
};

const AssessmentCorousel = ({homeData}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const navigation = useNavigation();
  const [assesMentIndex, setAssIndex] = useState(0);
  const [assInd, setAssInd] = useState(0);

  const dispatch = useDispatch();

  return (
    <ImageBackground
      resizeMode="cover"
      source={require('../../../assets/images/assesment_bg.png')}
      style={styles.assesMentContainer}>
      <View style={styles.assInnerCon}>
        <Text
          style={{
            color: appColor.white,
            fontFamily: appFont.bB,
            fontSize: fontScalling(3),
            paddingTop: 5,
            paddingBottom: 5,
            textAlign: 'center',
          }}>
          Top Deals Provided from
        </Text>
        <Text
          style={{
            color: appColor.bgBlack,
            fontFamily: appFont.bB,
            fontSize: fontScalling(3),
            paddingBottom: 10,
            textAlign: 'center',
          }}>
          Fitsuvai company
        </Text>
        <View
          style={{
            marginTop: 10,
          }}>
          {homeData &&
            homeData.assessments &&
            homeData.assessments.length > 0 && (
              <>
                <Carousel
                  {...baseOptions}
                  loop={true}
                  // ref={ref}
                  overscrollEnabled={true}
                  style={{
                    width: '100%',
                    height: scrnWidth / 2.2,
                    borderRadius: 15,
                    overflow: 'hidden',
                  }} //@@
                  autoPlay={true}
                  autoPlayInterval={1500}
                  data={homeData.assessments}
                  pagingEnabled={true}
                  onSnapToItem={index => {
                    return setAssIndex(index);
                  }}
                  renderItem={({item, index}) => {
                    return (
                      <Animatable.View
                        onTouchEnd={() => {
                          dispatch(setAssesmentRoute(true));
                          setAssInd(index);
                          navigation.navigate('assesments', {
                            id: item.id,
                            assName: item.name,
                          });
                          // navigation.navigate('Profile', {
                          //   screen: 'assesments',
                          //   initial: true,
                          //   params: {
                          //     id: item.id,
                          //     assName: item.name,
                          //   },
                          // });
                          // navigation.navigate(
                          //   'subscriptionPlanHistory',
                          // );
                        }}
                        animation={'zoomIn'}
                        duration={index * 1000}
                        key={index}
                        style={[
                          styles.assCard,
                          {
                            backgroundColor:
                              assInd !== index
                                ? appColor.white
                                : appColor.white,
                            elevation: 2,
                          },
                        ]}>
                        <View
                          style={{
                            backgroundColor: appColor.white,
                            padding: widthResponse ? 8 : 15,
                            borderRadius: 200, //@@
                            height: scrnWidth / 4, //@@
                            width: scrnWidth / 4, //@@
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: widthResponse ? 10 : 20, //@@
                            elevation: 8,
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            shadowOffset: {height: 2},
                          }}>
                          {item.image &&
                          item.image.split('.').pop().toLowerCase() == 'SVG' ? (
                            <SvgUri
                              fill={
                                assInd !== index
                                  ? appColor.black
                                  : appColor.white
                              }
                              width={scrnWidth / 8}
                              height={scrnWidth / 8}
                              uri={item.image}
                            />
                          ) : item.image.split('.').pop().toLowerCase() ==
                              'png' ||
                            'JPEG' ||
                            'WEBG' ? (
                            <Image
                              resizeMode="cover"
                              style={{
                                width: '100%', //@@
                                height: '100%', //@@
                                borderRadius: 200, //@@
                              }}
                              source={{uri: item.image}}></Image>
                          ) : null}
                        </View>
                        <Text
                          style={{
                            color: appColor.black,
                            fontFamily: appFont.rB,
                            fontSize: widthResponse
                              ? fontScalling(1.8)
                              : fontScalling(2), //@@,
                            paddingBottom: 10,
                            textTransform: 'capitalize',
                            textAlign: 'center',
                          }}>
                          {item.name}
                        </Text>
                        {/* <Text
                            style={{
                              color:
                               appColor.black,
                              fontFamily: appFont.rR,
                              fontSize: fontScalling(1.5),
                              paddingBottom: 5,
                              textTransform: 'capitalize',
                              textAlign: 'center',
                            }}>
                            {item.description}
                          </Text> */}
                      </Animatable.View>
                    );
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: 10,
                    // backgroundColor: appColor.textGrey,
                    paddingVertical: 2.5,
                    paddingHorizontal: 8,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {homeData.assessments.map((item, index) => {
                    return (
                      <Animatable.View
                        animation={'zoomIn'}
                        duration={1000 * index}
                        key={index}
                        style={{
                          //@@
                          width: widthResponse
                            ? assesMentIndex == index
                              ? 25
                              : 6
                            : assesMentIndex == index
                            ? 35
                            : 13,
                          height: widthResponse ? 6 : 13,
                          borderRadius: 15,
                          borderWidth: 0.8,
                          borderColor: appColor.Textlightblack,
                          backgroundColor:
                            assesMentIndex == index
                              ? appColor.greyBg
                              : 'transparent',
                          alignSelf: 'center',
                          marginRight:
                            homeData.assessments.length - 1 == index ? 0 : 10,
                        }}></Animatable.View>
                    );
                  })}
                </View>
              </>
            )}
        </View>
      </View>
    </ImageBackground>
  );
};

const DashBoard = ({navigation}) => {
  const appColor = appColors();
  const showToast = useShowToast();
  const isFocus = useIsFocused();
  const {styles} = useStyle();
  const {userSettings, vegToggle} = useSelector(state => state.setting);
  const scrollRef = useRef(null);

  const dispatch = useDispatch();

  const [backPressCount, setBackPressCount] = useState(0);
  const [homeData, setHomeDatas] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // chatbot
  const [chatbot, setChatbot] = useState(false);
  const [chatArray, setChatArray] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [formObj, setFormObj] = useState({
    input: '',
  });
  const botRef = useRef(null);
  const {assesmentRoute, bottomTabPress} = useSelector(state => state.setting);

  // api
  const apiCall = async () => {
    try {
      const formData = new FormData();
      // request data for backend:
      formData.append('veg_filter', vegToggle ? 1 : 0);
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (Object.keys(homeData).length == 0) {
        setLoad(true);
      }
      // get the response:
      const response = await fetch(url().home, requestOptions);
      if (response.status == 200) {
        // requestLocationPermission();
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          setHomeDatas(resparse.data);
          setLoad(false);
          setRefresh(false);
          SplashScreen.hide();
        }
      } else {
        print(response.status, 'status in home screen');
        setLoad(false);
        setRefresh(false);
        SplashScreen.hide();
      }
    } catch (e) {
      console.log(e, 'error in home screen');
      setRefresh(false);
      setLoad(false);
      SplashScreen.hide();
    }
  };

  function applySizeFilterWithRate(products) {
    const filteredProducts = [];
    const processedProductNames = new Set();

    // Group products by name
    const groupedProducts = products.reduce((groups, product) => {
      if (!groups[product.name]) {
        groups[product.name] = [];
      }
      groups[product.name].push(product);
      return groups;
    }, {});

    // print(groupedProducts, 'groupedProducts');

    // Process grouped products
    for (const [productName, productVariants] of Object.entries(
      groupedProducts,
    )) {
      if (!processedProductNames.has(productName)) {
        let selectedProduct = null;

        // Extract sizes for the product
        const sizes = productVariants.map(variant =>
          variant.size.toLowerCase(),
        );
        // Determine the size to use for pricing based on the rules
        let selectedSize = null;
        if (
          sizes.includes('small') &&
          sizes.includes('medium') &&
          sizes.includes('large')
        ) {
          selectedSize = 'medium';
        } else if (sizes.includes('small') && sizes.includes('large')) {
          selectedSize = 'small';
        } else if (sizes.includes('medium') && sizes.includes('large')) {
          selectedSize = 'medium';
        } else if (sizes.includes('medium')) {
          selectedSize = 'medium';
        } else if (sizes.includes('large')) {
          selectedSize = 'medium';
        } else if (sizes.includes('small')) {
          selectedSize = 'small';
        }

        // Find the product variant with the selected size
        selectedProduct = productVariants.find(
          variant => variant.size.toLowerCase() === selectedSize,
        );

        // Add the selected product to the result
        if (selectedProduct) {
          filteredProducts.push(selectedProduct);
          processedProductNames.add(productName); // Mark product as processed
        }
      }
    }
    return filteredProducts;
  }

  //  console.log(sizePriorityProducts);

  // print(
  //   sizePriorityProducts,
  //   // applySizeFilter(homeData.vegetarianJuice, ['small', 'medium', 'large']),
  //   'applySizeFilter',
  // );

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      apiCall();
      dispatch(userSettingApi());
    }
  }, [refresh]);

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [vegToggle]);

  useEffect(() => {
    if (assesmentRoute && isFocus) {
      dispatch(setAssesmentRoute(false));
    }
  }, [isFocus]);

  // hit back to back press:
  useEffect(() => {
    if (isFocus) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (backPressCount === 0) {
            setBackPressCount(1);
            showToast(
              'custom',
              'Press Again',
              'Please press again to back',
              2000,
            );
            setTimeout(() => setBackPressCount(0), 2000);
          } else if (backPressCount === 1) {
            BackHandler.exitApp();
          }
          return true;
        },
      );
      return () => backHandler.remove();
    } else {
      setBackPressCount(0);
    }
  }, [backPressCount, isFocus]);

  // chatbotOption:
  const ChatbotOption = ({data, isPress}) => {
    const [press, setPress] = useState(false);
    const appColor = appColors();

    return (
      <Pressable
        onPress={() => {
          if (isPress) {
            setChatArray(pre => [
              ...pre,
              {
                chatbot: '',
                user: data,
                options: [],
              },
            ]);
            apiBotCall(false, data);
          }
        }}
        onPressIn={() => isPress && setPress(true)}
        onPressOut={() => isPress && setPress(false)}
        style={{
          borderRadius: 25,
          margin: 5,
          paddingHorizontal: 8,
          justifyContent: 'center',
          backgroundColor: press ? appColor.themeYellow : appColor.bgWhite,
          borderWidth: 0.3,
        }}>
        <Text
          style={{
            padding: 10,
            fontSize: fontScalling(1.7),
            color: press ? appColor.textWhite : appColor.textBlack,
            fontFamily: appFont.rM,
          }}>
          {data}
        </Text>
      </Pressable>
    );
  };

  // api
  const apiBotCall = async (initial = false, options) => {
    try {
      var myHeaders = new Headers();
      const formData = new FormData();
      let formVar = {};
      if (!initial) {
        for (let [key, val] of Object.entries(formObj)) {
          if (val == '') {
            formVar = {...formObj, [key]: options ? options : userInput};
          }
        }
        setFormObj(formVar);
        // console.log(formVar, 'formVar');
        formData.append('chatbot', JSON.stringify(formVar));
      }

      var requestOptions = {
        method: 'POST',
        body: !initial ? formData : null,
      };
      // get the response:
      const response = await fetch(url().chatBot, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (initial) {
          setChatArray([
            {
              chatbot: resparse.data.initial_message,
              user: '',
              options: resparse.data.suggestions,
            },
          ]);
          setFormObj({input: ''});
        } else if (resparse?.data?.input == '') {
          setChatArray(pre => [
            ...pre,
            {
              chatbot: resparse?.data?.response,
              user: '',
              options: resparse?.data?.suggestions
                ? resparse?.data?.suggestions
                : [],
            },
          ]);
          setFormObj({input: ''});
        } else if (resparse?.data?.input && resparse?.data?.input != '') {
          setChatArray(pre => [
            ...pre,
            {
              chatbot: resparse?.data?.response,
              user: '',
              options: resparse?.data?.suggestions
                ? resparse?.data?.suggestions
                : [],
            },
          ]);
          setFormObj(pre => ({...pre, [resparse?.data?.input]: ''}));
        }
      } else {
        console.log('Chatbot status code:', response.status);
      }
    } catch (e) {
      console.log(e, 'error Chatbot');
    }
  };

  useEffect(() => {
    apiBotCall(true);
  }, []);

  useEffect(() => {
    dispatch(
      setSummeryContent({
        bmi: '',
        yourMeal: '',
        yourGoal: '',
        age: '',
        weight: '',
      }),
    );
  }, [isFocus]);

  const Rotate = {
    //@@
    0: {
      transform: [{rotate: '0deg'}],
    },
    1: {
      transform: [{rotate: '360deg'}],
    },
  };

  const onPressTouch = () => {
    dispatch(setBottomTabPress(0));
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    if (bottomTabPress) {
      onPressTouch();
    }
  }, [bottomTabPress]);

  return (
    <>
      <View style={{backgroundColor: appColor.bgBlack}}>
        <View
          style={[
            {
              marginHorizontal: 15,
              backgroundColor: appColor.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 20,
              paddingTop: 10,
              height: 65,
            },
          ]}
        />
      </View>
      <Animatable.View
        animation={'zoomIn'}
        duration={1000}
        onTouchEnd={() => {
          navigation.navigate('search');
        }}
        style={[styles.searchContainer]}>
        <Icon
          ComponentName={'FontAwesome'}
          name={'search'}
          color={appColor.bgBlack}
          size={widthResponse ? 20 : 25}
        />
        <Text style={styles.placeHolderStyle}>Search Your Favourite Food</Text>
      </Animatable.View>
      {load ? (
        <ScrollView>
          <DashShimmer />
        </ScrollView>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: appColor.white,
            paddingTop: 10,
            // overflow: 'visible',
          }}>
          <ScrollView
            ref={scrollRef}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[appColor.themeYellow]}
                style={{backgroundColor: appColor.bgBlack}}
                tintColor={appColor.themeYellow}
              />
            }
            contentContainerStyle={{paddingBottom: widthResponse ? 91 : 140}} //@@
            showsVerticalScrollIndicator={false}>
            {objectLength(homeData) && arrayLength(homeData.banner) && (
              <View>
                <ImageBackground
                  source={{uri: homeData?.banner[0]?.backgroundimage}}
                  resizeMode="cover"
                  style={[styles.banner1Bg]}>
                  <View style={styles.bnrContainer}>
                    {/* left container */}
                    <View
                      style={[
                        styles.leftContainer,
                        {
                          flexWrap: 'wrap',
                          width: '50%',
                          flexDirection: 'row',
                        },
                      ]}>
                      {homeData?.banner[0].heading
                        .split(' ')
                        .map((data, index) => {
                          return (
                            <Text
                              key={index}
                              style={{
                                color:
                                  index ==
                                  homeData?.banner[0].heading.split(' ')
                                    .length -
                                    1
                                    ? appColor.gold
                                    : appColor.white,
                                fontFamily: appFont.bB,
                                fontSize: fontScalling(3.5),
                                paddingBottom: 10,
                                paddingRight: 5,
                              }}>
                              {data}
                            </Text>
                          );
                        })}

                      {homeData?.banner[0]?.button_text && (
                        <Animatable.View
                          animation={'zoomIn'}
                          duration={1000}
                          style={{
                            backgroundColor: appColor.white,
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            borderRadius: 15,
                            alignSelf: 'flex-start',
                            elevation: 3,
                          }}>
                          <Pressable
                            onPress={() => {
                              navigation.navigate('menu');
                            }}>
                            <Text
                              style={{
                                color: appColor.black,
                                fontFamily: appFont.bB,
                                fontSize: fontScalling(2),
                              }}>
                              {homeData?.banner[0]?.button_text}
                            </Text>
                          </Pressable>
                        </Animatable.View>
                      )}
                    </View>
                    {/* right container   //@@ */}
                    <View style={[styles.rightContainer]}>
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: [{rotate: '45deg'}],
                          },
                        ]}>
                        <Animatable.Image
                          resizeMode="contain"
                          animation={'bounceIn'}
                          duration={1500}
                          delay={100}
                          resizeMethod="cover"
                          style={{
                            width: scrnWidth / 4.5,
                            height: scrnWidth / 4.5,
                          }}
                          source={{
                            uri: homeData?.banner[0].image2,
                          }}></Animatable.Image>
                        <Animatable.Image
                          animation={'bounceIn'}
                          duration={1500}
                          delay={100}
                          resizeMethod="cover"
                          style={{
                            width: scrnWidth / 4.5,
                            height: scrnWidth / 4.5,
                          }}
                          source={{
                            uri: homeData?.banner[0].image3,
                          }}></Animatable.Image>
                        <Animatable.View
                          animation={'zoomIn'}
                          duration={500}
                          delay={1000}
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bottom: 5,
                            right: 5,
                          }}>
                          <Animatable.Image
                            animation={Rotate}
                            easing={'linear'}
                            duration={4000}
                            iterationCount={'infinite'}
                            source={{uri: homeData?.banner[0].image1}}
                            style={{
                              width: scrnWidth / 3.3,
                              height: scrnWidth / 3.3,
                            }}
                          />
                        </Animatable.View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            )}
            {/* Assesment container */}
            {homeData && Object.keys(homeData).length > 0 && (
              <AssessmentCorousel homeData={homeData} />
            )}
            {objectLength(homeData) &&
              arrayLength(homeData.traditionalFoods) && (
                <>
                  {/* Side Heading */}
                  <SideHeading
                    title={'Traditional Foods'}
                    onPress={() =>
                      navigation.navigate('productOverView', {
                        context: 'filteredProducts',
                        name: 'traditionalFoods',
                      })
                    }
                  />
                  {/* card section */}
                  <View
                    style={{
                      marginLeft: 15,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={applySizeFilterWithRate(
                        homeData.traditionalFoods,
                      ).slice(0, 6)}
                      keyExtractor={(data, index) => index}
                      renderItem={({item, index}) => {
                        return (
                          <ProductCard key={index} item={item} ind={index} />
                        );
                      }}
                    />
                  </View>
                </>
              )}

            {/* Banner slider_1 */}
            {objectLength(homeData) && arrayLength(homeData.bannerBlock1) && (
              <View
                style={{
                  marginLeft: 15,
                  marginVertical: 15,
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginTop: 30,
                }}>
                <SliderCarosal data={homeData.bannerBlock1} />
              </View>
            )}
            {/* Body Building Meals */}
            {objectLength(homeData) &&
              arrayLength(homeData.bodyBuildingmeals) && (
                <>
                  {/* Side Heading */}
                  <SideHeading
                    title={'Healthy Quick Bites'}
                    onPress={() =>
                      navigation.navigate('productOverView', {
                        context: 'filteredProducts',
                        name: 'bodyBuildingMeals',
                      })
                    }
                  />
                  {/* card section */}
                  <View
                    style={{
                      marginLeft: 15,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={applySizeFilterWithRate(
                        homeData.bodyBuildingmeals,
                      ).slice(0, 4)}
                      keyExtractor={(data, index) => index}
                      renderItem={({item, index}) => {
                        return (
                          <ProductCard key={index} item={item} ind={index} />
                        );
                      }}
                    />
                  </View>
                </>
              )}

            {/* Banner slider_2 */}
            {objectLength(homeData) && arrayLength(homeData.bannerBlock2) && (
              <View
                style={{
                  marginLeft: 15,
                  marginVertical: 15,
                  marginTop: 30,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}>
                <SliderCarosal data={homeData.bannerBlock2} />
              </View>
            )}
            {objectLength(homeData) && arrayLength(homeData.healthySnacks) && (
              <>
                {/* Side Heading */}
                <SideHeading
                  title={'Super Bowls / Super Meals'}
                  onPress={() =>
                    navigation.navigate('productOverView', {
                      context: 'filteredProducts',
                      name: 'healthySnacks',
                    })
                  }
                />
                {/* card section */}
                <View
                  style={{
                    marginLeft: 15,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={applySizeFilterWithRate(homeData.healthySnacks).slice(
                      0,
                      4,
                    )}
                    keyExtractor={(data, index) => index}
                    renderItem={({item, index}) => {
                      return (
                        <ProductCard key={index} item={item} ind={index} />
                      );
                    }}
                  />
                </View>
              </>
            )}

            {/* Banner slider_3 */}
            {objectLength(homeData) && arrayLength(homeData.bannerBlock2) && (
              <View
                style={{
                  marginLeft: 15,
                  marginVertical: 15,
                  marginTop: 30,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}>
                <SliderCarosal data={homeData.bannerBlock3} />
              </View>
            )}

            {objectLength(homeData) &&
              arrayLength(homeData.vegetarianJuice) && (
                <>
                  {/* Side Heading */}
                  <SideHeading
                    title={'Vegetarian food'}
                    onPress={() =>
                      navigation.navigate('productOverView', {
                        context: 'filteredProducts',
                        name: 'vegetarian',
                      })
                    }
                  />
                  {/* card section */}
                  <View
                    style={{
                      marginLeft: 15,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={applySizeFilterWithRate(
                        homeData.vegetarianJuice,
                      ).slice(0, 4)}
                      keyExtractor={(data, index) => index}
                      renderItem={({item, index}) => {
                        return (
                          <ProductCard key={index} item={item} ind={index} />
                        );
                      }}
                    />
                  </View>
                </>
              )}
          </ScrollView>

          {/* chat bot logo */}
          <Pressable
            onPress={() => setChatbot(true)}
            style={{
              padding: 5,
              zIndex: 100,
              backgroundColor: appColor.themeYellowDark,
              position: 'absolute',
              bottom: widthResponse ? 95 : 140, //@@
              right: widthResponse ? 20 : 40,
              borderRadius: 10,
            }}>
            <View
              style={{
                padding: 5,
                borderRadius: 5,
                elevation: 5,
                backgroundColor: appColor.themeYellow,
              }}>
              <Icon
                ComponentName={'MaterialIcons'}
                name={'chat'}
                size={widthResponse ? 33 : 40}
                color={appColor.bgWhite}
              />
            </View>
          </Pressable>

          {/* chatbot modal */}
          <ModalBottomSheet
            snapPoints={['70%', '70%']}
            isVisible={chatbot}
            chatbot
            close={() => setChatbot(false)}>
            <View
              style={{
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                backgroundColor: appColor.bgWhite,
              }}>
              {/* header */}
              <View
                style={{
                  backgroundColor: appColor.themeYellow,
                  paddingHorizontal: widthResponse ? 15 : 20,
                  paddingVertical: widthResponse ? 15 : 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  ComponentName={'MaterialIcons'}
                  name={'chat'}
                  size={widthResponse ? 35 : 40}
                  color={appColor.bgWhite}
                />
                <Text
                  style={{
                    color: appColor.textWhite,
                    fontSize: fontScalling(3.2),
                    marginLeft: widthResponse ? 10 : 15,
                    fontFamily: appFont.bB,
                  }}>
                  Chat with our chatbot
                </Text>
                <Pressable
                  onPress={() => setChatbot(false)}
                  style={{
                    marginLeft: 'auto',
                  }}>
                  <Icon
                    ComponentName={'Fontisto'}
                    name={'close-a'}
                    size={20}
                    color={appColor.bgWhite}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                {/* chats */}
                <View style={{flex: 1}}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={chatArray}
                    ref={botRef}
                    onContentSizeChange={() =>
                      setTimeout(() => {
                        botRef.current.scrollToEnd();
                      }, 90)
                    }
                    contentContainerStyle={{
                      paddingTop: widthResponse ? 20 : 25,
                      paddingBottom: widthResponse ? 10 : 25,
                      paddingHorizontal: widthResponse ? 20 : 25,
                    }}
                    ItemSeparatorComponent={() => {
                      return (
                        <View style={{marginBottom: widthResponse ? 15 : 20}} />
                      );
                    }}
                    renderItem={({item, index}) => {
                      return (
                        <View key={index}>
                          {/* chatbot message */}
                          {item.chatbot && item.chatbot != '' && (
                            <View
                              style={{
                                backgroundColor: appColor.bgBlack,
                                maxWidth: '70%',
                                marginRight: 'auto',
                                // marginBottom: widthResponse ? 15 : 20,
                                borderRadius: 15,
                                padding: 10,
                                borderBottomLeftRadius: 0,
                              }}>
                              <Text
                                style={{
                                  color: appColor.textWhite,
                                  fontFamily: appFont.rM,
                                  fontSize: fontScalling(1.7),
                                }}>
                                {item.chatbot}
                              </Text>
                            </View>
                          )}
                          {/* options */}
                          {item.options && item.options.length > 0 && (
                            <View
                              style={{
                                flexDirection: 'row',
                                // justifyContent: 'center',
                                flexWrap: 'wrap',
                                opacity:
                                  chatArray.length - 1 == index ? 1 : 0.5,
                                zIndex: chatArray.length - 1 == index ? 15 : -1,
                                marginTop: widthResponse ? 15 : 20,
                              }}>
                              {item.options.map((data, i) => {
                                return (
                                  <ChatbotOption
                                    key={i}
                                    data={data}
                                    isPress={chatArray.length - 1 == index}
                                  />
                                );
                              })}
                            </View>
                          )}
                          {/* user Reply */}
                          {item.user && item.user != '' && (
                            <View
                              style={{
                                backgroundColor: appColor.greyBg,
                                maxWidth: '70%',
                                marginLeft: 'auto',
                                // marginBottom: widthResponse ? 15 : 20,
                                borderRadius: 15,
                                padding: 10,
                                borderBottomRightRadius: 0,
                              }}>
                              <Text
                                style={{
                                  fontSize: fontScalling(1.7),
                                  color: appColor.textBlack,
                                  fontFamily: appFont.rM,
                                }}>
                                {item.user}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
                {/* footer */}
                <View
                  style={{
                    paddingBottom: widthResponse ? 25 : 35,
                    paddingHorizontal: widthResponse ? 20 : 25,
                    marginTop: widthResponse ? 10 : 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={() => apiBotCall(true)}>
                    <Icon
                      ComponentName={'Ionicons'}
                      name={'reload'}
                      size={widthResponse ? 25 : 30}
                      color={appColor.bgBlack}
                    />
                  </TouchableOpacity>
                  {/* input */}
                  <View
                    style={{
                      backgroundColor: appColor.greyBg,
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 10,
                      marginLeft: 10,
                      padding: 5,
                      paddingHorizontal: 10,
                    }}>
                    <TextInput
                      onChangeText={e => {
                        setUserInput(e);
                      }}
                      value={userInput}
                      style={{
                        padding: 6,
                        flex: 1,
                        paddingRight: 10,
                        color: appColor.bgBlack,
                        fontFamily: appFont.rM,
                      }}
                      placeholder="Ask your questions"
                      placeholderTextColor={appColor.placeHolderTextDark}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (userInput != '') {
                          setChatArray(pre => [
                            ...pre,
                            {
                              chatbot: '',
                              user: userInput,
                              options: [],
                            },
                          ]);
                          apiBotCall();
                          setUserInput('');
                        }
                      }}>
                      <Icon
                        ComponentName={'FontAwesome'}
                        name={'send'}
                        size={widthResponse ? 23 : 30}
                        color={appColor.Textlightblack}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ModalBottomSheet>
        </SafeAreaView>
      )}
    </>
  );
};

export default DashBoard;

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    ScrContainer: {
      overflow: 'visible',
      backgroundColor: appColor.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
      paddingTop: 10,
      zIndex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderRadius: 15,
      backgroundColor: appColor.greyBg,
      justifyContent: 'flex-start',
      marginHorizontal: 20,
      marginTop: -55,
      zIndex: 3,
      overflow: 'visible',
    },
    placeHolderStyle: {
      fontFamily: appFont.rR,
      color: appColor.placeHolderText,
      fontSize: fontScalling(2),
      paddingLeft: 10,
    },
    banner1Bg: {
      width: scrnWidth - 30,
      flexDirection: 'row',
      marginBottom: widthResponse ? 15 : 30, //@@
      borderRadius: widthResponse ? 10 : 25, //@@
      overflow: 'hidden',
      alignSelf: 'center',
      marginVertical: 20,
    },
    bnrContainer: {
      paddingVertical: widthResponse ? 20 : 30,
      justifyContent: 'space-between',
      width: '100%',
      minHeight: scrnWidth / 2.3, //@@
      flexDirection: 'row',
    },
    leftContainer: {
      width: '50%',
      // height: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: 30,
    },
    rightContainer: {
      width: '45%', //@@
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      // height: '100%',
    },
    assesMentContainer: {
      width: '100%',
      paddingTop: 10,
    },
    assInnerCon: {
      paddingHorizontal: 10,
      paddingBottom: 8,
    },
    assCard: {
      // borderWidth: 1.5,
      paddingHorizontal: 10,
      borderRadius: 15,
      width: scrnWidth / 2.7, //@@
      height: scrnWidth / 2.2, //@@
      alignItems: 'center',
      justifyContent: 'center', //@@
      overflow: 'hidden',
      // marginBottom: 25,
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
  });
  return {styles};
};
