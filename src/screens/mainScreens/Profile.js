import {StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  print,
  TabReset,
  widthResponse,
} from '../../utilities/helperFunction';
import NavCard from '../../components/Card/NavCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import MainCard from '../../components/Card/MainCard';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setProfileData, setUserType} from '../../redux/authSlice';
import {setBottomTabPress, userSettingApi} from '../../redux/SettingSlice';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {setTitle} from '../../redux/TitleSlice';
import LottieView from 'lottie-react-native';
import {Image} from 'react-native-animatable';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const [termsActive, setTermsActive] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [thisLogout, setThisLogout] = useState(false);
  const [pressIndex, setPressIndex] = useState(-1);
  const [randomNumber, setRandomNumber] = useState(0);
  const dispatch = useDispatch();

  const quotes = [
    'The only bad workout is the one that didn’t happen.',

    'Your body can stand almost anything. It’s your mind that you have to convince.',

    'Eat to fuel your body, not to feed your emotions.',
    'You don’t have to be great to start, but you have to start to be great.',

    'Healthy eating isn’t about dieting; it’s about creating a lifestyle that supports your goals.',

    'Success starts with self-discipline. Make today the day you commit to your fitness journey.',

    'Food is fuel, not therapy.',

    'Fitness is not about being better than someone else; it’s about being better than you used to be.',

    'The greatest wealth is health.',

    'You don’t have to be perfect, just consistent.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      //console.log('15 sec');
      setRandomNumber(preData => {
        if (preData == 0) {
          return quotes.length - 1;
        } else {
          return preData - 1;
        }
      });
    }, 15000);
    return () => interval;
  }, []);

  const scrollRef = useRef(null);
  const {userSettings, userSettingLoad, bottomTabPress} = useSelector(
    state => state.setting,
  );
  const {userType} = useSelector(state => state.auth);
  const member =
    userSettings &&
    userSettings?.userInfo &&
    userSettings?.userInfo.user_type == 'U';

  const showToast = useShowToast();

  // api
  const apiCall = async () => {
    try {
      setThisLogout(true);
      const formData = new FormData();
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      // request data for backend:
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // get the response:
      const response = await fetch(url().logout, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.Status == 'successfully updated') {
          TabReset(navigation, false);
          dispatch(setUserType('guest'));
          dispatch(
            setProfileData({
              userId: '',
              name: '',
              email: '',
              number: '',
              gender: '',
              flatNumber: '',
              pincode: '',
              street: '',
              city: '',
              state: '',
              profile_picture: {
                name: 'profile.jpeg',
                uri: '',
                type: 'image/jpeg',
              },
            }),
          );
          AsyncStorage.clear();

          navigation.navigate('Dashboard', {screen: 'home'});
          showToast('success', 'Logout', resparse.Status, 1200); // dispatch(userSettingApi());
          setModalVisible(false);
          setThisLogout(false);
        }
      } else {
        setThisLogout(false);
        print(response.status, 'status in home screen');
      }
    } catch (e) {
      setThisLogout(false);
      console.log(e, 'error in home screen');
    }
  };

  const onPressTouch = () => {
    dispatch(setBottomTabPress(0));
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    if (bottomTabPress) {
      onPressTouch();
    }
  }, [bottomTabPress]);

  return (
    <MainCard
      altStyle={{
        backgroundColor: appColor.cartBg,
        marginHorizontal: 0,
      }}>
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingBottom: userType == 'user' ? 15 : 10,
          paddingHorizontal: 5,
        }}
        showsVerticalScrollIndicator={false}>
        {/* /---------------- UPPER CARDS -------------/ */}
        {/* Profile Edit Section */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 0.4,
            borderColor: appColor.TextInputborderbg,
            borderRadius: 10,
            elevation: 0.2,
            backgroundColor: appColor.white,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}>
          {/* left container */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Pressable
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 38,
                  padding: 5,
                  borderWidth: 2.5,

                  borderColor: appColor.gold,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={
                  userType == 'guest'
                    ? () => navigation.navigate('login')
                    : () => {
                        navigation.navigate('EditProfile');
                      }
                }>
                {userSettingLoad ? (
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      marginHorizontal: 10,
                      borderWidth: 0.5,
                      borderColor: appColor.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: appColor.white,
                      padding: 10,
                    }}>
                    <LottieView
                      autoPlay={true}
                      style={{width: 150, height: 150, top: 5}}
                      source={require('../../../assets/lottieFiles/load.json')}
                    />
                  </View>
                ) : (
                  <Image
                    style={{
                      width: widthResponse ? 60 : 55, //@@
                      height: widthResponse ? 60 : 55, //@@
                      borderRadius: 32,
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
                        : require('../../../assets/images/profile-user.png')
                    }
                    resizeMode="contain"
                  />
                )}
              </Pressable>
              <View
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 2.5,
                  borderRadius: 5,
                  borderColor: appColor.gold,
                  borderWidth: 1,
                  zIndex: 100,
                  marginTop: -6,
                  backgroundColor: appColor.white,
                }}>
                <Text
                  style={{
                    color: appColor.Textlightblack,
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(1.5),
                  }}>
                  {member ? 'Member' : 'guest user'}
                </Text>
              </View>
            </View>
            {userSettingLoad ? (
              <>
                <SkeletonPlaceholder>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        width: 40,
                        height: 12,
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    />
                    <View
                      style={{
                        width: 20,
                        height: 12,
                        borderRadius: 5,
                        marginTop: 5,
                        marginLeft: 5,
                      }}
                    />
                  </View>
                </SkeletonPlaceholder>
              </>
            ) : (
              <>
                <View
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 12,
                    paddingTop: 5,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.rB,
                      fontSize: fontScalling(2),
                      color: appColor.textBlack,
                    }}>
                    {userSettings &&
                    userSettings?.userInfo &&
                    userSettings?.userInfo?.first_name != ''
                      ? userSettings?.userInfo.first_name
                      : 'Hi ,Guest Users'}
                  </Text>
                  {userSettings &&
                    userSettings?.userInfo &&
                    userSettings?.userInfo.email != '' && (
                      <Text
                        style={{
                          fontFamily: appFont.rM,
                          fontSize: fontScalling(1.7),
                          color: appColor.Textlightblack,
                        }}>
                        {userSettings &&
                          userSettings?.userInfo &&
                          userSettings?.userInfo.email != '' &&
                          userSettings?.userInfo.email}
                      </Text>
                    )}
                  <Animatable.Text
                    animation={'fadeInUp'}
                    duration={1000}
                    isInteraction={true}
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(1.7),
                      color: appColor.gold,
                    }}>
                    {quotes[randomNumber]}
                  </Animatable.Text>
                </View>
              </>
            )}
          </View>
          <Pressable
            onPress={
              userType == 'guest'
                ? () => navigation.navigate('register')
                : () => {
                    navigation.navigate('EditProfile');
                  }
            }
            style={{
              padding: 10,
              borderRadius: 20,
              borderWidth: 0.9,
              borderColor: appColor.borderColor,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 5,
              backgroundColor:
                userType == 'guest' ? appColor.gold : appColor.white,
            }}>
            {userType == 'guest' ? (
              <Text
                style={{
                  color: appColor.white,
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(1.8),
                }}>
                Sign Up
              </Text>
            ) : (
              <Icon
                ComponentName={'FontAwesome6'}
                name={'pen-to-square'}
                color={appColor.gold}
                size={13}
              />
            )}
          </Pressable>
        </View>
        {/* subscription plan card */}
        <Animatable.View
          animation={'slideInRight'}
          duration={1000}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: appColor.borderColor,
            paddingHorizontal: 5,
            paddingRight: 15,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 10,
            backgroundColor: appColor.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Animatable.View animation={'zoomIn'} duration={1000}>
              <LottieView
                resizeMode="cover"
                autoPlay={true}
                style={{width: 60, height: 55}}
                source={require('../../../assets/lottieFiles/chrone.json')}
              />
            </Animatable.View>
            <Text
              style={{
                fontFamily: appFont.rM,
                fontSize: fontScalling(2),
                flex: 1,
                color: appColor.Textlightblack,
              }}>
              Subscription Plan's
            </Text>
            <Pressable
              onPress={() => {
                member &&
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'home'}],
                  });
                member
                  ? navigation.navigate('Dashboard', {
                      screen: 'subscriptionPlanHistory',
                      initial: true,
                    })
                  : navigation.navigate('Dashboard', {
                      screen: 'home',
                      initial: true,
                    });
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[appColor.textGrey, appColor.ratingGold, appColor.gold]}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 5,
                  paddingVertical: 8,
                  borderRadius: 8,
                  paddingLeft: 8,
                  elevation: 2,
                }}>
                <Text
                  style={{
                    fontFamily: appFont.bB,
                    color: appColor.white,
                    fontSize: fontScalling(1.4),
                  }}>
                  {member ? 'View Plan' : 'Get Plan'}
                </Text>
                <Icon
                  ComponentName={'Entypo'}
                  name="chevron-right"
                  size={18}
                  color={appColor.white}
                />
              </LinearGradient>
            </Pressable>
          </View>
        </Animatable.View>
        {/* /---------------------ACCOUNT SETTINGS NAVCARDS ----------/ */}
        <Text style={[styles.SideHeadings]}>Account Settings</Text>
        <View
          style={
            {
              // borderBottomWidth: 1,
            }
          }>
          <NavCard
            cardbg
            deletePage
            onpress={() => {
              userType == 'guest'
                ? navigation.navigate('login')
                : navigation.navigate('WishList');
            }}
            title="My Wishlist"
            icon="AntDesign"
            iconName="hearto"
          />
          <NavCard
            cardbg
            deletePage
            onpress={() => {
              userType == 'guest'
                ? navigation.navigate('login')
                : navigation.navigate('manageAddress', {verify: 'add'});
            }}
            icon="Ionicons"
            iconName="location-outline"
            title="Manage Address"
          />

          <NavCard
            cardbg
            deletePage
            onpress={() => {
              if (userType == 'guest') {
                navigation.navigate('login');
              } else {
                dispatch(userSettingApi());
                setTimeout(() => {
                  navigation.navigate('RewardCoin');
                }, 1500);
              }
            }}
            icon="FontAwesome5"
            iconName="coins"
            title="Reward coins"
          />
          <NavCard
            cardbg
            deletePage
            onpress={() => {
              userType == 'guest'
                ? navigation.navigate('login')
                : navigation.navigate('gen_course');
            }}
            icon="SimpleLineIcons"
            iconName="graduation"
            title="Course"
          />
          <NavCard
            cardbg
            deletePage
            onpress={() => {
              userType == 'guest'
                ? navigation.navigate('login')
                : navigation.navigate('notification', {btn: 2});
            }}
            iconName="android-messages"
            icon="MaterialCommunityIcons"
            title="OTP"
          />

          <NavCard
            cardbg
            deletePage
            onpress={() => {
              navigation.navigate('blog_overview');
            }}
            iconName="modern-mic"
            icon="Entypo"
            title="Blog"
          />
          <NavCard
            cardbg
            deletePage
            onpress={() => {
              navigation.navigate('about_us');
            }}
            icon="MaterialCommunityIcons"
            iconName="information-outline"
            title="About us"
          />
          <NavCard
            cardbg
            deletePage
            onpress={() => {
              navigation.navigate('ContactUs');
            }}
            icon="AntDesign"
            iconName="contacts"
            title="Contact us"
          />
        </View>

        {/* /---------------------MY ACTIVITY CARDS-------------------/ */}
        <Text style={[styles.SideHeadings]}>My Activity</Text>
        <NavCard
          cardbg
          deletePage
          onpress={() => {
            userType == 'guest'
              ? navigation.navigate('login')
              : navigation.navigate('ReviewPage');
          }}
          icon="MaterialCommunityIcons"
          iconName="star-box-outline"
          title="My Review"
        />

        {/* /--------------------- Employee Login CARDS-------------------/ */}
        <Text
          style={[
            styles.SideHeadings,
            {
              borderTopColor: appColor.borderColor,
              textTransform: 'uppercase',
            },
          ]}>
          Employee
        </Text>
        <NavCard
          cardbg
          deletePage
          onpress={() => {
            dispatch(setTitle('Employee login'));
            navigation.navigate('chefLogin', {url: url().admin});
          }}
          icon="MaterialCommunityIcons"
          iconName="chef-hat"
          title="Employee login"
        />
        <View
          style={{
            paddingTop: 5,
            borderColor: appColor.borderColor,
          }}
        />
        {/* /---------------------TERMS AND CONDITION & PRIVACY POLICY-------------------/ */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 5,
            width: '100%',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
          {userSettings && userSettings?.links ? (
            Object.keys(userSettings?.links).map((data, index) => {
              const ifUserHover = index == pressIndex;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    // width: '48%',
                    alignItems: 'center',
                    // paddingTop: 5,
                  }}>
                  <Pressable
                    style={{}}
                    onPressIn={() => {
                      setPressIndex(index);
                      if (ifUserHover) {
                        setTermsActive(true);
                      }
                    }}
                    onPressOut={() => {
                      setPressIndex(-1);
                      if (ifUserHover) {
                        setTermsActive(false);
                      }
                    }}
                    onPress={() => {
                      dispatch(setTitle(data));
                      navigation.navigate('chefLogin', {
                        url: userSettings?.links[data],
                      });
                      // Linking.openURL(userSettings?.links[data]);
                    }}>
                    <Text
                      style={[
                        styles.policy,
                        {
                          color: ifUserHover
                            ? appColor.themeYellow
                            : appColor.black,
                          marginRight: 10,
                          textAlignVertical: 'center',
                          // textAlign: 'center',
                        },
                      ]}>
                      {data}
                    </Text>
                  </Pressable>
                </View>
              );
            })
          ) : (
            <Pressable
              onPressIn={() => {
                setTermsActive(true);
              }}
              onPressOut={() => {
                setTermsActive(false);
              }}>
              <Text
                style={[
                  styles.policy,
                  {
                    color: termsActive ? appColor.themeYellow : appColor.black,
                  },
                ]}>
                terms & conditions
              </Text>
            </Pressable>
          )}
        </View>

        {/* /---------------------BUTTONS-------------------/ */}

        {userType !== 'guest' && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: widthResponse ? 10 : 15,
            }}>
            <PrimaryButton
              Title="DELETE ACCOUNT"
              black
              parentStyle={{flex: 1}}
              textStyle={{fontSize: fontScalling(1.8)}}
              altStyle={{marginRight: 10, fontSize: fontScalling(1.2)}}
              onPress={() => {
                navigation.navigate('deleteScreen1');
              }}
            />
            <PrimaryButton
              Title="LOGOUT"
              profile
              textStyle={{fontSize: fontScalling(1.8)}}
              parentStyle={{flex: 1}}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>
        )}

        {/* /---------------------LOGOUT BOTTOM SHEET-------------------/ */}

        <View style={{height: 70}}></View>
        <ModalBottomSheet
          snapPoints={['10%', '20%']}
          isVisible={isModalVisible}
          close={() => {
            setModalVisible(false);
          }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 15,
              paddingVertical: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: appColor.cardbg,
                padding: 10,
                borderRadius: 10,
                elevation: 1,
                shadowOffset: {height: 1},
                shadowOpacity: 0.4,
                shadowRadius: 1,
              }}
              onPress={() => {
                !thisLogout && apiCall();
              }}>
              <Text
                style={[
                  styles.btmText,
                  {
                    // marginBottom: 20,
                    color: thisLogout
                      ? appColor.themeYellow
                      : appColor.textBlack,
                  },
                ]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ModalBottomSheet>
      </ScrollView>
    </MainCard>
  );
};

export default Profile;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    proName: {
      color: appColor.black,
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      paddingBottom: 5,
    },
    SideHeadings: {
      color: appColor.Textlightblack,
      fontSize: fontScalling(2.4),
      fontFamily: appFont.bB,
      marginVertical: 10,
      textDecorationLine: 'underline',
      letterSpacing: 1,
    },
    policy: {
      color: appColor.black,
      fontFamily: appFont.bB,
      fontSize: fontScalling(2),
      paddingBottom: 5,
      textTransform: 'uppercase',
    },
    btmText: {
      fontSize: fontScalling(2.2),
      color: appColor.textBlack,
      fontFamily: appFont.rM,
      textAlign: 'center',
    },
  });

  return {styles};
};
