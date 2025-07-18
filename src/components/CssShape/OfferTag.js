import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {
  TriangleCornerBottomRight,
  TriangleCornerTopRight,
} from '../HelperStyle/HelperStyle';

const OfferTag = ({offer, reverse = false}) => {
  const {style} = useStyle();
  const appColor = appColors();
  return (
    <View
      style={{
        flexDirection: reverse ? 'row-reverse' : 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}>
      <View style={{right: -1}}>
        <TriangleCornerTopRight reverse={reverse} />
        <TriangleCornerBottomRight reverse={reverse} />
      </View>
      <View
        style={{
          backgroundColor: appColor.gold,
          // paddingVertical: 6,
          justifyContent: 'center',
          // width: 55,
          paddingHorizontal: widthResponse ? 7 : 15,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: appColor.white,
            fontFamily: appFont.bB,
            fontSize: widthResponse ? fontScalling(1.6) : fontScalling(2),
          }}>
          {offer}
        </Text>
      </View>
    </View>
  );
};

export default OfferTag;

const useStyle = () => {
  const appColor = appColors();

  const style = StyleSheet.create({
    badgeRibbon140: {
      backgroundColor: 'transparent',
      borderBottomWidth: 28,
      borderBottomColor: appColor.cartBg,
      borderLeftWidth: 25,
      borderLeftColor: 'transparent',
      borderRightWidth: 35,
      borderRightColor: 'transparent',
      position: 'absolute',
      top: '15%',
      left: -25,
      bottom: 10,
      zIndex: 10,
      transform: [{rotate: '90deg'}],
    },
  });
  return {style};
};
