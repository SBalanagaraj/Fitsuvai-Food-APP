import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Image,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  currencyConvertor,
  print,
  objectLength,
  arrayLength,
  destructureDate,
  destructureDateSlace,
  convertTo24HourFormat,
} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import * as Animatable from 'react-native-animatable';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
// import MainOverflowCard from '../../components/Card/MainOverflowCard';
import {url} from '../../utilities/appApi';
import {OrderdetailShimmer} from '../../utilities/appShimmer';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {userSettingApi} from '../../redux/SettingSlice';
import moment from 'moment';
import {useShowToast} from '../../components/Toast/ToastAlert';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

const OrderTrack = ({route, navigation}) => {
  const {order_id, order_created, delivery_date, cancelled} = route.params;
  const appColor = appColors();
  const {styles} = useStyle();
  const showToast = useShowToast();
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [details, setDetails] = useState({});
  const [trackStatus, setTrackStatus] = useState(0);
  const [cancel, setCancel] = useState(false);
  const animationDuration = 600;
  const [cancelModal, setCancelModal] = useState(false);
  const cancelAnimRef = useRef(null);

  console.log(order_id, 'cancel');
  const dispatch = useDispatch();

  // console.log(
  //   new Date('2024-12-05 18:47:03').getTime(),
  //   'format',
  //   new Date().getTime(),
  // );

  useEffect(() => {
    const deliveryDate =
      delivery_date?.length != 0 ? destructureDate(delivery_date, '-') : '';
    if (
      deliveryDate?.length != 0 &&
      new Date(deliveryDate).getTime() > new Date().getTime() &&
      cancelled == '0'
    ) {
      setCancel(true);
    } else if (
      order_created?.length != 0 &&
      deliveryDate?.length != 0 &&
      deliveryDate == order_created?.split(' ')[0] &&
      cancelled == '0'
    ) {
      const timer = setInterval(timerFun, 1000);
      function timerFun() {
        // formating the order created date:
        const created = `${order_created.split(' ').join('T')}+0000`;
        const created1minMs = new Date(created).getTime() + 60000;
        const createdObj = new Date(created1minMs);
        // formating the order current date:
        const currentDate = destructureDate(
          new Date().toLocaleDateString(),
          '/',
        );
        const currentTime = new Date().toLocaleTimeString();
        const currentObj = new Date(
          `${currentDate}T${convertTo24HourFormat(currentTime)}+0000`,
        );
        const currentMs = currentObj.getTime();
        setCancel(true);
        console.log(created1minMs, 'clg', currentMs);
        // order created ms and current ms validate:
        if (created1minMs < currentMs) {
          setCancel(false);
          clearInterval(timer);
        }
      }
    } else {
      setCancel(false);
    }
  }, []);

  //api call
  const apiCall = (cancel = false) => {
    (async () => {
      try {
        if (Object.keys(details).length == 0) {
          setLoad(true);
        }
        // request data for backend:
        var myHeaders = new Headers();
        const formdata = new FormData();
        formdata.append('id', order_id);
        !cancel && formdata.append('context', 'orderDetails');
        var requestOptions = {
          method: 'POST',
          body: formdata,
        };

        const response = await fetch(
          !cancel ? url().myOrder : url().cancelOrder,
          requestOptions,
        );
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'Success') {
            if (resparse.data) {
              setDetails(resparse.data);
              if (arrayLength(resparse.data.status_history)) {
                setTrackStatus(
                  resparse.data.status_history.reduce((total, obj) => {
                    return total + Number(obj.value);
                  }, 0),
                );
              }
            }
          }
          if (
            resparse.status == 'success' &&
            resparse.message &&
            resparse.message != '' &&
            cancel
          ) {
            setCancel(false);
            showToast('success', 'Order Cancelled', resparse.message, 2000);
            navigation.navigate('order');
          }
        } else {
          console.log('order Track status code:', response.status);
        }
        setLoad(false);
        setRefresh(false);
      } catch (error) {
        console.log(error, 'Error in order detail');
        setLoad(false);
        setRefresh(false);
      }
    })();
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      apiCall();
      dispatch(userSettingApi());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      await apiCall();
    })();
  }, []);

  //pull to refresh
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    refresh && apiCall();
  }, [refresh]);

  const OrderTracking = ({data, i, length}) => {
    const [lineHeight, setLineHeight] = useState(0); //@@
    // text animation:
    const colorValue = useRef(new Animated.Value(0)).current;
    const nameAnimation = colorValue.interpolate({
      inputRange: [0, 1],
      outputRange: [appColor.lightGreyLine, appColor.textBlack], // From black to red
    });
    const descriptionAnimation = colorValue.interpolate({
      inputRange: [0, 1],
      outputRange: [appColor.lightGreyLine, appColor.Textlightblack], // From black to red
    });
    useEffect(() => {
      const startColorAnimation = () => {
        Animated.timing(colorValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }).start(() => {
          if (trackStatus > i) {
            Animated.timing(colorValue, {
              toValue: 1,
              delay: i * animationDuration,
              duration: animationDuration,
              useNativeDriver: false,
            }).start();
          }
        });
      };
      startColorAnimation();
    }, []);
    const slideDown = {
      //@@
      from: {
        transform: [{translateY: -lineHeight}],
      },
      to: {
        transform: [{translateY: 0}],
      },
    };

    return (
      <View style={[styles.dotOut, {minHeight: 60}]}>
        <View style={styles.dotIn}>
          {/* dots */}
          <View
            style={[
              styles.dot,
              {backgroundColor: appColor.greyBg, overflow: 'hidden'},
            ]}>
            <Animatable.View
              duration={animationDuration}
              delay={i * animationDuration}
              animation={'fadeIn'}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  trackStatus > i ? appColor.themeYellow : appColor.greyBg,
              }}>
              <Icon
                ComponentName={cancelled == '1' ? 'AntDesign' : 'FontAwesome'}
                name={cancelled == '1' ? 'close' : 'check'}
                size={widthResponse ? 18 : 23}
                color={appColor.bgWhite}
              />
            </Animatable.View>
          </View>
          {/* line */}
          {i != length - 1 && (
            <View
              style={{marginBottom: 10, height: '100%', flex: 1}}
              onLayout={({nativeEvent}) => {
                setLineHeight(nativeEvent.layout.height);
              }}>
              <View
                style={[
                  styles.line,
                  {
                    overflow: 'hidden',
                    backgroundColor: appColor.greyBg,
                  },
                ]}>
                <Animatable.View
                  duration={animationDuration}
                  delay={i * animationDuration}
                  // easing={'ease-in-out'}
                  animation={slideDown} //@@
                  style={[
                    {
                      width: '100%',
                      height: '100%',
                      backgroundColor:
                        trackStatus > i + 1
                          ? appColor.themeYellow
                          : appColor.greyBg,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
        {/* contents */}
        <Pressable style={[styles.dotContent]}>
          {data.status && data.status != '' && (
            <Animated.Text
              style={[
                styles.roboto_light,
                {
                  textTransform: 'capitalize',
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.8),
                  color: nameAnimation,
                  marginBottom: widthResponse ? 4 : 7,
                },
              ]}>
              {data.status}
            </Animated.Text>
          )}
          {data.date && data.date != null && data.date != '' && (
            <Animated.Text
              style={[
                styles.roboto_light,
                {
                  color: descriptionAnimation,
                },
              ]}>
              {data.date}
            </Animated.Text>
          )}
        </Pressable>
      </View>
    );
  };
  return (
    <MainOverflowCard
      onRefresh={onRefresh}
      refresh={refresh}
      borderRadius={40}
      altStyle={{paddingTop: 20}}>
      {load ? (
        <OrderdetailShimmer />
      ) : (
        <>
          {objectLength(details) && (
            <>
              {/* top content */}
              <View
                style={{
                  alignItems: 'center',
                  marginTop: widthResponse ? 10 : 20,
                  marginBottom: widthResponse ? 20 : 30,
                }}>
                {/* order id */}
                {details.id && details.id != '' && (
                  <Text
                    style={[
                      styles.baby_blk,
                      {
                        marginBottom: 10,
                        fontSize: fontScalling(2.9),
                        color: appColor.themeYellow,
                      },
                    ]}>
                    <Text style={[{color: appColor.textBlack}]}>
                      Order Id:{' '}
                    </Text>
                    #{details.id}
                  </Text>
                )}
                {/* deliver date */}
                {objectLength(details.order_details) &&
                  details.order_details.delivery_date &&
                  details.order_details.delivery_date != '' && (
                    <Text
                      style={[
                        styles.roboto_light,
                        {fontSize: fontScalling(1.8)},
                      ]}>
                      Delivery date :
                      <Text style={{fontFamily: appFont.rM}}>
                        {' '}
                        {details.order_details.delivery_date}
                      </Text>
                    </Text>
                  )}
              </View>
              {/* products */}
              <View
                style={{
                  backgroundColor: appColor.greyBg,
                  width: scrnWidth,
                  left: -24,
                  marginBottom: widthResponse ? 15 : 20,
                  paddingHorizontal: 24,
                  paddingVertical: 15,
                }}>
                {arrayLength(details.product_details) && (
                  <FlatList
                    scrollEnabled={false}
                    data={details.product_details}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => {
                      return (
                        <View
                          style={{
                            height: 1,
                            width: '100%',
                            marginVertical: 20,
                            backgroundColor: appColor.lightGreyLine,
                          }}
                        />
                      );
                    }}
                    keyExtractor={(data, index) => index}
                    renderItem={({item, index}) => {
                      return (
                        <Pressable key={index} style={[styles.card_in]}>
                          {/* images */}
                          <View style={styles.img_view}>
                            <View
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: appColor.bgWhite,
                              }}>
                              {item.product_image &&
                                item.product_image != '' && (
                                  <Image
                                    style={{
                                      width: '70%',
                                      height: '70%',
                                      borderRadius: 50,
                                    }}
                                    resizeMode="cover"
                                    source={{uri: item.product_image}}
                                  />
                                )}
                            </View>
                          </View>
                          {/* details */}
                          <View
                            style={{
                              flex: 1,
                              paddingHorizontal: widthResponse ? 15 : 20,
                            }}>
                            {item.product_name && item.product_name != '' && (
                              <Text
                                numberOfLines={1}
                                style={[styles.baby_blk, {marginBottom: 3}]}>
                                {item.product_name}
                              </Text>
                            )}
                            {item.product_count && item.product_count != '' && (
                              <Text
                                style={[
                                  styles.roboto_light,
                                  {marginBottom: 7},
                                ]}>
                                Quantity : {item.product_count}
                              </Text>
                            )}

                            {item.product_price && item.product_price != '' && (
                              <Text
                                style={[
                                  styles.roboto_light,
                                  {
                                    fontFamily: appFont.rB,
                                    color: appColor.themeYellow,
                                  },
                                ]}>
                                {currencyConvertor(item.product_price, 2)}
                              </Text>
                            )}
                          </View>
                        </Pressable>
                      );
                    }}
                  />
                )}
              </View>
              {/* order Track */}
              {arrayLength(details.status_history) &&
                details.status_history.map((data, i) => {
                  return (
                    <OrderTracking
                      data={data}
                      i={i}
                      key={i}
                      length={details.status_history.length}
                    />
                  );
                })}
              {/* cancel Order */}
              {details?.order_details?.deleted &&
                details?.order_details?.deleted == '0' &&
                trackStatus != 5 &&
                cancel && (
                  <PrimaryButton
                    onPress={() => {
                      setCancelModal(true);
                    }}
                    Title={'Cancel Order'}
                    parentStyle={{padding: 0, paddingVertical: 20}}
                  />
                )}
              {cancelled == '1' && (
                <Text
                  style={[
                    styles.roboto_light,
                    {
                      fontFamily: appFont.rB,
                      color: appColor.themeYellow,
                      alignSelf: 'center',
                    },
                  ]}>
                  Your order was cancelled
                </Text>
              )}
            </>
          )}
        </>
      )}

      <Modal
        animationType="slide"
        onBackdropPress={() => {
          setCancelModal(false);
        }}
        backdropColor={appColor.overlayBg}
        backdropOpacity={1}
        transparent={true}
        isVisible={cancelModal}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
          width: scrnWidth / 1.2,
          marginHorizontal: 'auto',
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
            ref={cancelAnimRef}
            resizeMode="contain"
            style={{
              width: scrnWidth / 2,
              height: scrnWidth / 2.5,
              // marginTop: -35,
            }}
            source={require('../../../assets/lottieFiles/trash_1.json')}
            loop={false}
          />
          <Text
            style={{
              marginBottom: 10,
              fontFamily: appFont.rB,
              fontSize: fontScalling(2.1),
              color: appColor.textBlack,
              paddingBottom: 10,
            }}>
            Are you sure you want to cancel order?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Pressable
              style={{
                backgroundColor: appColor.themeYellow,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              onPress={() => {
                cancelAnimRef?.current.play(0, 150);
                apiCall(true);
                setTimeout(() => {
                  setCancelModal(false);
                }, 2000);
              }}>
              <Text
                style={{
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.5),
                  color: appColor.white,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}>
                yes
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
              onPress={() => setCancelModal(false)}>
              <Text
                style={{
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.5),
                  color: appColor.white,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}>
                no
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </MainOverflowCard>
  );
};

export default OrderTrack;
const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    card_in: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
    img_view: {
      width: widthResponse ? 80 : 150,
      height: widthResponse ? 80 : 150,
    },
    imglength: {
      borderWidth: 1,
      borderRadius: 6,
      height: '100%',
      width: '100%',
      padding: 3,
      borderColor: appColor.bgBlack,
      backgroundColor: appColor.bgBlack,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dotOut: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dotIn: {
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    dotContent: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 3,
      paddingBottom: widthResponse ? 20 : 30,
    },
    dot: {
      width: widthResponse ? 30 : 34,
      height: widthResponse ? 30 : 34,
      borderRadius: 60,
      zIndex: 10,
    },
    line: {
      borderColor: appColor.themeYellow,
      width: widthResponse ? 3 : 5,
      height: '100%',
      left: widthResponse ? -1.5 : -2.5, //@@
      position: 'absolute',
      top: 5,
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
