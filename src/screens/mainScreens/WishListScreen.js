import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import WishProCard from '../../components/Card/WishProCard';
import {useIsFocused} from '@react-navigation/native';
import MainCard from '../../components/Card/MainCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import Modal from 'react-native-modal';
import {scrnWidth} from '../../utilities/helperFunction';
import {InputText} from '../../components/InputField/InputText';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {
  listProductApi,
  setCheckCollections,
  setFavModal,
  setProdId,
} from '../../redux/favSlice';
import {WhishlistShimmer} from '../../utilities/appShimmer';

export default function Wishlist() {
  const styles = useStyles();
  const appColor = appColors();
  const [collectionModal, setCollectionModal] = useState(false);
  const isFocus = useIsFocused();
  const textFocus = useRef(null);
  const dispatch = useDispatch();
  const [wishlist, setWishList] = useState([]);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [collectionTrigger, setCollectionTrigger] = useState(0);

  const {collections} = useSelector(state => state.fav);
  const {userSettings, vegToggle} = useSelector(state => state.setting);
  const showToast = useShowToast();

  const renderItem = ({item, index}) => {
    return (
      <>
        <WishProCard item={item} ind={index} />
      </>
    );
  };

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
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {fname: ''},
    resolver: yupResolver(schema),
  });

  const handleNewCollection = data => {
    if (isValid) {
      apiCall('createCollection', data.fname);
    }
  };

  const handlecollectionModal = () => {
    // Handle delete logic
    setCollectionModal(!collectionModal);
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  async function apiCall(context, newCollection = '') {
    try {
      if (wishlist && wishlist.length == 0) {
        setLoad(true);
      }
      const formData = new FormData();
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      formData.append('context', context);
      if (newCollection != '') {
        formData.append('newCollection', newCollection);
      }
      formData.append('veg_filter', vegToggle ? '1' : '0');
      const wishlistUrl = url().wishList;
      const response = await fetch(wishlistUrl, {
        method: 'POST',
        body: formData,
      });
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'success') {
          setWishList(resparse.data);
        } else {
          if (resparse.status == 'added') {
            setCollectionTrigger(collectionTrigger + 1);
            dispatch(setCheckCollections(newCollection));
          }
          setCollectionModal(false);
          if (userSettings?.userInfo?.user_id && collections != '') {
            dispatch(listProductApi());
          }
          // resparse.status != 'Error' && dispatch(listProductApi());
          showToast('custom', resparse.message, '', 2000);
          reset({fname: ''});
        }
        setLoad(false);
        setRefresh(false);
      } else {
        console.log(response.status, 'status-error');
        setLoad(false);
        setRefresh(false);
      }
    } catch (error) {
      console.log(error, 'collection api');
      setLoad(false);
      setRefresh(false);
    }
  }

  useEffect(() => {
    (() => {
      isFocus && apiCall('collectionList', '');
    })();
  }, [isFocus, collectionTrigger, vegToggle]);

  useEffect(() => {
    if (refresh) {
      (() => {
        apiCall('collectionList', '');
      })();
    }
  }, [refresh]);

  return (
    <MainCard>
      {load ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <WhishlistShimmer />
        </ScrollView>
      ) : (
        <>
          {/* //@@ */}
          <View style={{flex: 1, marginBottom: widthResponse ? 90 : 140}}>
            {/* //@@ */}
            <View style={{paddingTop: widthResponse ? 7 : 15}}>
              <Text style={[styles.head, {textAlign: 'center'}]}>
                MY
                <Text style={{color: appColor.themeYellow, paddingLeft: 10}}>
                  {' COLLECTIONS'}
                </Text>
              </Text>
            </View>
            {wishlist && wishlist.length > 0 ? (
              <View style={{flex: 1, paddingVertical: 10, paddingTop: 15}}>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                      colors={[appColor.themeYellow]}
                      tintColor={appColor.themeYellow}
                    />
                  }
                  data={wishlist}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.themeYellow]}
                    tintColor={appColor.themeYellow}
                  />
                }>
                <Text style={[styles.emptyFont]}>Your wishlist is empty</Text>
              </ScrollView>
            )}

            <View
              style={{
                flexDirection: 'row',
              }}>
              <PrimaryButton
                Title="CHOOSE COLLECTIONS"
                black
                parentStyle={{flex: 1}}
                altStyle={{marginRight: 10}}
                onPress={() => {
                  dispatch(setFavModal(true));
                  dispatch(setProdId(''));
                }}
              />
              <PrimaryButton
                Title="CREATE COLLECTION"
                profile
                parentStyle={{flex: 1}}
                altStyle={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  handlecollectionModal();
                }}
              />
            </View>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        onBackdropPress={() => {
          setCollectionModal(!collectionModal);
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
          setCollectionModal(!collectionModal);
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
              Create a new collection
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
                autoFocus={true} //@@
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
            Title="create a new collection"
            onPress={handleSubmit(handleNewCollection)}
          />
        </View>
      </Modal>
    </MainCard>
  );
}

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    head: {
      color: appColor.black,
      fontFamily: appFont.bB,
      fontSize: fontScalling(3), //@@
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
