import React from 'react';
import {View, Text, Dimensions, Image, FlatList} from 'react-native';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {RefreshControl, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from '../../utilities/icon';
import {useNavigation} from '@react-navigation/native';
import {scrnWidth} from '../../utilities/helperFunction';
import ReviewCard from '../../components/Card/ReviewCard';
import {fontScalling} from '../../utilities/helperFunction';

const PublishedList = ({
  data,
  load,
  editFn,
  deleteFn,
  pullRefresh,
  refresh,
  productImgUrl,
  reviewImgUrl,
}) => {
  const navigation = useNavigation();
  const appColor = appColors();
  const renderItem = ({item, index}) => {
    return <ReviewCard keyIndex={index} data={item} />;
  };

  return (
    <>
      {load ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: scrnHeight - 200,
          }}>
          <ActivityIndicator size={'large'} color={appColor.gold} />
        </View>
      ) : (
        <View style={{width: '100%'}}>
          {data.length > 0 ? (
            <View
              style={{
                padding: 5,
                paddingTop: 15,
                backgroundColor: appColors.cartBg,
              }}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={pullRefresh}
                    colors={[appColor.themeYellow]}
                    style={{backgroundColor: appColor.bgBlack}}
                    tintColor={appColor.themeYellow}
                  />
                }
              />
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
                paddingVertical: 35,
                backgroundColor: appColor.cardbg,
                borderRadius: 15,
              }}>
              <View
                style={{
                  backgroundColor: appColor.themeYellow,
                  borderRadius: 50,
                  width: 80,
                  height: 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 5,
                }}>
                <Icon
                  ComponentName={'Foundation'}
                  name={'clipboard-pencil'}
                  color={appColor.white}
                  size={40}
                />
              </View>
              <Text
                style={{
                  fontFamily: appFont.bB,
                  color: appColor.textBlack,
                  fontSize: fontScalling(3),
                  paddingTop: 15,
                  paddingBottom: 10,
                }}>
                No Pending Reviews
              </Text>
              <Text style={{fontFamily: appFont.rM, color: appColor.textBlack}}>
                You have no products to review right now
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default PublishedList;
