import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {
  arrayLength,
  currencyConvertor,
  fontScalling,
  objectLength,
  percentage,
  percentAmt,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {FlatList} from 'react-native-gesture-handler';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {useDispatch, useSelector} from 'react-redux';
import {url} from '../../utilities/appApi';
import useCartPriceInfo from '../../Hooks/useCartPriceInfo';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import {CouponCard} from '../../components/Card/CouponCard';
import {userSettingApi} from '../../redux/SettingSlice';

// Android files

const seperator = widthResponse ? 15 : 15;
const container = widthResponse ? 15 : 20;

const Coupon = ({route, navigation}) => {
  const appColor = appColors();
  const styles = useStyles();
  const showToast = useShowToast();
  const {userSettings} = useSelector(state => state.setting);
  const {total, cart} = useSelector(state => state.cart);
  const {planAmmount} = useSelector(state => state.summary);
  const {calculatePriceInfo} = useCartPriceInfo();
  const {PlanPriceInfo} = UserPlanPrice();
  const {
    distance = '',
    type = 'checkout',
    days = 1,
  } = route?.params && route?.params;

  const [promoCode, setpromoCode] = useState('');

  const productCount =
    cart && cart.length > 0
      ? cart.reduce((acc, curr) => {
          const count = acc + curr.quantity;
          return count;
        }, 0)
      : 0;

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

  //apply Promo code -------------//
  const toapplyPromocode = async (suggestions = '') => {
    const fdata = new FormData();
    if (userSettings?.userInfo?.user_id) {
      fdata.append('userId', userSettings?.userInfo?.user_id);
    }
    fdata.append('code', suggestions == '' ? promoCode : suggestions);
    fdata.append('context', type == 'assessment' ? type : 'general');
    try {
      const apply = await fetch(url().promoCode, {
        method: 'POST',
        body: fdata,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // print(fdata, 'fdata');

      let respo = await apply.json();
      print(respo, 'respo');
      if (respo?.message) {
        if (respo?.percent) {
          const subTotal =
            type == 'assessment' ? planAmmount?.subTotal : total?.subTotal;

          // Which amount will be lower value to apply the coupon
          const percentAmount = percentAmt(subTotal, respo.percent);
          const offerAmt =
            respo.high_price && respo.high_price != ''
              ? percentAmount < respo.high_price
              : true;
          const percent = percentage(subTotal, Number(respo.high_price));
          console.log(percent, 'percent');
          hookFunction(false, suggestions, offerAmt ? respo?.percent : percent);
          navigation.goBack();
        } else {
          setpromoCode('');
        }
        showToast('custom', respo.message, '', 1500);
      }
    } catch (err) {
      console.log(err, 'check-err');
    }
  };

  // set Redux
  const hookFunction = (cancel = false, suggestions = '', percentage) => {
    if (type == 'checkout') {
      calculatePriceInfo(
        {
          code: cancel ? null : suggestions == '' ? promoCode : suggestions,
          percent: cancel ? null : percentage,
        },
        distance,
        0,
        0,
        'checkDistance',
        total.vesselPrice,
        total.vesselName,
      );
    }
    if (planAmmount && type == 'assessment') {
      PlanPriceInfo(
        planAmmount.subTotal,
        {
          code: cancel ? null : suggestions == '' ? promoCode : suggestions,
          percent: cancel ? null : percentage,
        },
        planAmmount.sectionCount,
        planAmmount.km,
        'checkDistance',
        planAmmount.vesselPrice,
        planAmmount.vesselName,
        planAmmount.dishCount,
      );
    }
    cancel && navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: appColor.white}}>
      {/* curve structure */}
      {/* <View style={{backgroundColor: appColor.bgBlack}}>
        <View style={[styles.curve]} />
      </View> */}
      <View
        style={{
          flexDirection: 'row',
          // marginTop: widthResponse ? -55 : -60,
          zIndex: 3,
        }}>
        {/* search bar */}
        <View style={[styles.srchBar]}>
          {/* seach icon */}
          <Icon
            ComponentName={'FontAwesome'}
            name={'search'}
            color={appColor.textGrey}
            size={widthResponse ? 20 : 25}
          />
          {/* search input */}
          <TextInput
            numberOfLines={1}
            // autoFocus={true}
            value={promoCode}
            onChangeText={setpromoCode}
            placeholder="Enter Coupen Code"
            placeholderTextColor={appColor.placeHolderTextDark}
            style={[
              styles.srchFont,
              {
                flex: 1,
                paddingHorizontal: widthResponse ? 7 : 10,
              },
            ]}
          />
          <TouchableOpacity onPress={handlepromoCode}>
            <Text style={[styles.srchFont, {color: appColor.Textlightblack}]}>
              APPLY
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.container]}>
        {/* Coupon list */}
        {userSettings?.discount_suggetions &&
          arrayLength(userSettings?.discount_suggetions) && (
            <FlatList
              data={userSettings?.discount_suggetions}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={true}
              style={{maxHeight: 300}}
              contentContainerStyle={{paddingTop: 6}}
              // ItemSeparatorComponent={() => {
              //   return <View style={{paddingTop: seperator}} />;
              // }}
              renderItem={({item}) => {
                return (
                  item.suggestions == '1' &&
                  (userSettings?.first_order == false
                    ? item.first_order == '0'
                    : item.first_order == '1') &&
                  (type == 'checkout'
                    ? item.general_order == '1'
                    : item.general_order != '1') &&
                  ((type == 'checkout'
                    ? Number(item.days) == 1
                    : item.days <= days) ||
                    item.days == '') &&
                  (Number(item.meals) <=
                    (type == 'assessment'
                      ? planAmmount.dishCount
                      : productCount) ||
                    item.meals == '') && (
                    <View style={{paddingTop: seperator}}>
                      <CouponCard
                        item={item}
                        toapplyPromocode={toapplyPromocode}
                        type={type}
                      />
                    </View>
                  )
                );
              }}
            />
          )}
      </View>
    </View>
  );
};

export default Coupon;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    curve: {
      marginHorizontal: 10,
      backgroundColor: appColor.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
      paddingTop: 10,
      height: widthResponse ? 55 : 65,
      zIndex: 1,
    },
    srchBar: {
      flex: 1,
      borderColor: appColor.textGrey,
      borderWidth: 1,
      alignSelf: 'stretch',
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      // marginHorizontal: widthResponse ? 15 : 20,
      paddingHorizontal: widthResponse ? 10 : 15,
      //paddingVertical: widthResponse ? 5 : 10,
    },
    srchFont: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.7),
      color: appColor.bgBlack,
    },
    container: {
      flex: 1,
      // marginTop: seperator,
      // paddingHorizontal: container,
    },
    head: {
      fontFamily: appFont.bR,
      fontSize: fontScalling(1.9),
      color: appColor.white,
    },
    subHead: {
      fontFamily: appFont.bR,
      fontSize: fontScalling(1.7),
      color: appColor.black,
    },
    para: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.6),
      color: appColor.ToastSuccess,
    },
  });
  return styles;
};
