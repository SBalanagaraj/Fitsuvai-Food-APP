import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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

const SearchScreen = () => {
  const navigation = useNavigation();
  const appColor = appColors();
  const dispatch = useDispatch();
  const {styles} = useStyle();
  const [srchKey, setSrchKey] = useState('');
  const [data, setData] = useState([]);

  const {userSettings, vegToggle} = useSelector(state => state.setting);

  useEffect(() => {
    (() => {
      if (userSettings?.suggestions && !vegToggle) {
        setData([...userSettings?.suggestions]);
      } else if (userSettings?.suggestions && vegToggle) {
        setData([
          ...userSettings?.suggestions.filter(
            data => data.vegetartin_foods == '1',
          ),
        ]);
      }
    })();
  }, [userSettings?.suggestions, vegToggle]);

  // Search fn:
  const searchFn = async term => {
    if (data) {
      let filtered = filter(data, item => {
        const filterProduct =
          item.name.toLowerCase().includes(term.toLowerCase().trimStart()) ||
          (item.offer &&
            item.offer.toLowerCase().includes(term.toLowerCase().trimStart()));

        // print(filterProduct, 'filterProduct');
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
      print(sortedResult, 'sortedResult');
      // setResult(sortedResult.length);
      setData(sortedResult);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: appColor.bgWhite, paddingTop: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          marginHorizontal: 20,
          backgroundColor: appColor.bgWhite,
        }}>
        {/* back Icon */}
        <Pressable
          style={{
            backgroundColor: appColor.greyBack,
            padding: 8,
            borderRadius: 50,
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
              size={widthResponse ? 25 : 30}
              color={appColor.bgWhite}
            />
          </View>
        </Pressable>
        {/* search bar */}
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            marginRight: 5,
            backgroundColor: appColor.greyBg,
            alignSelf: 'stretch',
            borderRadius: 50,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: widthResponse ? 15 : 20,
          }}>
          {/* search icon */}
          <Icon
            ComponentName={'FontAwesome'}
            name={'search'}
            color={appColor.bgBlack}
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
            placeholder="Search Your Favourite Food "
            placeholderTextColor={appColor.placeHolderTextDark}
            style={{
              flex: 1, //BN
              paddingHorizontal: widthResponse ? 10 : 15,
              fontFamily: appFont.rM,
              fontSize: fontScalling(1.7),
              color: appColor.bgBlack, //BN
              textAlignVertical: 'center',
            }}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              color: appColor.bgBlack,
              // paddingBottom: 5,
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
              // paddingHorizontal: 7,
              paddingVertical: 6.5,
              // borderWidth: 1,
            }}
          />
        </View>
      </View>
      <>
        {data.length > 0 ? (
          <FlatList
            data={data.filter(data => data.hide_status == '1')}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            contentContainerStyle={{
              marginHorizontal: 20,
              paddingBottom: widthResponse ? 90 : 130,
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => {
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
                      paddingVertical: widthResponse ? 15 : 20,
                      paddingHorizontal: widthResponse ? 5 : 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderColor: appColor.greyBg,
                    }}>
                    {/* img */}
                    {item.image != '' && (
                      <View
                        style={{
                          width: widthResponse ? 60 : 80,
                          height: widthResponse ? 60 : 80,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: appColor.greyBg,
                          overflow: 'hidden',
                        }}>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          resizeMode="cover"
                          style={{width: '100%', height: '100%'}}
                        />
                      </View>
                    )}
                    <View style={{paddingHorizontal: widthResponse ? 15 : 20}}>
                      {/* Name */}
                      <Text
                        style={[
                          styles.baby_blk,
                          {marginBottom: fontScalling(0.5)},
                        ]}>
                        {item.name}
                      </Text>
                      {item.type == 1 && (
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
  );
};

export default SearchScreen;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.5),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
  });

  return {styles};
};
