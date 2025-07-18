import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SvgUri} from 'react-native-svg';
import * as Animtable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import appColors from '../../utilities/appColors';

const ImageView = ({image = ''}) => {
  const appColor = appColors();
  return (
    <>
      {image &&
      image != null &&
      image != '' &&
      image.split('.').pop().toUpperCase() == 'SVG' ? (
        <>
          <Animtable.View animation={'zoomIn'} duration={1000}>
            <SvgUri
              fill={appColor.bgBlack}
              width={50} //@@
              height={50} //@@
              style={{width: 80, height: 80, borderRadius: 42.5, elevation: 3}}
              uri={image}
              onError={error => {
                console.error('Failed to load SVG:', error);
              }}
            />
          </Animtable.View>
        </>
      ) : (image &&
          image != null &&
          image != '' &&
          image.split('.').pop().toUpperCase() == 'PNG') ||
        'JPG' ||
        'JPEG' ||
        'WEBG' ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            width: 75,
            height: 75,
            borderRadius: 42.5,
            elevation: 10,
            shadowColor: appColor.bgBlack,
            marginVertical: 10,
          }}>
          <FastImage
            resizeMode="cover"
            style={{width: '100%', height: '100%'}}
            source={{uri: image}}
          />
        </View>
      ) : null}
    </>
  );
};

export default ImageView;

const styles = StyleSheet.create({});
