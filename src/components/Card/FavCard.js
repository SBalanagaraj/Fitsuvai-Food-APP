import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import Heart from 'react-native-vector-icons/AntDesign';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
} from '../../utilities/helperFunction';
import CheckBox from '../InputField/CheckBox';
import {useDispatch, useSelector} from 'react-redux';
import {setCheckCollections} from '../../redux/favSlice';

const FavCard = ({title, qty}) => {
  const appColor = appColors();
  const [check, setCheck] = useState(false);

  const dispatch = useDispatch();

  const {checkCollections} = useSelector(state => state.fav);

  print(checkCollections.length, 'checkCollections');

  return (
    <Pressable
      onPress={() => {
        if (checkCollections.length == 0) {
          dispatch(setCheckCollections(title));
        }
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingVertical: 5,
        }}>
        <View
          style={{
            width: scrnWidth / 7.5,
            height: scrnWidth / 7.5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 20,
            backgroundColor: appColor.cardbg,
          }}>
          <Heart name="heart" size={22} color={appColor.themeYellow} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 15,
          }}>
          <View>
            <Text
              style={{
                fontFamily: appFont.rM,
                color: appColor.textBlack,
                textTransform: 'capitalize',
                fontSize: fontScalling(2.1),
              }}>
              {title}
            </Text>
            <Text
              style={{
                fontFamily: appFont.rR,
                color: appColor.textBlack,
                fontSize: 15,
              }}>
              {qty} Items
            </Text>
          </View>
          <CheckBox
            checkBox={checkCollections.includes(title)}
            onPress={() => dispatch(setCheckCollections(title))}
            color
          />
        </View>
      </View>
    </Pressable>
  );
};

export default FavCard;

const styles = StyleSheet.create({});
