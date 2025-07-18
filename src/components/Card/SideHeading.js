import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';

const SideHeading = ({title, onPress, altStyle = {}}) => {
  const appColor = appColors();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 35,
          marginBottom: 15,
        },
        altStyle,
      ]}>
      <Text
        style={{
          color: appColor.boldBlacktext,
          fontFamily: appFont.bB,
          fontSize: fontScalling(2.5),
        }}>
        {title}
      </Text>
      {/* <Text
        onPress={onPress}
        style={{
          color: appColor.black,
          fontFamily: appFont.rM,
          fontSize: fontScalling(1.5),
          borderBottomWidth: 1,
          // textDecorationLine: 'underline',
        }}>
        VIEW ALL
      </Text> */}
      <Pressable
        onPress={onPress}
        style={{
          borderRadius: 16,
          width: 25,
          height: 25,
          backgroundColor: appColor.sliderGreyBg,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 5,
          shadowColor: appColor.greyBg,
        }}>
        <Animatable.View animation={'zoomIn'} duration={500}>
          <Icon
            ComponentName={'FontAwesome6'}
            name={'angle-right'}
            size={17}
            color={appColor.white}
          />
        </Animatable.View>
      </Pressable>
    </View>
  );
};

export default SideHeading;

const styles = StyleSheet.create({});
