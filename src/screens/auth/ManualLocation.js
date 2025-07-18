import {
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, {useRef, useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {url} from '../../utilities/appApi';
import 'react-native-get-random-values';
import appColors from '../../utilities/appColors';
import {
  Capitalize,
  fontScalling,
  objectLength,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {
  getUserLocation,
  manualAddressBaseCoordinates,
  onRadiusValid,
} from '../../utilities/GeolocationFunctions';
import {useDispatch, useSelector} from 'react-redux';
import {useShowToast} from '../../components/Toast/ToastAlert';
import MapView, {Circle, Marker, Polygon, Polyline} from 'react-native-maps';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {userSettingApi} from '../../redux/SettingSlice';
import LottieView from 'lottie-react-native';

const ManualLocation = ({navigation, route}) => {
  const mapTypeArr = ['standard', 'satellite', 'terrain'];

  const {page = 'home', verify = ''} =
    route && route?.params ? route?.params : {page: '', verify: ''};

  const ref = useRef();
  const appColor = appColors();
  const {styles} = useStyles();
  const safeArea = useSafeAreaInsets();
  const dispatch = useDispatch();
  const showToast = useShowToast();

  const {userSettings} = useSelector(state => state.setting);
  const {userType} = useSelector(state => state.auth);

  const mapTypeImgs = [
    require('../../../assets/images/Standard.png'),

    require('../../../assets/images/satelite.png'),

    require('../../../assets/images/terrain.png'),
  ];

  let coordinates = {};

  const radius = (userSettings?.RADIUS ? userSettings?.RADIUS : 25) * 1000;
  const adminCoordinates = {
    latitude:
      userSettings?.SITEINFO?.location &&
      userSettings?.SITEINFO?.location != '' &&
      userSettings?.SITEINFO?.location.split(',')[0] &&
      Number(userSettings?.SITEINFO?.location.split(',')[0]),
    longitude:
      userSettings?.SITEINFO?.location &&
      userSettings?.SITEINFO?.location != '' &&
      userSettings?.SITEINFO?.location.split(',')[1] &&
      Number(userSettings?.SITEINFO?.location.split(',')[1]),
  };

  const [mapType, setMapType] = useState(mapTypeArr[0]);
  const [layerSheet, setLayerSheet] = useState(false);
  const [regionLoad, setRegionLoad] = useState(false);
  const [regionChange, setRegionChange] = useState(adminCoordinates);
  const [destination, setDestination] = useState({
    address: '',
    object: {},
  });

  const pickSuggesstion = (description = '') => {
    (async () => {
      if (description != '') {
        coordinates = await manualAddressBaseCoordinates(description, '');
      }
      let coordinate = {
        latitude: coordinates.lat,
        longitude: coordinates?.lng,
      };
      const radiusValid = onRadiusValid({coordinate}, adminCoordinates, radius);
      if (radiusValid) {
        if (description && description != '' && coordinate) {
          setRegionLoad(true);
          const getLocation = await getUserLocation(coordinate);
          // const route = await getRoute(adminCoordinates, coordinate);
          // print(route, 'route');
          //  setRouteCoordinates(route);
          const street = description?.split(',');
          street.pop();
          setDestination({
            address: description,
            object: {...getLocation, street: street.join('')},
          });
          setRegionChange(coordinate);
          showToast(
            'custom',
            'Delivery location Fixed please ensure its close to you ',
            '',
            2500,
          );
          setRegionLoad(false);
        }
      } else {
        showToast(
          'info',
          'Warning',
          'Your selected delivery location is outside the allowed radius. Please choose a location within the radius.',
          4000,
        );
      }
    })();
  };

  // const getRoute = async (origin, destination) => {
  //   const apiKey = url().apiKey;
  //   try {
  //     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;

  //     let response = await fetch(url);
  //     let json = await response.json();

  //     if (json.routes.length) {
  //       const points = json.routes[0].overview_polyline.points;
  //       return decodePolyline(points);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching route:', error);
  //   }
  //   return [];
  // };

  // const decodePolyline = encoded => {
  //   let points = [];
  //   let index = 0,
  //     len = encoded.length;
  //   let lat = 0,
  //     lng = 0;

  //   while (index < len) {
  //     let b,
  //       shift = 0,
  //       result = 0;
  //     do {
  //       b = encoded.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);
  //     let dlat = result & 1 ? ~(result >> 1) : result >> 1;
  //     lat += dlat;

  //     shift = 0;
  //     result = 0;
  //     do {
  //       b = encoded.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);
  //     let dlng = result & 1 ? ~(result >> 1) : result >> 1;
  //     lng += dlng;

  //     points.push({latitude: lat / 1e5, longitude: lng / 1e5});
  //   }
  //   return points;
  // };

  return (
    <>
      <View style={{flex: 1}}>
        {Platform.OS == 'android' && (
          <StatusBar
            backgroundColor={appColor.white}
            barStyle={'dark-content'}
          />
        )}
        {/* location search */}
        <GooglePlacesAutocomplete
          debounce={300}
          placeholder="Enter Location"
          keyboardShouldPersistTaps="always"
          renderLeftButton={() => {
            return (
              <Icon
                ComponentName={'Feather'}
                name={'search'}
                size={widthResponse ? 18 : 25}
                color={appColor.gold}
              />
            );
          }}
          textInputProps={
            {
              // value: keyboardVisible ? search : '',
              // onChangeText: e => {
              //   setSearch(e);
              // },
            }
          }
          styles={{
            container: {
              width: scrnWidth - 30,
              backgroundColor: appColor.white,
              borderRadius: 20,
              zIndex: 100000000,
              position: 'absolute',
              alignSelf: 'center',
              marginTop: 10,
              padding: 5,
              elevation: 15,
              shadowColor: appColor.bgBlack,
            },
            textInput: {
              color: appColor.bgBlack,
              borderRadius: 10,
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: -2,
            },
            loader: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
            },
            textInputContainer: {
              color: appColor.textGrey,
              borderColor: appColor.borderColor,
              borderRadius: 20,
              alignItems: 'center',
              overflow: 'hidden',
              flexDirection: 'row',
              paddingHorizontal: 10,
            },

            description: {
              color: appColor.Textlightblack,
              borderRadius: 20,
              fontSize: fontScalling(2),
              fontFamily: appFont.rB,
            },
            separator: {
              borderWidth: 1,
              borderColor: appColor.borderColor,
            },
          }}
          ref={ref}
          onPress={({description}) => {
            pickSuggesstion(description);
          }}
          query={{
            key: url().apiKey,
            language: 'en',
          }}
        />
        {/* map */}
        {adminCoordinates &&
        Object.values(adminCoordinates).length > 0 &&
        adminCoordinates.latitude &&
        adminCoordinates.longitude ? (
          <MapView
            // provider="google"
            compassOffset={{x: 200, y: 200}}
            style={[styles.map, {zIndex: 10000}]}
            mapType={mapType == 'satellite' ? 'hybrid' : mapType}
            onPress={async ({nativeEvent}) => {
              const radiusValid = onRadiusValid(
                nativeEvent,
                adminCoordinates,
                radius,
              );
              if (radiusValid) {
                Keyboard.dismiss();
                const data = nativeEvent.coordinate;
                if (data && data?.latitude && data?.longitude) {
                  setRegionLoad(true);
                  setRegionChange({
                    latitude: data?.latitude,
                    longitude: data?.longitude,
                  });
                  const getLocation = await getUserLocation({
                    latitude: data?.latitude,
                    longitude: data?.longitude,
                  });
                  if (getLocation && objectLength(getLocation)) {
                    setDestination({
                      address: `${getLocation.street},${getLocation.city},${getLocation?.state},${getLocation?.pincode}`,
                      object: getLocation,
                    });
                    showToast(
                      'custom',
                      `Your delivery location has been set. Please make sure it's convenient and close to you.`,
                      '',
                      2500,
                    );
                    setRegionLoad(false);
                  }
                  Toast.hide();
                }
              } else {
                showToast(
                  'info',
                  'Warning',
                  'Your selected delivery location is outside the allowed radius. Please choose a location within the radius.',
                  4000,
                );
              }
            }}
            region={{
              ...adminCoordinates,
              latitudeDelta: 0.45,
              longitudeDelta: 0.45,
            }}>
            <Circle
              center={adminCoordinates}
              radius={radius}
              strokeWidth={2}
              strokeColor={appColor.toggleGreen}
            />
            {/* <Polyline
              coordinates={[
                {latitude: 9.9252, longitude: 78.1198},
                {latitude: 9.8552, longitude: 79.1198},
                {latitude: 9.8852, longitude: 80.1198},
                {latitude: 9.8952, longitude: 81.1198},
                {latitude: 9.7552, longitude: 80.5198},
                {latitude: 9.6952, longitude: 82.05198},
              ]}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[
                '#7F0000',
                '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                '#B24112',
                '#E5845C',
                '#B24112',
                '#E5845C',
              ]}
              strokeWidth={2}
            /> */}
            {regionChange &&
              regionChange.latitude &&
              regionChange.longitude && (
                <Marker
                  style={styles.marker}
                  pinColor={appColor.ratingGold}
                  coordinate={regionChange}
                />
              )}
          </MapView>
        ) : (
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              flex: 1,
              height: scrnHeight,
              width: scrnWidth,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LottieView
              autoPlay={true}
              style={{width: scrnWidth * 0.5, height: scrnWidth * 0.5}}
              source={require('../../../assets/lottieFiles/load.json')}
            />
          </View>
        )}
        {/* map layer button */}
        <TouchableOpacity
          onPress={() => setLayerSheet(!layerSheet)}
          style={{
            padding: 10,
            borderRadius: 100,
            shadowRadius: 5,
            shadowOffset: {height: 0},
            shadowOpacity: 0.3,
            backgroundColor: appColor.white,
            zIndex: 2,
            position: 'absolute',
            right: 15,
            bottom: 30,
          }}>
          <Icon
            ComponentName={'MaterialCommunityIcons'}
            name={'layers-outline'}
            size={20}
            color={appColor.bgBlack}
          />
        </TouchableOpacity>
      </View>
      {/* picked Location */}
      {destination.address != '' && (
        <View
          style={{
            backgroundColor: appColor.white,
            width: '100%',
            paddingVertical: 20,
            paddingHorizontal: 15,
            paddingBottom: safeArea.bottom == 0 ? 10 : safeArea.bottom,
          }}>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2.5),
              color: appColor.gold,
            }}>
            Delivering Your order to
          </Text>
          {
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: 5,
              }}>
              <FastImage
                style={{width: widthResponse ? 30 : 35, aspectRatio: 0.8}}
                source={require('../../../assets/images/location.png')}
              />
              {regionLoad ? (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: widthResponse ? 40 : 70,
                        height: widthResponse ? 12 : 18,
                        borderRadius: 5,
                      }}
                    />
                    <View
                      style={{
                        width: widthResponse ? 20 : 40,
                        height: widthResponse ? 12 : 18,
                        borderRadius: 5,
                        marginLeft: 5,
                      }}
                    />
                  </View>
                </SkeletonPlaceholder>
              ) : (
                <Text
                  style={{
                    flex: 1,
                    fontFamily: appFont.bR,
                    fontSize: fontScalling(2),
                    color: appColor.bgBlack,
                  }}>
                  {destination.address}
                </Text>
              )}
            </View>
          }
          {
            <PrimaryButton
              onPress={() => {
                // dispatch(setUserLocation(destination.object));
                page == 'home' &&
                  userType == 'user' &&
                  dispatch(userSettingApi(destination.object));
                navigation.navigate(
                  'main',
                  page == 'home'
                    ? null
                    : {
                        screen: 'BottomTab',
                        params: {
                          screen:
                            (page == 'myAddress' || page == 'EditProfile') &&
                            verify == ''
                              ? 'Profile'
                              : page == 'checkOut' || verify == 'checkout'
                              ? 'Carts'
                              : page == 'member_2'
                              ? 'Dashboard'
                              : '',
                          params: {
                            screen: page == 'member_2' ? 'noTab' : page,
                            params:
                              page == 'member_2'
                                ? {
                                    screen: page,
                                    params: {maps: destination.object},
                                  }
                                : {maps: destination.object, verify: verify},
                          },
                        },
                      },
                );
                showToast(
                  'custom',
                  'Your delivery location has been set. Please make sure it is convenient and close to you.',
                  '',
                  2500,
                );
              }}
              Title={'Confirm Location'}
              altStyle={{marginTop: 15}}
            />
          }
        </View>
      )}

      {/* bottom sheet layer */}
      <ModalBottomSheet
        snapPoints={['20%', '25%']}
        isVisible={layerSheet}
        close={() => setLayerSheet(false)}>
        <Text
          style={{
            fontFamily: appFont.bB,
            fontSize: fontScalling(3),
            color: appColor.black,
            paddingBottom: 15,
            paddingHorizontal: 20,
          }}>
          Map Type
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          {mapTypeArr &&
            mapTypeArr.map((val, ind) => {
              const active = mapType == val;
              return (
                <Pressable
                  onPress={() => {
                    setMapType(val);
                    // setLayerSheet(false);
                  }}
                  key={ind}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginHorizontal: 25,
                    backgroundColor: appColor.cartBg,
                    shadowOpacity: active ? 0.3 : 0,
                    shadowRadius: 10,
                    shadowOffset: {height: 0},
                  }}>
                  {/* Image button */}
                  <View
                    style={{
                      borderRadius: 15,
                      borderWidth: 2,
                      padding: 2,
                      borderColor: active ? appColor.gold : 'transparent',
                      elevation: 2,
                      width: 70,
                      aspectRatio: 1,
                      shadowColor: appColor.gold,
                      alignItems: 'center',
                    }}>
                    <FastImage
                      source={mapTypeImgs[ind]}
                      style={{width: '100%', aspectRatio: 1, borderRadius: 15}}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(2),
                      color: active ? appColor.gold : appColor.black,
                      paddingTop: 8,
                    }}>
                    {Capitalize(val)}
                  </Text>
                </Pressable>
              );
            })}
        </View>
      </ModalBottomSheet>
    </>
  );
};

export default ManualLocation;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appColor.white,
      zIndex: 2,
      padding: 10,
    },
    primaryText: {
      color: appColor.gold,
      fontFamily: appFont.rM,
      fontSize: fontScalling(2.2),
      paddingBottom: 5,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.2),
    },
    marker: {
      width: widthResponse ? 25 : 30,
      aspectRatio: 0.5,
      position: 'absolute',
      left: widthResponse ? -12 : -16,
      bottom: widthResponse ? -6 : -7,
      zIndex: 100,
    },
  });
  return {styles};
};
