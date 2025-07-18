import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  print,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import AutoHeightImg from '../../components/Card/AutoHeightImg';
import moment from 'moment';

const BlogDetail = ({route}) => {
  const {Blog_Detail} = route.params;
  // print(Blog_Detail, 'datail');
  const appColor = appColors();
  const {styles} = useStyle();

  return (
    <MainOverflowCard borderRadius={50} altStyle={{paddingTop: 23}}>
      {/* img */}
      <View style={styles.img_view}>
        {Blog_Detail.blogImage && Blog_Detail.blogImage != '' && (
          <Image source={{uri: Blog_Detail.blogImage}} style={styles.img} />
        )}
        {/* date */}
        {Blog_Detail.blogDate && (
          <View style={styles.date_view}>
            <Text style={styles.baby_blk}>
              {moment(Blog_Detail.blogDate).format('DD')}
            </Text>
            <Text style={styles.roboto_light}>
              {moment(Blog_Detail.blogDate).format('MMM')}
            </Text>
          </View>
        )}
      </View>
      {/* title */}
      <Text
        style={[
          styles.baby_blk,
          {
            fontSize: fontScalling(2.2),
            color: appColor.themeYellow,
            marginBottom: widthResponse ? 6 : 10,
          },
        ]}>
        {Blog_Detail.title}
      </Text>
      {/* heading */}
      <Text
        style={[
          styles.baby_blk,
          {
            fontSize: fontScalling(2.7),
            marginBottom: widthResponse ? 10 : 15,
          },
        ]}>
        {Blog_Detail.heading}
      </Text>
      {/* render Html */}
      <View style={{flex: 1, width: scrnWidth}}>
        <HtmlView padding={46} url={Blog_Detail.content} />
      </View>
      {/* auther */}
      <View style={styles.author_view}>
        {Blog_Detail?.bloggerImage && Blog_Detail?.bloggerImage != '' && (
          <>
            {/* Gray line */}
            <View
              style={{
                position: 'absolute',
                top: widthResponse ? 35 : 40,
                width: scrnWidth,
                height: 2,
                backgroundColor: appColor.lightGreyLine,
              }}
            />
            <View style={styles.author_img_view}>
              <Image
                resizeMode="cover"
                source={{uri: Blog_Detail.bloggerImage}}
                style={{width: '100%', height: '100%'}}
              />
            </View>
          </>
        )}
        {Blog_Detail?.blogger && Blog_Detail?.blogger && (
          <View style={{marginLeft: 10, alignItems: 'center'}}>
            <Text
              style={[
                styles.baby_blk,
                {
                  fontSize: fontScalling(2.5),
                },
              ]}>
              {Blog_Detail?.blogger}
            </Text>
            <Text style={[styles.roboto_light, {fontSize: fontScalling(1.8)}]}>
              Anthor
            </Text>
          </View>
        )}
      </View>
    </MainOverflowCard>
  );
};

export default BlogDetail;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    img_view: {
      position: 'relative',
      marginBottom: widthResponse ? 30 : 40,
    },
    img: {
      borderRadius: widthResponse ? 25 : 35,
      width: '100%',
      height: scrnWidth / 1.8,
    },
    date_view: {
      position: 'absolute',
      bottom: widthResponse ? -25 : -30,
      right: widthResponse ? '5%' : '8%',
      paddingHorizontal: 15,
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
    author_view: {
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      marginBottom: 6,
      marginTop: 20,
      position: 'relative',
    },
    author_img_view: {
      width: widthResponse ? 70 : 80,
      height: widthResponse ? 70 : 80,
      borderRadius: 100,
      overflow: 'hidden',
    },
  });

  return {styles};
};
