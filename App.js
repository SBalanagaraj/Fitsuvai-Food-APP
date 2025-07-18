import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
// file import:
import {ToastConfig, useShowToast} from './src/components/Toast/ToastAlert';
import {AuthStack} from './src/navigations/Stack';
import {
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useNetInfo} from '@react-native-community/netinfo';
import NetworkUnavailable from './src/components/NetworkUnavailable/NetworkUnavailable';
import {AppState, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {listProductApi, setFavModal, addToFavApi} from './src/redux/favSlice';
import ModalBottomSheet from './src/components/BottomSheet/ModalBottomSheet';
import FavCard from './src/components/Card/FavCard';
import PrimaryButton from './src/components/Buttons/PrimaryButton';
import {appFont} from './src/utilities/appFont';
import appColors from './src/utilities/appColors';
import {
  fontScalling,
  checkNotificationPermission,
  print,
} from './src/utilities/helperFunction';
import {ContentApi, userSettingApi} from './src/redux/SettingSlice';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const {isConnected} = useNetInfo();
  const dispatch = useDispatch();
  const appColor = appColors();
  const showToast = useShowToast();

  const {favModal, collections, prodId} = useSelector(state => state.fav);
  const {userSettings, vegToggle} = useSelector(state => state.setting);
  const {profileData} = useSelector(state => state.auth);

  const badGateWay = userSettings && userSettings == 404;

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

  // push notification permissions and token generation
  useEffect(() => {
    checkNotificationPermission(dispatch);
  }, []);

  useEffect(() => {
    if (userSettings?.userInfo?.user_id) {
      console.log(userSettings?.userInfo?.user_id, 'user_id');
      dispatch(listProductApi());
    }
  }, [userSettings]);

  useEffect(() => {
    if (vegToggle) {
      showToast('success', '', 'You are now in vegetarian mode', 2000);
    } else if (!vegToggle) {
    }
  }, [vegToggle]);

  // call userSetting Api when app will invoke
  useEffect(() => {
    (() => {
      dispatch(userSettingApi());
      dispatch(ContentApi());
    })();
  }, [profileData]);

  useEffect(() => {
    if (badGateWay) {
      SplashScreen.hide();
    }
  }, [badGateWay]);

  // print(userSettings, 'userSettings');

  return (
    <>
      <NavigationContainer independent={true}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            {badGateWay ? (
              <>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(2),
                      color: appColor.bgBlack,
                    }}>
                    Bad GateWay
                  </Text>
                </View>
              </>
            ) : isConnected ? (
              <AuthStack />
            ) : (
              <NetworkUnavailable />
            )}
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
