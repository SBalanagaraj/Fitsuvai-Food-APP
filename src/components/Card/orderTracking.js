import {View, Animated, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {widthResponse, fontScalling} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import {appFont} from '../../utilities/appFont';
import * as Animatable from 'react-native-animatable';
import appColors from '../../utilities/appColors';

export const OrderTracking = ({data, i, length, trackStatus, cancelled}) => {
  const appColor = appColors();
  const [lineHeight, setLineHeight] = useState(0); //@@
  const {styles} = useStyle();
  const animationDuration = 600;

  // text animation:
  const colorValue = useRef(new Animated.Value(0)).current;
  const nameAnimation = colorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [appColor.lightGreyLine, appColor.textBlack], // From black to red
  });
  const descriptionAnimation = colorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [appColor.lightGreyLine, appColor.Textlightblack], // From black to red
  });

  useEffect(() => {
    const startColorAnimation = () => {
      Animated.timing(colorValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start(() => {
        if (trackStatus > i) {
          Animated.timing(colorValue, {
            toValue: 1,
            delay: i * animationDuration,
            duration: animationDuration,
            useNativeDriver: false,
          }).start();
        }
      });
    };
    startColorAnimation();
  }, []);
  const slideDown = {
    //@@
    from: {
      transform: [{translateY: -lineHeight}],
    },
    to: {
      transform: [{translateY: 0}],
    },
  };

  return (
    <View style={[styles.dotOut, {minHeight: 60}]}>
      <View style={styles.dotIn}>
        {/* dots */}
        <View
          style={[
            styles.dot,
            {backgroundColor: appColor.greyBg, overflow: 'hidden'},
          ]}>
          <Animatable.View
            duration={animationDuration}
            delay={i * animationDuration}
            animation={'fadeIn'}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                trackStatus > i ? appColor.themeYellow : appColor.greyBg,
            }}>
            <Icon
              ComponentName={cancelled == '1' ? 'AntDesign' : 'FontAwesome'}
              name={cancelled == '1' ? 'close' : 'check'}
              size={widthResponse ? 18 : 23}
              color={appColor.bgWhite}
            />
          </Animatable.View>
        </View>
        {/* line */}
        {i != length - 1 && (
          <View
            style={{marginBottom: 10, height: '100%', flex: 1}}
            onLayout={({nativeEvent}) => {
              setLineHeight(nativeEvent.layout.height);
            }}>
            <View
              style={[
                styles.line,
                {
                  overflow: 'hidden',
                  backgroundColor: appColor.greyBg,
                },
              ]}>
              <Animatable.View
                duration={animationDuration}
                delay={i * animationDuration}
                // easing={'ease-in-out'}
                animation={slideDown} //@@
                style={[
                  {
                    width: '100%',
                    height: '100%',
                    backgroundColor:
                      trackStatus > i + 1
                        ? appColor.themeYellow
                        : appColor.greyBg,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
      {/* contents */}
      <Pressable style={[styles.dotContent]}>
        {data.status && data.status != '' && (
          <Animated.Text
            style={[
              styles.roboto_light,
              {
                textTransform: 'capitalize',
                fontFamily: appFont.rM,
                fontSize: fontScalling(1.8),
                color: nameAnimation,
                marginBottom: widthResponse ? 4 : 7,
              },
            ]}>
            {data.status}
          </Animated.Text>
        )}
        {data.date && data.date != null && data.date != '' && (
          <Animated.Text
            style={[
              styles.roboto_light,
              {
                color: descriptionAnimation,
              },
            ]}>
            {data.date}
          </Animated.Text>
        )}
      </Pressable>
    </View>
  );
};

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
    dotOut: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dotIn: {
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    dotContent: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 3,
      paddingBottom: widthResponse ? 20 : 30,
    },
    dot: {
      width: widthResponse ? 30 : 34,
      height: widthResponse ? 30 : 34,
      borderRadius: 60,
      zIndex: 10,
    },
    line: {
      borderColor: appColor.themeYellow,
      width: widthResponse ? 3 : 5,
      height: '100%',
      left: widthResponse ? -1.5 : -2.5, //@@
      position: 'absolute',
      top: 5,
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
  });

  return {styles};
};
