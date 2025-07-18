import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {appFont} from '../../utilities/appFont';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '../../utilities/icon';
import RewardCard from '../../components/Card/RewardCard';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {url} from '../../utilities/appApi';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import {useDispatch, useSelector} from 'react-redux';
import {RewardShimmer} from '../../utilities/appShimmer';
import {userSettingApi} from '../../redux/SettingSlice';

const {width, height} = Dimensions.get('screen');

const RewardCoin = ({navigation}) => {
  const appColor = appColors();
  const {style} = useStyle();
  // state:
  const [list, setList] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [altStart, setAltStart] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const {userSettings} = useSelector(state => state.setting);

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('start', altStart);
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      print(formData, 'formdata');
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // loading enable:
      if (list.data.length == 0) {
        setLoad(true);
      }
      // get the response:
      const response = await fetch(url().rewards, requestOptions);
      if (response.status == 200) {
        // dispatch(userSettingApi())
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setList(preData => {
            return {
              data: refresh
                ? resparse.data
                : [...preData.data, ...resparse.data],
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              page: refresh ? 1 : Number(preData.page + 1),
              totalPages: Number(resparse.totalPages),
            };
          });
          setLoad(false);
          setRefresh(false);
        }
      } else {
        console.log('blog overview status code:', response.status);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error blog overview');
      setRefresh(false);
      setLoad(false);
    }
  };

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
      // dispatch(userSettingApi());
    }
  }, [altStart]);

  // during Refresh
  useEffect(() => {
    if (refresh) {
      apiCall();
      // dispatch(userSettingApi());
    }
  }, [refresh]);

  const onRefresh = useCallback(() => {
    setList(preData => ({
      data: preData.data,
      start: 0,
      limit: 0,
      page: 0,
      totalPages: 0,
    }));
    setAltStart(0);
    setRefresh(true);
  }, [userSettings?.userInfo?.user_id]);

  const paging = () => {
    setAltStart(Number(list.start) + Number(list.limit));
  };

  // useEffect(() => {
  //   dispatch(userSettingApi());
  // }, []);

  const keyExtractor = useCallback((item, index) => index, []);

  return (
    <>
      {load ? (
        <ScrollView>
          <RewardShimmer />
        </ScrollView>
      ) : (
        <MainCard>
          <View
            style={[
              style.TopCoinText,
              {
                flexDirection: 'column',
                paddingTop: 10,
                paddingBottom: 20,
                marginBottom: 25,
                borderBottomWidth: 1,
                borderBottomColor: appColor.bgBlack,
              },
            ]}>
            {userSettings && userSettings.user_points && (
              <>
                <Text style={style.TextBold}>Reward coins</Text>
                <View style={style.coinButton}>
                  <Image
                    source={require('../../../assets/images/coin.png')}
                    resizeMode="contain"
                    style={style.coinImg}
                  />
                  <Text style={[style.TextBoldsmall, {paddingLeft: 5}]}>
                    {userSettings.user_points}
                  </Text>
                </View>
              </>
            )}
          </View>
          <View style={style.expiryCard}>
            <View style={[style.TopCoinText, {alignItems: 'flex-start'}]}>
              <Icon
                ComponentName={'Entypo'}
                name={'pin'}
                size={22}
                color={appColor.formError}
              />
              <Text
                style={[
                  style.TextSemiBold,
                  {paddingHorizontal: 7, marginBottom: 10},
                ]}>
                Reward Coin Expiry :
              </Text>
            </View>
            <Text style={[style.textMedium, {textAlign: 'center'}]}>
              Reward coins are valid for 1 year from the date they are credited
              on.
            </Text>
          </View>
          <View style={[style.TopCoinText, {paddingVertical: 5}]}>
            <Text style={[style.TextSemiBold, {color: appColor.textBlack}]}>
              Recent coin Activity
            </Text>
            <View style={style.coinComponent}>
              <Image
                source={require('../../../assets/images/coin.png')}
                resizeMode="contain"
                style={style.coinImg}
              />
              <Text
                style={[
                  style.TextBoldsmall,
                  {paddingLeft: 5, fontSize: fontScalling(2)},
                ]}>
                Coins
              </Text>
            </View>
          </View>
          {list?.data?.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  onRefresh={onRefresh}
                  refreshing={refresh}
                  tintColor={appColor.gold}
                  colors={[appColor.themeYellow]}
                  style={{backgroundColor: appColor.bgBlack}}
                />
              }
              onEndReached={() => {
                altStart == list.start &&
                  list.page < list.totalPages &&
                  paging();
              }}
              style={{marginBottom: 90}}
              data={list.data}
              renderItem={({item, index}) => (
                <RewardCard data={item} index={index} />
              )}
              keyExtractor={keyExtractor}
              ListFooterComponent={() => {
                return (
                  <>
                    {list.page != list.totalPages && (
                      <BallWithSpin
                        duration={1000}
                        containerStyle={{
                          width: widthResponse ? 40 : 70,
                          height: widthResponse ? 40 : 70,
                          zIndex: 10,
                          alignSelf: 'center',
                          marginTop: widthResponse ? 20 : 30,
                          marginVertical: widthResponse ? 0 : 30,
                        }}
                        imgStyle={{
                          width: '100%',
                          height: '100%',
                          zIndex: 10,
                        }}
                        imgSrc={require('../../../assets/images/load.png')}
                      />
                    )}
                  </>
                );
              }}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={200}
              decelerationRate={'fast'}
              disableVirtualization={true}
              disableAutoLayout={false}
            />
          ) : (
            !load && (
              <View style={{alignItems: 'center'}}>
                {/* <Image
                source={{uri: }}
                style={{width: width, height: height / 2}}
                resizeMode="contain"
              /> */}
                <Text>data not Found</Text>
              </View>
            )
          )}
        </MainCard>
      )}
    </>
  );
};

export default RewardCoin;

const useStyle = () => {
  const appColor = appColors();
  const style = StyleSheet.create({
    TopCoinText: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    coinImg: {
      width: 22,
      height: 22,
    },
    TextBold: {
      fontFamily: appFont.bB,
      color: appColor.textBlack,
      fontSize: fontScalling(3),
      paddingBottom: 10,
    },
    TextBoldsmall: {
      fontFamily: appFont.rM,
      color: appColor.textBlack,
      fontSize: fontScalling(2),
    },
    textMedium: {
      fontFamily: appFont.rM,
      color: appColor.white,
      fontSize: fontScalling(1.9),
    },
    TextSemiBold: {
      fontFamily: appFont.bB,
      color: appColor.white,
      fontSize: fontScalling(2.7),
    },
    coinButton: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: appColor.rewardBorder,
      borderRadius: 20,
    },
    coinComponent: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding: 10,
    },
    expiryCard: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 5,
      backgroundColor: appColor.themeYellow,
    },
  });
  return {style};
};
// style={{paddingHorizontal: 20, paddingTop: 25, paddingBottom: 35}}
