import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';

const FilterButton = ({
  title,
  altStyle = {},
  altTextStyle = {},
  ICN,
  IN,
  ICC = false,
  onPress = () => {},
  btnName,
  bgGolg = false,
  bgBlack = false,
  load = false,
}) => {
  const appColor = appColors();
  const focus = btnName == title;
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      onPressIn={() => {
        setHover(true);
      }}
      onPressOut={() => {
        setHover(false);
      }}
      style={[
        {
          backgroundColor:
            focus || hover
              ? bgGolg
                ? appColor.gold
                : bgGolg
                ? appColor.gold
                : appColor.bgBlack
              : appColor.white,
          borderWidth: bgGolg ? 0.5 : 0.6,
          borderColor:
            focus || hover
              ? bgGolg
                ? appColor.gold
                : bgGolg
                ? appColor.gold
                : appColor.white
              : appColor.bgBlack,
          borderRadius: bgGolg ? 4 : 7,
          paddingHorizontal: 10,
          paddingVertical: widthResponse ? 5 : 10, //@@
          // flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        altStyle,
      ]}>
      {!load ? (
        <>
          <Icon
            color={
              focus || hover
                ? appColor.white
                : bgBlack
                ? appColor.white
                : appColor.bgBlack
            }
            size={widthResponse ? 15 : 23} //@@
            ComponentName={ICN}
            name={IN}
          />
          <Text
            style={[
              {
                fontFamily: appFont.rM,
                fontSize: fontScalling(1.6), //@@
                color:
                  focus || hover
                    ? bgGolg
                      ? appColor.white
                      : appColor.white
                    : appColor.textGrey,
                paddingLeft: 5,
              },
              altTextStyle,
            ]}>
            {title}
          </Text>
        </>
      ) : (
        <ActivityIndicator
          color={
            focus || hover
              ? bgGolg
                ? appColor.white
                : appColor.white
              : appColor.textGrey
          }
        />
      )}
    </Pressable>
  );
};

export default FilterButton;

const styles = StyleSheet.create({});
