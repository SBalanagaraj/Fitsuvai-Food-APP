import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {appFont} from '../../utilities/appFont';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';

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
              : appColor.themeYellow,
            borderWidth: outLine ? 0.5 : 2,
            borderColor: btnInActive
              ? appColor.greyBg
              : black
              ? appColor.bgBlack
              : outLine
              ? appColor.black
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
        <Text
          style={[
            {
              marginLeft: download ? 10 : 0,
              fontFamily: appFont.bB,
              fontSize: fontScalling(2.5),
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
