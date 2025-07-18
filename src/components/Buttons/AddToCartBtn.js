import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddToCart,
  dicrementQuantity,
  incrementQuantity,
  removeFromCart,
  setDeleteModal,
} from '../../redux/CartSlice';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import useCartPriceInfo from '../../Hooks/useCartPriceInfo';
import PrimaryButton from './PrimaryButton';
import {useNavigation} from '@react-navigation/native';

const AddToCartBtn = ({data, detail = false, cartBtn = false}) => {
  const dispatch = useDispatch();
  const {cart, total, coinHub} = useSelector(state => state.cart);
  const navigation = useNavigation();

  const appColor = appColors();
  const {styles} = useStyles();

  const [focus, setFocus] = useState(false);
  const [focusMinus, setFocusMins] = useState(false);

  const {calculatePriceInfo} = useCartPriceInfo();

  useEffect(() => {
    calculatePriceInfo(
      {
        code: null,
        percent: null,
      },
      total.delfee,
      0,
      0,
      'dummy',
      0,
      0,
    );
  }, [total.subTotal, cart]);

  const cartPresent = cart?.length > 0 && cart.find(item => item.id == data.id);

  let count =
    cart?.length > 0
      ? cart
          .filter(item => item.id == data.id)
          .map(item => item.quantity)
          .join()
      : 0;

  const btnValidator =
    cartPresent &&
    Object.keys(cartPresent).length > 0 &&
    count &&
    Number(count) >= 1;

  return btnValidator ? (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Pressable
        style={[
          styles.increMentBtn,
          {
            flex: detail ? 1 : 0,
            marginRight: detail ? 25 : 0,
            borderRadius: detail ? 20 : 5,
            shadowOpacity: 0.5,
          },
        ]}>
        <>
          {count && Number(count) == 1 ? (
            <Pressable
              style={[
                styles.plusMinus,
                {
                  paddingVertical: detail ? 10 : 7,
                  paddingHorizontal: detail ? 10 : 6,
                  borderRadius: cartBtn || detail ? 15 : 5,
                  backgroundColor:
                    cartBtn || detail
                      ? focusMinus
                        ? appColor.black
                        : appColor.cardbg
                      : appColor.bgBlack,
                  elevation: 1,
                  overflow: 'hidden',
                },
              ]}
              onPressIn={() => setFocusMins(true)}
              onPressOut={() => setFocusMins(false)}
              onPress={() => {
                cartBtn
                  ? dispatch(setDeleteModal({isModal: true, item: data}))
                  : dispatch(removeFromCart(data));
              }}>
              <Icon
                ComponentName={'Feather'}
                name={'trash-2'}
                size={detail ? 24 : 18}
                color={
                  cartBtn || detail
                    ? focusMinus
                      ? appColor.white
                      : appColor.bgBlack
                    : appColor.white
                }
              />
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.plusMinus,
                {
                  paddingVertical: detail ? 10 : 7,
                  paddingHorizontal: detail ? 10 : 6,
                  borderRadius: cartBtn || detail ? 15 : 5,
                  backgroundColor:
                    cartBtn || detail
                      ? focusMinus
                        ? appColor.black
                        : appColor.cardbg
                      : appColor.bgBlack,
                  elevation: 1,
                },
              ]}
              onPressIn={() => setFocusMins(true)}
              onPressOut={() => setFocusMins(false)}
              onPress={() => {
                dispatch(dicrementQuantity(data));
              }}>
              <Icon
                ComponentName={'Entypo'}
                name={'minus'}
                size={detail ? 24 : 18}
                color={
                  cartBtn || detail
                    ? focusMinus
                      ? appColor.white
                      : appColor.bgBlack
                    : appColor.white
                }
              />
            </Pressable>
          )}
        </>
        <Text
          style={[
            styles.textColor,
            {
              paddingHorizontal: 15,
              color: appColor.black,
              fontFamily: appFont.bB,
              fontSize: detail ? fontScalling(3) : fontScalling(1.8),
            },
          ]}>
          {count <= 9 ? 0 + count : count}
        </Text>
        <Pressable
          onPressIn={() => setFocus(true)}
          onPressOut={() => setFocus(false)}
          style={[
            styles.plusMinus,
            {
              paddingVertical: detail ? 10 : 7,
              paddingHorizontal: detail ? 10 : 6,
              borderRadius: cartBtn || detail ? 15 : 5,
              backgroundColor:
                cartBtn || detail
                  ? focus
                    ? appColor.black
                    : appColor.cardbg
                  : appColor.bgBlack,
            },
          ]}
          onPress={() => {
            dispatch(incrementQuantity(data));
          }}>
          <Icon
            ComponentName={'Entypo'}
            name={'plus'}
            size={detail ? 24 : 18}
            color={
              cartBtn || detail
                ? focus
                  ? appColor.white
                  : appColor.bgBlack
                : appColor.white
            }
          />
        </Pressable>
      </Pressable>
      {detail && (
        <PrimaryButton
          onPress={() => navigation.navigate('Carts', {screen: 'cart'})}
          Title={'Go To Cart'}
          parentStyle={{flex: 1}}
        />
      )}
    </View>
  ) : (
    <Pressable
      onPress={() => {
        dispatch(AddToCart(data));
      }}
      style={[
        styles.addButton,
        {
          flex: detail ? 1 : null,
          borderRadius: detail ? 20 : 5,
          paddingHorizontal: detail ? 0 : 20,
          paddingVertical: detail ? 12.5 : 10,
          flexDirection: detail ? 'row' : null,
          // marginRight: detail ? 10 : 0,
        },
      ]}>
      {detail && (
        <Icon
          color={appColor.white}
          ComponentName={'AntDesign'}
          name={'shoppingcart'}
          size={22}
        />
      )}
      <Text
        style={[
          styles.textColor,
          {
            fontSize: detail ? fontScalling(2.5) : fontScalling(1.6),
            paddingLeft: detail ? 15 : 0,
          },
        ]}>
        Add to cart
      </Text>
    </Pressable>
  );
};

export default AddToCartBtn;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    addButton: {
      backgroundColor: appColor.inputBackDark,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 0.7,
      shadowOffset: 0.5,
    },
    increMentBtn: {
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      flexDirection: 'row',
      borderRadius: 5,
      alignSelf: 'center',
      // overflow: 'hidden',
      zIndex: 50,
    },
    textColor: {
      color: appColor.white,
      fontSize: fontScalling(1.6),
      fontFamily: appFont.bR,
      textAlignVertical: 'center',
    },
    plusMinus: {
      padding: 5,
      paddingHorizontal: 10,
      backgroundColor: appColor.gold,
      elevation: 0.5,
      shadowOffset: {width: 10, height: 10},
      shadowColor: 'black',
      shadowOpacity: 1,
      elevation: 3,
    },
  });
  return {styles};
};
