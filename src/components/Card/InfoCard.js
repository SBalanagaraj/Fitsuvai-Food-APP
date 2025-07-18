import {Image, Pressable, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {ScrollView} from 'react-native-gesture-handler';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {SvgUri} from 'react-native-svg';
import {Icon} from '../../utilities/icon';
import * as Animtable from 'react-native-animatable';

const gap = widthResponse ? 10 : 15; //@@
const logoSize = widthResponse ? 60 : 150;
const container = 20; //@@
const InfoCard = ({item, active, index, onPress = () => {}}) => {
  const appColor = appColors();
  const [Ipress, setIpress] = useState(false);
  return (
    <>
      <Pressable
        onPress={onPress}
        style={{
          width: (scrnWidth - 2 * container - gap) / 2, //@@
          height: (scrnWidth - 2 * container - gap) / 2, //@@
          paddingVertical: widthResponse ? 8 : 15,
          paddingHorizontal: widthResponse ? 8 : 15,
          borderRadius: widthResponse ? 15 : 20, //@@
          backgroundColor: active ? appColor.gold : appColor.cartBg,
          marginLeft: index % 2 == 0 ? 0 : gap, //@@
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: appFont.bB,
            fontSize: widthResponse ? fontScalling(2.2) : fontScalling(2.5),
            color: active ? appColor.white : appColor.black,
            paddingBottom: 10,
          }}>
          {item.name}
        </Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          {!Ipress && (
            <>
              {item.image &&
              item.image != null &&
              item.image.split('.').pop().toUpperCase() == 'SVG' ? (
                <>
                  <Animtable.View animation={'zoomIn'} duration={1000}>
                    <SvgUri
                      fill={active ? appColor.white : appColor.black}
                      width={logoSize} //@@
                      height={logoSize} //@@
                      uri={item.image}
                      onError={error => {
                        console.error('Failed to load SVG:', error);
                      }}
                    />
                  </Animtable.View>
                </>
              ) : item.image.split('.').pop().toUpperCase() == 'PNG' ||
                'JPG' ||
                'JPEG' ||
                'WEBG' ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    width: logoSize,
                    height: logoSize,
                    borderRadius: 10,
                  }}>
                  <Animtable.Image
                    duration={500}
                    animation={'zoomIn'}
                    resizeMode="cover"
                    style={{width: '100%', height: '100%'}}
                    source={{uri: item.image}}
                  />
                </View>
              ) : null}
            </>
          )}
          {Ipress && item.description && item.description != '' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                {
                  // margin: 'auto',
                }
              }
              style={{
                marginVertical: widthResponse ? 0 : 10,
              }}>
              <Pressable>
                <Animtable.Text
                  animation={'zoomIn'}
                  duration={500}
                  style={{
                    fontFamily: appFont.rM,
                    fontSize: fontScalling(1.9),
                    color: active ? appColor.white : appColor.black,
                    textAlign: 'center',
                  }}>
                  {item.description}
                </Animtable.Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
        {item.description && item.description != '' && (
          <View style={{width: '100%'}}>
            <Pressable
              onPress={() => setIpress(!Ipress)}
              style={{
                padding: 5,
                alignSelf: 'flex-end',
                opacity: Ipress ? 0.3 : 1,
              }}>
              <Icon
                ComponentName={'Entypo'}
                name={'info-with-circle'}
                size={widthResponse ? 20 : 35}
                color={
                  Ipress
                    ? appColor.bgBlack
                    : active
                    ? appColor.white
                    : appColor.themeYellow
                }
              />
            </Pressable>
          </View>
        )}
      </Pressable>
    </>
  );
};

export default InfoCard;
