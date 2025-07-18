import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import PrimaryButton from '../Buttons/PrimaryButton';

const StepHeading = ({
  title,
  btnInActive = false,
  altStyle = {},
  onPress = () => {},
  showBtn = true,
}) => {
  const appColor = appColors();

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          paddingVertical: 10,
        },
        altStyle,
      ]}>
      <Text
        style={{
          flex: 1.5,
          fontFamily: appFont.bB,
          fontSize: fontScalling(3),
          color: appColor.bgBlack,
          textAlign: !showBtn ? 'center' : null,
        }}>
        {' '}
        {title}
      </Text>
      {showBtn && (
        <PrimaryButton
          Title={'SUMMARY'}
          parentStyle={{flex: 1}}
          black
          btnInActive={btnInActive}
          onPress={onPress}
        />
      )}
    </View>
  );
};

export default StepHeading;

const styles = StyleSheet.create({});
