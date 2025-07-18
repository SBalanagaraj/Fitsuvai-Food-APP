import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {
  currencyConvertor,
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import OfferTag from '../CssShape/OfferTag';
import {useNavigation} from '@react-navigation/native';
import AddToCartBtn from '../Buttons/AddToCartBtn';
import FavIconButton from '../Buttons/FavIcon';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

const ProductCard = ({
  item,
  ind,
  calculative = false,
  collectionName = '',
  onPress = () => {},
  bgGrey = false,
}) => {
  // print(item, 'item');
  const appColor = appColors();
  const {styles} = useStyles();
  const navigation = useNavigation();
  const {userType} = useSelector(state => state.auth);

  const cardWidth = calculative
    ? widthResponse
      ? scrnWidth / 2 - 27.5
      : scrnWidth / 2 - 32 //@@
    : scrnWidth / 2.5;

  return (
    <Pressable
      onPress={() => {
        onPress;
        navigation.navigate('productDetail', {productId: item.id});
      }}
      key={ind}
      style={[
        styles.card,
        {
          width: cardWidth,
          marginBottom: calculative ? 15 : 7,
          elevation: 2,
          backgroundColor: bgGrey ? appColor.cardbg : appColor.white,
        },
      ]}>
      <View style={{alignSelf: 'flex-end', paddingTop: 5}}>
        {item.discount && item.discount != '' && item.discount != 0 && (
          <OfferTag offer={Number(item.discount).toFixed(0) + '% off'} />
        )}
      </View>
      <View
        style={{
          backgroundColor: appColor.cartBg,
          margin: 5,
          width: cardWidth / 1.7,
          height: cardWidth / 1.7,
          borderRadius: cardWidth / 3,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          elevation: 4,
        }}>
        {item && (
          <FastImage
            style={{width: '85%', height: '85%', borderRadius: 100}}
            resizeMode="cover"
            source={{
              priority: FastImage.priority.high,
              uri:
                item.image && item.image != ''
                  ? item.image
                  : item.main_image && item.main_image != ''
                  ? item.main_image
                  : 'https://www.fitsuvai.com/uploads/product/16Tx1737022277_09db3e94bac2ac33e39f.png',
            }}
          />
        )}
      </View>
      <View style={{paddingLeft: 8}}>
        {item.name && item.name != '' && (
          <Text
            numberOfLines={1}
            style={{
              color: appColor.Textlightblack,
              fontFamily: appFont.bB,
              paddingBottom: 3,
              paddingRight: 8, //@@
              // marginBottom: widthResponse ? 5 : 10,
              fontSize: widthResponse ? fontScalling(1.9) : fontScalling(2.7), //@@
            }}>
            {item.name}
          </Text>
        )}

        {item.category && item.category != '' && (
          <Text
            numberOfLines={1}
            style={{
              color: appColor.textGrey,
              fontSize: fontScalling(1.2),
              fontFamily: appFont.bB,
              paddingBottom: 8,
              width: '55%',
            }}>
            {item.category}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}>
          <View>
            {item.protein && (
              <Text
                style={{
                  color: appColor.Textlightblack,
                  fontSize: fontScalling(1.5),
                  fontFamily: appFont.rM,
                  paddingBottom: 2,
                }}>{`Protein : ${
                item.protein == 0 ? 'N/A' : item.protein + ' g'
              }`}</Text>
            )}
            {item.calories && (
              <Text
                style={{
                  color: appColor.Textlightblack,
                  fontSize: fontScalling(1.5),
                  fontFamily: appFont.rM,
                  paddingBottom: 5,
                  // width: '55%',
                }}>{`Calories : ${
                item.calories == 0 ? 'N/A' : item.calories + ' cal'
              }`}</Text>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            // marginBottom: 4,
          }}>
          {item.offer && item.offer != '' && (
            <Text
              numberOfLines={1}
              style={{
                // flex: 1,
                color: appColor.Textlightblack,
                fontFamily: appFont.bB,
                fontSize: fontScalling(2.1),
                textAlignVertical: 'bottom',
              }}>
              {currencyConvertor(item.offer, 2)}
            </Text>
          )}
          {item.offer && item.offer != '' && item.discount != 0 && (
            <Text
              numberOfLines={1}
              style={{
                // flex: 1,
                color: appColor.textGrey,
                fontFamily: appFont.bR,
                fontSize: fontScalling(1.8),
                textAlignVertical: 'bottom',
                paddingLeft: 10,
                textDecorationLine: 'line-through',
              }}>
              {currencyConvertor(item.price, 2)}
            </Text>
          )}
        </View>
      </View>
      <Pressable
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: userType == 'user' ? 'space-between' : 'flex-end',
          paddingTop: 8,
          // paddingVertical: 8,
          paddingRight: 5,
          paddingLeft: 8,
        }}>
        <AddToCartBtn data={item} />
        {userType == 'user' && (
          <View style={{}}>
            {item && (
              <FavIconButton pId={item} collectionName={collectionName} />
            )}
          </View>
        )}
      </Pressable>
    </Pressable>
  );
};

export default ProductCard;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    card: {
      marginRight: 10,
      borderRadius: 10,
      paddingBottom: 15,
      paddingTop: 5,
      marginBottom: 5,
    },
  });
  return {styles};
};
