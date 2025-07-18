import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import appColors from '../../utilities/appColors';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import MainCard from '../../components/Card/MainCard';
import {useSelector} from 'react-redux';
import {url} from '../../utilities/appApi';
import {SvgCssUri} from 'react-native-svg';
import {SubscriptionShimmer} from '../../utilities/appShimmer';
import {useIsFocused} from '@react-navigation/native';

const SubscriptionOverview = ({navigation}) => {
  const appColor = appColors();
  const isFocus = useIsFocused();
  const {userSettings} = useSelector(state => state.setting);
  const [Plan_history, setPlanHistory] = useState([]);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      if (Plan_history.length == 0) {
        setLoad(true);
      }
      myHeaders.append('Content-Type', 'multipart/form-data');
      const formData = new FormData();
      formData.append('context', 'planOverview');
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', Number(userSettings?.userInfo?.user_id));
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
        header: myHeaders,
      };
      // get the response:
      const response = await fetch(url().subscriptions, requestOptions);
      print(response, 'response ---');

      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setPlanHistory(resparse.data);
        }
        setLoad(false);
        setRefresh(false);
      } else {
        print(response.status, 'status in supscription overview');
        setLoad(false);
        setRefresh(false);
      }
    } catch (e) {
      console.log(e, 'error in supscription overview');
      setLoad(false);
      setRefresh(false);
    }
  };

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      apiCall();
    }
  }, [refresh, Plan_history]);

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [isFocus, userSettings]);

  const PlanCard = ({history, getDetail}) => {
    return (
      <>
        {load ? (
          <SubscriptionShimmer />
        ) : (
          Plan_history &&
          Plan_history.length > 0 && (
            <FlatList
              data={Plan_history}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: widthResponse ? 90 : 130}}
              renderItem={({item}) => {
                return (
                  <Pressable
                    onPress={() => {
                      getDetail(item);
                      navigation.navigate('SubscribedPlanDetail', {
                        id: item.id,
                      });
                    }}
                    style={[
                      styles.listCard,
                      {
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        backgroundColor:
                          item.plan_status == 'Active'
                            ? appColor.lightGreen
                            : item.plan_status == 'Pending'
                            ? appColor.ratingGray
                            : appColor.cardbg,
                      },
                    ]}>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          fontFamily: appFont.bB,
                          color: appColor.black,
                          fontSize: fontScalling(2.7),
                          marginBottom: widthResponse ? 2 : 5,
                        }}>
                        {`${item.membership}  id: ${item.id}`}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontScalling(1.7),
                          fontFamily: appFont.rR,
                          color: appColor.bgBlack,
                          paddingBottom: 5,
                        }}>
                        Amount Paid :{' '}
                        <Text style={{fontFamily: appFont.rM}}>
                          {' '}
                          ₹{item.amount_paid}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: fontScalling(1.7),
                          fontFamily: appFont.rR,
                          color: appColor.bgBlack,
                        }}>
                        Period :{' '}
                        <Text style={{fontFamily: appFont.rM}}>
                          {' '}
                          {`${item.start_date} - ${item.end_date}`}
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      {item.payment_method != '-' && (
                        <>
                          {item.payment_method &&
                          item.payment_method != null &&
                          item.payment_method != '' &&
                          item.payment_method != '-' &&
                          item.payment_method.split('.').pop().toUpperCase() ==
                            'SVG' ? (
                            <View style={{width: 60, height: 40}}>
                              <SvgCssUri
                                fill={appColor.black}
                                width={60}
                                height={40}
                                uri={item.payment_method}
                                onError={error => {
                                  console.error('Failed to load SVG:', error);
                                }}
                              />
                            </View>
                          ) : (item.payment_method != '-' &&
                              item.payment_method
                                .split('.')
                                .pop()
                                .toUpperCase() == 'PNG') ||
                            'JPG' ||
                            'JPEG' ||
                            'WEBG' ? (
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                width: 60,
                                height: 40,
                                borderRadius: 10,
                              }}>
                              <Image
                                resizeMode="contain"
                                style={{width: '100%', height: '100%'}}
                                source={{uri: item.payment_method}}
                              />
                            </View>
                          ) : null}
                        </>
                      )}
                      <Text
                        style={{
                          fontSize: fontScalling(1.7),
                          fontFamily: appFont.rR,
                          alignSelf: 'center',
                          // paddingBottom: 10,
                          color:
                            item.plan_status == 'Active'
                              ? appColor.active
                              : item.plan_status == 'Pending'
                              ? appColor.gold
                              : appColor.deactive,
                          paddingHorizontal: widthResponse ? 10 : 14,
                          paddingVertical: widthResponse ? 6 : 9,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor:
                            item.plan_status == 'Active'
                              ? appColor.active
                              : item.plan_status == 'Pending'
                              ? appColor.gold
                              : appColor.deactive,
                        }}>
                        {item.plan_status}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={onRefresh}
                  colors={[appColor.themeYellow]}
                  style={{backgroundColor: appColor.bgBlack}}
                  tintColor={appColor.themeYellow}
                />
              }
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 10,
                      backgroundColor: appColor.white,
                    }}></View>
                );
              }}
            />
          )
        )}

        {!load && Plan_history && Plan_history.length == 0 && (
          <>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontFamily: appFont.bB, fontSize: fontScalling(2)}}>
                No Plan's available
              </Text>
            </View>
          </>
        )}
      </>
    );
  };

  {
    /* card detail passing functions */
  }
  const passDetail = item => {
    // console.log(item);
  };

  return (
    <View style={{backgroundColor: appColor.white, flex: 1}}>
      <MainCard
        altStyle={{
          paddingHorizontal: 10, //@@
        }}>
        {/* plan card */}
        <PlanCard history={Plan_history} getDetail={passDetail} />
      </MainCard>
    </View>
  );
};

export default SubscriptionOverview;

const styles = StyleSheet.create({
  listCard: {
    paddingHorizontal: widthResponse ? 20 : 25,
    paddingVertical: widthResponse ? 20 : 25,
    borderRadius: 20,
  },
});
