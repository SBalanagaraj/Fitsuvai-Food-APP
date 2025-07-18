import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';

const SideHeading = ({title, onPress, altStyle = {}}) => {
  const appColor = appColors();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          marginTop: 15,
          marginBottom: 10,
        },
        altStyle,
      ]}>
      <Text
        style={{
          color: appColor.black,
          fontFamily: appFont.bB,
          fontSize: fontScalling(3),
        }}>
        {title}
      </Text>
      <Text
        onPress={onPress}
        style={{
          color: appColor.black,
          fontFamily: appFont.rM,
          fontSize: fontScalling(1.5),
          borderBottomWidth: 1,
          // textDecorationLine: 'underline',
        }}>
        VIEW ALL
      </Text>
    </View>
  );
};

export default SideHeading;

const styles = StyleSheet.create({});
