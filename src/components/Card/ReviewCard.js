import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import RatingComponent from '../RatingComponents/RatingComponent';
import {useNavigation} from '@react-navigation/native';
import ReadMore from '../Buttons/ReadMore';
import ImageView from 'react-native-image-viewing';

const ReviewCard = ({data, edit = false, deleteFn, productList = true}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const navigation = useNavigation();
  const [imgIndex, setImgIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: appColor.cardbg,
        marginBottom: 15,
        borderRadius: 10,
        padding: 15,
      }}>
      {productList && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 7,
          }}>
          {data.prod_name && data.prod_name != '' && (
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                paddingRight: widthResponse ? 5 : 10,
                color: appColor.textBlack,
                fontFamily: appFont.bB,
                fontSize: fontScalling(3),
              }}>
              {data.prod_name} yg6t6gh7yh7y y6gyyh
            </Text>
          )}
          <View style={{flexDirection: 'row'}}>
            {edit && (
              <Pressable
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  navigation.navigate('ReviewProduct', {
                    item: data,
                    id: 'editReview',
                  });
                }}>
                <Icon
                  ComponentName={'AntDesign'}
                  name={'edit'}
                  color={appColor.themeYellow}
                  size={17}
                />
                <Text
                  style={{
                    fontFamily: appFont.rM,
                    color: appColor.themeYellow,
                    fontSize: fontScalling(2.3),
                    marginLeft: 6,
                  }}>
                  Edit
                </Text>
              </Pressable>
            )}
            {deleteFn && (
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                }}
                onPress={() => {
                  deleteFn(data.id);
                }}>
                <Icon
                  ComponentName={'Feather'}
                  name={'trash-2'}
                  color={appColor.boldBlacktext}
                  size={20}
                />
              </Pressable>
            )}
          </View>
        </View>
      )}
      {data.review != '' && (
        <ReadMore
          content={data.review}
          numOfLine={5}
          contentStyle={[styles.text]}
          parentStyle={{marginBottom: 10}}
          readStyle={{
            backgroundColor: appColor.greyBg,
          }}
        />
      )}
      <View
        style={{
          paddingTop: 5,
          borderTopWidth: 1,
          borderColor: appColor.borderColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <RatingComponent rating={data.rating} size={15} fullbg />
        <Text style={[styles.text, {fontSize: fontScalling(1.8)}]}>
          {productList ? 'Last Edited' : 'Posted on'} : {data.modified_at}
        </Text>
      </View>
      {data.images && data.images.split(',').length > 0 && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={data.images.split(',')}
          keyExtractor={(item, index) => index}
          horizontal={true}
          style={{marginTop: 8}}
          renderItem={({item, index}) => {
            const isLastItem = index === data.images.length - 1;
            return (
              <Pressable
                onPress={() => {
                  setIsVisible(true);
                  setImgIndex(index);
                }}
                key={index}
                style={{flexDirection: 'row', marginRight: isLastItem ? 0 : 8}}>
                <Image
                  style={{
                    width: scrnWidth / 5,
                    height: scrnWidth / 5,
                    borderRadius: 10,
                  }}
                  source={{uri: item}}
                />
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* review images full screen view */}
      <ImageView
        images={data.images.split(',').map(data => ({uri: data}))}
        imageIndex={imgIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default ReviewCard;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    text: {
      color: appColor.textBlack,
      fontSize: fontScalling(2.1),
      fontFamily: appFont.rR,
      lineHeight: fontScalling(2.9),
    },
  });

  return {styles};
};
