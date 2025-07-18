import {StyleSheet, View, Dimensions, Animated, Text} from 'react-native';
import React from 'react';
import spinner from './Spinner';
import {scrnWidth} from '../../utilities/helperFunction';

const {width, height} = Dimensions.get('screen');

const BallWithSpin = ({
  style = {},
  imgSrc = null,
  imgStyle = {},
  duration,
  containerStyle = {},
  localImg = false,
}) => {
  const spin = spinner('clock', duration);
  const antiSpin = spinner('anti', duration);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[style, {transform: [{rotate: spin}]}]} />
      {imgSrc != null && (
        <Animated.Image
          resizeMode={'contain'}
          source={!localImg ? imgSrc : {uri: imgSrc}}
          style={[imgStyle, {transform: [{rotate: spin}]}]}
        />
      )}
    </View>
  );
};

export default BallWithSpin;

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
