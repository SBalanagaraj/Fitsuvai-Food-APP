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
import {fontScalling, scrnWidth} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import useCartPriceInfo from '../../Hooks/useCartPriceInfo';
import PrimaryButton from './PrimaryButton';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const AddToCartBtn = ({data, detail = false, cartBtn = false}) => {
  const [focus, setFocus] = useState(false);
  const [focusMinus, setFocusMins] = useState(false);

  const {cart, total} = useSelector(state => state.cart);
  const {calculatePriceInfo} = useCartPriceInfo();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const appColor = appColors();
  const {styles} = useStyles();

  const cartPresent = cart?.length > 0 && cart.find(item => item.id == data.id);

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

  const commonToggleStl = {
    paddingVertical: detail ? 7 : 3,
    paddingHorizontal: detail ? 7 : 3,
    borderRadius: cartBtn || detail ? 15 : 5,
    backgroundColor:
      cartBtn || detail
        ? focusMinus
          ? appColor.Textlightblack
          : appColor.cardbg
        : appColor.Textlightblack,
    elevation: 0.3,
    overflow: 'hidden',
  };

  const iconColor =
    cartBtn || detail
      ? focusMinus
        ? appColor.white
        : appColor.Textlightblack
      : appColor.white;

  const iconSize = detail ? 20 : 18;

  return btnValidator ? (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: detail ? 'space-evenly' : 'space-between',
      }}>
      <Pressable
        style={[
          styles.increMentBtn,
          {
            marginRight: detail ? 25 : 0,
            borderRadius: detail ? 20 : 5,
            shadowOpacity: 0.5,
            width: detail ? scrnWidth / 2.8 : null,
          },
        ]}>
        <>
          {count && Number(count) == 1 ? (
            <Animatable.View>
              <Pressable
                style={[styles.plusMinus, commonToggleStl]}
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
                  size={iconSize}
                  color={iconColor}
                />
              </Pressable>
            </Animatable.View>
          ) : (
            <Pressable
              style={[styles.plusMinus, commonToggleStl]}
              onPressIn={() => setFocusMins(true)}
              onPressOut={() => setFocusMins(false)}
              onPress={() => {
                dispatch(dicrementQuantity(data));
              }}>
              <Icon
                ComponentName={'Entypo'}
                name={'minus'}
                size={iconSize}
                color={iconColor}
              />
            </Pressable>
          )}
        </>
        <Text
          style={[
            styles.textColor,
            {
              paddingHorizontal: 8,
              color: detail ? appColor.Textlightblack : appColor.black,
              fontFamily: appFont.bB,
              fontSize: detail ? fontScalling(3) : fontScalling(1.8),
            },
          ]}>
          {count <= 9 ? 0 + count : count}
        </Text>
        <Pressable
          onPressIn={() => setFocus(true)}
          onPressOut={() => setFocus(false)}
          style={[styles.plusMinus, commonToggleStl]}
          onPress={() => {
            dispatch(incrementQuantity(data));
          }}>
          <Icon
            ComponentName={'Entypo'}
            name={'plus'}
            size={iconSize}
            color={iconColor}
          />
        </Pressable>
      </Pressable>
      {detail && (
        <View style={{width: detail ? scrnWidth / 2.8 : null}}>
          <PrimaryButton
            onPress={() => navigation.navigate('Carts', {screen: 'cart'})}
            Title={'Go To Cart'}
            parentStyle={{flex: 1}}
            textStyle={{
              fontSize: fontScalling(1.8),
              paddingVertical: 0,
            }}
          />
        </View>
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
          paddingHorizontal: detail ? 0 : 8,
          paddingVertical: detail ? 12.5 : 7.5,
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
            fontSize: detail ? fontScalling(2.5) : fontScalling(1.4),
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
      backgroundColor: appColor.Textlightblack,
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
