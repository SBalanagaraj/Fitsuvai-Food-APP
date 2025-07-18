import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {url} from './appApi';
import {print} from './helperFunction';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('always');
    if (status === 'granted') {
      console.log('Permission granted for iOS');
      return true;
    } else {
      console.log('Permission denied for iOS');
      return false;
    }
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // {
        //   title: 'Geolocation Permission',
        //   message: 'Can we access your location?',
        //   buttonNeutral: 'Ask Me Later',
        //   buttonNegative: 'Cancel',
        //   buttonPositive: 'OK',
        // },
      );
      print(granted, 'granted');
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted for Android');
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission permanently denied for Android');
        return 'settings';
      } else {
        console.log('Permission denied for Android');
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};

export const handleLocationPermission = async () => {
  const permission = await requestLocationPermission();
  if (permission === true) {
    console.log('Permission granted');
    // Proceed with location access
  } else if (permission === 'settings') {
    console.log('Directing user to settings');
    // Show a dialog to guide the user to enable permissions manually
    Alert.alert(
      'Permission Required',
      'Location permission is required. Please enable it in the app settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ],
    );
  } else {
    console.log('Permission denied');
    // Show a message or retry logic
  }
};

//Based on User Address PinCode Generation
export function getPincodeFromAddress(userAddress) {
  const myApiKey = url().apiKey; // Replace with your API key
  const address = userAddress
    .filter(Boolean) // Remove empty or undefined parts
    .join(', ')
    .replace(/\s/g, '+'); // Format address for URL

  return new Promise((resolve, reject) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${myApiKey}&address=${address}`,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'OK' && responseJson.results.length > 0) {
          const locationFilter = responseJson?.results.find(location => {
            // print(location, 'location');
            return (
              location.address_components.some(
                component =>
                  component.long_name == userAddress[2] &&
                  component.types.includes('administrative_area_level_3'),
              ) &&
              location.address_components.some(
                component =>
                  component.long_name == userAddress[3] &&
                  component.types.includes('administrative_area_level_1'),
              )
            );
          });
          // print(locationFilter, 'locationFilter');
          const addressComponents =
            responseJson?.results[0]?.address_components;
          // print(addressComponents, 'addressComponents');
          if (
            addressComponents?.find(
              component =>
                component?.types.includes('postal_code') != undefined,
            )
          ) {
            const pincode = addressComponents?.find(component =>
              component?.types?.includes('postal_code'),
            )?.long_name;

            if (pincode) {
              resolve(pincode);
            }
          } else {
            reject('Pincode not found in the address');
          }
        } else {
          reject('Address not found');
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Get coordinates for distance calculation
export function getCoordinatesFromUserLocation(userAddress = [], pincode = '') {
  if (userAddress[2].length > 0 && userAddress[3].length > 0) {
    const myApiKey = url().apiKey;
    let address = userAddress.toString().replace(/\s/g, '');
    // print(address.split(),'address');

    if (pincode != '' && pincode.length > 5) {
      return new Promise((resolve, reject) => {
        fetch(
          `https://maps.google.com/maps/api/geocode/json?key=${myApiKey}&address=${address}&sensor=false`,
        )
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.status === 'OK') {
              // resolve(responseJson?.results?.[0]?.formatted_address);
              const locationFilter = responseJson?.results.find(
                location =>
                  location.address_components.some(
                    component =>
                      component.long_name == userAddress[2] &&
                      component.types.includes('administrative_area_level_3'),
                  ) &&
                  location.address_components.some(
                    component =>
                      component.long_name == userAddress[3] &&
                      component.types.includes('administrative_area_level_1'),
                  ),
              );
              // const datas = responseJson?.results.filter(data=>data['formatted_address'].includes(userAddress[1])||data['formatted_address'].includes(userAddress[3])||data['formatted_address'].includes(userAddress[2]));
              if (
                locationFilter &&
                locationFilter != undefined &&
                Object.keys(locationFilter).length > 0
              ) {
                const destination = {
                  lat: locationFilter.geometry?.location?.lat,
                  lng: locationFilter.geometry?.location?.lng,
                };
                resolve(destination);
                // print(destination, 'destination');
                return destination;
              }
            } else {
              const destination = {
                lat: '',
                lng: '',
              };
              reject('not found');
              setDistance(0);
              return false;
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
}

// Get Current Location
export const getUserLocation = async () => {
  try {
    let position = '';
    const result = await requestLocationPermission();
    print(result, 'result');
    if (result) {
      position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          {enableHighAccuracy: true, timeout: 15000},
        );
      });
    }
    print(position, 'position');

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const myApiKey = url().apiKey;

    const findResult = (results, name) => {
      const result = results.find(obj => obj.types.includes(name));
      return result ? result.long_name : '';
    };

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${myApiKey}`,
    );

    if (response.status === 200) {
      const resparse = await response.json();
      if (resparse.results && resparse.results.length > 0) {
        const results = resparse.results[0].address_components;

        const street = [
          findResult(results, 'route'),
          findResult(results, 'sublocality_level_2'),
          findResult(results, 'sublocality_level_1'),
          findResult(results, 'locality'),
        ]
          .filter(val => val !== '')
          .join(', ');

        const city = findResult(results, 'administrative_area_level_3');
        const state = findResult(results, 'administrative_area_level_1');
        const pincode = findResult(results, 'postal_code');

        const address = {
          street,
          city,
          state,
          pincode,
        };
        return address;
      } else {
        throw new Error('No address components found');
      }
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.log('Error getting location:', error.message || error);
    return null;
  }
};

// Admin Radius Based Distance Validation Function
export const AdminDistanceRadius = async (
  adminlocations = '',
  userLocations = {},
  adminRadius = '',
) => {
  if (
    adminlocations !== '' &&
    userLocations.lat &&
    userLocations.lng &&
    adminRadius !== ''
  ) {
    const myApiKey = url().apiKey;
    const startaddress = adminlocations;
    const destaddress = `${userLocations.lat},${userLocations.lng}`;
    const settingRadius = parseFloat(adminRadius);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startaddress}&destinations=${destaddress}&mode=driving&language=en-En&key=${myApiKey}`,
      );
      const responseJson = await response.json();

      if (responseJson.status === 'OK') {
        const distanceInMeters =
          responseJson.rows[0].elements[0].distance.value;
        const distanceInKm = distanceInMeters / 1000;

        const inRange = {
          status: distanceInKm <= settingRadius,
          distance: distanceInKm.toFixed(2), // Return a string with fixed decimals for readability
        };

        console.log(inRange.distance, 'distance in km');
        return inRange; // Resolve directly by returning the value
      } else {
        console.error(
          'Error in distance matrix response:',
          responseJson.error_message || 'Unknown error',
        );
        throw new Error('Failed to calculate distance');
      }
    } catch (error) {
      console.error('Error fetching distance data:', error.message);
      throw new Error('Distance API fetch failed');
    }
  } else {
    console.error('Missing data for distance calculation');
    throw new Error('Missing required data');
  }
};
