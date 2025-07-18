import {Pressable, StatusBar, Text, View, Animated, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
// file import:
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import {appFont} from '../../utilities/appFont';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import {useDispatch, useSelector} from 'react-redux';
import {setPosition, setVegToggle} from '../../redux/SettingSlice';
import {setNotifeeDelModal} from '../../redux/NotificationSlice';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LottieView from 'lottie-react-native';
import Toggle from '../Buttons/Toggle';

function AppHeaders({
  drawer,
  backIconDisabled,
  title,
  welcome,
  bellDisabled,
  searchDisabled,
  coinIcon,
  deleteIcon = false,
  backIconFn = false,
  toggleDisable = true,
}) {
  const appColor = appColors();
  const navigation = useNavigation();
  const {total} = useSelector(state => state.cart);
  const {userType} = useSelector(state => state.auth);
  const {allNotification} = useSelector(state => state.notification);
  const {userSettings, userSettingLoad, vegToggle} = useSelector(
    state => state.setting,
  );
  const dispatch = useDispatch();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: appColor.bgBlack,
        }}>
        <StatusBar backgroundColor={appColor.bgBlack} />
        {/* Left Icons*/}
        <View>
          {/* backIcon */}
          {!backIconDisabled && (
            <Pressable
              style={{
                backgroundColor: appColor.greyBack,
                padding: 8,
                borderRadius: 50,
              }}
              onPress={
                backIconFn
                  ? backIconFn
                  : () => {
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        navigation.navigate('Dashboard', {screen: 'home'});
                      }
                    }
              }>
              <View style={{left: widthResponse ? 4 : 6}}>
                <Icon
                  ComponentName={'MaterialIcons'}
                  name={'arrow-back-ios'}
                  size={widthResponse ? 20 : 25}
                  color={appColor.bgWhite}
                />
              </View>
            </Pressable>
          )}
        </View>
        {/* Title */}
        {
          <Pressable
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {welcome && (
              <Pressable
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 22.5,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: appColor.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={
                  userType == 'guest'
                    ? () => navigation.navigate('login')
                    : () => {
                        navigation.navigate('Profile', {
                          screen: 'EditProfile',
                          initial: false,
                        });
                      }
                }>
                {userSettingLoad ? (
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 22.5,
                      marginHorizontal: 10,
                      borderWidth: 1,
                      borderColor: appColor.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: appColor.sliderGreyBg,
                    }}>
                    <LottieView
                      autoPlay={true}
                      style={{width: 100, height: 100, top: 5}}
                      source={require('../../../assets/lottieFiles/load.json')}
                    />
                  </View>
                ) : (
                  <Image
                    style={{
                      width: widthResponse ? 45 : 60, //@@
                      height: widthResponse ? 45 : 60, //@@
                      borderRadius: 22.5,
                      marginHorizontal: 10,
                      borderWidth: 1,
                      borderColor: appColor.white,
                    }}
                    source={
                      userSettings &&
                      userType != 'guest' &&
                      userSettings?.userInfo &&
                      userSettings?.userInfo?.picture != ''
                        ? {uri: userSettings?.userInfo?.picture}
                        : require('../../../assets/images/profile.png')
                    }
                    resizeMode="cover"
                  />
                )}
              </Pressable>
            )}
            <View style={{flex: 1, marginLeft: backIconDisabled ? 0 : 20}}>
              {welcome && (
                <Text
                  style={{
                    color: appColor.themeYellow,
                    fontFamily: appFont.rR,
                    fontSize: fontScalling(1.9),
                  }}>
                  Welcome
                </Text>
              )}
              {userSettingLoad ? (
                <>
                  <SkeletonPlaceholder>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{
                          width: 40,
                          height: 12,
                          borderRadius: 5,
                          marginTop: 15,
                        }}
                      />
                      <View
                        style={{
                          width: 20,
                          height: 12,
                          borderRadius: 5,
                          marginTop: 15,
                          marginLeft: 10,
                        }}
                      />
                    </View>
                  </SkeletonPlaceholder>
                </>
              ) : (
                <>
                  {title && (
                    <Text
                      style={{
                        fontFamily: appFont.bB,
                        fontSize: fontScalling(3),
                        letterSpacing: widthResponse ? 2.5 : 3,
                        color: appColor.textWhite,
                        marginBottom: widthResponse ? -4 : -8,
                      }}>
                      {title}
                    </Text>
                  )}
                </>
              )}
            </View>
          </Pressable>
        }
        {/* Right Icons */}
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          {/* coinIcon */}
          {coinIcon && (
            <Pressable
              onPress={() => {
                userType == 'guest'
                  ? navigation.navigate('login')
                  : navigation.navigate('Profile', {screen: 'RewardCoin'});
              }}
              style={{
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                // width: widthResponse ? 40 : 45,
                // height: widthResponse ? 40 : 45,
                borderRadius: 10,
                marginLeft: widthResponse ? 10 : 15,
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}>
              <Image
                source={{
                  uri: 'https://grocarto.com/assets/images/User/app/coin.png',
                }}
                resizeMode="contain"
                style={{
                  width: widthResponse ? 22 : 30, //@@
                  height: widthResponse ? 22 : 30, //@@
                }}
              />
              <Text
                style={[
                  {
                    color: appColor.white,
                    fontFamily: appFont.rR,
                    fontSize: fontScalling(1.8),
                  },
                  {paddingLeft: 5},
                ]}>
                {total.pointsShown}
              </Text>
            </Pressable>
          )}
          {/* SearchIcon */}
          {!searchDisabled && (
            <Pressable
              onPress={() => {
                navigation.navigate('search');
              }}
              style={{
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                width: widthResponse ? 40 : 45,
                height: widthResponse ? 40 : 45,
                borderRadius: 50,
                marginLeft: widthResponse ? 10 : 15,
              }}>
              <Icon
                ComponentName={'Fontisto'}
                name={'search'}
                color={appColor.bgWhite}
                size={widthResponse ? 20 : 23}
              />
            </Pressable>
          )}
          {allNotification &&
            allNotification.data?.length > 0 &&
            deleteIcon && (
              <Pressable
                onPress={() => {
                  dispatch(setNotifeeDelModal(true));
                }}
                style={{
                  backgroundColor: appColor.greyBack,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: widthResponse ? 40 : 45,
                  height: widthResponse ? 40 : 45,
                  borderRadius: 50,
                  marginLeft: widthResponse ? 10 : 15,
                }}>
                <Icon
                  ComponentName={'Feather'}
                  name={'trash-2'}
                  color={appColor.bgWhite}
                  size={widthResponse ? 20 : 23}
                />
              </Pressable>
            )}

          {/* bellIcon */}
          {!bellDisabled && (
            <Pressable
              onPress={() => {
                userType == 'guest'
                  ? navigation.navigate('login')
                  : navigation.navigate('Dashboard', {screen: 'notification'});
              }}
              style={{
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                width: widthResponse ? 40 : 45,
                height: widthResponse ? 40 : 45,
                borderRadius: 50,
                marginLeft: widthResponse ? 10 : 15,
              }}>
              <View style={{left: 1, position: 'relative'}}>
                <Icon
                  name={'bell'}
                  ComponentName={'Fontisto'}
                  color={appColor.bgWhite}
                  size={widthResponse ? 20 : 23}
                />
                {/* Number Budge */}
                {userSettings && userSettings.badge > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: widthResponse ? -13 : -20,
                      right: widthResponse ? -13 : -23,
                      width: widthResponse ? 20 : 30,
                      height: widthResponse ? 20 : 30,
                      borderRadius: 100,
                      backgroundColor: appColor.themeYellow,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: appFont.rM,
                        fontSize: fontScalling(1.3),
                        color: appColor.textWhite,
                      }}>
                      {userSettings.badge}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
          {toggleDisable && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderColor: appColor.white,
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  color: appColor.white,
                  paddingBottom: 5,
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2),
                }}>
                Veg
              </Text>

              <Toggle
                type="green"
                isActive={vegToggle}
                onPress={() => {
                  dispatch(setVegToggle(!vegToggle));
                }}
                style={{
                  borderRadius: 15,
                  backgroundColor: appColor.white,
                  paddingHorizontal: 7,
                  paddingVertical: 6.5,
                }}
              />
            </View>
          )}
          {/* Drawer Menu */}
          {drawer && (
            <Pressable
              style={{
                // height: widthResponse ? 20 : 25,
                // width: widthResponse ? 25 : 25,
                // // justifyContent: 'space-between',
                // marginLeft: widthResponse ? 15 : 20,
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                width: widthResponse ? 40 : 55, //@@
                height: widthResponse ? 40 : 55, //@@
                borderRadius: 50,
                marginLeft: widthResponse ? 10 : 15,
              }}
              onPress={() => {
                dispatch(setPosition('left'));
                navigation.getParent().openDrawer();
              }}>
              <Icon
                color={appColor.white}
                ComponentName={'MaterialIcons'}
                name={'restaurant-menu'}
                size={widthResponse ? 25 : 30}
              />
              {/* <View
                style={{
                  height: widthResponse ? 3 : 4,
                  width: '100%',
                  backgroundColor: appColor.bgWhite,
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  height: widthResponse ? 3 : 4,
                  width: '70%',
                  backgroundColor: appColor.bgWhite,
                  borderRadius: 10,
                  alignSelf: 'flex-end',
                }}
              />
              <View
                style={{
                  height: widthResponse ? 3 : 4,
                  width: '100%',
                  backgroundColor: appColor.bgWhite,
                  borderRadius: 10,
                }}
              /> */}
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}

export default AppHeaders;
