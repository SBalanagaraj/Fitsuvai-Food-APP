import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import * as Animatable from 'react-native-animatable';
import appColors from '../../utilities/appColors';
import {widthResponse} from '../../utilities/helperFunction';

const Toggle = ({onPress, isActive, style, type = 'default'}) => {
  // console.log(isActive,"switch");
  const appColor = appColors();
  let background = '';
  let thumb = '';

  switch (type) {
    case 'green':
      background = isActive ? appColor.toggleGreen : appColor.textGrey;
      thumb = !isActive ? appColor.white : appColor.white;
      break;
    case 'default':
      background = isActive ? appColor.primary : appColor.smokeBack;
      thumb = !isActive ? appColor.primary : appColor.white;
      break;
    case 'lightGreen':
      background = isActive ? appColor.paid : appColor.bgWhite;
      thumb = !isActive ? appColor.paid : appColor.white;
  }

  return (
    <Pressable onPress={onPress} style={[style]}>
      <View
        style={[
          {
            backgroundColor: background,
            borderRadius: 30,
            width: widthResponse ? 35 : 90,
            height: 12,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: isActive ? appColor.toggleGreen : appColor.gold,
            padding: 0,
            margin: 0,
            elevation: 2,
            zIndex: 2,
          },
        ]}>
        <Animatable.View
          animation={{
            from: {
              translateX: widthResponse
                ? isActive
                  ? 0
                  : 15
                : isActive
                ? 0
                : 35,
            },
            to: {
              translateX: widthResponse
                ? isActive
                  ? 15
                  : -1
                : isActive
                ? 35
                : 0,
            },
          }}
          style={{
            width: widthResponse ? 20 : 35,
            height: widthResponse ? 20 : 35,
            borderRadius: 7,
            backgroundColor: thumb,
            borderWidth: 2.5,
            borderColor: isActive ? appColor.toggleGreen : appColor.gold,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          duration={400}
          easing={'ease'}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              backgroundColor: isActive ? appColor.toggleGreen : appColor.gold,
            }}
          />
        </Animatable.View>
      </View>
    </Pressable>
  );
};

export default Toggle;

const styles = StyleSheet.create({});
