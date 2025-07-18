import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Pressable,
  Text,
  Keyboard,
  Platform,
  Vibration,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// file import:
import {
  CartStack,
  DashBoardStack,
  MenuStack,
  OrderStack,
  ProfileStack,
} from './Stack';
import appColors from '../utilities/appColors';
import {Icon} from '../utilities/icon';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../utilities/helperFunction';
import {appFont} from '../utilities/appFont';
import {useDispatch, useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {setBottomTabPress, userSettingApi} from '../redux/SettingSlice';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import LottieView from 'lottie-react-native';
import {Linking} from 'react-native';

const Tab = createBottomTabNavigator();

function CustomTabBar({state, descriptors, navigation}) {
  const appColor = appColors();
  const {cart} = useSelector(state => state.cart);
  const {userSettings} = useSelector(state => state.setting);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const width = fontScalling(30);

  const allProducts =
    userSettings &&
    userSettings?.suggestions &&
    userSettings?.suggestions.length > 0
      ? userSettings?.suggestions.filter(dta => dta.type == 1)
      : [];

  // Function to handle the deep link
  useEffect(() => {
    const handleDeepLink = event => {
      const {url} = event;
      processUrl(url);
    };

    // Function to process the URL
    const processUrl = url => {
      if (!url) return;
      if (url.includes('www.fitsuvai.com')) {
        const recipeId = url.split('/').pop();
        if (recipeId != '' && allProducts && allProducts.length > 0) {
          const findProduct = allProducts.find(
            data =>
              `${data.name.split(' ').join('-').trim()}-${
                data.size
              }`.toLocaleLowerCase() == recipeId.toLocaleLowerCase(),
          );
          if (
            findProduct &&
            Object.keys(findProduct).length > 0 &&
            findProduct.id
          ) {
            navigation.navigate('productDetail', {productId: findProduct.id});
          }
        } else {
          navigation.navigate('profile');
        }
      }
    };

    // Get the initial URL when the app is launched from a closed state
    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      processUrl(initialUrl);
    };

    getInitialUrl();

    // Add event listener for when the app is opened from the background
    const linkingListener = Linking.addEventListener('url', handleDeepLink);

    // Cleanup the event listener on unmount
    return () => {
      linkingListener.remove();
    };
  }, [navigation]);

  const handleNavigation = url => {
    const path = url.replace(/.*?:\/\//g, '');
    console.log(path, 'path');
    const id = path.split('/').pop();
    Alert.alert('Navigating', `Product Detail ID: ${id}`);
    navigation.navigate('productDetail', {productId: id});
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    // Cleanup the listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      {!keyboardVisible && (
        <View
          style={{
            width: scrnWidth - 40,
            marginHorizontal: 20,
            position: 'absolute',
            bottom: widthResponse ? 15 : 20,
            flexDirection: 'row',
            overflow: 'hidden',
            borderRadius: 100,
            backgroundColor: 'black',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: widthResponse ? 8 : 10, //@@
          }}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                // if (route.name == 'Menu') {
                //   // dispatch(setPosition('center'));
                // }
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={index}
                style={{
                  flex: isFocused ? 1 : 0,
                  flex: isFocused ? 1 : 0,
                  marginRight:
                    route.name == 'Profile' ? 0 : widthResponse ? 5 : 20, //@@
                  marginLeft:
                    route.name == 'Dashboard' ? 0 : widthResponse ? 5 : 20, //@@
                }}
                onPress={onPress}>
                <View
                  style={[
                    {
                      flexDirection:
                        route.name == 'Profile' ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      borderRadius: 100,
                      overflow: 'hidden',
                    },
                  ]}>
                  <View
                    style={{
                      backgroundColor: isFocused ? 'orange' : 'transparent',
                      borderRadius: 100,
                      zIndex: 10,
                      height: 45,
                      width: 45,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                    }}>
                    {route.name == 'Carts' && cart && cart.length > 0 && (
                      <Animatable.View
                        // animation={'bounceInDown'}
                        duration={500}
                        iterationCount={1}
                        style={{
                          position: 'absolute',
                          width: widthResponse ? 17 : 30, //@@
                          height: widthResponse ? 17 : 30, //@@
                          borderRadius: 40,
                          backgroundColor: 'red',
                          top: widthResponse ? 6 : 10, //@@
                          right: widthResponse ? 3 : 7, //@@
                          zIndex: 5000,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 0.5,
                          borderColor: appColor.white,
                          elevation: 2,
                          shadowOffset: 2,
                        }}>
                        <Text
                          style={{
                            fontFamily: appFont.bB,
                            fontSize: fontScalling(1.6),
                            color: appColor.white,
                          }}>
                          {cart.length}
                        </Text>
                      </Animatable.View>
                    )}
                    {route.name == 'Menu' ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <LottieView
                          autoPlay={true}
                          loop={true}
                          duration={10000}
                          style={{
                            width: 55,
                            height: 55,
                          }}
                          source={require('../../assets/lottieFiles/foodMenu.json')}
                        />
                      </View>
                    ) : (
                      // </View>
                      <Icon
                        ComponentName={
                          route.name == 'Dashboard'
                            ? 'AntDesign'
                            : route.name == 'Carts'
                            ? 'AntDesign'
                            : route.name == 'Order'
                            ? 'Feather'
                            : route.name == 'Profile'
                            ? 'FontAwesome'
                            : // : route.name == 'Menu'
                              // ? 'Entypo'
                              null
                        }
                        name={
                          route.name == 'Dashboard'
                            ? 'home'
                            : route.name == 'Carts'
                            ? 'shoppingcart'
                            : route.name == 'Order'
                            ? 'package'
                            : route.name == 'Profile'
                            ? 'user-o'
                            : // : route.name == 'Menu'
                              // ? 'bowl'
                              null
                        }
                        color={appColor.bgWhite}
                        size={
                          route.name == 'Dashboard'
                            ? widthResponse
                              ? 20
                              : 30
                            : route.name == 'Carts'
                            ? widthResponse
                              ? 23
                              : 35
                            : route.name == 'Order'
                            ? widthResponse
                              ? 22
                              : 35
                            : route.name == 'Profile'
                            ? widthResponse
                              ? 20
                              : 30
                            : route.name == 'Menu'
                            ? widthResponse
                              ? 20
                              : 25
                            : null
                        }
                      />
                    )}
                  </View>
                  {isFocused && (
                    <Animatable.View
                      duration={800}
                      easing={'linear'}
                      animation={{
                        0: {
                          transform: [
                            {
                              translateX:
                                route.name == 'Profile' ? width : -width,
                            },
                          ],
                          opacity: 0,
                        },
                        0.5: {
                          transform: [
                            {
                              translateX:
                                route.name == 'Profile'
                                  ? width / 2
                                  : -width / 2,
                            },
                          ],
                          opacity: 0,
                        },
                        1: {
                          transform: [
                            {translateX: route.name == 'Profile' ? 0 : 0},
                          ],
                          opacity: 1,
                        },
                      }}
                      // animation={
                      //   isFocused
                      //     ? route.name == 'Profile'
                      //       ? 'slideInRight'
                      //       : 'slideInLeft'
                      //     : route.name == 'Profile'
                      //     ? 'slideInLeft'
                      //     : 'slideInRight'
                      // }
                      style={[
                        {
                          left: -60,
                          display: isFocused ? 'flex' : 'none',
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // paddingHorizontal: 25,
                          paddingLeft: route.name !== 'Profile' && 50,
                          paddingRight: route.name === 'Profile' && 50,
                          marginLeft: route.name === 'Profile' ? -60 : 0,
                          marginRight: route.name !== 'Profile' ? -60 : 0,
                          zIndex: 5,
                          height: '100%',
                          borderRadius: 100,
                          backgroundColor: appColor.greyBack,
                          backgroundColor: isFocused
                            ? appColor.greyBack
                            : 'transparent',
                        },
                      ]}>
                      <Text
                        style={{
                          // paddingTop: 5,
                          fontFamily: appFont.bB,
                          fontSize: fontScalling(2),
                          letterSpacing: widthResponse ? 1.3 : 3, //@@
                          textAlign: 'center',
                          color: appColor.textWhite,
                        }}>
                        {label}
                      </Text>
                    </Animatable.View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </>
  );
}

const BottomTab = () => {
  const {termsPage} = useSelector(state => state.title);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //foreground background and quit state handling
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        navigation.navigate('notification');
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          switch (remoteMessage.data['route']) {
            case undefined:
              navigation.navigate('notification');
              break;
          }
        }
      });
  }, []);

  useEffect(() => {
    notifee.onForegroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        // Wrap in try-catch to handle errors gracefully
        try {
          await navigation.navigate('notification');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    });
  }, []);

  useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        // Wrap in try-catch to handle errors gracefully
        try {
          await navigation.navigate('notification');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    });
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'ios' || 'android') {
        await messaging().requestPermission();
      }
    };
    requestPermission();
  }, []);

  // background
  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log('float test');
        const {notification, messageId} = remoteMessage;
        if (!messageId) {
          console.error('Missing message ID');
          return;
        }
        displayFloatingNotification(notification, messageId);
      },
    );
    return unsubscribe;
  }, []);

  // foreGround Message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {notification, messageId} = remoteMessage;
      if (!messageId) {
        console.error('Missing message ID');
        return;
      }

      displayFloatingNotification(notification, messageId);
      dispatch(userSettingApi());
      console.log('its work in foreground');
      Vibration.vibrate(60);
    });
    return unsubscribe;
  }, []);

  async function displayFloatingNotification(notification, messageId) {
    if (notification.displayed) return; // Prevents duplication
    notification.displayed = true;
    // Create a channel with high importance
    await notifee.createChannel({
      id: 'high-priority',
      name: 'High Priority Notifications',
      importance: AndroidImportance.HIGH, // Set importance to high for heads-up display
      visibility: AndroidVisibility.PUBLIC, // Make notification content visible on lock screen
    });

    // Display a notification with the created channel
    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId: 'high-priority',
        importance: AndroidImportance.HIGH, // Ensures heads-up on supported devices
        pressAction: {
          id: 'messageId',
        },
        style: notification?.android?.imageUrl && {
          type: AndroidStyle.BIGPICTURE,
          picture: notification?.android?.imageUrl
            ? notification?.android?.imageUrl
            : '',
        },
      },
    });
  }

  return (
    <>
      <Tab.Navigator
        tabBar={props => {
          return !termsPage ? <CustomTabBar {...props} /> : null;
        }}
        screenOptions={{headerShown: false, tabBarHideOnKeyboard: true}}>
        <Tab.Screen
          name="Dashboard"
          component={DashBoardStack}
          options={{title: 'home'}}
          listeners={{tabPress: e => dispatch(setBottomTabPress(1))}}
        />
        <Tab.Screen
          name="Carts"
          component={CartStack}
          options={{title: 'Cart'}}
          listeners={{tabPress: e => dispatch(setBottomTabPress(1))}}
        />
        <Tab.Screen
          name="Menu"
          component={MenuStack}
          listeners={{tabPress: e => dispatch(setBottomTabPress(1))}}
        />
        <Tab.Screen
          name="Order"
          component={OrderStack}
          options={{}}
          listeners={{tabPress: e => dispatch(setBottomTabPress(1))}}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{}}
          listeners={{tabPress: e => dispatch(setBottomTabPress(1))}}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTab;
