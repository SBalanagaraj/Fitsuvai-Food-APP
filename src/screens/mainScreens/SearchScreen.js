import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Keyboard,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import filter from 'lodash.filter';
import appColors from '../../utilities/appColors';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import {appFont} from '../../utilities/appFont';
import {useDispatch, useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';
import Toggle from '../../components/Buttons/Toggle';
import {setVegToggle} from '../../redux/SettingSlice';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import useVoiceRecognition from '../../utilities/useVoiceRecognition';
import Modal from 'react-native-modal';
import VoiceRecordCard from '../../components/Card/VoiceRecordCard';
import RecordModal from '../../components/Card/RecordModal';

const SearchScreen = ({route}) => {
  const navigation = useNavigation();
  const appColor = appColors();
  const dispatch = useDispatch();
  const {styles} = useStyle();
  const [srchKey, setSrchKey] = useState('');
  const [data, setData] = useState([]);
  const isFocus = useIsFocused();
  const {query = false} = route?.params ? route?.params : false;
  const [dyKeyWord, setDyKeyWord] = useState('Search Your Favourite Food');

  useEffect(() => {
    let interval;
    if (
      isFocus &&
      userSettings &&
      userSettings?.suggestions &&
      userSettings?.suggestions.length > 0
    ) {
      let foods = userSettings?.suggestions.filter(
        data => data.vegetartin_foods == '1',
      );
      interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * foods.length);
        setDyKeyWord(foods[randomIndex].name);
      }, 3500);
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isFocus, userSettings?.suggestions]);

  const {userSettings, vegToggle} = useSelector(state => state.setting);
  const termbasedArray = srchKey == '' ? userSettings?.suggestions : data;

  const {
    startRecognizing,
    started,
    setVoiceModal,
    voiceModal,
    results,
    permissionModal,
    isCompleted,
    setPermissionModal,
    resetStates,
    checkPermission,
    setStarted,
  } = useVoiceRecognition();

  // Search fn:
  const searchFn = async term => {
    const vegFiltering = vegToggle
      ? userSettings?.suggestions.filter(data => data.vegetartin_foods == '1')
      : userSettings?.suggestions;
    if (vegFiltering) {
      let filtered = filter(vegFiltering, item => {
        if (!term || typeof term !== 'string') return false; // prevent error
        const filterProduct =
          item.name?.toLowerCase().includes(term.toLowerCase()) ||
          (item.offer && item.offer.toLowerCase().includes(term.toLowerCase()));

        return filterProduct;
      });

      const startWithFirstLetter = [];
      const others = [];
      filtered.forEach(item => {
        if (
          item.name.toLowerCase().startsWith(term.toLowerCase()) ||
          (item.offer &&
            item.offer.toLowerCase().includes(term.toLowerCase().trimStart()))
        ) {
          startWithFirstLetter.push(item);
        } else {
          others.push(item);
        }
      });
      startWithFirstLetter.sort((a, b) => a.type - b.type);
      const sortedResult = startWithFirstLetter.concat(others);
      setData(sortedResult);
      resetStates();
    }
  };

  useEffect(() => {
    if (query) {
      setVoiceModal(true);
      setTimeout(() => {
        startRecognizing();
        searchFn(query);
        setSrchKey(query);
      }, 100);
    }
  }, [query]);

  return (
    <>
      <StatusBar backgroundColor={appColor.white} barStyle={'dark-content'} />
      <SafeAreaView
        style={{flex: 1, backgroundColor: appColor.bgWhite, paddingTop: 5}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 5,
            marginHorizontal: 10,
            backgroundColor: appColor.bgWhite,
          }}>
          {/* back Icon */}
          <Pressable
            style={{
              backgroundColor: appColor.textGrey,
              padding: 6,
              borderRadius: 50,
              elevation: 0.7,
            }}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Dashboard', {screen: 'home'});
              }
            }}>
            <View style={{left: widthResponse ? 4 : 6}}>
              <Icon
                ComponentName={'MaterialIcons'}
                name={'arrow-back-ios'}
                size={widthResponse ? 20 : 30}
                color={appColor.white}
              />
            </View>
          </Pressable>
          {/* search bar */}
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              // marginRight: 5,
              backgroundColor: appColor.greyBg,
              alignSelf: 'stretch',
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: widthResponse ? 15 : 20,
            }}>
            {/* search icon */}
            <Icon
              ComponentName={'FontAwesome'}
              name={'search'}
              color={appColor.textGrey}
              size={widthResponse ? 20 : 25}
            />
            {/* search input */}
            <TextInput
              numberOfLines={1} //BN
              autoFocus={true}
              value={srchKey}
              onChangeText={term => {
                searchFn(term);
                setSrchKey(term);
              }}
              placeholder={dyKeyWord}
              placeholderTextColor={appColor.placeHolderTextDark}
              style={{
                flex: 1, //BN
                paddingHorizontal: widthResponse ? 10 : 15,
                fontFamily: appFont.rM,
                fontSize: fontScalling(1.6),
                color: appColor.bgBlack, //BN
                textAlignVertical: 'center',
              }}
            />
            <Pressable
              onPress={async () => {
                (await checkPermission())
                  ? startRecognizing()
                  : setPermissionModal(true);
              }}
              style={{
                paddingHorizontal: 10,
                borderLeftWidth: 2,
                // paddingVertical: 5,
                borderLeftColor: appColor.borderColor,
              }}>
              <Icon
                ComponentName={'FontAwesome'}
                name={'microphone'}
                color={appColor.ratingGold}
                size={widthResponse ? 23 : 25}
              />
            </Pressable>
          </View>
          <Animatable.View
            animation={'zoomIn'}
            duration={400}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: appColor.borderColor,
              paddingHorizontal: 3,
              // borderWidth: 1,
              borderRadius: 15,
              marginLeft: 5,
              paddingVertical: 2,
              // backgroundColor: appColor.borderColor,
            }}>
            <Text
              style={{
                color: vegToggle ? appColor.gold : appColor.textGrey,
                fontFamily: appFont.bB,
                fontSize: fontScalling(1.8),
                paddingBottom: 5,
              }}>
              Veg{' '}
              <Text
                style={{
                  color: !vegToggle ? appColor.gold : appColor.textGrey,
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(1.8),
                  paddingBottom: 5,
                }}>
                Mode
              </Text>
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
                paddingHorizontal: 4,
                paddingRight: 8,
                paddingVertical: 6,
                elevation: 0.5,
                borderWidth: 1,
                borderColor: appColor.lightGreyLine,
              }}
            />
          </Animatable.View>
        </View>
        <>
          {termbasedArray && termbasedArray.length > 0 ? (
            <FlatList
              data={
                vegToggle
                  ? termbasedArray.filter(
                      data =>
                        data.hide_status == '1' && data.vegetartin_foods == '1',
                    )
                  : termbasedArray.filter(data => data.hide_status == '1')
              }
              onScrollBeginDrag={() => Keyboard.dismiss()}
              contentContainerStyle={{
                marginHorizontal: 20,
                paddingBottom: widthResponse ? 90 : 130,
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: appColor.lightGreyLine,
                  }}
                />
              )}
              renderItem={({item, index}) => {
                const imageValid =
                  item && item.image && item.image != ''
                    ? item.image != ''
                    : item.main_image && item.main_image != '';

                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      if (item.type == 2) {
                        navigation.navigate('productOverView', {
                          context: 'categories',
                          catId: item.id,
                        });
                      } else if (item.type == 1) {
                        navigation.navigate('productDetail', {
                          productId: item.id,
                        });
                      }
                    }}>
                    <View
                      style={{
                        paddingVertical: widthResponse ? 7 : 16,
                        paddingHorizontal: widthResponse ? 5 : 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {/* img */}
                      {imageValid && (
                        <View
                          style={{
                            width: widthResponse ? 50 : 70,
                            height: widthResponse ? 50 : 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            backgroundColor: appColor.greyBg,
                            overflow: 'hidden',
                          }}>
                          <FastImage
                            source={{
                              priority: FastImage.priority.high,
                              uri:
                                item && item.image && item.image != ''
                                  ? item.image != '' && item.image
                                  : item.main_image &&
                                    item.main_image != '' &&
                                    item.main_image,
                            }}
                            resizeMode="cover"
                            style={{width: '100%', height: '100%'}}
                          />
                        </View>
                      )}
                      <View
                        style={{
                          paddingHorizontal: widthResponse ? 10 : 20,
                          alignSelf: 'flex-start',
                        }}>
                        {/* Name */}
                        {item.name && (
                          <Text
                            style={[
                              styles.baby_blk,
                              {marginBottom: fontScalling(0.5)},
                            ]}>
                            {item.name}
                          </Text>
                        )}
                        {item.cname && item.type == 1 && (
                          <Text
                            style={[
                              styles.roboto_light,
                              {color: appColor.themeYellow},
                            ]}>
                            {item.cname}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
          ) : (
            srchKey.length > 0 && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // backgroundColor: appColor.gold,
                }}>
                <LottieView
                  style={{width: scrnWidth / 2.5, height: scrnHeight / 4}}
                  source={require('../../../assets/lottieFiles/emptyProduct.json')}
                  autoPlay={true}
                  loop={true}
                />
                <Text style={styles.roboto_light}>Product's not found </Text>
              </View>
            )
          )}
        </>
      </SafeAreaView>
      {/* Modal for Voice recoganizing */}
      <VoiceRecordCard
        voiceModal={voiceModal}
        setVoiceModal={setVoiceModal}
        started={started}
        startRecognizing={startRecognizing}
        setStarted={setStarted}
        results={results}
        searchFn={searchFn}
        setSrchKey={setSrchKey}
        isCompleted={isCompleted}
      />
      <RecordModal
        isVisible={permissionModal}
        setPermissionModal={setPermissionModal}
        startRecognizing={startRecognizing}
      />
    </>
  );
};

export default SearchScreen;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.1),
      color: appColor.Textlightblack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
  });

  return {styles};
};
