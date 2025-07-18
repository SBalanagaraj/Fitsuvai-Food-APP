import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
// file import:
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import {useDispatch, useSelector} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import MainCard from '../../components/Card/MainCard';
import {setTitle} from '../../redux/TitleSlice';
import {setBottomTabPress, userSettingApi} from '../../redux/SettingSlice';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import ImageView from '../../components/Card/ImageView';
import {MenuShimmer} from '../../utilities/appShimmer';
import {SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Menu = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const navigation = useNavigation();
  const {userSettings, bottomTabPress, vegToggle, userSettingLoad} =
    useSelector(state => state.setting);

  const scrollRef = useRef(null);
  const [catogaries, setCatogaries] = useState([]);
  const [toggleSwitch, setToggleSwitch] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();

  const separator = widthResponse ? 10 : 15;
  const container = 40;
  const column = widthResponse ? 3 : 4;
  const cardContainer = 45;

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      dispatch(userSettingApi());
      setRefresh(false);
    }
  }, [refresh]);

  const MenuCard = ({item, index}) => {
    // print(item, 'item');
    return (
      <>
        {
          <Animatable.View
            // animation={'zoomIn'}

            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 0.5,
              borderWidth: 1,
              borderColor: appColor.borderColor,
              borderRadius: 10,
              width:
                (scrnWidth - container - (column - 1) * separator) / column,
              marginRight: (index + 1) % column && separator,
              position: 'relative',
              backgroundColor: appColor.white,
              shadowOffset: {height: 1},
              shadowOpacity: 0.2,
              shadowRadius: 1,
              padding: widthResponse ? 1.5 : 2,
            }}>
            <Pressable
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 5,
                overflow: 'hidden',
                elevation: 1,
              }}
              onPress={() => {
                navigation.navigate('productOverView', {
                  context: 'categories',
                  catId: item.id,
                });
              }}>
              {/* <FastImage
              resizeMode="cover"
              style={{
                width: 80,
                height: 80,
                borderRadius: 42.5,
              }}
              source={{uri: item.image, priority: FastImage.priority.high}}
            /> */}
              <ImageView image={item.image} />
              <Pressable
                onPress={
                  item.subcategory && item.subcategory.length > 0
                    ? () => {
                        handlePress(item);
                      }
                    : () => {
                        navigation.navigate('productOverView', {
                          context: 'categories',
                          catId: item.id,
                        });
                      }
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                  marginBottom: widthResponse ? 5 : 10,
                }}>
                {item.name && item.name != '' && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: appFont.bR,
                      fontSize: fontScalling(1.7),
                      paddingTop: 10,
                      paddingBottom: 5,
                      color: appColor.Textlightblack,
                      flex: 1,
                      letterSpacing: 1,
                    }}>
                    {item.name}
                  </Text>
                )}
                {item.subcategory && item.subcategory.length > 0 && (
                  <Pressable
                    style={{
                      borderRadius: 100,
                      padding: 1,
                      borderWidth: widthResponse ? 0.7 : 1,
                      borderColor: appColor.borderColor,
                    }}
                    onPress={() => {
                      handlePress(item);
                      // toggleSubArr(index);
                    }}>
                    <Animatable.View
                      animation={'zoomIn'}
                      isInteraction={true}
                      iterationCount={'infinite'}>
                      <Icon
                        ComponentName={'Entypo'}
                        name={'chevron-small-right'}
                        color={appColor.bgBlack}
                        size={widthResponse ? 20 : 30}
                      />
                    </Animatable.View>
                  </Pressable>
                )}
              </Pressable>
            </Pressable>
          </Animatable.View>
        }
      </>
    );
  };

  const handlePress = item => {
    if (item.subcategory?.length > 0) {
      // Navigate to SubcategoryScreen with current subcategory data
      dispatch(setTitle(item.name));
      navigation.navigate('Subcategory', {subcategories: item.subcategory});
    } else {
      alert('No further subcategories available');
    }
  };

  const onPressTouch = () => {
    dispatch(setBottomTabPress(0));
    scrollRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  useEffect(() => {
    if (bottomTabPress) {
      onPressTouch();
    }
  }, [bottomTabPress]);

  useEffect(() => {
    // Filter empty product catogary $
    const validCatogary =
      userSettings &&
      userSettings?.categories &&
      userSettings?.categories.length > 0
        ? userSettings?.categories.filter(data =>
            userSettings?.suggestions.some(
              product => product.cname == data.name,
            ),
          )
        : [];

    if (
      vegToggle > 0 &&
      userSettings &&
      userSettings?.categories &&
      userSettings?.categories.length > 0
    ) {
      setCatogaries(validCatogary?.filter(data => data.veg_status == 1));
    } else {
      setCatogaries(validCatogary);
    }
  }, [vegToggle, userSettings]);
  const MenuComponent = ({catogaries}) => {
    return catogaries && catogaries.length > 0 ? (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          ref={scrollRef}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={[appColor.themeYellow]}
              tintColor={appColor.themeYellow}
            />
          }
          numColumns={column}
          scrollEnabled={true}
          data={catogaries}
          keyExtractor={(data, index) => index}
          contentContainerStyle={{
            //   paddingHorizontal: 10,
            paddingBottom: widthResponse ? 90 : 150,
          }}
          renderItem={({item, index}) => {
            //   print(item, 'item');
            return <MenuCard item={item} index={index} />;
          }}
          ItemSeparatorComponent={() => {
            return <View style={{paddingBottom: separator}} />;
          }}
        />
      </>
    ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}
            colors={[appColor.themeYellow]}
            tintColor={appColor.themeYellow}
          />
        }
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: widthResponse ? 90 : 140,
        }}>
        <Text style={[styles.baby_blk]}>Menu Empty</Text>
      </ScrollView>
    );
  };

  const LinearButton = ({name}) => {
    return (
      <LinearGradient
        start={{x: 0.1, y: 0.3}}
        end={{x: 0.5, y: 1}}
        // locations={[0.15, 0.5, 0.75, 1]}
        locations={[0, 0.5, 1]}
        useAngle={true}
        angle={90}
        colors={
          (name == 'General' ? toggleSwitch == 0 : toggleSwitch == 1)
            ? [appColor.gold, appColor.white, appColor.gold]
            : [appColor.cardbg, appColor.textBlack, appColor.cardbg]
        }
        onTouchStart={() => setToggleSwitch(name == 'General' ? 0 : 1)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 10,
          marginRight: name == 'General' ? 10 : 0,
          borderWidth: 1,
          borderColor: appColor.greyBg,
          opacity: 0.85,
        }}>
        <Text
          style={{
            fontFamily: appFont.bB,
            letterSpacing: 1.5,
            color: (name == 'General' ? toggleSwitch == 0 : toggleSwitch == 1)
              ? appColor.boldBlacktext
              : appColor.white,
            fontSize: fontScalling(1.9),
          }}>
          {name}
        </Text>
      </LinearGradient>
    );
  };
  const Rotate = {
    0: {
      transform: [{rotate: '0deg'}],
    },
    1: {
      transform: [{rotate: '360deg'}],
    },
  };

  return (
    <>
      <MainCard altStyle={{paddingTop: 30}} cartBg>
        <View
          style={{
            shadowOpacity: 1,
            shadowOffset: {height: 0},
            shadowColor: appColor.themeYellowDark,
            shadowRadius: 6,
          }}>
          <View
            style={{
              marginBottom: 10,
              marginTop: -25,
              elevation: 50,
              overflow: 'hidden',
              shadowColor: appColor.Textlightblack,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: appColor.sliderGreyBg,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                padding: 5,
              }}>
              <LinearButton name={'General'} />
              <LinearButton name={'Others'} />
            </View>
            <Animatable.View
              animation={Rotate}
              easing={'linear'}
              duration={4000}
              iterationCount={'infinite'}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: -1,
              }}>
              <LinearGradient
                start={{x: 0.1, y: 0.3}}
                end={{x: 0.5, y: 1}}
                locations={[0.4, 0.5, 0.6]}
                useAngle={true}
                angle={90}
                style={{width: '100%', aspectRatio: 1}}
                colors={[
                  appColor.ratingGold,
                  'transparent',
                  appColor.Textlightblack,
                ]}
              />
            </Animatable.View>
          </View>
        </View>
        {userSettingLoad ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <MenuShimmer />
          </ScrollView>
        ) : (
          <MenuComponent
            catogaries={
              toggleSwitch == 0 ? catogaries : userSettings?.otherProducts
            }
          />
        )}
      </MainCard>
    </>
  );
};

export default Menu;

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    ScrContainer: {
      height: widthResponse ? 100 : 150,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appColor.bgBlack,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomWidth: 5,
      borderColor: appColor.themeYellow,
    },
    card: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: widthResponse ? 20 : 25,
      paddingVertical: widthResponse ? 15 : 20,
      borderBottomWidth: 1,
      borderColor: appColor.lightGreyLine,
    },
    text: {
      marginLeft: 15,
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.8),
      color: appColor.textBlack,
    },
    categoryText: {
      fontFamily: appFont.rR,
      width: scrnWidth - 230,
      // marginTop: widthResponse ? 15 : 20,
      fontSize: fontScalling(1.8),
      color: appColor.textBlack,
    },
  });
  return {styles};
};
