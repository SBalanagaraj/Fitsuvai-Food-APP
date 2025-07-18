import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const WishProCard = ({item, ind}) => {
  const appColor = appColors();
  const navigation = useNavigation();
  // console.log(item.count, 'item.count');
  return (
    <Animatable.View
      animation={'fadeInLeft'}
      duration={400 * ind}
      style={[
        {
          backgroundColor: appColor.cardbg,
          borderRadius: 15,
          elevation: 2,
          shadowOpacity: 0.2,
          shadowRadius: 2,
          shadowOffset: {height: 2},
        },
        item !== item.length - 1 && {marginBottom: widthResponse ? 10 : 20},
      ]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('WishListView', {
            collection: item.collection,
          });
        }}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderColor: appColor.white,
          justifyContent: 'center',
        }}>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                marginRight: 10,
                width: '100%',
                overflow: 'hidden',
              }}>
              {item &&
                item.images.map((img, index) => {
                  return (
                    <Animatable.View
                      animation={'slideInRight'}
                      duration={1500 * ind}
                      key={index}
                      style={{
                        resizeMode: 'contain',
                        width: scrnWidth / 4 - 21, //@@
                        height: scrnWidth / 4 - 21, //@@
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: appColor.white,
                        marginRight: widthResponse ? 5 : 10, //@@
                        borderRadius: widthResponse ? 5 : 10, //@@
                      }}>
                      {item && item.images.length > 0 && (
                        <Image
                          source={{uri: img}}
                          style={{
                            resizeMode: 'cover', //@@
                            width: '80%', //@@
                            height: '80%', //@@
                            borderRadius: widthResponse ? 5 : 10, //@@
                          }}
                        />
                      )}
                    </Animatable.View>
                  );
                })}
            </View>
          </View>
        </View>
        {item.count > 4 && (
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              // marginRight: 5,
            }}>
            <View
              style={{
                position: 'absolute',
                right: 0, //@@
                backgroundColor: `${appColor.textGrey}bb`, //@@
                // opacity: 0.8,
                alignItems: 'center',
                justifyContent: 'center',
                width: widthResponse
                  ? (scrnWidth - 25) / 4 - 21
                  : (scrnWidth - 90) / 4 - 21, //@@
                height: scrnWidth / 4 - 21, //@@
                paddingVertical: 10,
                borderRadius: 5,
                borderWidth: 0.4,
              }}>
              <Text
                style={{
                  color: appColor.white,
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2),
                }}>
                {item.count > 4 ? item.count - 3 + '+' : null}
              </Text>
            </View>
          </View>
        )}

        <View
          style={{
            paddingTop: item.count == 0 ? 0 : 12,
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: appColor.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 3,
            }}>
            <Text
              lineBreakMode="word-wrap"
              numberOfLines={1}
              style={{
                fontFamily: appFont.rM,
                color: appColor.textBlack,
                width: scrnWidth / 2.5,
                textTransform: 'capitalize',
                fontSize: fontScalling(2),
              }}>
              {item.collection}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: appFont.bB,
                  color: appColor.Textlightblack,
                  fontSize: fontScalling(1.8), //@@
                }}>
                {item.count + '  '}
                <Text
                  style={{
                    color: appColor.Textlightblack,
                    fontFamily: appFont.rM,
                    paddingLeft: 5,
                  }}>
                  Items
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default WishProCard;
