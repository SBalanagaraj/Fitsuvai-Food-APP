import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {useDispatch, useSelector} from 'react-redux';
import {deleteWholeCart} from '../../redux/CartSlice';
import LottieView from 'lottie-react-native';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {useIsFocused} from '@react-navigation/native';
import {Icon} from '../../utilities/icon';

// Android Files

export default function ThanksScreen({navigation, route}) {
  const appColor = appColors();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const {orderTrigger} = useSelector(state => state.setting);

  const {styles} = useStyle();

  const isSummeyPage = route?.params?.page == 'summary';
  const planId = route?.params?.id ? route?.params?.id : '';
  const {slotDate = '', expectDeliveryTime = ''} = route?.params;

  let [deliveryTime, stDeliveryTime] = useState({
    day:'0',
    hr: '0',
    min: '0',
    sec:'0'
  });

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
    // let hr = Math.floor(differenceInMs / (1000 * 60 * 60));
    // const min = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

    const hr = Math.floor(differenceInMs / (1000 * 60 * 60));
    const day = Math.floor(hr / 24);
    const remainderHrs = hr % 12;
    const min = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((differenceInMs % (1000 * 60)) / 1000);

    if (differenceInMs > 0) {
      stDeliveryTime({
        day,
        hr,
        min,
       sec
      });
    }
  };

  useEffect(() => {
    isFocus && !isSummeyPage && dispatch(deleteWholeCart());
    if (!isFocus && !isSummeyPage) {
      navigation.reset({
        index: 1,
        routes: [{name: 'cart'}],
      });
    } else if (isFocus && isSummeyPage) {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'home'}],
        });
        navigation.navigate('SubscribedPlanDetail', {id: planId});
      }, 2000);
    }

    if (slotDate && expectDeliveryTime) {
        const interval = setInterval(() => {
          calculateTimeDifference(slotDate, expectDeliveryTime);
        }, 1000);
        if (!isFocus) {
          return clearInterval(interval);
        }
      
    }
  }, [isFocus]);
  console.log(deliveryTime, 'deliveryTime');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: widthResponse ? 90 : 140,
      }}>
      <Text
        style={{
          color: appColor.black,
          fontFamily: appFont.rB,
          fontSize: fontScalling(3),
        }}>
        Order Placed <Text style={{color: appColor.gold}}>Successfully</Text>
      </Text>
      <Text
        style={{
          color: appColor.black,
          fontFamily: appFont.rB,
          fontSize: fontScalling(2),
          marginVertical: 10,
        }}>
        Thanks for scheduling your order
      </Text>
      {/* deliver duration */}
      {deliveryTime.min != 0 && !isSummeyPage && (
        // <Text
        //   style={{
        //     color: appColor.black,
        //     fontFamily: appFont.rB,
        //     fontSize: fontScalling(2),
        //     marginTop: 5,
        //   }}>
        //   Delivery in
        //   <Text style={{color: appColor.gold}}>
        //     {' '}
        //     {deliveryTime.hr == 0 ? '' : deliveryTime.hr + ' hours '}
        //     {deliveryTime.min == 0 ? '' : deliveryTime.min + ' minutes'}
        //   </Text>
        // </Text>
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
      {/* navigate order */}
      {!isSummeyPage && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('Order', {screen: 'order'});
          }}
          style={{
            marginTop: 5,
            borderBottomWidth: 2,
            borderColor: appColor.gold,
          }}>
          <Text
            style={{
              color: appColor.gold,
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
            }}>
            See your orders
          </Text>
        </TouchableOpacity>
      )}
      {/* lottie */}
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <LottieView
          style={{width: scrnWidth / 2, aspectRatio: 1}}
          source={require('../../../assets/lottieFiles/ticks.json')}
          autoPlay
        />
      </View>
    </View>
  );
}

const useStyle = () => {
  const appColor = appColors();
const styles = StyleSheet.create({
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
})
return{styles}}