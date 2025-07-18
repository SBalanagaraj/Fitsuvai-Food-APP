import {
  View,
  Text,
  StyleSheet,
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
  objectLength,
  arrayLength,
  destructureDate,
  convertTo24HourFormat,
  print,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {url} from '../../utilities/appApi';
import {OrderdetailShimmer} from '../../utilities/appShimmer';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {userSettingApi} from '../../redux/SettingSlice';
import {useShowToast} from '../../components/Toast/ToastAlert';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {OrderTracking} from '../../components/Card/orderTracking';
import {useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const OrderTrack = ({route, navigation}) => {
  const {
    order_id,
    order_created,
    cancelled,
    delivery_date,
    expect_delivery_time,
  } = route.params;
  ``;
  const appColor = appColors();
  const {styles} = useStyle();
  const showToast = useShowToast();
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [details, setDetails] = useState({});
  const [trackStatus, setTrackStatus] = useState(0);
  const [cancel, setCancel] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const cancelAnimRef = useRef(null);
  const isFocus = useIsFocused();

  const dispatch = useDispatch();

  const [deliveryTime, setDeliveryTime] = useState({
    day: '01',
    hr: '00',
    min: '00',
    sec: '00',
  });

  const today = new Date()
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('-');

  const deliveryTimeValid =
    deliveryTime.day != 0 ||
    deliveryTime.hr != 0 ||
    deliveryTime.min != 0 ||
    deliveryTime.sec != 0;

  const timerValid =
    deliveryTime &&
    cancelled == '0' &&
    trackStatus != 5 &&
    delivery_date >= today &&
    deliveryTimeValid;

  useEffect(() => {
    const deliveryDate =
      delivery_date.trim()?.length != 0
        ? destructureDate(delivery_date, '-')
        : '';
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

  const calculateTimeDifference = (date, time) => {
    // Convert the date to YYYY-MM-DD format
    const formattedDate = date.split('-').reverse().join('-');

    // Convert time to 24-hour format if needed
    const timeParts = time.match(/(\d+):(\d+) (\w+)/);
    let hours = parseInt(timeParts[1], 10);
    const minutes = timeParts[2];
    const period = timeParts[3];

    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:00`;

    const dateTimeString = `${formattedDate}T${formattedTime}`;
    // console.log(dateTimeString, 'dateTimeString');

    const endDate = new Date(dateTimeString);
    const startDate = new Date();
    const differenceInMs = endDate - startDate;

    // Convert the difference to hours, minutes, and seconds
    const hr = Math.floor(differenceInMs / (1000 * 60 * 60));
    const day = Math.floor(hr / 24);
    const remainderHrs = hr % 12;
    const min = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((differenceInMs % (1000 * 60)) / 1000);

    console.log(day, 'day');

    if (differenceInMs < 0) {
      return setDeliveryTime({day: 0, hr: 0, min: 0, sec: 0}); // or return null;
    }

    setDeliveryTime({
      ...deliveryTime,
      day,
      hr: day == 0 ? hr : remainderHrs,
      min,
      sec,
    });
    return {hr, min, sec};
  };

  useEffect(() => {
    if (timerValid) {
      const interval = setInterval(() => {
        calculateTimeDifference(delivery_date, expect_delivery_time);
      }, 1000);
      if (!isFocus) {
        return clearInterval(interval);
      }
    }
  }, []);

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
                        marginBottom: 5,
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
                        {
                          fontSize: fontScalling(1.8),
                          paddingBottom: 5,
                          marginRight: 5,
                          flex: 1,
                        },
                      ]}>
                      Delivery date :
                      <Text style={{fontFamily: appFont.rM}}>
                        {' '}
                        {details.order_details.delivery_date}
                      </Text>
                    </Text>
                  )}

                {timerValid && (
                  <>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 2.5,
                        backgroundColor: appColor.gold,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: -12.5,
                        zIndex: 10,
                      }}>
                      <Text
                        style={[
                          styles.roboto_light,
                          {fontSize: fontScalling(1.8), color: appColor.white},
                        ]}>
                        Delivered in
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: appColor.gold,
                        paddingBottom: 5,
                        paddingHorizontal: 10,
                        paddingTop: 15,
                        borderRadius: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{alignItems: 'center'}}>
                          <Text style={styles.keyText}>{deliveryTime.day}</Text>
                          <Text style={styles.valueText}>Day</Text>
                        </View>
                        <Text style={styles.colonStyle}>:</Text>
                        <View style={{alignItems: 'center'}}>
                          <Text style={styles.keyText}>{deliveryTime.hr}</Text>
                          <Text style={styles.valueText}>Hr</Text>
                        </View>
                        <Text style={styles.colonStyle}>:</Text>
                        <View style={{alignItems: 'center'}}>
                          <Text style={styles.keyText}>{deliveryTime.min}</Text>
                          <Text style={styles.valueText}>Min</Text>
                        </View>
                        <Text style={styles.colonStyle}>:</Text>
                        <View style={{alignItems: 'center'}}>
                          <Text style={styles.keyText}>{deliveryTime.sec}</Text>
                          <Text style={styles.valueText}>Sec</Text>
                        </View>
                      </View>
                    </View>
                  </>
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
                                  <FastImage
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
                      trackStatus={trackStatus}
                      cancelled={cancelled}
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
    keyText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.8),
      color: appColor.boldBlacktext,
    },
    valueText: {
      color: appColor.textGrey,
      fontFamily: appFont.bR,
      fontSize: fontScalling(1.5),
    },
    colonStyle: {
      color: appColor.gold,
      fontFamily: appFont.bB,
      fontSize: fontScalling(2),
      marginHorizontal:10
    },
  });

  return {styles};
};
