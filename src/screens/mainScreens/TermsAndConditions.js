import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import appColors from '../../utilities/appColors';
import {
  fontScalling,
  scrnWidth,
  scrnHeight,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {ScrollViewIndicator} from '@fanchenbao/react-native-scroll-indicator';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setTermsPage} from '../../redux/TitleSlice';
import {Icon} from '../../utilities/icon';

const TermsAndConditions = ({navigation}) => {
  const appColor = appColors();
  const {styles} = useStyle();

  return (
    <View style={styles.Container}>
      <ImageBackground
        source={require('../../../assets/images/terms_bg.png')}
        resizeMode="cover"
        style={{width: scrnWidth, height: '100%', alignItems: 'center'}}>
        <View style={styles.InnerContainer}>
          <View style={styles.textContainer}>
            <View
              style={{
                paddingHorizontal: 10,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.Heading}>Terms and conditions</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  ComponentName={'Ionicons'}
                  name={'close'}
                  color={appColor.themeYellow}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginBottom: 40}}>
              <ScrollViewIndicator
                position={'right'}
                indStyle={{
                  backgroundColor: appColor.themeYellow,
                  width: 6.5,
                  zIndex: 100,
                }}>
                <Text style={styles.sideHeading}>
                  Donec vehicula turpis in odio pharetra eges tas. Donec vitae
                  ultrices sapien. Orci varius natoque penatibus et magnis dis
                  parturient montes, nascetur ridiculus mus. Cras in enim metus.
                  Suspendisse sit amet consectetur lacus. Sed vehicula libero
                  quis est porta gravida. Sed fringilla leo in ornare hendrerit.
                  Curabitur cursus vehicula efficitur. In hac habitasse platea
                  dictumst. Donec eleifend, neque in tempor varius, felis lacus
                  consequat orci, sed vulputate eros enim vel est. Suspendisse
                  pretium elit ipsum. Suspendisse potenti. Aenean pulvinar est
                  ut orci convallis, sed bibendum ante tempor. Curabitur nec
                  tortor dolor. Donec eu mauris massa. Praesent viverra blandit
                  mi sed condimentum. Pellentesque eget finibus dui. Phasellus
                  ultricies orci lorem, vitae dapibus purus congue in. Integer
                  maximus at est a laoreet. Nulla ac dolor eu neque luctus
                  sodales.
                </Text>
              </ScrollViewIndicator>
            </View>
          </View>
          <View style={styles.btnAdjustMent}>
            <PrimaryButton Title="CONTINUE" />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default TermsAndConditions;
const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    Container: {
      flex: 1,
    },
    InnerContainer: {
      backgroundColor: appColor.white,
      borderRadius: 10,
      padding: 5,
      elevation: 0.3,
      marginHorizontal: 20,
      paddingVertical: 20,
      paddingHorizontal: 10,
      alignSelf: 'center',
      marginVertical: 'auto',
    },
    Heading: {
      fontFamily: appFont.bB,
      color: appColor.textBlack,
      fontSize: fontScalling(3),
    },
    textContainer: {
      height: scrnHeight / 2,
    },
    sideHeading: {
      fontFamily: appFont.rR,
      color: appColor.textBlack,
      fontSize: fontScalling(2.3),
      paddingHorizontal: 10,
      paddingRight: 20,
      height: 'auto',
      borderRightWidth: 7,
      borderRightColor: appColor.borderColor,
    },
    btnAdjustMent: {
      paddingTop: 10,
      paddingBottom: 5,
    },
  });
  return {styles};
};
