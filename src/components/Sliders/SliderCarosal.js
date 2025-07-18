import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {
  fontScalling,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import OfferTag from '../CssShape/OfferTag';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {useNavigation} from '@react-navigation/native';

const SliderCarosal = ({data}) => {
  const baseOptions = {
    vertical: false,
    width: scrnWidth * 0.7,
    height: scrnWidth / 2.2,
  };

  const appColor = appColors();
  const navigation = useNavigation();

  return (
    <View>
      <Carousel
        {...baseOptions}
        loop={true}
        // ref={ref}
        overscrollEnabled={true}
        style={{width: '100%'}}
        autoPlay={true}
        autoPlayInterval={2000}
        data={data}
        pagingEnabled={true}
        // onSnapToItem={index => console.log('current index:', index)}
        renderItem={({item, index}) => {
          return (
            <Pressable
              onPress={() => {
                navigation.navigate('productOverView', {
                  context: 'categories',
                  catId: item.id,
                });
              }}
              style={{marginRight: 10, borderRadius: 20, overflow: 'hidden'}}>
              <ImageBackground
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 20,
                }}
                key={index}
                source={{uri: item.image}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: appColor.overlayBgCorousel,
                    height: '100%',
                  }}>
                  {/* //@@ */}
                  <View style={{width: widthResponse ? '45%' : '50%'}} />
                  <View
                    style={{
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      height: '100%',
                    }}>
                    <OfferTag reverse={true} offer={item.offer} />
                    <Text
                      style={{
                        color: appColor.white,
                        fontFamily: appFont.bB,
                        fontSize: fontScalling(2.5),
                        paddingBottom: 10,
                        textTransform: 'capitalize',
                        width: '70%',
                        marginTop: 10,
                      }}>
                      {item.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // justifyContent: 'center',
                        width: '80%',
                      }}>
                      <Text
                        style={{
                          color: appColor.white,
                          fontFamily: appFont.rR,
                          fontSize: fontScalling(1.8),
                        }}>
                        {item.buttontext}
                      </Text>
                      <View style={{paddingLeft: 5}}>
                        <Icon
                          ComponentName={'AntDesign'}
                          name={'doubleright'}
                          size={12}
                          color={appColor.white}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default SliderCarosal;

const styles = StyleSheet.create({});
