import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import ImageView from 'react-native-image-viewing';
import appColors from '../../utilities/appColors';
import {
  arrayLength,
  currencyConvertor,
  fontScalling,
  objectLength,
  print,
  scrnHeight,
  scrnWidth,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import RatingComponent from '../../components/RatingComponents/RatingComponent';
import OfferTag from '../../components/CssShape/OfferTag';
import FavIconButton from '../../components/Buttons/FavIcon';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import SideHeading from '../../components/Card/SideHeading';
import MainOverflowCard from '../../components/Card/MainOverFlowCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import AddToCartBtn from '../../components/Buttons/AddToCartBtn';
import ReviewCard from '../../components/Card/ReviewCard';
import {url} from '../../utilities/appApi';
import AutoHeightHTML from '../../components/HtmlElement/AutoHeightWebView';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {DetailShimmer} from '../../utilities/appShimmer';
import {useSelector} from 'react-redux';
import RadioButton from '../../components/Buttons/RadioButton';
import ProductCard from '../../components/Card/ProductCard';

const ProductDetails = ({route, navigation}) => {
  const {styles} = useStyles();
  const appColor = appColors();
  const {userType} = useSelector(state => state.auth);

  const [imgIndex, setImgIndex] = useState(0);
  const [listBtn, setListBtn] = useState(false);
  const [listBtnRight, setListBtnright] = useState(false);
  const [toggleButton, setToggleButton] = useState(0);
  const dateRef = useRef(null);
  const [productInfo, setProductInfo] = useState({});
  const [reviewList, setReviewList] = useState([]);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeIndex, setSizeIndex] = useState(0);

  const {userSettings, vegToggle} = useSelector(state => state.setting);

  const scrollSizeRef = useRef(null);

  const NutritionCard = ({keys, values, altStyle = {}}) => {
    return (
      <>
        {values != 0 && (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingVertical: 8,
                borderBottomWidth: 0.4,
                borderBlockColor: appColor.lightGreyLine,
              },
              altStyle,
            ]}>
            <Animatable.Text
              // animation={'fadeInLeft'}
              duration={1000}
              style={[
                styles.normalText,
                {flex: 1, alignSelf: 'flex-start', paddingLeft: 15},
              ]}>
              {keys}
            </Animatable.Text>
            <Text style={styles.normalText}>:</Text>
            <Animatable.Text
              // animation={'fadeInRight'}
              duration={1000}
              style={[styles.normalText, {flex: 1, paddingLeft: 25}]}>
              {values}
            </Animatable.Text>
          </View>
        )}
      </>
    );
  };

  const apiCall = async (product_id = '') => {
    const productId = product_id != '' ? product_id : route?.params?.productId;
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('context', 'info');
      formData.append('veg_filter', vegToggle ? 1 : 0);

      if (route?.params?.productId) {
        formData.append('productId', productId);
        ``;
      }
      if (
        userSettings &&
        userSettings?.userInfo &&
        userSettings?.userInfo?.user_id
      ) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      // print(formData, 'formdata');
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (!objectLength(productInfo)) {
        setLoad(true);
      }
      // get the response:
      const response = await fetch(url().productDetail, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          if (resparse?.data?.product) {
            setProductInfo(resparse.data.product);
            if (resparse?.data?.product?.size) {
              setSizes(resparse?.data?.product?.size);
            }
            if (resparse?.data?.reviewslist) {
              setReviewList(resparse?.data?.reviewslist);
            }
            if (refresh) {
              setSizeIndex(0);
            }
            setLoad(false);
            setRefresh(false);
          }
        }
      } else {
        print(response.status, 'status in product Detail');
        setLoad(false);
        setRefresh(false);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error in product detail');
      setLoad(false);
      setRefresh(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  const {
    id,
    name,
    images,
    main_image,
    size,
    offer,
    discount,
    price,
    category,
    stock,
    product_group,
    short_description,
    product_description,
    additional_info,
    protein,
    calories,
    fats,
    vitamins,
    minerals,
    carbs,
    related,
    url: uri,
    gi,
    gl,
  } = productInfo;

  // console.log(images, 'images -- main_image,');
  // console.log(main_image, 'main_image,');

  const productToReview = {
    product_name: name,
    product_id: id,
    product_price: price,
    product_unit: stock,
    offer: offer,
    product_image:
      images && images != undefined && images.length > 0 ? images[0] : '',
    carbs: carbs,
  };

  const productsToCart = {
    id: id,
    name: name,
    image: images && images != undefined && images.length > 0 ? images[0] : '',
    size: size,
    offer: offer,
    discount: discount,
    price: price,
    category: category,
    stock: stock,
    product_group: product_group,
    protein,
    calories,
    fats,
    vitamins,
    minerals,
    carbs,
  };

  const productsToShow = {
    id: id,
    name: name,
    image:
      images && images != undefined && images.length > 0 ? images : main_image,
    size: size,
    offer_price: offer,
    offer: discount,
    price: price,
    category: category,
    stock: stock,
    product_group: product_group,
  };

  const onShare = async () => {
    if (images[0]) {
      const filename = images[0] && images[0].split('/').slice(-1).toString();
      try {
        const filePath = RNFS.DocumentDirectoryPath + `/${filename}`;
        const response = await fetch(images[0]);
        const blob = await response.blob();
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob);
        fileReaderInstance.onloadend = async () => {
          const base64data = fileReaderInstance.result;
          await RNFS.writeFile(filePath, base64data.split(',')[1], 'base64');
          const options = {
            title: `Check out this product: ${name}\nPrice: ${price}\ncatoegory: ${category}\n ${uri}`,
            url: 'file://' + filePath,
            type: 'image/jpeg',
            message: `Check out this product: ${name}\nPrice: ${price}\ncatoegory: ${category}\n ${uri}`,
          };
          await Share.open(options);
        };
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  };

  useEffect(() => {
    (() => {
      apiCall();
    })();
  }, [route, refresh, vegToggle]);

  // handleImageChange:
  const handleImageChange = click => {
    if (click == 'next') {
      if (imgIndex < productsToShow.image.length - 1) {
        setImgIndex(imgIndex + 1);
        dateRef.current.scrollToIndex({
          animated: true,
          index: imgIndex,
        });
      }
    }
    if (dateRef.current && click == 'prev' && imgIndex >= 1) {
      setImgIndex(imgIndex - 1);
      if (imgIndex == 1) {
        dateRef.current.scrollToIndex({
          animated: true,
          index: imgIndex - 1,
        });
      }
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <ReviewCard edit={false} data={item} review={true} productList={false} />
    );
  };

  return (
    <MainOverflowCard
      onRefresh={onRefresh}
      refresh={refresh}
      productId={productsToShow?.id}
      borderRadius={50}
      altStyle={{paddingTop: 23, paddingHorizontal: 0}}>
      {objectLength(productsToShow) && (
        <>
          {load ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <DetailShimmer />
            </ScrollView>
          ) : (
            <>
              {productsToShow.name && (
                <Text style={[styles.HeadingText, {textAlign: 'center'}]}>
                  {productsToShow.name}
                </Text>
              )}
              {reviewList &&
                reviewList.reviewdata &&
                reviewList.reviewdata.average && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <RatingComponent rating={reviewList.reviewdata.average} />
                    <Text style={[styles.subText]}>
                      {'  ( ' +
                        reviewList.reviewdata.review_count +
                        ' Reviews' +
                        ')'}
                    </Text>
                  </View>
                )}
              {/* banner Image */}
              {arrayLength(productsToShow.image) && (
                // <></>
                <Pressable
                  onPress={() => {
                    setIsVisible(true);
                  }}
                  style={{
                    borderRadius: 15,
                    height: scrnHeight / 3.5,
                    width: '100%',
                    alignSelf: 'center',
                    marginTop: 15,
                    // borderWidth: 1,
                    overflow: 'hidden',
                  }}>
                  <ImageBackground
                    resizeMode="cover"
                    source={{
                      uri: productsToShow.image
                        ? productsToShow.image[imgIndex]
                        : '',
                    }}
                    style={{
                      borderRadius: 15,
                      backgroundColor: appColor.cartBg,
                      height: scrnHeight / 3.5,
                      position: 'relative',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      alignSelf: 'center',
                      marginTop: 15,
                      // borderWidth: 1,
                      overflow: 'hidden',
                    }}>
                    <Animatable.View
                      // animation={'zoomIn'}
                      // duration={1000}
                      // iterationDelay={200}
                      // iterationCount={'infinite'}
                      style={{position: 'absolute', top: '10%', left: 0}}>
                      {productsToShow.offer && productsToShow.offer != 0 && (
                        <OfferTag
                          offer={
                            Number(productsToShow.offer).toFixed(0) + '% OFF'
                          }
                          reverse={true}
                        />
                      )}
                    </Animatable.View>
                    <View
                      style={{position: 'absolute', top: '7%', right: '5%'}}>
                      {userType == 'user' && (
                        <FavIconButton pId={productsToCart} />
                      )}
                      <Pressable
                        onPress={() => onShare()}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: appColor.white,
                          marginTop: 10,
                          elevation: 0.3,
                          shadowOffset: 2,
                        }}>
                        <Icon
                          ComponentName={'MaterialCommunityIcons'}
                          name={'share'}
                          color={appColor.bgBlack}
                          size={23}
                        />
                      </Pressable>
                    </View>
                    {/* {productsToShow.image && (
                      <Animatable.Image
                        animation={'zoomIn'}
                        duration={1000}
                        resizeMode="contain"
                        style={{
                          width: scrnWidth / 1.8,
                          height: scrnHeight / 5,
                          // borderRadius: (scrnWidth / 2.8) * 2,
                        }}
                        source={{uri: productsToShow.image[imgIndex]}}
                      />
                    )} */}
                  </ImageBackground>
                </Pressable>
              )}
              {/* list items */}
              {productsToShow &&
                arrayLength(productsToShow.image) &&
                productsToShow?.image?.length > 1 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: 15,
                      width: scrnWidth - 100,
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPressIn={() => setListBtn(true)}
                      onPressOut={() => setListBtn(false)}
                      style={{
                        borderRadius: 15,
                        backgroundColor: listBtn
                          ? appColor.bgBlack
                          : appColor.cartBg,
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 0.5,
                        shadowOpacity: 0.4,
                        shadowColor: appColor.bgBlack,
                      }}
                      onPress={() => {
                        handleImageChange('prev');
                      }}>
                      <Icon
                        name={'left'}
                        ComponentName={'AntDesign'}
                        size={14}
                        color={listBtn ? appColor.white : appColor.bgBlack}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        borderRadius: 10,
                        alignSelf: 'center',
                      }}>
                      <FlatList
                        data={productsToShow.image}
                        ref={dateRef}
                        keyExtractor={(item, index) => index}
                        style={{
                          width:
                            productsToShow?.image?.length > 2
                              ? scrnWidth / 2
                              : null,
                          alignSelf: 'center',
                        }}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        ItemSeparatorComponent={() => {
                          return <View style={{padding: 7}} />;
                        }}
                        renderItem={({item, index}) => {
                          return (
                            <Pressable
                              style={{
                                padding: 5,
                                backgroundColor: appColor.cartBg,
                                width: scrnWidth / 7,
                                height: scrnWidth / 7,
                                borderRadius: 5,
                                opacity: imgIndex == index ? 1 : 0.4,
                              }}
                              key={index}
                              onPress={() => {
                                setImgIndex(index);
                              }}>
                              {/* <Image
                                resizeMode="contain"
                                style={{width: '100%', height: '100%'}}
                                source={{uri: item}}
                              /> */}
                            </Pressable>
                          );
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPressIn={() => setListBtnright(true)}
                      onPressOut={() => setListBtnright(false)}
                      style={{
                        borderRadius: 15,
                        backgroundColor: listBtnRight
                          ? appColor.bgBlack
                          : appColor.cartBg,
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 0.5,
                        shadowOpacity: 0.4,
                        shadowColor: appColor.bgBlack,
                      }}
                      onPress={() => {
                        handleImageChange('next');
                      }}>
                      <Icon
                        name={'right'}
                        ComponentName={'AntDesign'}
                        size={14}
                        color={listBtnRight ? appColor.white : appColor.bgBlack}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              {productsToShow?.price && (
                <Text
                  style={[
                    styles.HeadingText,

                    {
                      alignSelf: 'center',
                      color: appColor.gold,
                      marginTop: productsToShow?.image?.length < 2 ? 15 : 0,
                      // marginVertical:
                      //   productsToShow?.image?.length < 2 ? 15 : 0,
                    },
                  ]}>
                  {currencyConvertor(productsToShow?.offer_price, 2) + '  '}
                  {productsToShow?.price &&
                    productsToShow?.offer_price &&
                    productsToShow?.price != productsToShow?.offer_price && (
                      <Text
                        style={[
                          styles.price,
                          {marginLeft: 15, textDecorationLine: 'line-through'},
                        ]}>
                        {currencyConvertor(productsToShow?.price, 2)}
                      </Text>
                    )}
                </Text>
              )}
              {protein != 0 ||
                vitamins != 0 ||
                calories != 0 ||
                fats != 0 ||
                (minerals != 0 && (
                  <Text style={[styles.normalText, {alignSelf: 'center'}]}>
                    Nutrients in food
                  </Text>
                ))}
              {/* {protein && <NutritionCard keys={'Protein'} values={protein} />} */}
              {protein && protein != 0 && (
                <NutritionCard keys={'Proteins'} values={`${protein} g`} />
              )}
              {vitamins && vitamins != 0 && (
                <NutritionCard keys={'vitamins'} values={`${vitamins}`} />
              )}
              {carbs && carbs != 0 && (
                <NutritionCard keys={'carbs'} values={`${carbs} g`} />
              )}
              {calories && calories != 0 && (
                <NutritionCard keys={'calories'} values={`${calories} cal`} />
              )}
              {fats && fats != 0 && (
                <NutritionCard keys={'Fats'} values={`${fats} g`} />
              )}
              {minerals && minerals != 0 && (
                <NutritionCard
                  keys={'Minerals'}
                  values={minerals}
                  // altStyle={{marginBottom: 15}}
                />
              )}
              {gi && gi != 0 && (
                <NutritionCard
                  keys={'GI'}
                  values={gi}
                  // altStyle={{marginBottom: 15}}
                />
              )}
              {gl && gl != 0 && (
                <NutritionCard
                  keys={'GL'}
                  values={gl}
                  // altStyle={{marginBottom: 15}}
                />
              )}

              {short_description && (
                <View style={{flex: 1, paddingBottom: 10}}>
                  <AutoHeightHTML url={short_description} />
                </View>
              )}
              {/* Button Block */}
              <View style={{flex: 1, marginVertical: 20}}>
                <AddToCartBtn data={productsToCart} detail={true} />
              </View>
              {/* Product size */}
              {sizes && sizes.length > 0 && (
                <FlatList
                  ref={scrollSizeRef}
                  data={sizes}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginVertical: 10,
                  }}
                  renderItem={({item: data, index}) => {
                    const active = index === sizeIndex;
                    return (
                      <Animatable.View
                        animation={'bounceInRight'}
                        duration={1500 * (index + 0.5)}>
                        <RadioButton
                          onPress={() => {
                            setSizeIndex(index);
                            if (
                              scrollSizeRef &&
                              scrollSizeRef.current &&
                              scrollSizeRef.current.scrollToIndex
                            ) {
                              scrollSizeRef.current.scrollToIndex({
                                index: index,
                                animation: true,
                              });
                            }
                            apiCall(data.id);
                          }}
                          isChecked={active}
                          text={`${data.size.toUpperCase()} @ ${currencyConvertor(
                            Number(data.offer).toFixed(0),
                          )}`}
                          altStyle={{
                            borderWidth: 1,
                            borderColor: active
                              ? appColor.gold
                              : appColor.bgBlack,
                            width: scrnWidth / 2,
                            paddingHorizontal: 10,
                            marginRight: index !== sizes.length - 1 ? 10 : 0,
                            color: active ? appColor.gold : appColor.bgBlack,
                          }}
                          altText={{
                            color: active ? appColor.gold : appColor.bgBlack,
                          }}
                        />
                      </Animatable.View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
              {/* Ratings and reviews */}
              {
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  {product_description && (
                    <Pressable
                      onPress={() => setToggleButton(0)}
                      style={{alignItems: 'center'}}>
                      <Text
                        style={[
                          styles.normalText,
                          {
                            color:
                              toggleButton == 0
                                ? appColor.bgBlack
                                : appColor.ratingGray,
                          },
                        ]}>
                        Details
                      </Text>
                      {toggleButton == 0 &&
                      reviewList &&
                      reviewList.reviews &&
                      reviewList.reviews.length > 0 ? (
                        <Animatable.View
                          animation={'zoomIn'}
                          duration={1000}
                          style={styles.dot}
                        />
                      ) : (
                        <View style={styles.dotWhite} />
                      )}
                    </Pressable>
                  )}
                  {reviewList &&
                    reviewList.reviews &&
                    reviewList.reviews.length > 0 && (
                      <Pressable
                        onPress={() => setToggleButton(1)}
                        style={{
                          paddingLeft: product_description && 50,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.normalText,
                            {
                              color:
                                (product_description == '' &&
                                  additional_info == '') ||
                                toggleButton == 1
                                  ? appColor.bgBlack
                                  : appColor.ratingGray,
                            },
                          ]}>
                          Ratings & Reviews
                        </Text>
                        {toggleButton == 1 && product_description ? (
                          <Animatable.View
                            animation={'zoomIn'}
                            duration={1000}
                            style={styles.dot}
                          />
                        ) : (
                          <View style={styles.dotWhite} />
                        )}
                      </Pressable>
                    )}
                </View>
              }
              {toggleButton == 0 && (
                <>
                  {product_description && (
                    <Animatable.View
                      animation={'fadeInUp'}
                      duration={1000}
                      style={{padding: 5}}>
                      {short_description && (
                        <>
                          <AutoHeightHTML url={product_description} />
                          <View style={{paddingTop: 10}}>
                            <AutoHeightHTML url={additional_info} />
                          </View>
                        </>
                      )}
                    </Animatable.View>
                  )}
                </>
              )}
              {((product_description == '' && additional_info == '') ||
                toggleButton == 1) && (
                <>
                  {reviewList &&
                    reviewList.reviews &&
                    reviewList.reviews.length > 0 && (
                      <FlatList
                        scrollEnabled={false}
                        data={reviewList.reviews.slice(0, 4)}
                        keyExtractor={(item, index) => index}
                        renderItem={renderItem}
                        style={{marginTop: 10}}
                        showsVerticalScrollIndicator={false}
                      />
                    )}
                  {reviewList &&
                    reviewList.reviews &&
                    reviewList.reviews.length > 3 && (
                      <PrimaryButton
                        Title={'see more reviews'}
                        altStyle={{marginBottom: 10}}
                        onPress={() => {
                          navigation.navigate('reviewOverView', {
                            productId: productInfo.id,
                          });
                        }}
                        outLine
                      />
                    )}
                  {productInfo?.review_posted == 1 &&
                    productInfo?.review_status && (
                      <PrimaryButton
                        Title={'Write a review'}
                        // altStyle={{marginTop: 10}}
                        // black

                        onPress={() => {
                          navigation.navigate('Profile', {
                            screen: 'ReviewProduct',
                            params: {item: productToReview, id: 'addReview'},
                          });
                        }}
                      />
                    )}
                </>
              )}
              {related && arrayLength(related) && (
                <>
                  {/* Related products */}
                  <SideHeading
                    title={'Related Foods'}
                    altStyle={{paddingHorizontal: 0}}
                    onPress={() => {
                      navigation.navigate('productOverView', {
                        context: 'relatedProducts',
                        productId: productsToShow.id,
                      });
                    }}
                  />
                  {/* card section */}
                  <View
                    style={{
                      borderRadius: 10,
                      overflow: 'hidden',
                      width: scrnWidth,
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={related.slice(0, 4)}
                      keyExtractor={(item, ind) => item.name.toString()}
                      renderItem={({item, index}) => {
                        // print(item, 'item');
                        return (
                          // <></>
                          <ProductCard key={index} item={item} ind={index} />
                        );
                      }}
                    />
                  </View>
                </>
              )}
            </>
          )}
          <ImageView
            images={images && images.map(data => ({uri: data}))}
            imageIndex={imgIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
        </>
      )}
    </MainOverflowCard>
  );
};

export default ProductDetails;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      paddingBottom: 5,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.5),
      color: appColor.black,
    },
    normalText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(2),
      color: appColor.black,
    },
    price: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.2),
      color: appColor.textGrey,
    },
    line: {
      width: scrnWidth,
      height: 0.5,
      backgroundColor: appColor.textGrey,
      alignSelf: 'center',
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.bgBlack,
      marginTop: 5,
    },
    dotWhite: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.white,
      marginTop: 5,
    },
  });

  return {styles};
};
