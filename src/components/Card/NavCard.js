import React, {useState} from 'react';
import {View, Pressable, Text, StyleSheet, Image} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {fontScalling} from '../../utilities/helperFunction';

const NavCard = ({
  icon,
  title,
  onpress,
  iconName,
  cardbg,
  deletePage,
  proCard,
}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const [active, setActive] = useState(false);
  return (
    <Pressable
      style={[
        styles.card,
        {
          paddingHorizontal: 10,
          elevation: 1,
          backgroundColor: appColor.white
            ? !active
              ? appColor.white
              : appColor.cardbg
            : appColor.white,
          borderRadius: cardbg ? 10 : null,
          marginBottom: cardbg ? 10 : null,
          paddingRight: cardbg ? 5 : null,
          borderWidth: cardbg ? 1 : null,
          borderColor: cardbg
            ? active
              ? appColor.themeYellow
              : 'transparent'
            : 'transparent',
        },
      ]}
      onPress={onpress}
      onPressIn={() => {
        setActive(true);
      }}
      onPressOut={() => {
        setActive(false);
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Icon
          ComponentName={icon}
          name={iconName}
          color={!active ? appColor.gold : appColor.black}
          size={20}
        />
        <Text
          style={[
            styles.title,
            {
              color: active ? appColor.themeYellow : appColor.Textlightblack,
              fontFamily: deletePage ? appFont.rM : appFont.bR, //@@
            },
          ]}>
          {title}
        </Text>
        <MaterialCommunityIcon
          name="chevron-right"
          size={30}
          color={active ? appColor.themeYellow : appColor.lightGreyLine}
        />
      </View>
    </Pressable>
  );
};

export default NavCard;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    card: {
      paddingVertical: 10,
    },
    title: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.8),
      flex: 1,
      paddingLeft: 10,
    },
    title1: {
      color: appColors.Text,
      fontFamily: appFont.rM,
      fontSize: fontScalling(2.1),
      flex: 1,
      paddingLeft: 10,
    },
  });
  return {styles};
};
