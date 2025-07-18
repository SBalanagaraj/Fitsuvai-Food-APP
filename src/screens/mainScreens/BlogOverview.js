import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
// file import:
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import {appFont} from '../../utilities/appFont';
import {url} from '../../utilities/appApi';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  print,
} from '../../utilities/helperFunction';
import {BlogShimmer} from '../../utilities/appShimmer';
// import LoaderKit from 'react-native-loader-kit';

const BlogOverview = ({navigation}) => {
  const appColor = appColors();
  const {styles} = useStyle();

  // state:
  const [blogOverview, setBlogOverview] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [altStart, setAltStart] = useState(0);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // print(blogOverview, 'blog');

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [altStart]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setBlogOverview(prevData => ({
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
    setAltStart(Number(blogOverview.start) + Number(blogOverview.limit));
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
      if (blogOverview.data.length == 0) {
        setLoad(true);
      }

      // get the response:
      const response = await fetch(url().blog_overview, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          setBlogOverview(prevdata => {
            return {
              data:
                altStart > blogOverview.start
                  ? [...prevdata.data, ...resparse.data.blogsOverview]
                  : resparse.data.blogsOverview,
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              totalPages: Number(resparse.totalPages),
              page: refresh ? 1 : Number(prevdata.page + 1),
            };
          });
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

  return (
    <MainCard altStyle={{paddingHorizontal: 10}}>
      <View style={styles.container}>
        {!load ? (
          <>
            {blogOverview?.data?.length > 0 ? (
              <FlatList
                data={blogOverview?.data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatlist}
                numColumns={2}
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
                  altStart == blogOverview.start &&
                    blogOverview.page < blogOverview.totalPages &&
                    paging();
                }}
                ItemSeparatorComponent={() => {
                  return <View style={{padding: 7}} />;
                }}
                ListFooterComponent={() => {
                  return (
                    <>
                      {blogOverview.page != blogOverview.totalPages && (
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
                renderItem={({item, index}) => {
                  return (
                    <View key={index} style={styles.card_out}>
                      <Pressable
                        style={styles.card_in}
                        onPress={() => {
                          navigation.navigate('blog_detail', {
                            Blog_Detail: item,
                          });
                        }}>
                        {/* img */}
                        <View style={styles.img_view}>
                          {item.blogImage && item.blogImage != '' && (
                            <Image
                              source={{uri: item.blogImage}}
                              resizeMode="cover"
                              style={[styles.img]}
                            />
                          )}
                          {/* date */}
                          {item.blogDate && (
                            <View style={styles.date_view}>
                              <Text style={styles.baby_blk}>
                                {moment(item.blogDate).format('DD')}
                              </Text>
                              <Text style={styles.roboto_light}>
                                {moment(item.blogDate).format('MMM')}
                              </Text>
                            </View>
                          )}
                        </View>
                        {/* content */}
                        <View style={styles.content}>
                          {/* sub_title */}
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.baby_blk,
                              {
                                fontSize: fontScalling(2),
                                color: appColor.themeYellow,
                                marginBottom: 8,
                                paddingTop: 5,
                              },
                            ]}>
                            {item.title}
                          </Text>
                          {/* title */}
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.baby_blk,
                              {
                                marginBottom: 10,
                              },
                            ]}>
                            {item.heading}
                          </Text>
                          {/* auther */}
                          <View style={styles.author_view}>
                            {item.bloggerImage && item.bloggerImage != '' && (
                              <View style={styles.author_img_view}>
                                <Image
                                  resizeMode="cover"
                                  source={{uri: item.bloggerImage}}
                                  style={{width: '100%', height: '100%'}}
                                />
                              </View>
                            )}
                            <View style={{marginLeft: 10}}>
                              <Text
                                style={[
                                  styles.baby_blk,
                                  {
                                    fontSize: fontScalling(2),
                                  },
                                ]}>
                                {item.blogger}
                              </Text>
                              <Text style={styles.roboto_light}>Author</Text>
                            </View>
                          </View>
                        </View>
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
          <BlogShimmer />
          // <View
          //   style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          //   <ActivityIndicator
          //     color={appColor.themeYellow}
          //     size={widthResponse ? 30 : 40}
          //   />
          // </View>
        )}
      </View>
    </MainCard>
  );
};

export default BlogOverview;
const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    flatlist: {marginRight: -14, paddingBottom: 100},
    card_out: {width: '50%', paddingRight: 14},
    card_in: {
      backgroundColor: appColor.cardBack,
      borderRadius: 10,
      padding: 6,
      overflow: 'hidden',
    },
    img_view: {
      position: 'relative',
      width: '100%',
      height: scrnWidth / 3.7,
    },
    img: {
      height: '100%',
      width: '100%',
      borderTopLeftRadius: widthResponse ? 10 : 15,
      borderTopRightRadius: widthResponse ? 10 : 15,
    },
    date_view: {
      position: 'absolute',
      bottom: widthResponse ? -25 : -30,
      right: widthResponse ? '5%' : '8%',
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 5,
      backgroundColor: appColor.bgWhite,
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
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
    author_view: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      marginBottom: 6,
    },
    author_img_view: {
      width: widthResponse ? 50 : 60,
      height: widthResponse ? 50 : 60,
      borderRadius: 100,
      overflow: 'hidden',
    },
  });

  return {styles};
};
