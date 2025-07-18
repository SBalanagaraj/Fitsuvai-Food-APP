import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {fontScalling} from '../../utilities/helperFunction';

const {width, height} = Dimensions.get('window');

export const MenuCard = ({title, icon, onPress, iconName, altStyles = {}}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const [active, setActive] = useState(false);
  return (
    <Pressable
      style={[
        styles.card,
        altStyles,
        {borderColor: active ? appColor.themeYellow : appColor.borderColor},
      ]}
      onPress={onPress}
      onPressIn={() => {
        setActive(true);
      }}
      onPressOut={() => {
        setActive(false);
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{paddingRight: 10}}>
          <Icon
            ComponentName={icon}
            name={iconName}
            color={appColor.gold}
            size={21}
          />
        </View>
        <Text
          style={[
            styles.title,
            {color: active ? appColor.themeYellow : appColor.black},
          ]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: appColor.white,
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 5,
      // marginVertical: 5,
      width: width / 2 - 30,
      borderWidth: 1,
    },
    title: {
      color: appColor.black,
      fontFamily: appFont.rM,
      fontSize: fontScalling(2.2),
      // flex:1,
    },
  });
  return {styles};
};
