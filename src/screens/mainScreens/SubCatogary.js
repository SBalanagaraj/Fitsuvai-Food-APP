import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, FlatList, Text} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import MainCard from '../../components/Card/MainCard';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../redux/TitleSlice';
import LinearGradient from 'react-native-linear-gradient';
import ImageView from '../../components/Card/ImageView';

const SubcategoryScreen = ({route, navigation}) => {
  const {subcategories} = route.params;
  const dispatch = useDispatch();
  const appColor = appColors();

  const [angleRef, setAngleRef] = useState(5);

  const separator = widthResponse ? 10 : 15;
  const container = 40;
  const column = widthResponse ? 3 : 4;
  const cardContainer = 45;

  useEffect(() => {
    const updateAngle = setInterval(() => {
      setAngleRef(preData => {
        const angle = preData * 2;
        return angle >= 360 ? 5 : angle;
      });
    }, 1000);
    return () => clearInterval(updateAngle);
  }, []);

  const handlePress = subcategory => {
    if (subcategory.subcategory?.length > 0) {
      // Navigate to the same screen with the next level of subcategories
      dispatch(setTitle(subcategory.name));
      navigation.push('Subcategory', {subcategories: subcategory.subcategory});
    } else {
      alert('No further subcategories available');
    }
  };

  const MenuCard = ({item, index}) => {
    return (
      <>
        {angleRef && (
          <LinearGradient
            start={{x: 0.1, y: 0.3}}
            end={{x: 0.5, y: 1}}
            locations={[0.25, 0.5, 0.75, 1]}
            useAngle={true}
            angle={angleRef}
            colors={['#E8CBC0', 'transparent', '#636FA4', '#00c3ff']}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: appColor.borderColor,
              borderRadius: 10,
              width:
                (scrnWidth - container - (column - 1) * separator) / column,
              marginRight: (index + 1) % column && separator,
              position: 'relative',
              backgroundColor: appColor.white,
              paddingVertical: 0.8,
              // zIndex: -2,
            }}>
            <Animatable.View
              // animation={'zoomIn'}
              duration={400}
              delay={400}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 0.5,

                borderRadius: 10,
                width:
                  (scrnWidth - cardContainer - (column - 1) * separator) /
                  column,
                // marginRight: (index + 1) % column && separator,
                position: 'relative',
                backgroundColor: appColor.white,
                elevation: 5,
                shadowColor: appColor.bgBlack,
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
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: appFont.bR,
                      fontSize: fontScalling(1.7),
                      paddingTop: 10,
                      paddingBottom: 5,
                      color: appColor.bgBlack,
                      flex: 1,
                      letterSpacing: 1,
                    }}>
                    {`${item.name}`}
                  </Text>
                  {item.subcategory && item.subcategory.length > 0 && (
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
                      <Animatable.View
                        animation={'zoomIn'}
                        isInteraction={true}
                        iterationCount={'infinite'}>
                        <Icon
                          ComponentName={'Entypo'}
                          name={'chevron-small-right'}
                          color={appColor.bgBlack}
                          size={widthResponse ? 20 : 32} //$
                        />
                      </Animatable.View>
                    </Pressable>
                  )}
                </Pressable>
              </Pressable>
            </Animatable.View>
          </LinearGradient>
        )}
      </>
    );
  };

  return (
    <>
      {/* <AppHeaders title={'Menu'} /> */}
      <MainCard altStyle={{}}>
        {subcategories && subcategories.length > 0 && (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={3}
              scrollEnabled={true}
              data={subcategories}
              keyExtractor={(data, index) => index}
              contentContainerStyle={{
                //   paddingHorizontal: 10,
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

export default SubcategoryScreen;
