import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
// file import:
import {ToastConfig, useShowToast} from './src/components/Toast/ToastAlert';
import {AuthStack} from './src/navigations/Stack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useNetInfo} from '@react-native-community/netinfo';
import NetworkUnavailable from './src/components/NetworkUnavailable/NetworkUnavailable';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {AppState, Platform, Text, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useDispatch, useSelector} from 'react-redux';
import {listProductApi, setFavModal, addToFavApi} from './src/redux/favSlice';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import ModalBottomSheet from './src/components/BottomSheet/ModalBottomSheet';
import FavCard from './src/components/Card/FavCard';
import PrimaryButton from './src/components/Buttons/PrimaryButton';
import {appFont} from './src/utilities/appFont';
import appColors from './src/utilities/appColors';
import {fontScalling} from './src/utilities/helperFunction';
import {setFcmToken, userSettingApi} from './src/redux/SettingSlice';

const App = () => {
  const {isConnected} = useNetInfo();
  const dispatch = useDispatch();
  const {favModal, collections, prodId} = useSelector(state => state.fav);
  const {userSettings, vegToggle} = useSelector(state => state.setting);
  const appColor = appColors();
  const showToast = useShowToast();

  // when the app state is background hide the modal
  useEffect(() => {
    const state = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        dispatch(setFavModal(false));
      }
    });
    return () => {
      state.remove();
    };
  }, []);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      // to get proper permission for android
      if (Platform.OS == 'android') {
        const result = await checkNotifications();
        if (
          result.status == 'granted' ||
          result.status == 'blocked' ||
          result.status == 'denied'
        ) {
          const requestNotification = await requestNotifications();
          if (
            requestNotification.status == 'granted' ||
            requestNotification.status == 'denied' ||
            requestNotification.status == 'blocked'
          ) {
            checkPermission();
          } else {
            checkPermission();
          }
        } else {
          checkPermission();
        }
      }
      // step1
      function checkPermission() {
        messaging()
          .hasPermission()
          .then(enable => {
            if (enable) {
              getToken();
            } else {
              requestNotification();
            }
          })
          .catch(e => {
            console.log('error in checkPermission', e);
          });
      }
      // step2
      const requestNotification = async () => {
        messaging()
          .requestPermission()
          .then(() => {
            getToken();
          })
          .catch(e => {
            console.log('error in request notification', e);
          });
      };
      // step3
      const getToken = async () => {
        messaging()
          .getToken()
          .then(token => {
            dispatch(setFcmToken(token));
            dispatch(userSettingApi());
            // console.log('fcm Token', token);
          })
          .catch(e => {
            console.log('error in token get', e);
          });
      };
    };
    checkNotificationPermission();
  }, []);

  useEffect(() => {
    if (userSettings?.userInfo?.user_id) {
      // dispatch(favDataApi());
      dispatch(listProductApi());
    }
  }, [userSettings]);

  useEffect(() => {
    if (vegToggle) {
      showToast('success', '', 'You are now vegitarian mode', 2000);
    } else if (!vegToggle) {
      // showToast('success', '', 'You are general mode', 2000);
    }
  }, [vegToggle]);

  return (
    <>
      <NavigationContainer independent={true}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            {isConnected ? <AuthStack /> : <NetworkUnavailable />}
            {/* collectionsModal bottomSheet */}
            <ModalBottomSheet
              snapPoints={['40%', '45%']}
              isVisible={favModal}
              close={() => {
                dispatch(setFavModal(false));
              }}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingBottom: 15,
                    paddingHorizontal: 15,

                    // flex: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      color: appColor.textBlack,
                      fontSize: fontScalling(2.5),
                      marginLeft: 10,
                    }}>
                    save item to...
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  {collections && collections.length > 0 && (
                    <BottomSheetFlatList
                      data={collections.filter(item => item.collection != '')}
                      renderItem={({item, index}) => {
                        if (item) {
                          const [name, value] = item.split('|');
                          return (
                            <>
                              {name != '' && (
                                <FavCard
                                  key={index}
                                  title={name}
                                  qty={value}
                                  catogary={'private'}
                                  img={''}
                                  checked={item}
                                />
                              )}
                            </>
                          );
                        }
                      }}
                    />
                  )}
                  <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
                    <PrimaryButton
                      Title={'Done'}
                      onPress={() => {
                        if (prodId != '') {
                          dispatch(addToFavApi({pId: prodId}));
                        } else {
                          dispatch(listProductApi());
                          dispatch(setFavModal(false));
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </ModalBottomSheet>
          </BottomSheetModalProvider>
          <Toast config={ToastConfig()} />
        </GestureHandlerRootView>
      </NavigationContainer>
    </>
  );
};

export default App;
