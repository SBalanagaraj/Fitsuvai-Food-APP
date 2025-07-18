import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
// file import:
import {url} from '../../utilities/appApi';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {widthResponse, fontScalling} from '../../utilities/helperFunction';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import {appFont} from '../../utilities/appFont';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../redux/TitleSlice';
import AutoHeightImg from '../../components/Card/AutoHeightImg';
import {OverviewShimmer} from '../../utilities/appShimmer';
import FastImage from 'react-native-fast-image';

const GenralCourseOverview = ({navigation}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const dispatch = useDispatch();

  // state:
  const [genCourse, setGenCourse] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [altStart, setAltStart] = useState(0);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [altStart]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setGenCourse(prevData => ({
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
    setAltStart(Number(genCourse.start) + Number(genCourse.limit));
  };

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('start', altStart);
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (genCourse.data.length == 0) {
        setLoad(true);
      }

      // get the response:
      const response = await fetch(url().gendral_course, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          setGenCourse(prevdata => {
            return {
              data: refresh
                ? resparse.data.generalCourses
                : [...prevdata.data, ...resparse.data.generalCourses],
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              totalPages: Number(resparse.totalPages),
              page: refresh ? 1 : Number(prevdata.page + 1),
            };
          });
        }
      } else {
        console.log('Gendral Course status code:', response.status);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error Gendral Course');
      setRefresh(false);
      setLoad(false);
    }
  };

  return (
    <MainCard altStyle={{paddingHorizontal: 0}}>
      <View style={styles.container}>
        {!load ? (
          <>
            {genCourse?.data?.length > 0 ? (
              <FlatList
                bounces={false}
                data={genCourse.data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatlist}
                numColumns={2}
                ItemSeparatorComponent={() => {
                  return <View style={{padding: 7}} />;
                }}
                ListFooterComponent={() => {
                  return (
                    <>
                      {genCourse.page != genCourse.totalPages && (
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
                onEndReached={() => {
                  altStart == genCourse.start &&
                    genCourse.page < genCourse.totalPages &&
                    paging();
                }}
                keyExtractor={(data, index) => index}
                renderItem={({item, index}) => {
                  return (
                    <View
                      key={index}
                      style={[styles.card_out, {paddingHorizontal: 7}]}>
                      <Pressable
                        style={styles.card_in}
                        onPress={() => {
                          navigation.navigate('course_overview', {
                            catId: Number(item.id),
                          });
                          dispatch(setTitle(item.name));
                        }}>
                        {/* img */}
                        {item.image && item.image != '' && (
                          <View style={styles.img_view}>
                            <FastImage
                              resizeMode="cover"
                              style={styles.img}
                              source={{
                                priority: FastImage.priority.high,
                                uri: item.image,
                              }}
                            />
                          </View>
                        )}
                        {/* content */}
                        {item.name && item.name != '' && (
                          <View style={styles.content}>
                            {/* title */}
                            <Text
                              style={[
                                styles.baby_blk,
                                {
                                  marginBottom: 10,
                                },
                              ]}>
                              {item.name}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    </View>
                  );
                }}
              />
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
          <OverviewShimmer />
        )}
      </View>
    </MainCard>
  );
};

export default GenralCourseOverview;

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
      overflow: 'hidden',
    },
    img_view: {
      position: 'relative',
      width: '100%',
      height: widthResponse ? 120 : scrnWidth / 3.8,
    },
    img: {
      height: '100%',
      width: '100%',
      borderRadius: widthResponse ? 10 : 15,
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.5),
      color: appColor.Textlightblack,
    },
    content: {
      marginTop: widthResponse ? 25 : 30,
      paddingHorizontal: 7,
    },
  });

  return {styles};
};
