import {StyleSheet, View, Pressable, ToastAndroid} from 'react-native';
import React, {useState, useRef} from 'react';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToFav,
  addToFavApi,
  setFavList,
  setFavModal,
  setProdId,
} from '../../redux/favSlice';
import {widthResponse} from '../../utilities/helperFunction';
import {useShowToast} from '../Toast/ToastAlert';

const FavIconButton = ({pId, indColl = '', collectionName}) => {
  const {favList, checkCollections} = useSelector(state => state.fav);
  const {userType} = useSelector(state => state.auth);

  const showToast = useShowToast();

  const appColor = appColors();
  const {styles} = useStyles();

  const wishListRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleAddToFavorites = async () => {
    const result = await dispatch(
      addToFavApi({pId: pId.id, collectionName: collectionName}),
    );
    console.log(checkCollections, 'result', collectionName);
    if (result?.payload && result?.payload != '') {
      showToast(
        result?.payload?.status === 'added' ? 'success' : 'error',
        result?.payload?.status.toUpperCase(),
        `${result?.payload?.status === 'added' ? 'Added to' : 'Removed from'} ${
          collectionName && collectionName != '' //@@
            ? collectionName
            : checkCollections.length == 0
            ? 'Mywishlist'
            : checkCollections.join(', ')
        } collection${
          checkCollections.length > 1 && collectionName == '' ? 's' : ''
        }`,
        2000,
      );
    }
  };

  return (
    <Pressable
      onLongPress={() => {
        if (userType !== 'guest') {
          dispatch(setProdId(pId.id));
          dispatch(setFavModal(true));
        }
      }}
      onPress={() => {
        userType == 'guest'
          ? navigation.navigate('login')
          : handleAddToFavorites();
        if (wishListRef.current) {
          wishListRef.current.play(0, 150);
        }
      }}>
      {/* {load ? 
      ( */}
      <View style={styles.heart}>
        {favList && favList.length > 0 && favList.includes(pId.id) ? (
          <>
            <LottieView
              ref={wishListRef}
              resizeMode="contain"
              style={{
                width: widthResponse ? 50 : 80, //@@
                height: widthResponse ? 50 : 80, //@@
              }}
              source={require('../../../assets/lottieFiles/heart.json')}
              // autoPlay
              loop={false}
            />
          </>
        ) : (
          <Icon
            ComponentName={'MaterialCommunityIcons'}
            name={'heart-outline'}
            color={appColor.bgBlack}
            size={widthResponse ? 23 : 35} //@@
          />
        )}
      </View>
      {/* ) 
      : (
        <View style={styles.heart}>
          <MaterialCommunityIcons
            name={
              (favCtx.favList ? favCtx.favList.find(ele => ele == cid) : null)
                ? 'heart'
                : 'heart-outline'
            }
            color={appColors.Green}
            size={18}
          />
        </View>
      )} */}
    </Pressable>
  );
};

export default FavIconButton;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    heart: {
      width: widthResponse ? 30 : 50, //@@
      height: widthResponse ? 30 : 50, //@@
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appColor.white,
    },
  });
  return {styles};
};
