import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import {Image} from 'react-native-animatable';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// file import:
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';

const MemberRegCard = ({textFocus, children}) => {
  const appColor = appColors();

  return (
    <ImageBackground
      resizeMode="stretch"
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
      source={require('../../../assets/images/background_reg.png')}>
      <View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
            // paddingTop: widthResponse ? 100 : 120,
            paddingBottom: 10,
          }}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          extraHeight={300}
          ref={textFocus}
          showsVerticalScrollIndicator={false}>
          {/* image */}
          <View
            style={{
              height: widthResponse ? 180 : 250,
              width: widthResponse ? 250 : 350,
              marginBottom: widthResponse ? 15 : 25,
            }}>
            <Image
              resizeMode="contain"
              style={{height: '100%', width: '100%'}}
              source={require('../../../assets/images/reg_img.png')}
            />
          </View>
          {/* Title */}
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(3),
              color: appColor.textWhite,
              marginBottom: fontScalling(2.5),
            }}>
            Get Summary
          </Text>
          {children}
        </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
};

export default MemberRegCard;
