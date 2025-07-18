import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {
  widthResponse,
  fontScalling,
  Capitalize,
} from '../../utilities/helperFunction';

const ListCard = ({label}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
      }}>
      <View
        style={{
          backgroundColor: appColor.themeYellow,
          padding: 4,
          borderRadius: 50,
        }}>
        <Icon
          name={'check'}
          ComponentName={'FontAwesome'}
          size={fontScalling(1.8)}
          color={appColor.bgWhite}
        />
      </View>
      <Text style={[styles.roboto_light, {}]}>{Capitalize(label)}</Text>
    </View>
  );
};
export default ListCard;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    roboto_light: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.8),
      color: appColor.textBlack,
      marginHorizontal: 8,
    },
  });

  return {styles};
};
