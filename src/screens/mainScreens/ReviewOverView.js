import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import {url} from '../../utilities/appApi';
import {
  arrayLength,
  fontScalling,
  objectLength,
  print,
  scrnHeight,
  widthResponse,
} from '../../utilities/helperFunction';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import ReviewCard from '../../components/Card/ReviewCard';
import RatingComponent from '../../components/RatingComponents/RatingComponent';

const ReviewOverView = ({route}) => {
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const appColor = appColors();

  // state:
  const [reviewOverView, setReviewOverView] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [altStart, setAltStart] = useState(0);
  const [reviewData, setReviewData] = useState({});

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [altStart]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setReviewOverView(prevData => ({
      data: prevData.data,
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    }));
    setAltStart(0);
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      apiCall();
    }
  }, [refresh]);

  // pagination:
  const paging = () => {
    setAltStart(Number(reviewOverView.start) + Number(reviewOverView.limit));
  };

  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('context', 'allReviews');
      formData.append('start', altStart);
      if (route?.params?.productId) {
        formData.append('productId', route?.params?.productId);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (!arrayLength(reviewOverView.data)) {
        setLoad(true);
      }
      // get the response:
      const response = await fetch(url().reviewApi, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          if (resparse?.reviews?.reviews) {
            setReviewOverView(prevdata => {
              return {
                data: refresh
                  ? resparse?.reviews?.reviews
                  : [...prevdata.data, ...resparse?.reviews?.reviews],
                start: Number(resparse.start),
                limit: Number(resparse.limit),
                totalPages: Number(resparse.totalPages),
                page: refresh ? 1 : Number(prevdata.page + 1),
              };
            });
            setLoad(false);
            setRefresh(false);
          }
          if (resparse?.reviews?.data) {
            setReviewData(resparse?.reviews?.data);
          }
        }
      } else {
        print(response.status, 'status in product Detail');
        setLoad(false);
        setRefresh(false);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error in product detail');
      setLoad(false);
      setRefresh(false);
    }
  };

  const renderItem = ({item, index}) => {
    return <ReviewCard data={item} edit={false} productList={false} />;
  };

  return (
    <MainOverflowCard>
      <>
        {load ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: scrnHeight - 200,
            }}>
            <ActivityIndicator size={'large'} color={appColor.gold} />
          </View>
        ) : (
          <View style={{width: '100%'}}>
            {reviewOverView.data.length > 0 ? (
              <View
                style={{
                  padding: 5,
                  paddingTop: 15,
                  backgroundColor: appColors.cartBg,
                }}>
                {reviewData && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                      paddingBottom: 15,
                    }}>
                    <RatingComponent rating={reviewData.average} />
                    <Text style={[styles.subText]}>
                      {'  ( ' + reviewData.review_count + ' Reviews' + ')'}
                    </Text>
                  </View>
                )}
                <FlatList
                  scrollEnabled={false}
                  data={reviewOverView.data}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                      colors={[appColor.themeYellow]}
                      style={{backgroundColor: appColor.bgBlack}}
                      tintColor={appColor.themeYellow}
                    />
                  }
                  onEndReached={() => {
                    altStart == reviewOverView.start &&
                      reviewOverView.page < reviewOverView.totalPages &&
                      paging();
                  }}
                  ItemSeparatorComponent={() => {
                    return <View style={{padding: 7}} />;
                  }}
                  ListFooterComponent={() => {
                    return (
                      <>
                        {reviewOverView.page != reviewOverView.totalPages && (
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
                  keyExtractor={(data, index) => index}
                />
              </View>
            ) : (
              !load && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 15,
                    paddingVertical: 35,
                    backgroundColor: appColor.cardbg,
                    borderRadius: 15,
                  }}>
                  <View
                    style={{
                      backgroundColor: appColor.themeYellow,
                      borderRadius: 50,
                      width: 80,
                      height: 80,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: 5,
                    }}>
                    <Icon
                      ComponentName={'Foundation'}
                      name={'clipboard-pencil'}
                      color={appColor.white}
                      size={40}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      color: appColor.textBlack,
                      fontSize: fontScalling(3),
                      paddingTop: 15,
                      paddingBottom: 10,
                    }}>
                    No Reviews available
                  </Text>
                  <Text
                    style={{fontFamily: appFont.rM, color: appColor.textBlack}}>
                    You have no products to review right now
                  </Text>
                </View>
              )
            )}
          </View>
        )}
      </>
    </MainOverflowCard>
  );
};

export default ReviewOverView;

const styles = StyleSheet.create({});
