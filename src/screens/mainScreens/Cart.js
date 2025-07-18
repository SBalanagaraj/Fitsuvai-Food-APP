import {View, Text, StyleSheet, Image, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  currencyConvertor,
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
} from '../../utilities/helperFunction';
import AddToCartBtn from '../../components/Buttons/AddToCartBtn';
import FilterButton from '../../components/Buttons/FilterButton';
import * as Animatable from 'react-native-animatable';
import {
  coinsCollector,
  removeFromCart,
  setCart,
  setDeleteModal,
} from '../../redux/CartSlice';
import OrderPriceContainer from '../../components/Card/OrderPriceContainer';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import LottieView from 'lottie-react-native';
import {Icon} from '../../utilities/icon';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import useCartPriceInfo from '../../Hooks/useCartPriceInfo';
import {setBottomTabPress} from '../../redux/SettingSlice';
import {url} from '../../utilities/appApi';
import FastImage from 'react-native-fast-image';
import HtmlView from '../../components/HtmlElement/RenderHtml';

const Cart = ({navigation}) => {
  const {cart, total, deleteModal} = useSelector(state => state.cart);
  const {userSettings, vegToggle, bottomTabPress, AppContents} = useSelector(
    state => state.setting,
  );
  const {userType} = useSelector(state => state.auth);
  const isFocus = useIsFocused();
  const {calculatePriceInfo} = useCartPriceInfo();

  const [coins, setCoin] = useState(0);
  const [deleteIcon, setDeleteIcon] = useState(false);
  const [load, setLoad] = useState(false);
  const [suggestionData, setSuggestionData] = useState([]);

  const appColor = appColors();
  const {styles} = useStyles();
  const dispatch = useDispatch();

  const scrollRef = useRef(null);

  const deleteAnimRef = useRef(null);

  const cartContent =
    AppContents &&
    AppContents?.cart_content &&
    AppContents?.cart_content[0] &&
    AppContents?.cart_content[0]?.value?.split('\r\n') &&
    AppContents?.cart_content[0]?.value?.split('\r\n').length > 0
      ? AppContents?.cart_content[0]?.value?.split('\r\n')
      : [];

  //coin generator fn
  function TotalBasedCoinGenrator() {
    if (
      total &&
      total.totalamt > userSettings?.REWARD?.maximum_amount &&
      userSettings?.REWARD &&
      total.totalamt &&
      cart &&
      cart.length > 0
    ) {
      const coinValue = (
        (parseFloat(total.totalamt) * Number(userSettings?.REWARD?.reward)) /
        Number(userSettings?.REWARD?.number_points)
      ).toFixed(0);
      setCoin(coinValue);
      dispatch(coinsCollector(coinValue));
    } else if (total.totalamt < userSettings?.REWARD?.maximum_amount) {
      dispatch(coinsCollector(0));
    }
  }

  useEffect(() => {
    (async () => TotalBasedCoinGenrator())();
  }, [total.totalamt]);

  const apiCall = async () => {
    try {
      setLoad(true);
      const requestOptions = {
        method: 'POST',
      };
      const response = await fetch(url().searchSuggestion, requestOptions);
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.data.suggestions) {
          const filterHideStatus = resparse.data.suggestions;
          if (filterHideStatus && filterHideStatus.length > 0) {
            setSuggestionData(filterHideStatus);
          }
          setLoad(false);
        }
      } else {
        print(response.status, 'status code in cart API');
      }
    } catch (error) {
      console.log(error, 'error api in Cart screen');
    }
  };

  useEffect(() => {
    if (isFocus) {
      apiCall();
    }
    if (!isFocus) {
      calculatePriceInfo(
        {
          code: null,
          percent: null,
        },
        0,
        0,
        0,
        'dummy',
        0,
        0,
      );
    }
  }, [isFocus]);

  useEffect(() => {
    if (
      cart.length > 0 &&
      suggestionData &&
      suggestionData.length > 0
      // &&isFocus
    ) {
      const matchedProducts = cart.filter(item =>
        suggestionData.some(suggestion =>
          vegToggle
            ? suggestion.id === item.id &&
              suggestion.hide_status !== '0' &&
              suggestion.vegetartin_foods == '1'
            : suggestion.id === item.id && suggestion.hide_status !== '0',
        ),
      );
      dispatch(setCart(matchedProducts));
    }
  }, [suggestionData, vegToggle]);

  const onPressTouch = () => {
    dispatch(setBottomTabPress(0));
    scrollRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  useEffect(() => {
    if (bottomTabPress) {
      onPressTouch();
    }
  }, [bottomTabPress]);

  return (
    <>
      <View style={{flex: 1, backgroundColor: appColor.bgWhite}}>
        <View style={{backgroundColor: appColor.bgBlack}}>
          <View
            style={[
              {
                marginHorizontal: 10,
                backgroundColor: appColor.white,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingBottom: 20,
                paddingTop: 10,
                height: 65,
                zIndex: 1,
              },
            ]}
          />
        </View>

        {cart && cart.length > 0 ? (
          <>
            {cart && cart.length > 0 && (
              <Text
                style={[
                  styles.HeadingText,
                  {textAlign: 'center', marginTop: -50},
                ]}>
                <Text style={{color: appColor.gold}}>{cart.length + '  '}</Text>
                items in your cart
              </Text>
            )}
            <View style={{flex: 1, backgroundColor: appColor.white}}>
              {cart && cart.length > 0 && (
                <FlatList
                  ref={scrollRef}
                  showsVerticalScrollIndicator={false}
                  data={cart.map(data => ({
                    ...data,
                    offer: data.offer * data.quantity,
                  }))}
                  horizontal={false}
                  contentContainerStyle={{paddingBottom: 91}}
                  renderItem={({item, index}) => {
                    return (
                      <Pressable
                        onPress={() =>
                          navigation.navigate('Dashboard', {
                            screen: 'productDetail',
                            params: {productId: item.id},
                          })
                        }
                        style={styles.card}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                          }}>
                          <Animatable.View
                            style={{
                              width: scrnWidth / 5,
                              height: scrnWidth / 5,
                              borderRadius: 10,
                              overflow: 'hidden',
                              backgroundColor: appColor.cardbg,
                            }}>
                            <FastImage
                              resizeMode="cover"
                              style={{width: '100%', height: '100%'}}
                              source={{
                                priority: FastImage.priority.high,
                                uri:
                                item.image && item.image != ''
                                    ? item.image
                                    : item.main_image,
                              }}
                            />
                          </Animatable.View>
                          <Animatable.View
                            animation={'fadeInDown'}
                            duration={500 * index}
                            style={{
                              paddingLeft: 15,
                              width: '50%',
                            }}>
                            <Text
                              style={[
                                styles.HeadingText,
                                {fontSize: fontScalling(2)},
                              ]}>
                              {item.name}
                            </Text>
                            <Text style={styles.normalText}>
                              Qty : {item.quantity}
                            </Text>
                            <Text style={styles.price}>
                              {currencyConvertor(item.offer, 2)}
                            </Text>
                          </Animatable.View>
                        </View>
                        <Pressable
                          onPress={() => {}}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '100%',
                            paddingVertical: 20,
                            paddingLeft: 10,
                            marginLeft: -10,
                          }}>
                          <AddToCartBtn data={item} cartBtn={true} />
                          <View style={{width: scrnWidth / 4}}>
                            <FilterButton
                              onPress={() => {
                                dispatch(
                                  setDeleteModal({isModal: true, item: item}),
                                );
                              }}
                              ICN={'Ionicons'}
                              IN={'close'}
                              title={'Remove'}
                              altStyle={{borderRadius: 20, borderWidth: 0.8}}
                            />
                          </View>
                        </Pressable>
                      </Pressable>
                    );
                  }}
                  ListFooterComponent={() => {
                    return (
                      <>
                        <View
                          style={{
                            backgroundColor: appColor.cardbg,
                            paddingVertical: 15,
                            marginHorizontal: 20,
                            borderRadius: 15,
                          }}>
                          {userType == 'user' &&
                            total.totalamt >
                              userSettings?.REWARD?.maximum_amount && (
                              <View
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'row',
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    paddingLeft: 5,
                                    fontFamily: appFont.bB,
                                    color: appColor.bgBlack,
                                    fontSize: fontScalling(2),
                                  }}>
                                  You will receive {'  '}
                                  <Image
                                    source={{
                                      uri: 'https://grocarto.com/assets/images/User/app/coin.png',
                                    }}
                                    style={{width: 20, height: 20}}
                                    resizeMode="contain"
                                  />
                                  <Text
                                    style={{
                                      fontFamily: appFont.bB,
                                      color: appColor.gold,
                                    }}>
                                    {' '}
                                    {'  ' + coins && coins + ' '}
                                  </Text>{' '}
                                  coins for this Order
                                </Text>
                              </View>
                            )}
                          {!load ? (
                            <OrderPriceContainer data={total} km={total.kms} />
                          ) : (
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <LottieView
                                autoPlay={true}
                                style={{width: 150, height: 150, top: 5}}
                                source={require('../../../assets/lottieFiles/load.json')}
                              />
                            </View>
                          )}
                        </View>
                        {
                          <PrimaryButton
                            textStyle={{fontSize: fontScalling(2)}}
                            onPress={
                              load
                                ? () => {}
                                : () => navigation.navigate('checkOut')
                            }
                            Title={load ? 'Loading...' : 'Checkout'}
                            altStyle={{marginHorizontal: 20, marginTop: 20}}
                          />
                        }
                        <View
                          style={{
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            padding: 10,
                          }}>
                          {cartContent && (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                paddingTop: 10,
                                paddingHorizontal: 25,
                              }}>
                              {/* <Text
                                      style={[
                                        styles.subText,
                                        {
                                          paddingLeft: 15,
                                          fontSize: fontScalling(1.8),
                                        },
                                      ]}>
                                      {data}
                                      
                                    </Text> */}
                              <HtmlView url={cartContent[0]} padding={40} />
                            </View>
                          )}
                        </View>
                        <Pressable
                          onPress={() => navigation.navigate('home')}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            paddingTop: 10,
                          }}>
                          <Text
                            style={{
                              color: appColor.Textlightblack,
                              fontFamily: appFont.bB,
                              fontSize: fontScalling(2.2),
                            }}>
                            {'Continue shopping  '}
                          </Text>
                          <Animatable.View
                            animation={'zoomIn'}
                            duration={1000}
                            iterationDelay={1000}
                            iterationCount={'infinite'}>
                            <Icon
                              ComponentName={'AntDesign'}
                              name={'doubleright'}
                              size={18}
                              color={appColor.Textlightblack}
                            />
                          </Animatable.View>
                        </Pressable>
                      </>
                    );
                  }}
                  ItemSeparatorComponent={() => {
                    return (
                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: appColor.greyBg,
                        }}
                      />
                    );
                  }}
                />
              )}
            </View>
          </>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: appColor.white,
            }}>
            <LottieView
              style={{width: scrnWidth / 1.5, height: scrnWidth / 1.5}}
              source={require('../../../assets/lottieFiles/emptyProduct.json')}
              autoPlay
              loop={true}
            />
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(1.8),
                color: appColor.bgBlack,
                padding: 10,
              }}>
              Please add product to cart
            </Text>
            <Text
              onPress={() => {
                navigation.navigate('Menu', {screen: 'menu'});
              }}
              style={{
                color: appColor.black,
                fontSize: fontScalling(2),
                fontFamily: appFont.rB,
                textDecorationLine: 'underline',
              }}>
              Buy Product
            </Text>
          </View>
        )}
        {/* Delete Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={deleteModal.isModal}
          backdropColor={appColor.overlayBg}
          backdropOpacity={1}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onBackdropPress={() =>
            dispatch(setDeleteModal({isModal: false, item: {}}))
          }
          onRequestClose={() => {
            dispatch(setDeleteModal({isModal: false, item: {}}));
          }}>
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 15,
              paddingBottom: 15,
              borderRadius: 5,
              alignItems: 'center',
              paddingTop: 0,
            }}>
            <LottieView
              ref={deleteAnimRef}
              resizeMode="contain"
              style={{
                width: deleteIcon ? scrnWidth / 2 : scrnWidth / 3,
                height: deleteIcon ? scrnWidth / 2 : scrnWidth / 3,
                marginTop: -35,
              }}
              source={require('../../../assets/lottieFiles/trash_1.json')}
              autoPlay
              loop={false}
            />
            {!deleteIcon && (
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(2),
                  color: appColor.black,
                }}>
                Are you sure want to delete product ?
              </Text>
            )}
            {!deleteIcon && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '85%',
                }}>
                <Pressable
                  style={{
                    backgroundColor: appColor.gold,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    deleteAnimRef?.current.play(0, 150);
                    setDeleteIcon(true);
                    setTimeout(() => {
                      dispatch(setDeleteModal({isModal: false, item: {}}));
                      setDeleteIcon(false);
                    }, 1500);
                    dispatch(removeFromCart(deleteModal.item));
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(2),
                      color: appColor.white,
                      textAlign: 'center',
                    }}>
                    yes
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    backgroundColor: appColor.bgBlack,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginLeft: 20,
                  }}
                  onPress={() =>
                    dispatch(setDeleteModal({isModal: false, item: {}}))
                  }>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(2),
                      color: appColor.white,
                      textAlign: 'center',
                    }}>
                    No
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Cart;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    card: {
      // width: scrnWidth - 30,
      height: scrnHeight / 7,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingHorizontal: 20,
    },
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.Textlightblack,
      paddingBottom: 5,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.5),
      color: appColor.Textlightblack,
    },
    normalText: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.5),
      color: appColor.Textlightblack,
      paddingBottom: 5,
    },
    price: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(1.8),
      color: appColor.Textlightblack,
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
