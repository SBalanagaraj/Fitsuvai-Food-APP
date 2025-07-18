import {View, Text, Pressable, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const CheckBox = ({
  checkBox,
  onPress,
  label,
  color = false,
  terms,
  altStyle = {},
  multiLabel,
}) => {
  const appColor = appColors();
  const navigation = useNavigation();
  const {userSettings} = useSelector(state => state.setting);

  return (
    <Pressable
      style={[{flexDirection: 'row', alignItems: 'center'}, altStyle]}
      onPress={onPress}>
      <View
        style={{
          height: 18,
          width: 18,
          backgroundColor: checkBox ? appColor.themeYellow : 'transparent',
          borderRadius: 3,
          borderWidth: 1,
          borderColor: !checkBox
            ? color
              ? appColor.black
              : appColor.bgWhite
            : appColor.themeYellow,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {checkBox && (
          <Icon
            ComponentName={'Entypo'}
            name={'check'}
            size={13}
            color={appColor.bgWhite}
          />
        )}
      </View>
      {multiLabel && (
        <Text
          style={{
            marginLeft: 8,
            color: color ? appColor.black : appColor.textWhite,
            fontFamily: appFont.rR,
            fontSize: fontScalling(1.6),
          }}>
          Accept
          <Text style={{color: appColor.themeYellow}}> Fitsuvai </Text>
          Terms & Conditions
        </Text>
      )}
      {label && (
        <>
          <Text
            style={{
              marginLeft: 8,
              color: color ? appColor.black : appColor.textWhite,
              fontFamily: appFont.rR,
              fontSize: fontScalling(1.6),
              textTransform: 'capitalize',
            }}>
            {label}
          </Text>
        </>
      )}
      {terms && (
        <Text
          style={{
            marginLeft: 8,
            color: color ? appColor.black : appColor.textWhite,
            fontFamily: appFont.rR,
            fontSize: fontScalling(1.6),
            justifyContent: 'center',
          }}>
          I agree to the{' '}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsAndConditions');
            }}>
            <Text
              onPress={() => {
                if (userSettings?.links?.terms_and_conditions) {
                  Linking.openURL(userSettings?.links?.terms_and_conditions);
                }
                // navigation.navigate('TermsAndConditions');
              }}
              style={{
                color: appColor.themeYellow,
                top: 4,
              }}>
              terms and conditions
            </Text>
          </TouchableOpacity>{' '}
          of Fitsuvai
        </Text>
      )}
    </Pressable>
  );
};

export default CheckBox;
