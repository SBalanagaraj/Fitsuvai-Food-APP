import {View, StyleSheet, Pressable, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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
import {setBottomTabPress} from '../../redux/SettingSlice';

const Menu = () => {
  const appColor = appColors();
  const navigation = useNavigation();
  const {userSettings, bottomTabPress, vegToggle} = useSelector(
    state => state.setting,
  );
  const scrollRef = useRef(null);
  const [catogaries, setCatogaries] = useState([]);

  const dispatch = useDispatch();

  const MenuCard = ({item, index}) => {
    return (
      <>
        <Animatable.View
          // animation={'zoomIn'}
          duration={400}
          delay={400}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 5,
            borderWidth: 0.2,
            borderRadius: 10,
            flex: 1,
            marginHorizontal: (index + 2) % 3 == 0 && 10,
            position: 'relative',
            // shadowOpacity: 0.2,
            backgroundColor: appColor.white,
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
            <Animatable.Image
              // animation={'fadeInLeft'}
              duration={400}
              delay={400}
              resizeMode="cover"
              style={{
                width: 85,
                height: 85,
                borderRadius: 42.5,
              }}
              source={{uri: item.image}}
            />
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
              }}>
              <Animatable.Text
                animation={'fadeInRight'}
                duration={400}
                delay={400}
                style={{
                  fontFamily: appFont.bR,
                  fontSize: fontScalling(1.7),
                  paddingTop: 10,
                  paddingBottom: 5,
                  color: appColor.bgBlack,
                  flex: 1,
                  letterSpacing: 1,
                }}>
                {item.name}
              </Animatable.Text>
              {item.subcategory && item.subcategory.length > 0 && (
                <Animatable.View
                  animation={'zoomIn'}
                  isInteraction={true}
                  iterationCount={'infinite'}>
                  <Pressable
                    style={{
                      // borderWidth: 1,
                      borderRadius: 15,
                      padding: 1,
                      borderWidth: 0.2,
                    }}
                    onPress={() => {
                      handlePress(item);
                      // toggleSubArr(index);
                    }}>
                    <Icon
                      ComponentName={'Entypo'}
                      name={'chevron-small-right'}
                      color={appColor.bgBlack}
                      size={widthResponse ? 25 : 35}
                    />
                  </Pressable>
                </Animatable.View>
              )}
            </Pressable>
          </Pressable>
        </Animatable.View>
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
    if (vegToggle > 0) {
      setCatogaries(
        userSettings?.categories.filter(data => data.veg_status == 1),
      );
    } else {
      setCatogaries(userSettings?.categories);
    }
  }, [vegToggle]);

  return (
    <>
      <MainCard altStyle={{}}>
        {catogaries && (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              ref={scrollRef}
              numColumns={3}
              scrollEnabled={true}
              data={catogaries}
              keyExtractor={(data, index) => index}
              contentContainerStyle={{
                paddingBottom: 80,
              }}
              renderItem={({item, index}) => {
                return <MenuCard item={item} index={index} />;
              }}
              ItemSeparatorComponent={() => {
                return <View style={{paddingBottom: 10}} />;
              }}
            />
          </>
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
