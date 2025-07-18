import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {ScrollView} from 'react-native-gesture-handler';
import MainCard from '../../components/Card/MainCard';
import ImageView from 'react-native-image-viewing';

import {
  fontScalling,
  objectLength,
  print,
  requestPermissions,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import FilterButton from '../../components/Buttons/FilterButton';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {Icon} from '../../utilities/icon';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageCropPicker, {openCamera} from 'react-native-image-crop-picker';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {useSelector} from 'react-redux';

export default function ReviewProduct({navigation, route}) {
  const appColor = appColors();
  const {styles} = useStyle();
  const [isModalVisible, setModalVisible] = useState(false);
  const [reviewProduct, setReviewProduct] = useState({
    rating: 0,
    reviewImage: [],
    description: '',
  });
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [details, setDetails] = useState({});
  const [imgIndex, setImgIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const showToast = useShowToast();
  const ratingCompleted = rating => {
    setReviewProduct(preData => {
      return {
        ...preData,
        rating: rating,
      };
    });
  };

  const {userSettings, vegToggle} = useSelector(state => state.setting);

  const [videoUrl, setVideoUrl] = useState('');
  // for video play
  const videoRef = useRef(null);
  const textFocus = useRef(null);

  const routeId = route.params.id;

  const openLib = async () => {
    const options = {mediaType: 'video', videoQuality: 'low'};
    const result = await launchImageLibrary(options);
    setVideoUrl(result?.assets[0]?.uri);
  };

  // update the route data:
  useEffect(() => {
    if (route.params.item) {
      setDetails(route.params.item);
      if (route.params.id == 'editReview') {
        setReviewProduct({
          rating: route.params.item.rating,
          reviewImage:
            route.params.item.images.length > 0
              ? route.params.item.images.split(',').map((dt, i) => {
                  return {
                    name: `review_img${i}.jpeg`,
                    uri: dt,
                    type: 'image/jpeg',
                  };
                })
              : [],
          description: route.params.item.review,
        });
      }
    }
  }, [route.params.id]);

  const OpenCamera = async () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      width: 200,
      height: 200,
      cropping: true,
      multiple: true,
      compressImageMaxHeight: 200,
      compressImageMaxWidth: 200,
    })
      .then(pic => {
        let profile = {
          name: 'profile.' + pic.mime.split('/')[1],
          uri: pic.path,
          type: 'image/jpeg',
        };
        setReviewProduct(preData => {
          return {
            ...preData,
            reviewImage: [...preData.reviewImage, profile],
          };
        });
        setModalVisible(false);
      })
      .catch(error => {
        console.log(error);
      });
    // setAnimButton(!animButton);
  };

  const OpenGallery = async () => {
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      width: 200,
      height: 200,
      cropping: true,
      compressImageMaxHeight: 200,
      compressImageMaxWidth: 200,
    })
      .then(image => {
        let imgArr = image.map((image, i) => {
          return {
            name: 'profile' + i + '.' + image.mime.split('/')[1],
            uri: image.path,
            type: image.mime,
          };
        });
        setReviewProduct(preData => {
          return {
            ...preData,
            reviewImage: [...preData.reviewImage, ...imgArr],
          };
        });
        setModalVisible(false);
      })
      .catch(error => {
        console.log(error);
      });
    // setAnimButton(!animButton);
  };

  const deleteImg = ind => {
    const deleteImg = reviewProduct.reviewImage.filter(
      (item, index) => index != ind,
    );
    setReviewProduct(preData => {
      return {
        ...preData,
        reviewImage: deleteImg,
      };
    });
  };

  // useEffect(() => {
  //   if (route.params.id == 'reviewEdit') {
  //     setReview(productDetail.review);
  //     setRating(productDetail.rating);
  //     setImage(productDetail.images);
  //     setdefImage(productDetail.images);
  //   }
  // }, []);

  // const submitReview = async () => {
  //   try {
  //     const formData = new FormData();
  //     if (route.params.id != 'reviewEdit') {
  //       formData.append('context', 'addReview');
  //       formData.append('userId', userDetail.user_id);
  //       formData.append('review', review);
  //       formData.append('rating', rating);
  //       formData.append('productId', productDetail.id);
  //       image.forEach((item, i) => {
  //         formData.append('images[]', item);
  //       });
  //     } else {
  //       formData.append('context', 'editReview');
  //       formData.append('userId', userDetail.user_id);
  //       formData.append('review', review);
  //       formData.append('rating', rating);
  //       formData.append('id', productDetail.id);
  //       formData.append(
  //         'exist_img',
  //         defImage.length > 0 ? defImage.join(',') : '',
  //       );
  //       editImage.forEach((item, i) => {
  //         formData.append('images[]', item);
  //       });
  //     }
  //     const productReviewsUrl = url.productReviewsUrl;
  //     const response = await fetch(productReviewsUrl, {
  //       method: 'POST',
  //       header: {
  //         Accept: 'application/x-www-form-urlencoded',
  //       },
  //       body: formData,
  //     });
  //     if (response.status == 200) {
  //       const resparse = await response.json();
  //       if (route.params.id != 'reviewEdit') {
  //         toast.hideAll();
  //         toast.show('Review submit sucess fully', {
  //           type: 'success',
  //           duration: 4000,
  //           offset: 30,
  //           placement: 'bottom',
  //           animationType: 'zoom-in',
  //           style: {
  //             marginBottom: 110,
  //           },
  //         });
  //         navigation.goBack();
  //       } else {
  //         toast.hideAll();
  //         toast.show(resparse.toast, {
  //           type: 'success',
  //           duration: 4000,
  //           offset: 30,
  //           placement: 'bottom',
  //           animationType: 'zoom-in',
  //           style: {
  //             marginBottom: 110,
  //           },
  //         });
  //       }
  //       navigation.navigate('MyReview');
  //     } else {
  //       console.log('status-error');
  //     }
  //   } catch (error) {
  //     console.log(error, 'Add review screen');
  //   }
  // };

  // api
  const apiCall = async () => {
    if (
      userSettings &&
      userSettings.userInfo &&
      userSettings.userInfo.user_id
    ) {
      try {
        // request data for backend:
        const formdata = new FormData();
        if (routeId != 'editReview') {
          formdata.append('userId', userSettings.userInfo.user_id);
          formdata.append('review', reviewProduct.description);
          formdata.append('rating', reviewProduct.rating);
          formdata.append('productId', route.params.item.product_id);
          formdata.append('context', 'addReview');
          if (reviewProduct.reviewImage.length > 0) {
            reviewProduct.reviewImage.forEach((item, i) => {
              formdata.append('images[]', item);
            });
          }
        } else {
          formdata.append('id', details.id);
          formdata.append('review', reviewProduct.description);
          formdata.append('rating', reviewProduct.rating);
          formdata.append('context', 'editReview');
          if (reviewProduct.reviewImage.length > 0) {
            reviewProduct.reviewImage.forEach((item, i) => {
              formdata.append('images[]', item);
            });
          }
        }
        print(formdata, 'formdata');
        var requestOptions = {
          method: 'POST',
          body: formdata,
        };
        // get the response:
        const response = await fetch(url().reviewApi, requestOptions);
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
            showToast('success', '', resparse.message, 2000);
            navigation.navigate('ReviewPage');
          }
        } else {
          print(response.status, 'status in home screen');
        }
        setLoad(false);
        setRefresh(false);
      } catch (e) {
        console.log(e, 'error in home screen');
        setRefresh(false);
        setLoad(false);
      }
    }
  };

  return (
    <MainCard>
      {!objectLength(details) ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={appColor.gold} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingBottom: widthResponse ? 90 : 130,
          }}
          keyboardShouldPersistTaps={'always'}
          ref={textFocus}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          extraHeight={300}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              borderBottomWidth: 1,
              borderBottomColor: appColor.borderColor,
              paddingBottom: 10,
            }}>
            <View
              style={{
                backgroundColor: appColor.cardbg,
                borderRadius: 100,
                padding: 15,
              }}>
              <Image
                style={{
                  width: scrnWidth / 4,
                  height: scrnWidth / 4,
                  borderRadius: 100,
                }}
                source={{
                  uri:
                    routeId != 'editReview'
                      ? details.product_image
                      : details.prod_image,
                }}
                resizeMode="cover"
              />
            </View>

            <Text
              style={{
                fontFamily: appFont.bB,
                color: appColor.textBlack,
                fontSize: fontScalling(3),
                marginVertical: 10,
              }}>
              {routeId != 'editReview'
                ? details.product_name
                : details.prod_name}
            </Text>
            <View style={{paddingBottom: 10}}>
              <Rating
                type="star"
                ratingColor={'gold'}
                ratingBackgroundColor="#f1f1f1"
                minValue={0}
                jumpValue={1}
                imageSize={23}
                ratingCount={5}
                onFinishRating={ratingCompleted}
                startingValue={reviewProduct.rating}
              />
            </View>
          </View>
          <View
            style={{
              paddingTop: 15,
              paddingBottom: 18,
              borderBottomWidth: 1,
              borderBottomColor: appColor.borderColor,
            }}>
            <Text style={styles.text}>Upload Image or Pick a Camera</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 10,
                paddingBottom: 15,
              }}>
              <FilterButton
                review
                altStyle={{width: scrnWidth / 2.35}}
                title={'Camera'}
                ICN={'MaterialCommunityIcons'}
                IN={'camera-plus-outline'}
                onPress={async () => {
                  const Camera = await requestPermissions('camera');
                  const Storage = await requestPermissions('storage');
                  if (Camera == 'granted' && Storage == 'granted') {
                    OpenCamera();
                  }
                }}
              />
              <FilterButton
                review
                altStyle={{width: scrnWidth / 2.35}}
                title={'Gallery'}
                ICN={'Ionicons'}
                IN={'folder-open'}
                onPress={() => {
                  requestPermissions('storage', OpenGallery);
                }}
              />
            </View>
            <Text style={styles.text}>
              Upload Photos reated to the product like Hygienic, Packaging.
            </Text>
            {/* {videoUrl !== '' && (
              <View
                style={{
                  overflow: 'hidden',
                  height: scrnWidth / 4,
                  width: scrnWidth / 4,
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginTop: 16,
                }}>
                (
                <Video
                  style={{
                    height: scrnWidth / 4,
                    width: scrnWidth / 4,
                    borderRadius: 10,
                  }}
                  source={{uri: videoUrl}}
                  ref={videoRef}
                  resizeMode="cover"
                  selectionLimit={2}
                />
                )
              </View>
            )} */}

            {reviewProduct && reviewProduct.reviewImage.length > 0 && (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                {reviewProduct.reviewImage.map((item, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        setIsVisible(true);
                        setImgIndex(index);
                      }}
                      key={index}
                      style={{
                        width: scrnWidth / 4,
                        height: scrnWidth / 4,
                        // borderRadius: 10,
                        marginRight: 10,

                        position: 'relative',
                      }}>
                      <Pressable
                        onPress={() => deleteImg(index)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          zIndex: 100,
                          backgroundColor: appColor.white,
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          elevation: 2,
                        }}>
                        <Icon
                          ComponentName={'AntDesign'}
                          name={'close'}
                          size={18}
                          color={appColors.Text}
                        />
                      </Pressable>
                      {item?.uri && item?.uri != '' && (
                        <Image
                          resizeMode="cover"
                          style={{
                            width: scrnWidth / 4,
                            height: scrnWidth / 4,
                            borderRadius: 15,
                            backgroundColor: appColor.greyBg,
                            marginRight: 10,
                          }}
                          source={{uri: item.uri ? item.uri : item}}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
          <View style={{paddingVertical: 15}}>
            <Text style={[styles.text, {paddingBottom: 10}]}>
              Write a review
            </Text>
            <TextInput
              numberOfLines={5}
              textAlignVertical="top"
              multiline={true}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 15,
                backgroundColor: appColor.cardbg,
                borderRadius: 10,
                color: appColor.Textlightblack,
                marginBottom: 20,
              }}
              onChangeText={val =>
                setReviewProduct(preData => {
                  return {
                    ...preData,
                    description: val,
                  };
                })
              }
              value={reviewProduct.description}
              placeholder="Enter your comments..."
              placeholderTextColor={appColor.Textlightblack}
              onFocus={event => {
                if (textFocus.current) {
                  textFocus.current.scrollToFocusedInput(event.target);
                }
              }}
            />
            <PrimaryButton
              Title={reviewProduct.description.length > 0 ? 'finish' : 'skip'}
              parentStyle={{flex: 1}}
              onPress={() => {
                reviewProduct.description.length > 0
                  ? apiCall()
                  : navigation.goBack();
              }}
            />
          </View>
          {print(reviewProduct.reviewImage, 'review image')}
          {/* review images full screen view */}
          {reviewProduct.reviewImage &&
            reviewProduct.reviewImage.length > 0 && (
              <ImageView
                images={reviewProduct.reviewImage.map(data => ({
                  uri: data.uri,
                }))}
                imageIndex={imgIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
              />
            )}
        </KeyboardAwareScrollView>
      )}
      {/* --------------------------bottom sheet camera------------------------- */}
      <ModalBottomSheet
        snapPoints={['20%', '20%']}
        isVisible={isModalVisible}
        close={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 60,
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <TouchableOpacity
            style={{marginRight: 40}}
            onPress={() => {
              OpenGallery();
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Icon
                ComponentName="Ionicons"
                name="folder-open"
                size={35}
                color={appColor.themeYellow}
              />
              <Text
                style={{
                  fontFamily: appFont.bB,
                  color: appColor.textBlack,
                  fontSize: fontScalling(2.5),
                  marginTop: 5,
                }}>
                Gallery
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const Camera = await requestPermissions('camera');
              const Storage = await requestPermissions('storage');
              if (Camera == 'granted' && Storage == 'granted') {
                OpenCamera();
              }
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Icon
                ComponentName="Ionicons"
                name="camera"
                size={35}
                color={appColor.themeYellow}
              />
              <Text
                style={{
                  fontFamily: appFont.bB,
                  color: appColor.textBlack,
                  fontSize: fontScalling(2.5),
                  marginTop: 5,
                }}>
                Camera
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ModalBottomSheet>
    </MainCard>
  );
}

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    text: {
      color: appColor.textBlack,
      fontSize: fontScalling(2.1),
      fontFamily: appFont.rM,
      lineHeight: fontScalling(2.9),
    },
  });

  return {styles};
};
