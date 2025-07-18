import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {useSelector} from 'react-redux';
import {fontScalling, print} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import * as Animatable from 'react-native-animatable';

const NutritionCard = ({data}) => {
  const appColor = appColors();
  const {total} = useSelector(state => state.cart);

  const NutritionList = ({keys, values, duration}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomWidth: keys == 'Carbs' ? 0 : 0.7,
          borderColor: appColor.borderColor,
        }}>
        <Animatable.Text
          animation={'zoomIn'}
          duration={duration}
          style={{
            fontFamily: appFont.rB,
            fontSize: fontScalling(2),
            color: appColor.textGrey,
          }}>
          {`${keys} :`}
        </Animatable.Text>
        <Animatable.Text
          animation={'bounceInDown'}
          duration={duration}
          style={{
            fontFamily: appFont.rM,
            fontSize: fontScalling(2),
            color: appColor.Textlightblack,
          }}>
          {' '}
          {values != 0 ? `${values} ${keys == 'Carbs' ? 'cal' : 'g'}` : 'N/A'}
        </Animatable.Text>
      </View>
    );
  };

  return (
    <>
      {Object.values(data).join('') != '' && (
        <View
          style={{
            backgroundColor: appColor.cartBg,
            paddingVertical: 10,
            borderRadius: 10,
            paddingHorizontal: 10,
            overflow: 'hidden',
          }}>
          {(data.totalProtein != '' ||
            data.totalCalories != '' ||
            data.totalFats != '' ||
            data.totalCarbs != '') && (
            <Animatable.Text
              animation={'slideInLeft'}
              duration={800}
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.black,
                textAlign: 'center',
                paddingBottom: 15,
                textTransform: 'uppercase',
                textDecorationLine: 'underline',
                letterSpacing: 1,
              }}>
              Nutrients Value
            </Animatable.Text>
          )}
          {data.totalProtein != '' && (
            <NutritionList
              keys={'Proteins'}
              values={data.totalProtein}
              duration={700}
            />
          )}
          {data.totalCalories != '' && (
            <NutritionList
              keys={'Calories'}
              values={data.totalCalories}
              duration={1000}
            />
          )}
          {data.totalFats != '' && (
            <NutritionList
              keys={'Fats'}
              values={data.totalFats}
              duration={1300}
            />
          )}
          {data.totalCarbs != '' && (
            <NutritionList
              keys={'Carbs'}
              values={data.totalCarbs}
              duration={1600}
            />
          )}
        </View>
      )}
    </>
  );
};

export default NutritionCard;

const styles = StyleSheet.create({});
