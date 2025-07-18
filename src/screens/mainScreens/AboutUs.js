import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  objectLength,
  arrayLength,
  scrnHeight,
  print,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {url} from '../../utilities/appApi';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import {SvgCssUri} from 'react-native-svg';

const AboutUs = () => {
  const appColor = appColors();

  // state:
  const [aboutUs, setAboutUs] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // initial api & pagination:
  useEffect(() => {
    apiCall();
  }, []);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      apiCall();
    }
  }, [refresh]);

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var requestOptions = {
        method: 'POST',
      };

      // loading enable:
      if (!objectLength(aboutUs)) {
        setLoad(true);
      }

      // get the response:
      const response = await fetch(url().about, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          setAboutUs(resparse.data[0]);
        }
      } else {
        console.log('About us status code:', response.status);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error About us');
      setRefresh(false);
      setLoad(false);
    }
  };

  // print(aboutUs, 'aboutUs');

  return (
    <MainOverflowCard
      borderRadius={40}
      altStyle={{paddingTop: 23}}
      refresh={refresh}
      onRefresh={onRefresh}>
      {!load ? (
        <>
          {/* banner img */}
          {aboutUs.image1 && aboutUs.image1 != '' && (
            <Image
              source={{uri: aboutUs.image1}}
              style={{
                height: scrnWidth / 1.8,
                borderRadius: 20,
                backgroundColor: appColor.borderColor,
                marginBottom: 15,
              }}
            />
          )}
          {/* title */}
          {aboutUs.heading1 && aboutUs.heading1 != '' && (
            <HtmlView url={aboutUs.heading1} padding={40} />
          )}
          {/* description */}
          {aboutUs.content1 && aboutUs.content1 != '' && (
            <HtmlView url={aboutUs.content1} padding={40} />
          )}
          {/* sub_content */}
          {aboutUs.subContentArray && arrayLength(aboutUs.subContentArray) && (
            <FlatList
              data={aboutUs.subContentArray}
              numColumns={2}
              style={{marginBottom: widthResponse ? 30 : 40}}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              keyExtractor={(data, index) => index}
              renderItem={({item, i}) => {
                return (
                  <View
                    key={i}
                    style={{
                      width: '50%',
                      paddingRight: '5%',
                    }}>
                    {/* logo */}
                    {item.sub_content_image && item.sub_content_image != '' && (
                      <View
                        style={{
                          width: (scrnWidth - 48) / 6,
                          height: (scrnWidth - 48) / 6,
                        }}>
                        {item?.sub_content_image
                          .split('.')
                          .pop()
                          .toUpperCase() == 'SVG' ? (
                          <SvgCssUri
                            fill={appColor.black}
                            width={(scrnWidth - 48) / 6}
                            height={(scrnWidth - 48) / 6}
                            uri={item?.sub_content_image}
                            onError={error => {
                              console.error('Failed to load SVG:', error);
                            }}
                          />
                        ) : item?.sub_content_image
                            .split('.')
                            .pop()
                            .toUpperCase() == 'PNG' ||
                          'JPG' ||
                          'JPEG' ||
                          'WEBG' ? (
                          <Image
                            style={{
                              width: '100%',
                              height: '100%',
                              resizeMode: 'contain',
                            }}
                            source={{uri: item.sub_content_image}}
                          />
                        ) : null}
                      </View>
                    )}
                    {/* content */}
                    {item.sub_content && item.sub_content != '' && (
                      <HtmlView url={item.sub_content} width={'100%'} />
                    )}
                  </View>
                );
              }}
            />
          )}
          <View
            style={{
              width: scrnWidth,
              left: -23,
            }}>
            {/* explore */}
            <ImageBackground
              source={require('../../../assets/images/abt_exp_back.png')}
              style={{
                width: '100%',
                marginBottom: 10,
              }}>
              <View
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: widthResponse ? 30 : 45,
                  width: '65%',
                }}>
                {/* title */}
                {aboutUs.heading2 && aboutUs.heading2 != '' && (
                  <HtmlView
                    url={aboutUs.heading2}
                    width={'100%'}
                    whiteText={true}
                  />
                )}
                {/* description */}
                {aboutUs.content2 && aboutUs.content2 != '' && (
                  <HtmlView
                    url={aboutUs.content2}
                    width={'100%'}
                    whiteText={true}
                  />
                )}
                {/* btn */}
                <PrimaryButton
                  Title={'Shop now'}
                  altStyle={{
                    flex: 0,
                    paddingHorizontal: 40,
                    paddingVertical: 6,
                  }}
                />
              </View>
            </ImageBackground>
            {/* special food */}
            <View
              style={{
                backgroundColor: appColor.greyBg,
                width: '100%',
                paddingBottom: 30,
                paddingHorizontal: 24,
              }}>
              {aboutUs.image3 && aboutUs.image3 != '' && (
                <Image
                  resizeMode="contain"
                  source={{uri: aboutUs.image3}}
                  style={{
                    height: scrnWidth / 2,
                    borderRadius: 20,
                    backgroundColor: appColor.borderColor,
                    marginBottom: 15,
                  }}
                />
              )}
              {/* title */}
              {aboutUs.heading3 && aboutUs.heading3 != '' && (
                <HtmlView url={aboutUs.heading3} padding={46} />
              )}
              {/* description */}
              {aboutUs.content3 && aboutUs.content3 != '' && (
                <HtmlView url={aboutUs.content3} padding={46} />
              )}
            </View>
          </View>
          {/* ideas */}
          <View style={{paddingVertical: widthResponse ? 20 : 30}}>
            {/* title */}
            {aboutUs.heading4 && aboutUs.heading4 != '' && (
              <HtmlView url={aboutUs.heading4} padding={46} />
            )}
            {/* description */}
            {aboutUs.content4 && aboutUs.content4 != '' && (
              <HtmlView url={aboutUs.content4} padding={46} />
            )}
          </View>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: (scrnHeight - 150) / 2,
          }}>
          <ActivityIndicator
            color={appColor.themeYellow}
            size={widthResponse ? 30 : 40}
          />
        </View>
      )}
    </MainOverflowCard>
  );
};

export default AboutUs;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    card_in: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
    img_view: {
      width: widthResponse ? 80 : 150,
      height: widthResponse ? 80 : 150,
      backgroundColor: appColor.bgWhite,
    },
    imglength: {
      borderWidth: 1,
      borderRadius: 6,
      height: '100%',
      width: '100%',
      padding: 3,
      borderColor: appColor.bgBlack,
      backgroundColor: appColor.bgBlack,
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
      fontSize: fontScalling(1.7),
      lineHeight: fontScalling(2.2),
      color: appColor.textBlack,
    },
  });

  return {styles};
};
