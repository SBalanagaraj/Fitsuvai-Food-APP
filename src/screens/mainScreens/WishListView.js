import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {
  arrayLength,
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import MainCard from '../../components/Card/MainCard';
import ProductCard from '../../components/Card/ProductCard';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {url} from '../../utilities/appApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  listProductApi,
  setCheckCollections,
  setInitialCheckCollections,
} from '../../redux/favSlice';
import Modal from 'react-native-modal';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {scrnWidth} from '../../utilities/helperFunction';
import {InputText} from '../../components/InputField/InputText';
import {useForm, Controller} from 'react-hook-form';
import {OverviewShimmer} from '../../utilities/appShimmer';

export default function WishListView({navigation, route}) {
  const styles = useStyles();
  const appColor = appColors();
  const {item} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState([]);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const [collectionModal, setCollectionModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');

  const textFocus = useRef(null);
  const {favList, checkCollections} = useSelector(state => state.fav);
  const {userSettings, vegToggle} = useSelector(state => state.setting);

  useEffect(() => {
    apiCall('collectionOverview', '');
  }, [collectionName, favList, vegToggle]);

  print('iiiii');

  async function apiCall(context, newCollection = '') {
    try {
      if (product && product.length == 0) {
        setLoad(true);
      }
      const formData = new FormData();
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      formData.append('context', context);
      if (route?.params?.collection && route.params.collection != '') {
        formData.append('collection', route.params.collection);
      }
      if (newCollection != '') {
        formData.append('newCollection', newCollection);
      }
      formData.append('veg_filter', vegToggle ? '1' : '0');

      print(formData, 'formData');

      const wishlistUrl = url().wishList;
      const response = await fetch(wishlistUrl, {
        method: 'POST',
        body: formData,
      });
      // print(formData, 'formdata');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'wishlistview');
        if (resparse.status == 'success') {
          setProduct(resparse.data);
          setLoad(false);
          if (context == 'deleteCollection') {
            if (
              arrayLength(checkCollections) &&
              checkCollections.includes(collectionName)
            ) {
              dispatch(setCheckCollections(collectionName)); //@@
            }
            navigation.goBack();
            dispatch(listProductApi());
          } else if (context == 'editCollection') {
            dispatch(listProductApi());
            let collectionVar = checkCollections.map(data =>
              collectionName == data ? newCollection : data,
            );
            dispatch(setInitialCheckCollections(collectionVar));
            setCollectionName(newCollection);
            setCollectionModal(false);
          }
        } else if (resparse.status == 'Error') {
          setLoad(false);
          setRefresh(false);
        }
      } else {
        console.log(response.status, 'status-error wishlist view');
        setLoad(false);
        setRefresh(false);
      }
    } catch (error) {
      console.log(error, 'collection api');
      setLoad(false);
      setRefresh(false);
    }
  }

  // validation:
  const schema = yup
    .object()
    .shape({
      fname: yup.string('must be string').required('Name is required'),
    })
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {fname: ''},
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    (() => {
      if (route.params.collection) {
        setCollectionName(route.params.collection);
        setValue('fname', route.params.collection);
      }
    })();
  }, [route]);

  const handleNewCollection = data => {
    if (isValid) {
      apiCall('editCollection', data.fname);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <ProductCard
          key={index}
          item={item}
          ind={index}
          collectionName={route.params.collection}
          calculative={true}
        />
      </>
    );
  };

  return (
    <MainCard>
      {load ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <OverviewShimmer />
        </ScrollView>
      ) : (
        <>
          <View style={{flex: 1}}>
            <View style={{paddingBottom: 5}}>
              <Text
                style={{
                  fontFamily: appFont.bB,
                  color: appColor.textBlack,
                  fontSize: fontScalling(3),
                  paddingVertical: 5,
                }}>
                {collectionName}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {item && item.length > 0 && (
                <Text
                  style={{
                    fontFamily: appFont.bB,
                    color: appColor.textBlack,
                  }}>
                  {item.length} items
                </Text>
              )}
            </View>
            {/* //@@ */}
            {collectionName != 'MyWishlist' && (
              <Pressable
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingVertical: 15,
                }}>
                <Pressable
                  onPress={() => {
                    setCollectionModal(true);
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    borderColor: appColor.textBlack,
                    borderWidth: 0.8,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 3,
                  }}>
                  <Icon
                    ComponentName="FontAwesome"
                    name="pencil"
                    color={appColor.themeYellow}
                    size={widthResponse ? 13 : 25} //@@
                  />
                  <Text
                    style={{
                      paddingLeft: 8,
                      fontFamily: appFont.rM,
                      color: appColor.textBlack,
                      fontSize: fontScalling(2.3),
                    }}>
                    Edit
                  </Text>
                </Pressable>
                <Pressable
                  style={{paddingHorizontal: widthResponse ? 5 : 8}} //@@
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <Icon
                    ComponentName="Entypo"
                    name="dots-three-vertical"
                    color={appColor.themeYellow}
                    size={widthResponse ? 17 : 30} //@@
                  />
                </Pressable>
              </Pressable>
            )}
            {item && item.length == 0 && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>You haven't added any products yet</Text>
                <Text>
                  click{' '}
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'heart'}
                    size={15}
                    color={appColors.Green}
                  />
                  {''} to save products
                </Text>
                <View style={{paddingTop: 20}}>
                  <PrimaryButton
                    title={'Find item to save'}
                    onpress={() => navigation.navigate('RootCategories')}
                  />
                </View>
              </View>
            )}
            {product && arrayLength(product) ? (
              <FlatList
                data={product}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingBottom: widthResponse ? 90 : 140, //@@
                }}
                keyExtractor={(item, index) => index}
                numColumns={2}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                // refreshControl={
                //   <RefreshControl
                //     refreshing={refresh}
                //     onRefresh={onRefresh}
                //     colors={[appColor.themeYellow]}
                //     tintColor={appColor.themeYellow}
                //   />
                // }
                contentContainerStyle={{
                  flex: 1,
                  alignItems: 'center',
                  paddingBottom: widthResponse ? 90 : 140, //@@
                  justifyContent: 'center',
                }}>
                <Text style={[styles.emptyFont]}>
                  No products in your collection
                </Text>
              </ScrollView>
            )}
          </View>
          <ModalBottomSheet
            snapPoints={['10%', '20%']}
            isVisible={isModalVisible}
            close={() => {
              setModalVisible(false);
            }}>
            <Pressable
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: appColor.cardbg,
                paddingVertical: 10,
                margin: 30,
                flexDirection: 'row',
                borderRadius: 10,
              }}
              onPress={() => {
                apiCall('deleteCollection', '');
                setModalVisible(false);
              }}>
              <Icon
                ComponentName={'MaterialCommunityIcons'}
                name={'delete'}
                size={widthResponse ? 20 : 30} //@@
                color={appColor.textBlack}
              />
              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2),
                  marginBottom: -5, //@@
                  color: appColor.textBlack,
                  marginLeft: 10,
                }}>
                Delete the collections
              </Text>
            </Pressable>
          </ModalBottomSheet>
          {/* Edit collection */}
          <Modal
            animationType="slide"
            onBackdropPress={() => {
              setCollectionModal(false);
            }}
            backdropColor={appColor.overlayBg}
            backdropOpacity={1}
            transparent={true}
            isVisible={collectionModal}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
              width: scrnWidth / 1.1,
              marginHorizontal: 'auto',
            }}
            onRequestClose={() => {
              setCollectionModal(false);
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: appColor.white,
                paddingHorizontal: 15,
                paddingVertical: 20,
                borderRadius: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: appColor.textBlack,
                    fontFamily: appFont.bB,
                    flex: 1,
                    fontSize: fontScalling(2.7),
                    marginBottom: 15,
                  }}>
                  EDIT YOUR COLLECTION
                </Text>
                <TouchableOpacity onPress={() => setCollectionModal(false)}>
                  <Icon
                    ComponentName="AntDesign"
                    name="close"
                    size={23}
                    color={appColor.textBlack}
                  />
                </TouchableOpacity>
              </View>
              {/* Name */}
              <Controller
                name="fname"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Enter name'}
                    value={value}
                    row
                    noelevation
                    Title={'Collection name'}
                    onChangeText={onChange}
                    formError={errors.fname}
                    onFocus={event => {
                      if (textFocus.current) {
                        textFocus.current.scrollToFocusedInput(event.target);
                      }
                    }}
                  />
                )}
              />

              <PrimaryButton
                Title="ENTER TO CHANGE COLLECTION"
                onPress={handleSubmit(handleNewCollection)}
              />
            </View>
          </Modal>
        </>
      )}
    </MainCard>
  );
}

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    head: {
      color: appColor.black,
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      paddingBottom: 5,
    },
    emptyFont: {
      color: appColor.gold,
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.5),
    },
  });
  return styles;
};
