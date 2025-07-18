import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Pressable,
  Text,
  Keyboard,
  Platform,
  Vibration,
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
import {
  setBottomTabPress,
  setPosition,
  userSettingApi,
} from '../redux/SettingSlice';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';

const Tab = createBottomTabNavigator();

function CustomTabBar({state, descriptors, navigation}) {
  const appColor = appColors();
  const {cart} = useSelector(state => state.cart);
  const {termsPage} = useSelector(state => state.title);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  // const navigation = useNavigation();

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
                          width: widthResponse ? 20 : 30, //@@
                          height: widthResponse ? 20 : 30, //@@
                          borderRadius: 40,
                          backgroundColor: 'red',
                          top: widthResponse ? 6 : 10, //@@
                          right: widthResponse ? 3 : 7, //@@
                          zIndex: 5000,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 0.2,
                          borderColor: appColor.white,
                          elevation: 2,
                          shadowOffset: 2,
                        }}>
                        <Text
                          style={{
                            fontFamily: appFont.bB,
                            fontSize: fontScalling(1.8),
                            color: appColor.white,
                          }}>
                          {cart.length}
                        </Text>
                      </Animatable.View>
                    )}
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
                          : route.name == 'Menu'
                          ? 'Entypo'
                          : null
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
                          : route.name == 'Menu'
                          ? 'bowl'
                          : null
                      }
                      color={appColor.bgWhite}
                      size={
                        route.name == 'Dashboard'
                          ? widthResponse
                            ? 25
                            : 30
                          : route.name == 'Carts'
                          ? widthResponse
                            ? 30
                            : 35
                          : route.name == 'Order'
                          ? widthResponse
                            ? 30
                            : 35
                          : route.name == 'Profile'
                          ? widthResponse
                            ? 25
                            : 30
                          : route.name == 'Menu'
                          ? widthResponse
                            ? 25
                            : 25
                          : null
                      }
                    />
                  </View>
                  <Animatable.View
                    duration={300}
                    animation={
                      isFocused
                        ? route.name == 'Profile'
                          ? 'slideInRight'
                          : 'slideInLeft'
                        : route.name == 'Profile'
                        ? 'slideInLeft'
                        : 'slideInRight'
                    }
                    style={[
                      {
                        left: -60,
                        display: isFocused ? 'flex' : 'none',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingHorizontal: 25,
                        paddingLeft: route.name != 'Profile' && 50,
                        paddingRight: route.name == 'Profile' && 50,
                        marginLeft: route.name == 'Profile' ? -60 : 0,
                        marginRight: route.name != 'Profile' ? -60 : 0,
                        zIndex: 5,
                        height: '100%',
                        borderRadius: 100,
                        backgroundColor: appColor.greyBack,
                        justifyContent: 'center',
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
