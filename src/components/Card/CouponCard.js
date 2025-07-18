import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect} from 'react';
import appColors from '../../utilities/appColors';
import {useSelector} from 'react-redux';
import {
  currencyConvertor,
  fontScalling,
  objectLength,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import useCartPriceInfo from '../../Hooks/useCartPriceInfo';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import LottieView from 'lottie-react-native';
import {Icon} from '../../utilities/icon';
import HtmlView from '../HtmlElement/RenderHtml';

export const CouponCard = ({
  item,
  toapplyPromocode = () => {},
  type = '',
  applied = true,
  distance = '',
}) => {
  const appColor = appColors();
  const styles = useStyles();
  const {total} = useSelector(state => state.cart);
  const {planAmmount} = useSelector(state => state.summary);

  const percent = item?.percentage;

  let percentAmt =
    ((type == 'assessment' ? planAmmount?.subTotal : total?.subTotal) *
      item.percentage) /
    100;

  const offerAmt = () => {
    return percentAmt < item.high_price;
  };

  return (
    <View
      style={{
        marginHorizontal: 5,
      }}>
      <View
        // key={item.id}
        style={{
          borderRadius: 15,
          flexDirection: 'row',
          overflow: 'hidden',
          justifyContent: 'center',
        }}>
        {/* ball style */}
        <View
          style={{
            position: 'absolute',
            height: '100%',
            justifyContent: 'center',
            left: widthResponse ? -5 : -6,
            zIndex: 100,
          }}>
          {[0, 1, 2, 3].map((data, i) => (
            <View
              key={i}
              style={{
                padding: widthResponse ? 5 : 6,
                marginBottom: i == 3 ? 0 : widthResponse ? 6 : 10,
                borderRadius: 20,
                backgroundColor: appColor.white,
              }}
            />
          ))}
        </View>
        {/* offer */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColor.gold,
          }}>
          <Text
            style={[
              styles.head,
              {
                transform: [{rotate: '-90deg'}],
              },
            ]}>
            {offerAmt(Number(percent))
              ? percent + '% OFF'
              : 'Flat ' + item.high_price}
            {/* {percent}% OFF */}
          </Text>
        </View>
        {/* coupen detail */}
        <View
          style={{
            flex: 1,
            borderWidth: 2,
            borderLeftWidth: 0,
            borderColor: appColor.placeHolderText,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            alignItems: 'flex-start',
            backgroundColor: appColor.white,
            padding: widthResponse ? 10 : 15,
            paddingVertical:
              item.description && item.description != ''
                ? widthResponse
                  ? 10
                  : 15
                : widthResponse
                ? 25
                : 35,
          }}>
          {/* top block */}
          <View
            style={{
              //   flex: 1,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={[
                {
                  color: appColor.black,
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(2),
                },
              ]}>
              {item.code}
            </Text>
            <TouchableOpacity
              onPress={() =>
                // applyValid(item.code)
                //   ? hookFunction(true)
                toapplyPromocode(item.code)
              }
              style={{marginLeft: 'auto'}}>
              <Text style={[styles.subHead, {color: appColor.gold}]}>
                {'APPLY'}
              </Text>
            </TouchableOpacity>
            {/* {applied && (
            )} */}
          </View>
          <Text style={[styles.para]}>
            save{' '}
            {currencyConvertor(
              offerAmt(Number(percent)) ? percentAmt : item.high_price,
            )}{' '}
            on this Order!
          </Text>
          {/* bottom blk */}
          {item.description && item.description != '' && (
            <View
              style={{
                width: '100%',
                marginTop: widthResponse ? 8 : 12,
                borderTopWidth: 1,
                borderColor: appColor.borderColor,
                paddingTop: widthResponse ? 8 : 12,
              }}>
              <HtmlView
                url={item.description}
                width={'100%'}
                ElementStyle={{
                  p: {
                    ...styles.para,
                    margin: 0,
                    color: appColor.textGrey,
                  },
                }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// to show checkout and assessment
export const CoupanBlock = ({
  applied = false,
  onpress = () => {},
  type = 'checkout',
  distance = '',
}) => {
  const styles = useStyles();
  const {total} = useSelector(state => state.cart);
  const {planAmmount} = useSelector(state => state.summary);
  const {calculatePriceInfo} = useCartPriceInfo();
  const {PlanPriceInfo} = UserPlanPrice();
  //   print(planAmmount, 'planAmmount')

  // set Redux
  const hookFunction = (cancel = false, suggestions = '', respo = {}) => {
    if (type == 'checkout' && distance) {
      calculatePriceInfo(
        {
          code: cancel ? null : suggestions == '' ? promoCode : suggestions,
          percent: cancel ? null : respo?.percent,
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
          percent: cancel ? null : respo?.percent,
        },
        planAmmount.sectionCount,
        planAmmount.km,
        'checkDistance',
        planAmmount.vesselPrice,
        planAmmount.vesselName,
        planAmmount.dishCount,
      );
    }
  };
  const appColor = appColors();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 10,
          paddingBottom: 5,
          borderBottomWidth: 1,
          borderBottomColor: appColor.borderColor,
        }}>
        {/* <Icon
          ComponentName={'MaterialIcons'}
          name={'discount'}
          size={20}
          color={appColor.ratingGold}
        /> */}
          <LottieView
              autoPlay={true}
              style={{width: 30, height: 30}}
              source={require('../../../assets/lottieFiles/offer.json')}
           />
        <Text
          style={[
            {
              paddingLeft: 10,
              color: appColor.boldBlacktext,
              fontSize: fontScalling(2.5),
              textAlignVertical: 'center',
              // paddingBottom: 5,
              marginBottom: -3,
              fontFamily: appFont.bB,
            },
          ]}>
          Best Discount For you
        </Text>
      </View>
     {applied ? (
        <View
          style={{
            width: scrnWidth - (type == 'checkout' ? 30 : 50),
            alignSelf: 'center',
          }}>
      {/* coupon btn */}
      {false && (
      <Pressable
        onPress={onpress}
        style={{
          paddingVertical: widthResponse ? 5 : 15, //@@
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: appColor.borderColor,
          borderRadius: 10,
          elevation: 2.5,
          backgroundColor: appColor.white,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: appColor.Textlightblack,
          shadowRadius: 3,
          shadowOpacity: 0.7,
          shadowOffset: {width: 0, height: 0},
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <LottieView
            autoPlay={true}
            style={{width: 30, height: 30}}
            source={require('../../../assets/lottieFiles/offer.json')}
          />
          <Text
            style={{
              color: appColor.Textlightblack,
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
              paddingLeft: 12.5,
            }}>
            View all coupon's
          </Text>
        </View>
        <Pressable>
          <Icon
            ComponentName={'Entypo'}
            color={appColor.textGrey}
            size={25}
            name={'chevron-right'}
          />
        </Pressable>
      </Pressable>
          )}   
      </View>
  ) : (
    // <CouponCard
    //   type={type}
    //   item={type == 'checkout' ? total?.discount : planAmmount?.discount}
    //   applied={false}
    //   distance={distance}
    // />
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: scrnWidth - (type == 'checkout' ? 40 : 50),
        alignSelf: 'center',
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        borderColor: appColor.borderColor,
        justifyContent: 'space-between',
      }}>
      <Text style={[styles.para, {color: appColor.bgBlack}]}>
        Chosen discount code :{' '}
        <Text style={{color: appColor.gold}}>
          {type == 'checkout'
            ? total?.discount?.code
            : planAmmount?.discount?.code}
        </Text>
      </Text>
      <TouchableOpacity onPress={() => hookFunction(true)}>
        <Icon
          ComponentName={'AntDesign'}
          name={'closecircle'}
          color={appColor.gold}
          size={20}
        />
      </TouchableOpacity>
    </View>
  )}
    </>
  );
};

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
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
