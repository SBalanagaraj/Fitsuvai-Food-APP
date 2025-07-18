import React from 'react';
import {Animated, Easing} from 'react-native';

function spinner(type = 'clock', duration) {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: duration ? duration : 4000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: type == 'clock' ? ['0deg', '360deg'] : ['0deg', '-360deg'],
  });

  return spin;
}

export default spinner;
