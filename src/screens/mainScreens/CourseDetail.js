import {View, ScrollView, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  print,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import YoutubeIframe from 'react-native-youtube-iframe';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useShowToast} from '../../components/Toast/ToastAlert';

const CourseDetail = ({navigation, route}) => {
  const {courseDetail, youtubeId} = route.params;
  // print(courseDetail.pdf, 'pdf');

  const {styles} = useStyle();
  const showToast = useShowToast();

  // download pdf:
  const downloadFile = url => {
    const fileName = `download.pdf`;
    let dirs = ReactNativeBlobUtil.fs.dirs;
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: `${dirs.DocumentDir}/${fileName}`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'File downloaded by download manager.',
        mime: 'application/pdf',
      },
    })
      .fetch('GET', url)
      .then(() => {
        showToast(
          'success',
          'Invoice Downloaded',
          'Download Successfully',
          3000,
        );
      })
      .catch(err => console.log('Pdf err ', err));
  };

  return (
    <MainCard altStyle={{paddingHorizontal: 0}}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            borderRadius: 20,
            paddingBottom: widthResponse ? 100 : 120,
          }}>
          {/* iframe */}
          {youtubeId && youtubeId != '' && (
            <Pressable style={styles.img_view}>
              <YoutubeIframe
                play={false}
                height={'100%'}
                width={'100%'}
                videoId={youtubeId}
              />
            </Pressable>
          )}
          {/* content */}
          {courseDetail.description && courseDetail.description != '' && (
            <HtmlView url={courseDetail.description} padding={40} />
          )}
          {/* primary button */}
          <PrimaryButton
            onPress={() => {
              downloadFile(courseDetail.pdf);
            }}
            download
            altStyle={{paddingVertical: widthResponse ? 10 : 20}}
            Title={'download pdf'}
          />
        </ScrollView>
      </View>
    </MainCard>
  );
};

export default CourseDetail;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      marginHorizontal: 10,
      overflow: 'hidden',
    },
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
      borderRadius: 15,
      overflow: 'hidden',
      aspectRatio: 1.8,
    },
    img: {
      height: '100%',
      width: '100%',
      borderRadius: 10,
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.7),
      color: appColor.textBlack,
    },
    baby_yellow: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.2),
      color: appColor.themeYellow,
      marginBottom: widthResponse ? 10 : 15,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
    content: {
      marginTop: widthResponse ? 25 : 30,
      paddingHorizontal: 7,
    },
  });

  return {styles};
};
