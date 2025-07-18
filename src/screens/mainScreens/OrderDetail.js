import {View, Text, StyleSheet, Image, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  currencyConvertor,
  print,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import {Icon} from '../../utilities/icon';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import FromToCard from '../../components/Card/FromToCard';
import {url} from '../../utilities/appApi';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {OrderdetailShimmer} from '../../utilities/appShimmer';
import {useShowToast} from '../../components/Toast/ToastAlert';
import OrderPriceContainer from '../../components/Card/OrderPriceContainer';

const OrderDetail = ({navigation, route}) => {
  const {order_id, order_created} = route.params;
  const appColor = appColors();
  const showToast = useShowToast();
  const {styles} = useStyle();
  const [details, setDetails] = useState({});
  const [load, setLoad] = useState(false);

  // customeraddress
  const address = `${details.address && details.address.hno} , ${
    details.address && details.address.street
  } , ${details.address && details.address.city} - ${
    details.address && details.address.pincode
  } , ${details.address && details.address.country} `;

  // owneraddress
  const siteAddress = `${details.site_data && details.site_data.address} , ${
    details.site_data && details.site_data.city
  } - ${details.site_data && details.site_data.postcode}`;

  // file download
  const downloadFile = () => {
    if (details && details.order_details.invoicePdf) {
      const fileName = `Fitsuvai #${order_id} Invioce.pdf`;
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
        .fetch('GET', details.order_details.invoicePdf)
        .then(res => {
          showToast(
            'success',
            'Download Successfully',
            'Invoice Pdf Downloaded',
            2500,
          );
          // Vibration.vibrate(60);
        })
        .catch(err => console.log('BLOB ERROR -> ', err));
    }
  };

  //api call
  const apiCall = async () => {
    try {
      setLoad(true);
      // request data for backend:
      var myHeaders = new Headers();
      const formdata = new FormData();
      formdata.append('id', order_id);
      formdata.append('context', 'orderDetails');
      var requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(url().myOrder, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          // print(resparse, 'resparse');

          setDetails(resparse.data);
        }
      }
      setLoad(false);
    } catch (error) {
      console.log(error, 'Error in order detail');
      setLoad(false);
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  print(details, 'details');

  return (
    <MainOverflowCard borderRadius={40} altStyle={{paddingTop: 20}}>
      {load ? (
        <OrderdetailShimmer />
      ) : details ? (
        <>
          <View style={{alignItems: 'center', marginTop: 10}}>
            {/* logo */}
            <View
              style={{
                marginBottom: 10,
                width: widthResponse ? 70 : 100,
                height: widthResponse ? 70 : 100,
              }}>
              <Image
                resizeMode="contain"
                style={{width: '100%', height: '100%'}}
                source={require('../../../assets/images/splash_logo.png')}
              />
            </View>
            <Text style={[styles.roboto_light, {marginBottom: 10}]}>
              <Text style={{color: appColor.Textlightblack}}>Order Id: #</Text>
              {order_id && order_id}
            </Text>
            {/* download pdf */}
            <PrimaryButton
              altStyle={{
                flex: 0,
                paddingHorizontal: 25,
                paddingVertical: 7,
              }}
              parentStyle={{marginBottom: widthResponse ? 30 : 40}}
              Title={'Download Invoice'}
              black
              download
              onPress={downloadFile}
            />
          </View>
          {/* light line */}
          <View
            style={{
              height: 1,
              width: scrnWidth,
              left: -23,
              backgroundColor: appColor.lightGreyLine,
            }}
          />
          {/* from and to */}
          <View style={{paddingVertical: 15}}>
            {/* from */}
            {details.site_data && (
              <FromToCard
                title={details.site_data.name && details.site_data.name}
                location={siteAddress && siteAddress}
                phone={details.site_data.phone && details.site_data.phone}
                email={details.site_data.email && details.site_data.email}
              />
            )}
            {/* to */}
            {details.address && (
              <FromToCard
                title={details.address.name && details.address.name}
                to
                // deliveredTime={details.address.to.deliveredTime}
                location={address && address}
                phone={details.address.phone && details.address.phone}
                email={details.address.email && details.address.email}
              />
            )}
          </View>
          <PrimaryButton
            Title={'Track Order'}
            onPress={() => {
              navigation.navigate('order_track', {
                order_id: order_id,
                cancelled:
                  details?.order_details?.deleted &&
                  details?.order_details?.deleted,
                delivery_date:
                  details?.order_details?.delivery_date &&
                  details?.order_details?.delivery_date,
                order_created,
              });
            }}
            parentStyle={{padding: 0, paddingBottom: 20}}
          />
          {/* products */}
          {details.product_details && details.product_details.length > 0 && (
            <FlatList
              scrollEnabled={false}
              data={details.product_details}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      marginVertical: 20,
                      backgroundColor: appColor.lightGreyLine,
                    }}
                  />
                );
              }}
              keyExtractor={(data, index) => index}
              renderItem={({item, index}) => {
                return (
                  <Pressable key={index} style={[styles.card_in]}>
                    {/* images */}
                    <View style={styles.img_view}>
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: appColor.greyBg,
                        }}>
                        {item.product_image && item.product_image != '' && (
                          <Image
                            style={{
                              width: '80%',
                              height: '80%',
                              borderRadius: 150,
                            }}
                            resizeMode="cover"
                            source={{uri: item.product_image}}
                          />
                        )}
                      </View>
                    </View>
                    {/* details */}
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 10,
                      }}>
                      {item.product_name && (
                        <Text
                          numberOfLines={1}
                          style={[styles.baby_blk, {marginBottom: 3}]}>
                          {item.product_name}
                        </Text>
                      )}
                      {item.product_count && item.product_price && (
                        <Text style={[styles.roboto_light, {marginBottom: 7}]}>
                          {item.product_count} x{' '}
                          {currencyConvertor(item.product_price, 2)}
                        </Text>
                      )}
                      {item.product_total && (
                        <Text
                          style={[
                            styles.roboto_light,
                            {
                              fontFamily: appFont.rB,
                              color: appColor.themeYellow,
                            },
                          ]}>
                          {currencyConvertor(item.product_total, 2)}
                        </Text>
                      )}
                    </View>
                    {/* Add Review */}
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {print(details, 'item')}
                      {details.status_history[4].value != 0 &&
                        item.review_posted != 0 && (
                          <Pressable
                            onPress={() => {
                              navigation.navigate('ReviewProduct', {
                                item: item,
                                id: 'addReview',
                              });
                            }}
                            style={{
                              paddingHorizontal: 25,
                              paddingVertical: 8,
                              borderRadius: 50,
                              borderWidth: 1,
                              borderColor: appColor.lightGreyLine,
                            }}>
                            <Text
                              style={[
                                styles.baby_blk,
                                {
                                  bottom: 0,
                                  fontSize: fontScalling(2),
                                  lineHeight: fontScalling(2.2),
                                },
                              ]}>
                              Add Review
                            </Text>
                          </Pressable>
                        )}
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
          {/* Total */}
          {details.order_details && (
            <View
              style={{
                width: scrnWidth,
                left: -23,
                marginVertical: 20,
                paddingVertical: 15,
                backgroundColor: appColor.greyBg,
              }}>
              {/* subtotal */}
              {details?.order_details && details.address.distance && (
                <OrderPriceContainer
                  data={details.order_details}
                  isPersent={true}
                  km={details.address.distance}
                />
              )}
            </View>
          )}
          {/* note */}
          <View style={{marginBottom: 20}}>
            <Text
              style={[
                styles.roboto_light,
                {
                  textTransform: 'uppercase',
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.9),
                  // marginBottom: 10,
                },
              ]}>
              NOTE:
            </Text>
            <Text style={styles.roboto_light}>{details.notes}</Text>
          </View>
          {/* Thanks for rating */}
          <View
            style={{
              width: '100%',
              // marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              borderRadius: 6,
              padding: 8,
              backgroundColor: appColor.themeyellowLight,
              alignItems: 'center',
            }}>
            <Icon
              name={'thumbs-up'}
              ComponentName={'Feather'}
              size={widthResponse ? 15 : 20}
              color={appColor.themeYellow}
            />
            <Text
              style={[
                styles.roboto_light,
                {color: appColor.themeYellow, marginLeft: 4},
              ]}>
              Thanks for the rating !....
            </Text>
          </View>
        </>
      ) : (
        <Text>NOthing to show</Text>
      )}
    </MainOverflowCard>
  );
};

export default OrderDetail;

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
      backgroundColor: appColor.bgWhite,
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
