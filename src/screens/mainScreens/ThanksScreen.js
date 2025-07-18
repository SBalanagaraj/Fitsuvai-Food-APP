import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, Image, Dimensions} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {useDispatch, useSelector} from 'react-redux';
import {deleteWholeCart} from '../../redux/CartSlice';
import LottieView from 'lottie-react-native';
import {print, scrnWidth} from '../../utilities/helperFunction';
import {setOrderTrigger} from '../../redux/SettingSlice';

export default function ThanksScreen({navigation, route}) {
  const appColor = appColors();
  const dispatch = useDispatch();
  const {orderTrigger} = useSelector(state => state.setting);
  const isSummeyPage = route?.params?.page == 'summary';

  useEffect(() => {
    if (!isSummeyPage) {
      dispatch(deleteWholeCart());
      setTimeout(() => {
        navigation.navigate('cart');
        // dispatch(setOrderTrigger(orderTrigger + 1));
      }, 1500);

      setTimeout(() => {
        navigation.navigate('Order', {screen: 'order'});
      }, 1550);
    } else if (isSummeyPage) {
      setTimeout(() => {
        // navigation.navigate('home');
        navigation.reset({
          index: 4,
          routes: [{name: 'profile'}],
        });
      }, 200);
      setTimeout(() => {
        navigation.navigate('subscriptionPlanHistory', {
          screen: 'thanksScreen',
        });
      });
      1000;
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          marginVertical: '50%',
          marginHorizontal: 20,
        }}>
        <Text
          style={{
            color: appColor.black,
            fontFamily: appFont.rB,
            fontSize: 25,
          }}>
          Thank you for your order
        </Text>
        <Text
          style={{
            color: appColor.black,
            fontFamily: appFont.rB,
            marginTop: 5,
          }}>
          Your Order will Deliver Soon
        </Text>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            style={{width: scrnWidth / 2, height: scrnWidth / 2}}
            source={require('../../../assets/lottieFiles/ticks.json')}
            autoPlay
            // loop={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
