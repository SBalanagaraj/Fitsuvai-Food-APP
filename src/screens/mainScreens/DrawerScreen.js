import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
import {useSelector} from 'react-redux';
import DrawerScreenRight from './DrawerScreenRight';
import {useDrawerStatus} from '@react-navigation/drawer';
import * as Animatable from 'react-native-animatable';

const DrawerScreen = () => {
  const appColor = appColors();
  const navigation = useNavigation();
  const {styles} = useStyle();
  const {position, userSettings} = useSelector(state => state.setting);
  const {userType} = useSelector(state => state.auth);
  const isDrawer = useDrawerStatus();

  const [categories, setCategories] = useState(false);
  const [toggleSubCat1, setToggleSubCat1] = useState([]);
  const [toggleSubCat2, setToggleSubCat2] = useState([]);
  const [toggleSubCat3, setToggleSubCat3] = useState([]);

  const toggleSubArr = ind => {
    if (toggleSubCat1.includes(ind)) {
      setToggleSubCat1(toggleSubCat1.filter(i => i !== ind));
    } else {
      setToggleSubCat1([...toggleSubCat1, ind]);
    }
  };

  const toggleSubArr2 = ind => {
    if (toggleSubCat2.includes(ind)) {
      setToggleSubCat2(toggleSubCat2.filter(i => i !== ind));
    } else {
      setToggleSubCat2([...toggleSubCat2, ind]);
    }
  };

  const toggleSubArr3 = ind => {
    if (toggleSubCat3.includes(ind)) {
      setToggleSubCat3(toggleSubCat2.filter(i => i !== ind));
    } else {
      setToggleSubCat3([...toggleSubCat2, ind]);
    }
  };

  // When drawer close to category accordion close:
  useEffect(() => {
    if (isDrawer == 'closed') {
      setCategories(false);
    }
  }, [isDrawer]);

  const MenuCard = ({item, index}) => {
    return (
      <>
        <Animatable.View
          animation={'zoomIn'}
          duration={400}
          delay={400}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 5,
            borderWidth: 0.2,
            borderRadius: 10,
            flex: 1,
            marginRight: !index % 3 == 0 && 10,
            marginLeft: index == 1 && 10,
          }}>
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 5,
              overflow: 'hidden',
            }}
            onPress={() => {
              navigation.navigate('productOverView', {
                context: 'categories',
                catId: item.id,
              });
            }}>
            <Animatable.Image
              animation={'fadeInLeft'}
              duration={400}
              delay={400}
              resizeMode="contain"
              style={{
                width: 85,
                height: 85,
                borderRadius: 42.5,
                borderWidth: 3,
              }}
              source={{uri: item.image}}
            />
            <View
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
                <Pressable
                  style={{
                    // borderWidth: 1,
                    borderRadius: 5,
                    padding: 5,
                  }}
                  onPress={() => {
                    toggleSubArr(index);
                  }}>
                  <Icon
                    ComponentName={'Entypo'}
                    name={
                      toggleSubCat1.includes(index)
                        ? 'chevron-small-up'
                        : 'chevron-small-down'
                    }
                    color={appColor.bgBlack}
                    size={widthResponse ? 25 : 35}
                  />
                </Pressable>
              )}
            </View>
          </Pressable>
        </Animatable.View>
      </>
    );
  };

  // print(userSettings?.categories, 'subcatogary');

  return (
    <>
      {position == 'center' ? (
        <>
          <View>
            <View style={styles.ScrContainer}>
              <Image
                source={require('../../../assets/images/splash_logo.png')}
                resizeMode="contain"
                style={{
                  width: widthResponse ? 70 : 90,
                  height: widthResponse ? 70 : 90,
                }}
              />
            </View>
            <Pressable
              style={{
                alignItems: 'center',
                marginVertical: 8,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.text,
                  {fontFamily: appFont.bB, fontSize: fontScalling(3)},
                ]}>
                Menu
              </Text>
            </Pressable>

            {userSettings?.categories && (
              <FlatList
                numColumns={3}
                // scrollEnabled={false}
                data={userSettings?.categories}
                keyExtractor={(data, index) => index}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingBottom: 230,
                }}
                renderItem={({item, index}) => {
                  return <MenuCard item={item} index={index} />;
                }}
                ItemSeparatorComponent={() => {
                  return <View style={{paddingBottom: 10}} />;
                }}
              />
            )}
          </View>
        </>
      ) : position == 'right' ? (
        <DrawerScreenRight />
      ) : (
        <>
          <View style={styles.ScrContainer}>
            <Image
              source={require('../../../assets/images/splash_logo.png')}
              resizeMode="contain"
              style={{
                width: widthResponse ? 70 : 90,
                height: widthResponse ? 70 : 90,
              }}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{borderWidth: 1}}>
            {/* Categories */}
            <View
              style={{
                paddingHorizontal: widthResponse ? 20 : 25,
                paddingVertical: widthResponse ? 15 : 20,
                // borderBottomWidth: 1,
                borderColor: appColor.lightGreyLine,
              }}>
              <Pressable
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setCategories(!categories);
                }}>
                <Icon
                  name={'appstore-o'}
                  ComponentName={'AntDesign'}
                  color={appColor.bgBlack}
                  size={widthResponse ? 25 : 35}
                />
                <Text style={[styles.text]}>Menu</Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  <Icon
                    ComponentName={'Entypo'}
                    name={
                      categories ? 'chevron-small-up' : 'chevron-small-down'
                    }
                    color={appColor.bgBlack}
                    size={widthResponse ? 40 : 50}
                  />
                </View>
              </Pressable>
              {userSettings?.categories && (
                <View>
                  {/* traditional */}

                  {userSettings?.categories && (
                    <FlatList
                      scrollEnabled={false}
                      data={userSettings?.categories}
                      keyExtractor={(data, index) => index}
                      renderItem={({item, index}) => {
                        return (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingVertical: 5,
                              }}>
                              <Pressable
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  paddingVertical: 5,
                                }}
                                onPress={() => {
                                  navigation.navigate('productOverView', {
                                    context: 'categories',
                                    catId: item.id,
                                  });
                                }}>
                                <Image
                                  resizeMode="cover"
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 10,
                                  }}
                                  source={{uri: item.image}}
                                />
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginRight: 10,
                                    width: scrnWidth - 150,
                                  }}>
                                  <Text
                                    style={[
                                      styles.categoryText,
                                      {paddingLeft: 10},
                                    ]}>
                                    {item.name}
                                  </Text>
                                  {item.subcategory &&
                                    item.subcategory.length > 0 && (
                                      <Pressable
                                        style={{
                                          // borderWidth: 1,
                                          borderRadius: 5,
                                          padding: 5,
                                        }}
                                        onPress={() => {
                                          toggleSubArr(index);
                                        }}>
                                        <Icon
                                          ComponentName={'Entypo'}
                                          name={
                                            toggleSubCat1.includes(index)
                                              ? 'chevron-small-up'
                                              : 'chevron-small-down'
                                          }
                                          color={appColor.bgBlack}
                                          size={widthResponse ? 25 : 35}
                                        />
                                      </Pressable>
                                    )}
                                </View>
                              </Pressable>
                            </View>
                            {/* 1st sub catogary */}
                            {toggleSubCat1.includes(index) &&
                              item.subcategory &&
                              item.subcategory.length > 0 && (
                                <View
                                  style={{
                                    backgroundColor: appColor.greyBg,
                                    borderRadius: 10,
                                    paddingHorizontal: 10,
                                  }}>
                                  <FlatList
                                    data={item.subcategory}
                                    keyExtractor={(data, index) => index}
                                    ItemSeparatorComponent={() => {
                                      return (
                                        <View
                                          style={{borderBottomWidth: 0.5}}
                                        />
                                      );
                                    }}
                                    renderItem={({item, index}) => {
                                      return (
                                        <>
                                          <Pressable
                                            style={{
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              justifyContent: 'flex-start',
                                              paddingVertical: 5,
                                            }}
                                            onPress={() => {
                                              navigation.navigate(
                                                'productOverView',
                                                {
                                                  context: 'categories',
                                                  catId: item.id,
                                                },
                                              );
                                            }}>
                                            <Image
                                              resizeMode="contain"
                                              style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 10,
                                              }}
                                              source={{uri: item.image}}
                                            />
                                            <View
                                              style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: scrnWidth - 160,
                                                marginRight: 10,
                                              }}
                                              onPress={() => {}}>
                                              <Text
                                                style={[
                                                  styles.categoryText,
                                                  {paddingLeft: 10},
                                                ]}>
                                                {item.name}
                                              </Text>
                                              {item.subcategory &&
                                                item.subcategory.length > 0 && (
                                                  <>
                                                    <Pressable
                                                      style={{
                                                        // borderWidth: 1,
                                                        borderRadius: 5,
                                                        padding: 5,
                                                      }}
                                                      onPress={() => {
                                                        toggleSubArr2(index);
                                                      }}>
                                                      <Icon
                                                        ComponentName={'Entypo'}
                                                        name={
                                                          toggleSubCat2.includes(
                                                            index,
                                                          )
                                                            ? 'chevron-small-up'
                                                            : 'chevron-small-down'
                                                        }
                                                        color={appColor.bgBlack}
                                                        size={
                                                          widthResponse
                                                            ? 25
                                                            : 35
                                                        }
                                                      />
                                                    </Pressable>
                                                  </>
                                                )}
                                            </View>
                                          </Pressable>
                                          {/* 2nd subcatagory */}
                                          {toggleSubCat2.includes(index) &&
                                            item.subcategory &&
                                            item.subcategory.length > 0 && (
                                              <View
                                                style={{
                                                  backgroundColor:
                                                    appColor.white,
                                                  borderRadius: 10,
                                                  paddingHorizontal: 10,
                                                  marginBottom: 10,
                                                }}>
                                                <FlatList
                                                  data={item.subcategory}
                                                  keyExtractor={(data, index) =>
                                                    index
                                                  }
                                                  ItemSeparatorComponent={() => {
                                                    return (
                                                      <View
                                                        style={{
                                                          borderBottomWidth: 0.5,
                                                        }}
                                                      />
                                                    );
                                                  }}
                                                  renderItem={({
                                                    item,
                                                    index,
                                                  }) => {
                                                    return (
                                                      <>
                                                        <Pressable
                                                          style={{
                                                            flexDirection:
                                                              'row',
                                                            alignItems:
                                                              'center',
                                                            justifyContent:
                                                              'flex-start',
                                                            paddingVertical: 5,
                                                          }}
                                                          onPress={() => {
                                                            navigation.navigate(
                                                              'productOverView',
                                                              {
                                                                context:
                                                                  'categories',
                                                                catId: item.id,
                                                              },
                                                            );
                                                          }}>
                                                          <Image
                                                            resizeMode="contain"
                                                            style={{
                                                              width: 30,
                                                              height: 30,
                                                              borderRadius: 10,
                                                            }}
                                                            source={{
                                                              uri: item.image,
                                                            }}
                                                          />
                                                          <View
                                                            style={{
                                                              flexDirection:
                                                                'row',
                                                              alignItems:
                                                                'center',
                                                              justifyContent:
                                                                'space-between',
                                                              width:
                                                                scrnWidth - 180,
                                                              marginRight: 10,
                                                            }}
                                                            onPress={() => {}}>
                                                            <Text
                                                              style={[
                                                                styles.categoryText,
                                                                {
                                                                  paddingLeft: 10,
                                                                },
                                                              ]}>
                                                              {item.name}
                                                            </Text>
                                                            {item.subcategory &&
                                                              item.subcategory
                                                                .length > 0 && (
                                                                <>
                                                                  <Pressable
                                                                    style={{
                                                                      // borderWidth: 1,
                                                                      borderRadius: 5,
                                                                      padding: 5,
                                                                    }}
                                                                    onPress={() => {
                                                                      toggleSubArr3(
                                                                        index,
                                                                      );
                                                                    }}>
                                                                    <Icon
                                                                      ComponentName={
                                                                        'Entypo'
                                                                      }
                                                                      name={
                                                                        toggleSubCat3.includes(
                                                                          index,
                                                                        )
                                                                          ? 'chevron-small-up'
                                                                          : 'chevron-small-down'
                                                                      }
                                                                      color={
                                                                        appColor.bgBlack
                                                                      }
                                                                      size={
                                                                        widthResponse
                                                                          ? 25
                                                                          : 35
                                                                      }
                                                                    />
                                                                  </Pressable>
                                                                </>
                                                              )}
                                                          </View>
                                                        </Pressable>
                                                        {toggleSubCat3.includes(
                                                          index,
                                                        ) &&
                                                          item.subcategory &&
                                                          item.subcategory
                                                            .length > 0 && (
                                                            <View
                                                              style={{
                                                                backgroundColor:
                                                                  appColor.greyBg,
                                                                borderRadius: 10,
                                                                paddingHorizontal: 10,
                                                                marginBottom: 10,
                                                              }}>
                                                              <FlatList
                                                                data={
                                                                  item.subcategory
                                                                }
                                                                keyExtractor={(
                                                                  data,
                                                                  index,
                                                                ) => index}
                                                                ItemSeparatorComponent={() => {
                                                                  return (
                                                                    <View
                                                                      style={{
                                                                        borderBottomWidth: 0.5,
                                                                      }}
                                                                    />
                                                                  );
                                                                }}
                                                                renderItem={({
                                                                  item,
                                                                  index,
                                                                }) => {
                                                                  return (
                                                                    <>
                                                                      <Pressable
                                                                        style={{
                                                                          flexDirection:
                                                                            'row',
                                                                          alignItems:
                                                                            'center',
                                                                          justifyContent:
                                                                            'flex-start',
                                                                          paddingVertical: 5,
                                                                        }}
                                                                        onPress={() => {
                                                                          navigation.navigate(
                                                                            'productOverView',
                                                                            {
                                                                              context:
                                                                                'categories',
                                                                              catId:
                                                                                item.id,
                                                                            },
                                                                          );
                                                                        }}>
                                                                        <Image
                                                                          resizeMode="contain"
                                                                          style={{
                                                                            width: 30,
                                                                            height: 30,
                                                                            borderRadius: 10,
                                                                          }}
                                                                          source={{
                                                                            uri: item.image,
                                                                          }}
                                                                        />
                                                                        <View
                                                                          style={{
                                                                            flexDirection:
                                                                              'row',
                                                                            alignItems:
                                                                              'center',
                                                                            justifyContent:
                                                                              'space-between',
                                                                            width:
                                                                              scrnWidth -
                                                                              160,
                                                                            marginRight: 10,
                                                                          }}
                                                                          onPress={() => {}}>
                                                                          <Text
                                                                            style={[
                                                                              styles.categoryText,
                                                                              {
                                                                                paddingLeft: 10,
                                                                              },
                                                                            ]}>
                                                                            {
                                                                              item.name
                                                                            }
                                                                          </Text>
                                                                          {item.subcategory &&
                                                                            item
                                                                              .subcategory
                                                                              .length >
                                                                              0 && (
                                                                              <>
                                                                                <Pressable>
                                                                                  <Icon
                                                                                    ComponentName={
                                                                                      'Entypo'
                                                                                    }
                                                                                    name={
                                                                                      categories
                                                                                        ? 'chevron-small-up'
                                                                                        : 'chevron-small-down'
                                                                                    }
                                                                                    color={
                                                                                      appColor.bgBlack
                                                                                    }
                                                                                    size={
                                                                                      widthResponse
                                                                                        ? 25
                                                                                        : 35
                                                                                    }
                                                                                  />
                                                                                </Pressable>
                                                                              </>
                                                                            )}
                                                                        </View>
                                                                      </Pressable>
                                                                    </>
                                                                  );
                                                                }}
                                                              />
                                                            </View>
                                                          )}
                                                      </>
                                                    );
                                                  }}
                                                />
                                              </View>
                                            )}
                                        </>
                                      );
                                    }}
                                  />
                                </View>
                              )}
                          </>
                        );
                      }}
                    />
                  )}
                </View>
              )}
            </View>
            {/* Oil products */}
            {userSettings &&
              userSettings?.oilProducts &&
              userSettings?.oilProducts.length > 0 &&
              userSettings?.oilProducts[0]?.id && (
                <Pressable
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate('productOverView', {
                      context: 'categories',
                      catId: userSettings?.oilProducts[0]?.id,
                    });
                  }}>
                  <Icon
                    name={'drop'}
                    ComponentName={'SimpleLineIcons'}
                    color={appColor.bgBlack}
                    size={widthResponse ? 25 : 35}
                  />
                  <Text style={[styles.text]}>Oil Products</Text>
                </Pressable>
              )}
          </ScrollView>
        </>
      )}
    </>
  );
};

export default DrawerScreen;

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
