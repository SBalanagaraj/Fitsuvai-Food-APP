import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import ProductCard from '../../components/Card/ProductCard';
import appColors from '../../utilities/appColors';
import MainCard from '../../components/Card/MainCard';
import FilterButton from '../../components/Buttons/FilterButton';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {appFont} from '../../utilities/appFont';
import {
  arrayLength,
  currencyConvertor,
  fontScalling,
  print,
  requestPermissions,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import CheckBox from '../../components/InputField/CheckBox';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {InputText} from '../../components/InputField/InputText';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ImageCropPicker from 'react-native-image-crop-picker';
import {url} from '../../utilities/appApi';
import {RefreshControl} from 'react-native-gesture-handler';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import {useIsFocused} from '@react-navigation/native';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {OverviewShimmer} from '../../utilities/appShimmer';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';

const ProductOverView = ({route, navigation}) => {
  const {context, name, productId, catId} = route.params;
  const appColor = appColors();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();
  const showToast = useShowToast();

  // states
  const [filterModal, setFilterModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [btnName, setBtnName] = useState('');
  const [isSortBy, setIsSortBy] = useState(0);
  const [productOverView, setProductOverview] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [altStart, setAltStart] = useState(0);
  const [ranges, setRanges] = useState([0, 100000]);
  const [rangeBoundry, setRangeBoundry] = useState([0, 0]);
  const [filters, setFilters] = useState({});
  const [selectFilters, setselectFilters] = useState({
    base_ingredient: [],
    base_flavor: [],
    fragrance: [],
  });

  const {userType} = useSelector(state => state.auth);
  const {userSettings, vegToggle} = useSelector(state => state.setting);

  const sortList = [
    'Popularity',
    'Price - Low to High',
    'Price - High to Low',
    'Discount',
  ];

  // drawer to navigate trigger:
  useEffect(() => {
    if (catId) {
      setProductOverview(prevData => ({
        data: prevData.data,
        start: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
      }));
      setAltStart(0);
      setFilters({});
      setIsSortBy(0);
      setRanges([0, 100000]);
      setRangeBoundry([0, 0]);
      setselectFilters({
        base_ingredient: [],
        base_flavor: [],
        fragrance: [],
      });
      apiCall(isSortBy, 'catId');
    }
  }, [catId]);

  useEffect(() => {
    setProductOverview(prevData => ({
      data: prevData.data,
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    }));
    setAltStart(0);
    setFilters({});
    setIsSortBy(0);
    setRanges([0, 100000]);
    setRangeBoundry([0, 0]);
    setselectFilters({
      base_ingredient: [],
      base_flavor: [],
      fragrance: [],
    });
    apiCall(isSortBy, 'catId');
  }, [vegToggle]);

  // initial api,pagination & route based trigger :
  useEffect(() => {
    if (!refresh && isFocus) {
      apiCall(isSortBy);
    }
    if (!isFocus) {
      setProductOverview(prevData => ({
        data: prevData.data,
        start: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
      }));
      setselectFilters({
        base_ingredient: [],
        base_flavor: [],
        fragrance: [],
      });
      setIsSortBy(0);
      setRanges([0, 100000]);
      setRangeBoundry([0, 0]);
      setAltStart(0);
      setFilters({});
    }
  }, [altStart, isFocus]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setProductOverview(prevData => ({
      data: prevData.data,
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    }));
    setAltStart(0);
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      apiCall();
    }
  }, [refresh]);

  // pagination:
  const paging = () => {
    setAltStart(Number(productOverView.start) + Number(productOverView.limit));
  };

  const apiCall = async (sort = -1, categories) => {
    try {
      // loading enable:
      if (productOverView.data.length == 0) {
        setLoad(true);
      }
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();

      if (context) {
        formData.append('context', context);
      }
      // filteredProducts:
      if (name) {
        formData.append('name', name);
      }
      // relatedProducts:
      if (productId) {
        formData.append('productId', productId);
      }
      // Categories:
      if (catId) {
        formData.append('catId', catId);
      }
      formData.append('start', categories == 'catId' ? 0 : altStart);

      // filtering price formDatas
      // if (ranges[1] != 100000 && categories != 'catId') {
      //   //@@
      //   formData.append('price_range', ranges.join(','));
      // }
      formData.append('veg_filter', vegToggle ? 1 : 0);
      // sorting formDatas:
      //note: isSortBy state is not update suddenly so create the sorting variable.
      let sorting = (sort || sort == 0) && sort != -1 ? sort : isSortBy;
      if (sorting && sorting != -1 && categories != 'catId') {
        //@@
        formData.append(
          'sort',
          sorting == 0
            ? 'popularity'
            : sorting == 1
            ? 'price_low'
            : sorting == 2
            ? 'price_high'
            : sorting == 3
            ? 'discount'
            : null,
        );
      }

      // filtering incredients:   //@@
      arrayLength(selectFilters.base_ingredient) &&
        categories != 'catId' &&
        formData.append('ingredient', selectFilters.base_ingredient.join(','));
      arrayLength(selectFilters.base_flavor) &&
        categories != 'catId' &&
        formData.append('base_flavor', selectFilters.base_flavor.join(','));
      arrayLength(selectFilters.fragrance) &&
        categories != 'catId' &&
        formData.append('fragrance', selectFilters.fragrance.join(','));

      // print(formData, 'formData in overView---');

      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // get the response:
      const response = await fetch(url().productOverview, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          setProductOverview(prevdata => {
            return {
              data:
                altStart == productOverView.start
                  ? resparse.data
                  : [...prevdata.data, ...resparse.data],
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              totalPages: Number(resparse.totalPages),
              page:
                altStart == productOverView.start
                  ? 1
                  : Number(prevdata.page + 1),
            };
          });
          if (
            Number(resparse.maximumPrice) > rangeBoundry[1] ||
            categories == 'catId'
          ) {
            if (Number(resparse.start) == 0 || categories == 'catId') {
              //@@
              setRangeBoundry(preData => {
                const updateRanges = [...preData];
                updateRanges[updateRanges.length - 1] = Number(
                  resparse.maximumPrice,
                );
                return updateRanges;
              });
              setRanges(preData => {
                const updateRanges = [...preData];
                updateRanges[updateRanges.length - 1] = Number(
                  resparse.maximumPrice,
                );
                return updateRanges;
              });
            }
          }
          if (resparse.filters) {
            setFilters(resparse.filters);
          }
        }
      } else {
        print(response.status, 'status in product overview');
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error in product overview');
      setRefresh(false);
      setLoad(false);
    }
  };

  // requestFootApi:
  const requestFood = async datas => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      datas?.fName && formData.append('productName', datas.fName);
      datas?.restaurantName &&
        formData.append('storeName', datas.restaurantName);
      datas?.Ingredients &&
        formData.append('packageContent', datas.Ingredients);
      datas?.Country && formData.append('country', datas.Country);
      datas?.image && formData.append('image', datas.image);

      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // get the response:
      const response = await fetch(url().request_food, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          setRequestModal(false);
          showToast('success', resparse.status, resparse.message, 1500);
        }
      } else {
        print(response.status, 'status in product overview');
      }
    } catch (e) {
      console.log(e, 'error in product overview');
    }
  };

  // in filter Modal request Change CheckBox
  const handleCheckBoxClick = (val, type) => {
    setselectFilters(preFilters => {
      const selectedFilters = preFilters[type];
      const updateItems = selectedFilters.includes(val)
        ? selectedFilters.filter(item => item != val)
        : [...selectedFilters, val];
      return {...preFilters, [type]: updateItems};
    });
  };

  // filter slider Function
  const onValuesChange = values => {
    setRanges(values);
  };

  // filter function
  const handleFilter = () => {
    setFilterModal(false);
    setProductOverview({
      data: [],
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    });
    setAltStart(0);
    setLoad(true);
    apiCall();
  };

  // sort function:
  const handleSort = ind => {
    setIsSortBy(ind);
    setBtnName('');
    setSortModal(false);
    setProductOverview({
      data: [],
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    });
    setAltStart(0);
    setLoad(true);
    apiCall(ind);
  };

  const schema = yup.object().shape({
    fName: yup.string().required('Please Provide a food name'),
    restaurantName: yup.string(),
    Ingredients: yup.string(),
    Country: yup.string(),
    image: yup
      .mixed()
      .required('An image is required')
      .test('fileType', 'Unsupported file format', value => {
        if (!value) return false;
        const supportedFormats = ['image/jpeg', 'image/png'];
        return supportedFormats.includes(value.type);
      }),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors, isValid},
  } = useForm({resolver: yupResolver(schema)});

  // navigation:
  const onPressSend = data => {
    requestFood(data);
  };

  const OpenCamera = async () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        let fileName = 'foodImg.' + image.mime.split('/')[1];
        setValue('image', {name: fileName, uri: image.path, type: image.mime});
      })
      .catch(error => {
        console.log(error);
      });
  };

  const OpenGallery = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        let fileName = 'foodImg.' + image.mime.split('/')[1];
        setValue('image', {name: fileName, uri: image.path, type: image.mime});
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <MainCard altStyle={{paddingHorizontal: 10}}>
      {load ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <OverviewShimmer />
        </ScrollView>
      ) : (
        <>
          {/*  top Button Container */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 10,
              paddingHorizontal: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {(filters?.fragrance?.length > 0 ||
                (filters && filters?.base_flavor?.length > 0) ||
                (filters && filters?.base_ingredient?.length > 0) ||
                rangeBoundry[1] != 0) && (
                <FilterButton
                  onPress={() => {
                    setFilterModal(true);
                    setBtnName('Filters');
                  }}
                  btnName={btnName}
                  title={'Filters'}
                  ICN={'FontAwesome6'}
                  IN={'sliders'}
                  altStyle={{marginRight: 10}}
                />
              )}
              <FilterButton
                onPress={() => {
                  setSortModal(true);
                  setBtnName('Sort by');
                }}
                btnName={btnName}
                title={'Sort by'}
                ICN={'Octicons'}
                IN={'sort-desc'}
              />
            </View>
            <FilterButton
              onPress={() => {
                if (userType == 'guest') {
                  navigation.navigate('login');
                } else {
                  setRequestModal(true);
                  setBtnName('Request Food');
                }
              }}
              btnName={btnName}
              title={'Request Food'}
              ICN={'AntDesign'}
              IN={'message1'}
            />
          </View>
          {/* Product List */}
          {productOverView && arrayLength(productOverView?.data) ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={onRefresh}
                  colors={[appColor.themeYellow]}
                  style={{backgroundColor: appColor.bgBlack}}
                  tintColor={appColor.themeYellow}
                />
              }
              contentContainerStyle={{paddingBottom: 90}}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={productOverView?.data}
              renderItem={({item, index}) => {
                return (
                  <ProductCard item={item} ind={index} calculative={true} />
                );
              }}
              onEndReached={() => {
                altStart == productOverView.start &&
                  productOverView.page < productOverView.totalPages &&
                  paging();
              }}
              ListFooterComponent={() => {
                return (
                  <>
                    {productOverView.page != productOverView.totalPages && (
                      <BallWithSpin
                        duration={1000}
                        containerStyle={{
                          width: widthResponse ? 40 : 70,
                          height: widthResponse ? 40 : 70,
                          zIndex: 10,
                          alignSelf: 'center',
                          marginTop: widthResponse ? 20 : 30,
                          marginVertical: widthResponse ? 0 : 30,
                        }}
                        imgStyle={{
                          width: '100%',
                          height: '100%',
                          zIndex: 10,
                        }}
                        imgSrc={require('../../../assets/images/load.png')}
                      />
                    )}
                  </>
                );
              }}
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={onRefresh}
                  colors={[appColor.themeYellow]}
                  style={{backgroundColor: appColor.bgBlack}}
                  tintColor={appColor.themeYellow}
                />
              }
              contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LottieView
                style={{width: scrnWidth / 1.5, height: scrnWidth / 1.5}}
                source={require('../../../assets/lottieFiles/emptyProduct.json')}
                autoPlay
                loop={true}
              />
              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(3),
                  color: appColor.gold,
                  paddingBottom: 15,
                }}>
                Product not Found
              </Text>
            </ScrollView>
          )}
          {/* filter BottomSheet */}
          <ModalBottomSheet
            isVisible={filterModal}
            snapPoints={['10%', '65%']}
            close={() => {
              setBtnName('');
              setFilterModal(false);
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // justifyContent: 'center',
                paddingHorizontal: 20,
                paddingBottom: 30,
              }}>
              {/* By Ingredients */}
              {filters?.fragrance?.length > 0 && (
                <>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(3),
                      color: appColor.black,
                      paddingBottom: 15,
                    }}>
                    Filter By Fragrance
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      flexWrap: 'wrap',
                      paddingBottom: 15,
                    }}>
                    {filters &&
                      filters?.fragrance?.map((val, ind) => {
                        return (
                          <CheckBox
                            ind={ind}
                            key={ind}
                            label={val}
                            color={true}
                            onPress={() =>
                              handleCheckBoxClick(val, 'fragrance')
                            }
                            checkBox={selectFilters.fragrance.includes(val)}
                            altStyle={{paddingRight: 15, paddingBottom: 15}}
                          />
                        );
                      })}
                  </View>
                </>
              )}
              {/* By flavor  */}
              {filters && filters?.base_flavor?.length > 0 && (
                <>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(3),
                      color: appColor.black,
                      paddingBottom: 15,
                    }}>
                    Filter By Flavors
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      flexWrap: 'wrap',
                      paddingBottom: 15,
                    }}>
                    {filters &&
                      filters?.base_flavor?.map((val, ind) => {
                        return (
                          <CheckBox
                            ind={ind}
                            key={ind}
                            label={val}
                            color={true}
                            onPress={() =>
                              handleCheckBoxClick(val, 'base_flavor')
                            }
                            checkBox={selectFilters.base_flavor.includes(val)}
                            altStyle={{paddingRight: 15, paddingBottom: 15}}
                          />
                        );
                      })}
                  </View>
                </>
              )}
              {/* By flavor  */}
              {filters && filters?.base_ingredient?.length > 0 && (
                <>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(3),
                      color: appColor.black,
                      paddingBottom: 15,
                    }}>
                    Filter By Incredients
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      flexWrap: 'wrap',
                      paddingBottom: 15,
                    }}>
                    {filters &&
                      filters?.base_ingredient?.map((val, ind) => {
                        return (
                          <CheckBox
                            ind={ind}
                            key={ind}
                            label={val}
                            color={true}
                            onPress={() =>
                              handleCheckBoxClick(val, 'base_ingredient')
                            }
                            checkBox={selectFilters.base_ingredient.includes(
                              val,
                            )}
                            altStyle={{paddingRight: 15, paddingBottom: 15}}
                          />
                        );
                      })}
                  </View>
                </>
              )}
              {/* price */}
              {rangeBoundry[1] != 0 && (
                <>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(3),
                      color: appColor.black,
                      paddingBottom: 15,
                    }}>
                    Filter by prices
                  </Text>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(3),
                      color: appColor.black,
                      paddingBottom: 15,
                    }}>
                    {`${
                      currencyConvertor(ranges[0], 2) +
                      '  -  ' +
                      currencyConvertor(ranges[1], 2)
                    }`}
                  </Text>
                  <View style={{paddingHorizontal: 5}}>
                    <MultiSlider
                      min={rangeBoundry[0]}
                      max={rangeBoundry[1]}
                      values={ranges}
                      step={2}
                      showSteps={true}
                      enabledTwo={true}
                      onValuesChange={onValuesChange}
                      isMarkersSeparated={true}
                      sliderLength={scrnWidth - 50}
                      snapped={true}
                      smoothSnapped={true}
                      unselectedStyle={{
                        backgroundColor: appColor.sliderGreyBg,
                        height: 7,
                        alignItems: 'center',
                        borderRadius: 5,
                      }}
                      selectedStyle={{
                        backgroundColor: appColor.gold,
                        height: 7,
                        alignItems: 'center',
                      }}
                      customMarkerLeft={e => {
                        return (
                          <View
                            style={{
                              padding: 5,
                              borderRadius: 15,
                              backgroundColor: appColor.white,
                              borderWidth: 0.5,
                              borderColor: appColor.gold,
                              elevation: 2,
                              shadowColor: appColor.gold,
                              alignItems: 'center',
                              marginTop: 4,
                            }}>
                            <View
                              style={{
                                padding: 6,
                                borderRadius: 10,
                                backgroundColor: appColor.gold,
                                borderWidth: 0.5,
                                borderColor: appColor.white,
                              }}
                            />
                          </View>
                        );
                      }}
                      customMarkerRight={e => {
                        return (
                          <View
                            style={{
                              padding: 5,
                              borderRadius: 15,
                              backgroundColor: appColor.white,
                              borderWidth: 0.5,
                              borderColor: appColor.gold,
                              elevation: 2,
                              shadowColor: appColor.gold,
                              alignItems: 'center',
                              marginTop: 4,
                            }}>
                            <View
                              style={{
                                padding: 6,
                                borderRadius: 10,
                                backgroundColor: appColor.gold,
                                borderWidth: 0.5,
                                borderColor: appColor.white,
                              }}
                            />
                          </View>
                        );
                      }}
                      containerStyle={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </>
              )}
              {(filters?.fragrance?.length > 0 ||
                (filters && filters?.base_flavor?.length > 0) ||
                (filters && filters?.base_ingredient?.length > 0) ||
                rangeBoundry[1] != 0) && (
                <View style={{paddingTop: 40}}>
                  <PrimaryButton Title={'FILTER'} onPress={handleFilter} />
                </View>
              )}
            </ScrollView>
          </ModalBottomSheet>

          {/* Sort BottomSheet */}
          <ModalBottomSheet
            isVisible={sortModal}
            snapPoints={['10%', '37%']}
            close={() => {
              setBtnName('');
              setSortModal(false);
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 20,
              }}>
              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(3),
                  color: appColor.black,
                  paddingBottom: 15,
                }}>
                SORT BY
              </Text>

              {sortList &&
                sortList.map((val, ind) => {
                  // const isSorted = ind == isSortBy;
                  return (
                    <Pressable
                      onPress={() => {
                        handleSort(ind);
                      }}
                      key={ind}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 12.5,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        backgroundColor: appColor.cartBg,
                        marginBottom: 5,
                        paddingLeft: 15,
                      }}>
                      <View>
                        <View
                          style={{
                            padding: 3,
                            borderRadius: 15,
                            backgroundColor: appColor.white,
                            borderWidth: 0.3,
                            borderColor:
                              isSortBy == ind ? appColor.gold : appColor.black,
                            elevation: 2,
                            shadowColor: appColor.gold,
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              padding: 7,
                              borderRadius: 15,
                              backgroundColor:
                                isSortBy == ind
                                  ? appColor.gold
                                  : appColor.white,
                              borderWidth: 0.5,
                              borderColor: appColor.white,
                            }}
                          />
                        </View>
                      </View>
                      <Text
                        style={{
                          fontFamily: appFont.rM,
                          fontSize: fontScalling(2),
                          color: appColor.black,
                          paddingLeft: 8,
                        }}>
                        {val}
                      </Text>
                    </Pressable>
                  );
                })}
            </ScrollView>
          </ModalBottomSheet>

          {/* Request Food BottomSheet */}
          <ModalBottomSheet
            isVisible={requestModal}
            snapPoints={['10%', '70%']}
            close={() => {
              setBtnName('');
              setRequestModal(false);
              reset();
            }}>
            <View style={{flex: 1, paddingHorizontal: 20}}>
              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(3),
                  color: appColor.black,
                  paddingBottom: 5,
                }}>
                Request food
              </Text>
              <Text
                style={{
                  fontFamily: appFont.rR,
                  fontSize: fontScalling(1.5),
                  color: appColor.black,
                  paddingBottom: 10,
                }}>
                Sed ut augue viverra, tempus ante nec, consectetur tortor. Nunc
                quis posuere quam. Etiam sed dolor vel mi blandit
              </Text>
              <View style={{flex: 1}}>
                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps={'always'}
                  contentContainerStyle={{paddingBottom: 15}}
                  scrollEnabled={true}
                  enableAutomaticScroll={true}
                  extraHeight={500}
                  ref={textFocus}
                  showsVerticalScrollIndicator={false}>
                  <Controller
                    name="fName"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <InputText
                          Title={'Food Name'}
                          placeholder={'Enter Food name'}
                          value={value}
                          onChangeText={onChange}
                          noelevation
                          onFocus={event =>
                            textFocus.current.scrollToFocusedInput(event.target)
                          }
                          formError={errors.fName}
                        />
                      );
                    }}
                  />
                  <Controller
                    name="restaurantName"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <InputText
                          Title={'Name of the restaurant'}
                          placeholder={'Enter restaurant name'}
                          value={value}
                          noelevation
                          onChangeText={onChange}
                          onFocus={event =>
                            textFocus.current.scrollToFocusedInput(event.target)
                          }
                        />
                      );
                    }}
                  />
                  <Controller
                    name="Ingredients"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <InputText
                          Title={'Ingredients '}
                          noelevation
                          placeholder={'Enter recipe ingredients'}
                          value={value}
                          onChangeText={onChange}
                          onFocus={event =>
                            textFocus.current.scrollToFocusedInput(event.target)
                          }
                        />
                      );
                    }}
                  />
                  <Controller
                    name="Country"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <InputText
                          Title={'Country'}
                          noelevation
                          placeholder={'Select country'}
                          value={value}
                          onChangeText={onChange}
                          onFocus={event =>
                            textFocus.current.scrollToFocusedInput(event.target)
                          }
                        />
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="image"
                    render={({field: {value}}) => (
                      <>
                        {value?.uri && value?.uri != '' ? (
                          <Image
                            source={{uri: value?.uri}}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 10,
                              alignSelf: 'center',
                              marginBottom: 15,
                            }}
                          />
                        ) : (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 5,
                                marginBottom: 20,
                              }}>
                              <Text
                                style={{
                                  fontFamily: appFont.rM,
                                  fontSize: fontScalling(1.7),
                                  color: appColor.black,
                                }}>
                                Upload the image
                              </Text>
                              <View style={{flexDirection: 'row'}}>
                                <FilterButton
                                  onPress={() => {
                                    requestPermissions('storage', OpenGallery);
                                    setBtnName('Open gallery');
                                  }}
                                  btnName={btnName}
                                  title={'Open gallery'}
                                  bgGolg={true}
                                />
                                <FilterButton
                                  // onTouchStart={
                                  //   async () => {
                                  //   const Camera = await requestPermissions(
                                  //     'camera',
                                  //   );
                                  //   const Storage = await requestPermissions(
                                  //     'storage',
                                  //   );
                                  //   if (
                                  //     Camera == 'granted' &&
                                  //     Storage == 'granted'
                                  //   ) {
                                  //     OpenCamera();
                                  //   }
                                  // }}
                                  onPress={async () => {
                                    const Camera = await requestPermissions(
                                      'camera',
                                    );
                                    const Storage = await requestPermissions(
                                      'storage',
                                    );
                                    if (
                                      Camera == 'granted' &&
                                      Storage == 'granted'
                                    ) {
                                      OpenCamera();
                                    }

                                    // requestPermissions('storage', OpenCamera);
                                    setBtnName('Take photo');
                                  }}
                                  btnName={btnName}
                                  title={'Take photo'}
                                  bgGolg={true}
                                  altStyle={{marginLeft: 10}}
                                />
                              </View>
                            </View>
                            {errors?.image && errors?.image != '' && (
                              <Text
                                style={{
                                  color: appColor.formError,
                                  fontSize: fontScalling(1.45),
                                  fontFamily: appFont.rR,
                                  marginBottom: 10,
                                }}>
                                {errors.image.message}
                              </Text>
                            )}
                          </>
                        )}
                      </>
                    )}
                  />
                  <PrimaryButton
                    onPress={handleSubmit(onPressSend)}
                    Title={'Send request'}
                  />
                </KeyboardAwareScrollView>
              </View>
            </View>
          </ModalBottomSheet>
        </>
      )}
    </MainCard>
  );
};

export default ProductOverView;

const styles = StyleSheet.create({});
