import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  print,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
// import LoaderKit from 'react-native-loader-kit';
import YoutubeIframe from 'react-native-youtube-iframe';
import {setAltTitle} from '../../redux/TitleSlice';
import {useDispatch} from 'react-redux';
import {url} from '../../utilities/appApi';
import HtmlView from '../../components/HtmlElement/RenderHtml';

const CourseOverview = ({navigation, route}) => {
  const {catId} = route.params;
  const appColor = appColors();
  const dispatch = useDispatch();
  const {styles} = useStyle();

  // state:
  const [courseOverview, setCourseOverview] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [altStart, setAltStart] = useState(0);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // print(courseOverview.data[2].name, 'courseOverview');

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [altStart]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setCourseOverview(prevData => ({
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
    setAltStart(Number(courseOverview.start) + Number(courseOverview.limit));
  };

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('catId', catId);
      formData.append('start', altStart);

      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (courseOverview.data.length == 0) {
        setLoad(true);
      }

      // get the response:
      const response = await fetch(url().course, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          setCourseOverview(prevdata => {
            return {
              data: refresh
                ? resparse.data.courseOverview
                : [...prevdata.data, ...resparse.data.courseOverview],
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              totalPages: Number(resparse.totalPages),
              page: refresh ? 1 : Number(prevdata.page + 1),
            };
          });
        }
      } else {
        console.log('Course Overiview status code:', response.status);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error Course overview');
      setRefresh(false);
      setLoad(false);
    }
  };

  return (
    <MainCard altStyle={{paddingHorizontal: 0}}>
      <View style={styles.container}>
        {!load ? (
          <>
            {courseOverview?.data?.length > 0 ? (
              <>
                <FlatList
                  bounces={false}
                  data={courseOverview.data}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flatlist}
                  numColumns={2}
                  ItemSeparatorComponent={() => {
                    return <View style={{padding: 7}} />;
                  }}
                  ListFooterComponent={() => {
                    return (
                      <>
                        {courseOverview.page != courseOverview.totalPages && (
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
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                      colors={[appColor.themeYellow]}
                      style={{backgroundColor: appColor.bgBlack}}
                      tintColor={appColor.themeYellow}
                    />
                  }
                  keyExtractor={(data, index) => index}
                  onEndReached={() => {
                    altStart == courseOverview.start &&
                      courseOverview.page < courseOverview.totalPages &&
                      paging();
                  }}
                  renderItem={({item, index}) => {
                    const ecode = item?.ecode?.split('/');
                    const youtubeId = ecode[ecode.length - 1];
                    return (
                      <View
                        key={index}
                        style={[
                          styles.card_out,
                          {
                            paddingHorizontal: 6,
                          },
                        ]}>
                        <Pressable
                          style={styles.card_in}
                          onPress={() => {
                            navigation.navigate('course_detail', {
                              courseDetail: item,
                              youtubeId: youtubeId,
                            });
                            dispatch(setAltTitle(item.name));
                          }}>
                          {/* youtube */}
                          {item.image && item.image != '' && (
                            <View style={styles.img_view}>
                              <ImageBackground
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                source={{uri: item.image}}>
                                <Image
                                  style={{
                                    width: '30%',
                                    height: '100%',
                                    resizeMode: 'contain',
                                  }}
                                  source={require('../../../assets/images/youtubeLogo.png')}
                                />
                              </ImageBackground>
                            </View>
                          )}
                          {/* content */}
                          <View style={styles.content}>
                            {/* title */}
                            {item.name && item.name != '' && (
                              <Text
                                style={[
                                  styles.baby_blk,
                                  {
                                    marginBottom: 5,
                                  },
                                ]}>
                                {item.name}
                              </Text>
                            )}
                            {/* content */}
                            {item.content && item.content != '' && (
                              <Text
                                numberOfLines={2}
                                style={[styles.roboto_light]}>
                                {item.content}
                              </Text>
                            )}
                          </View>
                        </Pressable>
                      </View>
                    );
                  }}
                />
              </>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.themeYellow]}
                    style={{backgroundColor: appColor.bgBlack}}
                    tintColor={appColor.themeYellow}
                  />
                }
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Empty data</Text>
              </ScrollView>
            )}
          </>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              color={appColor.themeYellow}
              size={widthResponse ? 30 : 40}
            />
          </View>
        )}
      </View>
    </MainCard>
  );
};

export default CourseOverview;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    flatlist: {paddingBottom: widthResponse ? 90 : 120},
    card_out: {width: '50%'},
    card_in: {
      backgroundColor: appColor.greyBg,
      borderRadius: 10,
      padding: 6,
      paddingBottom: 10,
      overflow: 'hidden',
    },
    img_view: {
      position: 'relative',
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: 1.7,
    },
    img: {
      height: '100%',
      width: '100%',
      borderRadius: 10,
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
    content: {
      marginTop: widthResponse ? 15 : 30,
      paddingHorizontal: 7,
    },
  });

  return {styles};
};
