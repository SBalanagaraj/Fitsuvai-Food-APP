import {
  BackHandler,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {fontScalling, print, scrnWidth} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import {useSelector} from 'react-redux';
import FilterButton from '../../components/Buttons/FilterButton';
import {FlatList} from 'react-native-gesture-handler';
import RadioButton from '../../components/Buttons/RadioButton';
import {url} from '../../utilities/appApi';
import {ActivityIndicator} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  ManageAddressShimmer,
  WhishlistShimmer,
} from '../../utilities/appShimmer';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {ScrollView} from 'react-native';

const ManageAddress = ({navigation, route}) => {
  const {styles} = useStyles();
  const appColor = appColors();
  // const {address} = useSelector(state => state.address);
  const [address, setAddress] = useState({});
  const [load, setLoad] = useState(false);
  const isFocus = useIsFocused();
  const [refresh, setRefresh] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState({});
  const [deleteModal, setdeleteModal] = useState(false);
  const deleteAnimRef = useRef(null);
  const {userSettings} = useSelector(state => state.setting);
  const showToast = useShowToast();

  const [checked, setChecked] = useState(0);

  const routes =
    route.params.verify == 'checkout' || route.params.verify == 'editCheckOut';

  const pullRefresh = useCallback(() => {
    setRefresh(true);
    setAddress({});
    apiCall();
  }, []);

  // trigger function to delete the address
  const trigDeleteAddress = delItem => {
    setAddressToDelete(delItem);
    setdeleteModal(!deleteModal);
  };

  // function to delete the address
  const handleDeleteAddress = () => {
    if (addressToDelete) {
      deleteAnimRef?.current.play(0, 150);
      // print(addressToDelete,"Delteaddress")
      apiCall(addressToDelete, (delCall = true));
      setTimeout(() => {
        setdeleteModal(!deleteModal);
      }, 2200);
      setRefresh(true);
    }
  };

  useEffect(() => {
    if (isFocus) {
      apiCall();
    }
  }, [isFocus, refresh]);

  // api call

  const apiCall = async (itemToDelete, delCall = false) => {
    try {
      setLoad(true);
      var myHeaders = new Headers();
      const formdata = new FormData();
      if (userSettings?.userInfo?.user_id) {
        formdata.append('userId', userSettings?.userInfo?.user_id);
      }
      formdata.append('context', delCall ? 'delete' : 'manage');
      if (delCall) {
        formdata.append('addressId', itemToDelete && itemToDelete.id);
      }
      var requestOptions = {
        method: 'POST',
        body: formdata,
      };
      const response = await fetch(url().addressBook, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          // print(resparse,"Resparse")
          setAddress(resparse.data);
          setLoad(false);
          setRefresh(false);
        }
        setLoad(false);
        setRefresh(false);
      }
    } catch (error) {
      console.log(error, 'Error from my address');
      setLoad(false);
      setRefresh(false);
    }
  };

  console.log(route.params.verify, 'verify');

  return (
    <MainCard
      altStyle={{paddingHorizontal: 10, backgroundColor: appColor.white}}>
      <Text
        style={[styles.HeadingText, {textAlign: 'center', paddingBottom: 10}]}>
        Manage{'  '}
        <Text style={[styles.HeadingText, {color: appColor.gold}]}>
          address
        </Text>
      </Text>
      <Pressable
        onPress={() => {
          navigation.navigate('myAddress', {
            verify:
              route.params.verify == 'checkout' ? route.params.verify : 'add',
          });
        }}
        style={[
          styles.commenStyle,
          {
            backgroundColor: appColor.bgBlack,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 5,
            marginTop: 15,
          },
        ]}>
        <Icon
          ComponentName={'AntDesign'}
          name={'pluscircleo'}
          size={20}
          color={appColor.gold}
        />
        <Text
          style={[
            styles.subText,
            {paddingLeft: 15, fontSize: fontScalling(2.5)},
          ]}>
          {'Add a New address'}
        </Text>
      </Pressable>

      {!load ? (
        address && address.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 91}}
            data={address}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={pullRefresh}
                colors={[appColor.themeYellow]}
                style={{backgroundColor: appColor.bgBlack}}
                tintColor={appColor.themeYellow}
              />
            }
            renderItem={({item, index}) => {
              return (
                <Pressable
                  onPress={
                    routes
                      ? () => {
                          setChecked(index);
                          showToast('success', 'Address is selected', 3000);
                          setTimeout(() => {
                            navigation.navigate('Carts', {
                              screen: 'checkOut',
                              params: {details: item},
                            });
                          }, 3000);
                        }
                      : () => {}
                  }
                  style={{
                    backgroundColor:
                      routes && index == checked
                        ? appColor.gold
                        : appColor.cartBg,
                    borderRadius: 8,
                    padding: 15,
                    marginTop: 15,
                  }}>
                  <View
                    style={[
                      styles.commenStyle,
                      {
                        justifyContent: 'space-between',
                        width: '100%',
                      },
                    ]}>
                    <View
                      style={[
                        styles.commenStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      {routes && (
                        <RadioButton
                          isChecked={index == checked}
                          altStyle={{width: 28}}
                        />
                      )}
                      {item.place && (
                        <FilterButton
                          ICN={
                            item.place == 'work'
                              ? 'MaterialCommunityIcons'
                              : 'MaterialIcons'
                          }
                          IN={
                            item.place == 'work'
                              ? 'office-building-outline'
                              : 'home'
                          }
                          title={item.place}
                          altStyle={{
                            backgroundColor: appColor.white,
                            borderWidth: 0,
                            borderRadius: 25,
                            padding: 10,
                          }}
                          altTextStyle={{
                            fontFamily: appFont.bB,
                            fontSize: fontScalling(2),
                          }}
                        />
                      )}
                    </View>
                    <View
                      style={[
                        styles.commenStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <FilterButton
                        ICN={'FontAwesome6'}
                        IN={'pencil'}
                        ICC={appColor.black}
                        title={'Edit'}
                        bgBlack
                        altStyle={{
                          borderWidth: 0,
                          borderRadius: 25,
                          backgroundColor: appColor.black,
                        }}
                        altTextStyle={{
                          color: appColor.white,
                          fontFamily: appFont.bB,
                          fontSize: fontScalling(2),
                        }}
                        onPress={() => {
                          navigation.navigate('myAddress', {
                            verify:
                              route.params.verify == 'checkout'
                                ? 'editCheckOut'
                                : 'edit',
                            editItem: address[index],
                          });
                        }}
                      />
                      {!routes && (
                        <Pressable
                          style={{paddingLeft: 10}}
                          onPress={() => {
                            trigDeleteAddress(address[index]);
                          }}>
                          <Icon
                            ComponentName={'FontAwesome6'}
                            name={'trash-can'}
                            size={20}
                            color={
                              routes && index == checked
                                ? appColor.white
                                : appColor.gold
                            }
                          />
                        </Pressable>
                      )}
                    </View>
                  </View>
                  <View style={{paddingTop: 10}}>
                    {item.name && (
                      <Text
                        style={[
                          styles.HeadingText,
                          {
                            fontSize: fontScalling(2.3),
                            color:
                              routes && index == checked
                                ? appColor.white
                                : appColor.black,
                          },
                        ]}>
                        {item.name}
                      </Text>
                    )}
                    {item.phone && (
                      <Text
                        style={[
                          styles.normalText,
                          {
                            color:
                              routes && index == checked
                                ? appColor.white
                                : appColor.black,
                          },
                        ]}>
                        {item.phone}
                      </Text>
                    )}
                    {(item.street || item.flatno) && (
                      <Text
                        style={[
                          styles.normalText,
                          {
                            color:
                              routes && index == checked
                                ? appColor.white
                                : appColor.black,
                          },
                        ]}>
                        {item.flatno && item.flatno} ,{' '}
                        {item.street && item.street} ,
                      </Text>
                    )}
                    {(item.city || item.pincode) && (
                      <Text
                        style={[
                          styles.normalText,
                          {
                            color:
                              routes && index == checked
                                ? appColor.white
                                : appColor.black,
                          },
                        ]}>
                        {item.city && item.city} -{' '}
                        {item.pincode && item.pincode} ,
                      </Text>
                    )}
                    {item.state && (
                      <Text
                        style={[
                          styles.normalText,
                          {
                            color:
                              routes && index == checked
                                ? appColor.white
                                : appColor.black,
                          },
                        ]}>
                        {item.state && item.state} .
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            }}
          />
        ) : (
          <View
            style={{flex: 1, paddingTop: scrnWidth / 3, alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: appFont.bB,
                color: appColor.black,
                fontSize: fontScalling(2.7),
                letterSpacing: 1,
              }}>
              There is <Text style={{color: appColor.gold}}> no address </Text>{' '}
              on the addressBook
            </Text>
          </View>
        )
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ManageAddressShimmer />
        </ScrollView>
      )}
      {/* -------delete modal--------- */}
      <Modal
        animationType="slide"
        onBackdropPress={() => setdeleteModal(!deleteModal)}
        backdropColor={appColor.overlayBg}
        backdropOpacity={1}
        transparent={true}
        isVisible={deleteModal}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
          width: scrnWidth / 1,
          marginHorizontal: 'auto',
        }}>
        <View
          style={{
            backgroundColor: appColor.white,
            paddingHorizontal: 15,
            paddingBottom: 25,
            borderRadius: 5,
            alignItems: 'center',
            paddingTop: 0,
          }}>
          <LottieView
            ref={deleteAnimRef}
            resizeMode="contain"
            style={{
              width: scrnWidth / 2,
              height: scrnWidth / 2.5,
              marginTop: -35,
            }}
            source={require('../../../assets/lottieFiles/trash_1.json')}
            loop={false}
          />
          <Text
            style={{
              marginBottom: 10,
              fontFamily: appFont.rB,
              fontSize: fontScalling(2.1),
              color: appColor.textBlack,
              paddingBottom: 10,
            }}>
            Are you sure you want to delete?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              // width: '100%',
              // backgroundColor:appColor.black
            }}>
            <Pressable
              onPress={() => {
                setdeleteModal(!deleteModal);
              }}
              style={{
                backgroundColor: appColor.black,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.5),
                  color: appColor.white,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}>
                no
              </Text>
            </Pressable>
            <Pressable
              onPress={handleDeleteAddress}
              style={{
                backgroundColor: appColor.themeYellow,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 5,
                marginLeft: 15,
              }}>
              <Text
                style={{
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.5),
                  color: appColor.white,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}>
                yes
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </MainCard>
  );
};

export default ManageAddress;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      paddingBottom: 5,
    },

    commenStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      //   width: '100%',
    },
    subText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.white,
    },
    normalText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.5),
      color: appColor.black,
      marginBottom: 3,
    },
  });

  return {styles};
};
