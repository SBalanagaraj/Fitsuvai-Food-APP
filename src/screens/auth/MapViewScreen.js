import {StatusBar, StyleSheet, Text, View} from 'react-native';
import MapView, {MapCircle} from 'react-native-maps';
import React, {useEffect, useState} from 'react';
import {
  fontScalling,
  objectLength,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {Marker} from 'react-native-maps';
import {appFont} from '../../utilities/appFont';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import {
  getUserLocation,
  onRadiusValid,
} from '../../utilities/GeolocationFunctions';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {userSettingApi} from '../../redux/SettingSlice';
import {url} from '../../utilities/appApi';

const MapViewScreen = ({route}) => {
  const appColor = appColors();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const safeArea = useSafeAreaInsets();
  const showToast = useShowToast();
  const {location, coordinates, centerCoordinates, radius} = route?.params;
  const {userSettings} = useSelector(state => state.setting);
  const [district, setDistrict] = useState('');

  print(safeArea, 'safeArea');

  const [regionLoad, setRegionLoad] = useState(false);
  const [regionChange, setRegionChange] = useState({});
  const [destination, setDestination] = useState({
    address: '',
    object: {},
  });

  const getDistrictFromAddress = async address => {
    try {
      const apiKey = url().apiKey; // Replace with your Google API Key
      const urls = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
      )}&key=${apiKey}`;

      const response = await fetch(urls);
      const data = await response.json();

      if (data.status === 'OK') {
        // Loop through address components and find the district (administrative_area_level_2)
        const results = data.results[0].address_components;
        const districtComponent = results.find(component =>
          component.types.includes('administrative_area_level_3'),
        );
        print(districtComponent, 'results');
        if (districtComponent) {
          setDistrict(districtComponent.long_name);
        } else {
          setDistrict('District not found');
        }
      } else {
        setDistrict('Error fetching district');
      }
    } catch (error) {
      setDistrict('Error fetching district');
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      await getDistrictFromAddress(userSettings.ADDRESS);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (location && location != '' && coordinates && district != '') {
        setRegionLoad(true);
        const getLocation = await getUserLocation(coordinates);

        const arr = location?.split(',');
        const ind = arr.findIndex(val => val.trim() == district);
        const street = arr.slice(0, ind);
        // print(arr, 'arr');
        setDestination({
          address: location,
          object: {...getLocation, street: street.join('')},
        });
        onRadiusValid({coordinate: coordinates}, centerCoordinates, radius);
        setRegionChange(coordinates);
        setRegionLoad(false);
      }
    })();
  }, [location]);

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <View style={[styles.container]}>
        <MapView
          mapType="satellite"
          provider="google"
          style={styles.map}
          onPress={async ({nativeEvent}) => {
            const radiusValid = onRadiusValid(
              nativeEvent,
              centerCoordinates,
              radius,
            );
            if (radiusValid) {
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
                if (getLocation != '') {
                  setDestination({
                    address: `${getLocation.street},${getLocation.city},${getLocation?.state},${getLocation?.pincode}`,
                    object: getLocation,
                  });

                  setRegionLoad(false);
                }
              }
            }
          }}
          region={{
            ...centerCoordinates,
            latitudeDelta: 0.4,
            longitudeDelta: 0.45,
          }}>
          <MapCircle
            center={centerCoordinates}
            radius={radius}
            strokeWidth={2}
            // fillColor="#00000000"
            strokeColor={appColor.toggleGreen}
          />
          <Marker
            children={() => (
              <FastImage
                source={require('../../../assets/images/location.png')}
                style={styles.marker}
              />
            )}
            coordinate={objectLength(regionChange) ? regionChange : coordinates}
          />
        </MapView>
        <View
          style={{
            // height: scrnHeight / 5.5,
            backgroundColor: appColor.white,
            width: '100%',
            paddingVertical: 20,
            paddingHorizontal: 15,
            paddingBottom: safeArea.bottom,
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
            <>
              {regionLoad ? (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 12,
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    />
                    <View
                      style={{
                        width: 20,
                        height: 12,
                        borderRadius: 5,
                        marginTop: 5,
                        marginLeft: 5,
                      }}
                    />
                  </View>
                </SkeletonPlaceholder>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                  }}>
                  <FastImage
                    style={{width: 40, height: 40}}
                    source={require('../../../assets/images/location.png')}
                  />
                  <Text
                    style={{
                      fontFamily: appFont.bR,
                      fontSize: fontScalling(2),
                      color: appColor.bgBlack,
                    }}>
                    {destination.address}
                  </Text>
                </View>
              )}
            </>
          }
          <PrimaryButton
            onPress={() => {
              (async () => {
                // console.log(destination.object, 'object');
                dispatch(userSettingApi(destination.object));
                // dispatch(setUserLocation(destination.object));
                setTimeout(() => {
                  navigation.navigate('main');
                }, 1000);
              })();
            }}
            Title={'Confirm Location'}
            altStyle={{marginTop: 15}}
          />
        </View>
      </View>
    </>
  );
};

export default MapViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
