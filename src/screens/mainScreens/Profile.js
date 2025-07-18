import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  print,
  TabReset,
  widthResponse,
} from '../../utilities/helperFunction';
import {MenuCard} from '../../components/Card/MenuCard';
import NavCard from '../../components/Card/NavCard';
import {Spacer} from '../../utilities/spacer';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import MainCard from '../../components/Card/MainCard';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setProfileData, setUserType} from '../../redux/authSlice';
import {setBottomTabPress, userSettingApi} from '../../redux/SettingSlice';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {StackActions} from '@react-navigation/native';
import {setTitle} from '../../redux/TitleSlice';

const Profile = ({navigation}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const [termsActive, setTermsActive] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [thisLogout, setThisLogout] = useState(false);
  const [pressIndex, setPressIndex] = useState('');
  const dispatch = useDispatch();

  const scrollRef = useRef(null);

  const {userSettings, bottomTabPress} = useSelector(state => state.setting);
  const {userType} = useSelector(state => state.auth);

  const showToast = useShowToast();

  // api
  const apiCall = async () => {
    try {
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
          console.log('its work--');
          TabReset(navigation, false);
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
          dispatch(setUserType('guest'));
          navigation.navigate('Dashboard', {screen: 'home'});
          showToast('success', 'Logout', resparse.Status, 1200); // dispatch(userSettingApi());
          setModalVisible(false);
        }
      } else {
        print(response.status, 'status in home screen');
      }
    } catch (e) {
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
    <MainCard>
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        {/* /---------------- PROFILE NAME -------------/ */}

        <View style={{paddingTop: widthResponse ? 7 : 15}}>
          <Text style={[styles.proName, {fontSize: 25, textAlign: 'center'}]}>
            Hi{' '}
            <Text style={{color: appColor.themeYellow, paddingLeft: 10}}>
              {userType == 'guest'
                ? 'Guest Users'
                : userSettings &&
                  userSettings?.userInfo &&
                  userSettings?.userInfo?.first_name
                ? userSettings?.userInfo?.first_name
                : ' ######'}
            </Text>
          </Text>
        </View>

        {/* /---------------- UPPER CARDS -------------/ */}

        <View style={{paddingTop: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomColor: appColor.greyBack,
              paddingBottom: 5,
            }}>
            <MenuCard
              onPress={() => {
                userType == 'guest'
                  ? navigation.navigate('login')
                  : navigation.navigate('Dashboard', {
                      screen: 'subscriptionPlanHistory',
                      initial: true,
                    });
              }}
              title="Subscription"
              icon="FontAwesome6"
              iconName="crown"
              altStyles={{}}
            />
            <MenuCard
              onPress={() => {
                userType == 'guest'
                  ? navigation.navigate('login')
                  : navigation.navigate('WishList');
              }}
              title="Wishlist"
              icon="AntDesign"
              iconName="hearto"
            />
          </View>
        </View>

        <Spacer />

        {/* /---------------------ACCOUNT SETTINGS NAVCARDS ----------/ */}
        <Text style={[styles.SideHeadings, {paddingBottom: 10}]}>
          Account Settings
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBlockColor: appColor.borderColor,
            paddingBottom: 10,
          }}>
          <NavCard
            onpress={() => {
              userType == 'guest'
                ? navigation.navigate('login')
                : navigation.navigate('EditProfile');
            }}
            icon="Feather"
            iconName="user"
            title="Edit Profile"
          />
          <NavCard
            onpress={() => {
              userType == 'guest'
                ? navigation.navigate('login')
                : navigation.navigate('manageAddress', {verify: 'add'});
            }}
            icon="Ionicons"
            iconName="location-outline"
            title="Address"
          />
          <NavCard
            onpress={() => {
              userType == 'guest'
                ? navigation.navigate('login')
                : navigation.navigate('notification');
            }}
            icon="MaterialCommunityIcons"
            iconName="bell-outline"
            title="Notifications"
          />
          <NavCard
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
            onpress={() => {
              navigation.navigate('blog_overview');
            }}
            iconName="modern-mic"
            icon="Entypo"
            title="Blog"
          />
          <NavCard
            onpress={() => {
              navigation.navigate('about_us');
            }}
            icon="MaterialCommunityIcons"
            iconName="information-outline"
            title="Aboutus"
          />
          <NavCard
            onpress={() => {
              navigation.navigate('ContactUs');
            }}
            icon="AntDesign"
            iconName="contacts"
            title="Contact us"
          />
        </View>

        {/* /---------------------MY ACTIVITY CARDS-------------------/ */}
        <Text
          style={[styles.SideHeadings, {paddingTop: widthResponse ? 20 : 30}]}>
          My Activity
        </Text>
        <NavCard
          onpress={() => {
            userType == 'guest'
              ? navigation.navigate('login')
              : navigation.navigate('ReviewPage');
          }}
          icon="MaterialCommunityIcons"
          iconName="star-box-outline"
          title="Review"
        />

        {/* /--------------------- Employee Login CARDS-------------------/ */}
        <Text
          style={[
            styles.SideHeadings,
            {
              paddingTop: widthResponse ? 15 : 20,
              borderTopWidth: 1,
              borderTopColor: appColor.borderColor,
              textTransform: 'uppercase',
            },
          ]}>
          employee
        </Text>
        <NavCard
          onpress={() => {
            dispatch(setTitle('employee LOGIN'));
            navigation.navigate('chefLogin', {url: url().admin});
          }}
          icon="MaterialCommunityIcons"
          iconName="chef-hat"
          title="employee LOGIN"
        />
        <View
          style={{
            borderBottomWidth: 1,
            paddingTop: 5,
            borderColor: appColor.borderColor,
          }}
        />
        {/* /---------------------TERMS AND CONDITION & PRIVACY POLICY-------------------/ */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
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
                  {index % 2 != 0 && (
                    <Text style={{marginHorizontal: 5}}>
                      {index % 2 != 0 && '/'}
                    </Text>
                  )}
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
              marginTop: widthResponse ? 15 : 25,
            }}>
            <PrimaryButton
              Title="DELETE ACCOUNT"
              black
              parentStyle={{flex: 1}}
              altStyle={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('deleteScreen1');
              }}
            />
            <PrimaryButton
              Title="LOGOUT"
              profile
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
            <Pressable
              style={{
                backgroundColor: appColor.cardbg,
                padding: 10,
                borderRadius: 10,
                elevation: 1,
              }}
              onPress={() => {
                apiCall();
              }}
              onPressIn={() => {
                setThisLogout(true);
              }}
              onPressOut={() => {
                setThisLogout(false);
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
            </Pressable>

            {/* <Pressable
              onPress={() => {
                // navigation.navigate('login');
              }}
              onPressIn={() => {
                setAllLogout(true);
              }}
              onPressOut={() => {
                setAllLogout(false);
              }}>
              <Text
                style={[
                  styles.btmText,
                  {
                    color: allLogout
                      ? appColor.themeYellow
                      : appColor.textBlack,
                  },
                ]}>
                Logout from all Device
              </Text>
            </Pressable> */}
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
      color: appColor.black,
      fontSize: fontScalling(3),
      fontFamily: appFont.bB,
    },
    policy: {
      color: appColor.black,
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.9),
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
