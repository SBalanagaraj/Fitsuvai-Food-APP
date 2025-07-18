import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';

const RadioButton = ({
  text,
  ind,
  isChecked = false,
  onPress,
  altStyle = {},
  altText = {},
  dark = false,
}) => {
  const appColor = appColors();
  return (
    <Pressable
      onPress={onPress}
      key={ind}
      style={[
        {
          paddingVertical: 12.5,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
        },
        altStyle,
      ]}>
      <View>
        <View
          style={{
            padding: widthResponse ? 3 : 5, //@@
            borderRadius: 15,
            backgroundColor: appColor.white,
            borderWidth: 0.3,
            borderColor: isChecked ? appColor.gold : appColor.black,
            elevation: 2,
            shadowColor: appColor.gold,
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: widthResponse ? 7 : 10, //@@
              borderRadius: 15,
              backgroundColor: isChecked ? appColor.gold : appColor.white,
              borderWidth: 0.5,
              borderColor: appColor.white,
            }}
          />
        </View>
      </View>
      {text && (
        <Text
          style={[
            {
              fontFamily: appFont.rM,
              fontSize: fontScalling(2),
              paddingLeft: 8,
              color: dark ? appColor.white : appColor.black,
            },
            altText,
          ]}>
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default RadioButton;

const styles = StyleSheet.create({});
