import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {appFont} from '../../utilities/appFont';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import FastImage from 'react-native-fast-image';

const PrimaryButton = ({
  onPress,
  Title,
  altStyle,
  parentStyle,
  black,
  download,
  outLine,
  textStyle,
  iconName = 'download',
  iconComponent = 'Feather',
  btnInActive = false,
  img = false,
}) => {
  const appColor = appColors();
  const [hover, setHover] = useState(false);
  return (
    <View style={[{flexDirection: 'row'}, parentStyle]}>
      <Pressable
        onPress={btnInActive ? () => {} : onPress}
        onPressIn={() => {
          setHover(true);
        }}
        onPressOut={() => {
          setHover(false);
        }}
        style={[
          {
            flex: 1,
            padding: 10,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: hover
              ? 'transparent'
              : btnInActive
              ? appColor.greyBg
              : black
              ? appColor.bgBlack
              : outLine
              ? 'transparent'
              : img
              ? appColor.white
              : appColor.themeYellow,
            borderWidth: outLine ? 0.5 : 2,
            borderColor: btnInActive
              ? appColor.greyBg
              : black
              ? appColor.bgBlack
              : outLine
              ? appColor.black
              : img
              ? appColor.white
              : appColor.themeYellow,
            borderRadius: 100,
          },
          altStyle,
        ]}>
        {download && (
          <Icon
            name={iconName}
            ComponentName={iconComponent}
            size={widthResponse ? 23 : 40}
            color={
              hover
                ? black
                  ? appColor.textBlack
                  : appColor.themeYellow
                : appColor.bgWhite
            }
          />
        )}
        {img && (
          <FastImage
            style={{width: 30, height: 30, borderRadius: 15, marginRight: 5}}
            source={require('../../../assets/images/google.png')}
          />
        )}
        <Text
          style={[
            {
              marginLeft: download ? 10 : 0,
              fontFamily: img ? appFont.rM : appFont.bB,
              fontSize: fontScalling(img ? 2 : 2.5),
              letterSpacing: 0.5,
              opacity: btnInActive ? 0.4 : 1,
              color: btnInActive
                ? appColor.inputBackDark
                : hover
                ? black
                  ? appColor.bgBlack
                  : appColor.themeYellow
                : outLine
                ? appColor.black
                : img
                ? appColor.bgBlack
                : appColor.textWhite,
              textAlign: 'center',
            },
            textStyle,
          ]}>
          {Title}
        </Text>
      </Pressable>
    </View>
  );
};

export default PrimaryButton;
