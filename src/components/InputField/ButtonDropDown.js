import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';

const ButtonDropDown = ({
  title,
  active = false,
  onPress,
  dropDown,
  children,
  altStyle = {},
  dark = false,
}) => {
  const appColor = appColors();
  const {styles} = useStyles();

  return (
    <View>
      <Pressable
        onPress={() => {
          onPress();
        }}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 12,
            backgroundColor: active ? appColor.bgBlack : null,
            borderRadius: 10,
            marginBottom: 15,
            borderWidth: active ? 0 : 1,
            width: '100%',
            // height: 250,
          },
          altStyle,
        ]}>
        <Text
          style={[
            styles.normalText,
            {
              color: !active
                ? dark
                  ? appColor.white
                  : appColor.bgBlack
                : appColor.white,
              textTransform: 'capitalize',
            },
          ]}>
          {title}
        </Text>
        <Icon
          ComponentName={'Entypo'}
          name={!active ? 'chevron-down' : 'chevron-up'}
          color={
            !active
              ? dark
                ? appColor.white
                : appColor.bgBlack
              : appColor.white
          }
          size={22}
        />
      </Pressable>
      {children}
    </View>
  );
};

export default ButtonDropDown;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      paddingBottom: 5,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.7),
      color: appColor.black,
    },
    normalText: {
      fontFamily: appFont.rB,
      fontSize: fontScalling(1.7),
      color: appColor.black,
    },

    commenStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });

  return {styles};
};
