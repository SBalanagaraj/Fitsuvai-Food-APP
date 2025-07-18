import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {fontScalling, scrnHeight} from '../../utilities/helperFunction';
import LottieView from 'lottie-react-native';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../../utilities/GeolocationFunctions';

const LocationSearchScreen = ({navigation}) => {
  const {styles} = useStyles();
  const appColor = appColors();
  const [loadCL, setLoadCl] = useState(false);

  const getUserLocations = async () => {
    const userCurrentLocation = await getUserLocation();
    setLoadCl(true);
    if (userCurrentLocation && Object.keys(userCurrentLocation).length > 0) {
      // dispatch(setUserLocation(userCurrentLocation));
      setLoadCl(false);
    } else {
      setLoadCl(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={appColor.white} barStyle={'dark-content'} />
      <View style={styles.container}>
        {/* <Pressable
          style={{
            padding: 4,
            paddingHorizontal: 14,
            backgroundColor: appColor.greyBack,
            borderRadius: 10,
            alignSelf: 'flex-end',
            marginRight: 15,
            marginBottom: 20,
          }}
          onPress={() => {
            navigation.navigate('main');
          }}>
          <Text
            style={{
              color: appColor.textWhite,
              fontFamily: appFont.rM,
              fontSize: fontScalling(1.6),
              paddingBottom: 3,
            }}>
            Skip
          </Text>
        </Pressable> */}
        <Text style={styles.primaryText}>
          Enable Location for a Better Experience
        </Text>
        <Text style={[styles.primaryText, {color: appColor.Textlightblack}]}>
          🌍 To provide accurate and personalized services, we need access to
          your location.
        </Text>
        <Text style={styles.primaryText}>
          ✅ Use My Current Location – Get instant and precise results.
        </Text>
        <Text style={styles.primaryText}>
          📍 Enter Manually – Prefer to type it yourself? No problem!
        </Text>
        <Text style={[styles.primaryText, {color: appColor.Textlightblack}]}>
          We respect your privacy and only use your location to improve your
          experience.
        </Text>
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 15,
            borderRadius: 12,
            // backgroundColor: appColor.white,
            margin: 20,
            // elevation: 0.8,
            marginVertical: 20,
            alignSelf: 'center',
          }}>
          <LottieView
            resizeMode="cover"
            autoPlay={true}
            style={{
              width: 280,
              height: scrnHeight / 5,
            }}
            source={
              require('../../../assets/lottieFiles/location.json')
              //   {
              //   uri: 'https://lottie.host/c226957a-1120-44d4-992e-c31ddd3dd03b/22dLu92OBg.lottie',
              // }
            }
          />
        </View>
        <View style={{paddingHorizontal: 20, paddingTop: 80}}>
          <PrimaryButton
            onPress={async () => {
              const isGranted = await requestLocationPermission();
              if (isGranted && isGranted != 'settings') {
                getUserLocations();
              } else {
                await handleLocationPermission();
              }
            }}
            download
            iconName="my-location"
            iconComponent="MaterialIcons"
            Title={'Enable Device Location'}
            textStyle={{fontSize: fontScalling(2)}}
          />
          <PrimaryButton
            onPress={() => {
              navigation.navigate('manualLocation', {page: 'home'});
            }}
            download
            iconName="FontAwesome"
            iconComponent="hand-o-up"
            black={true}
            Title={'Enter Your Location Manually'}
            altStyle={{marginTop: 15}}
            textStyle={{fontSize: fontScalling(2)}}
          />
        </View>
      </View>
    </>
  );
};

export default LocationSearchScreen;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appColor.white,
      paddingTop: 20,
    },
    primaryText: {
      color: appColor.gold,
      fontFamily: appFont.rB,
      fontSize: fontScalling(2.2),
      paddingHorizontal: 30,
      paddingBottom: 5,
      textAlign: 'center',
    },
  });
  return {styles};
};
