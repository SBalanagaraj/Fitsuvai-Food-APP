import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {useSelector} from 'react-redux';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import * as Animatable from 'react-native-animatable';

const NutritionCard = ({data, title = '', perDayValue = false, days = ''}) => {
  const appColor = appColors();
  const {total} = useSelector(state => state.cart);

  const NutrientsWidth = widthResponse ? '50%' : '70%';
  const valueWidth = widthResponse ? '50%' : '30%';

  const NutritionListHead = ({keys, values, duration}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomWidth: keys == 'Carbs' ? 0 : 0.7,
          borderColor: appColor.borderColor,
          alignItems: 'center',
          backgroundColor: appColor.gold,
        }}>
        {(data.totalProtein != '' ||
          data.totalCalories != '' ||
          data.totalFats != '' ||
          data.totalCarbs != '') && (
          <Animatable.Text
            animation={'zoomIn'}
            duration={800}
            style={{
              fontFamily: appFont.rM,
              fontSize: fontScalling(2),
              color: appColor.white,
              width: NutrientsWidth,
            }}>
            {title == '' ? `Nutrients Value` : title}
          </Animatable.Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            // alignItems: 'center',
            // justifyContent: 'flex-end',
            width: valueWidth,
          }}>
          {perDayValue ? (
            <>
              <Animatable.Text
                style={{
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.7),
                  color: appColor.white,
                  width: '50%',
                  textAlign: 'right',
                  paddingRight: 15,
                }}>
                Per Day
              </Animatable.Text>
              <Animatable.Text
                style={{
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.7),
                  color: appColor.white,
                  textAlign: 'right',
                  width: '50%',
                }}>
                Total
              </Animatable.Text>
            </>
          ) : (
            <Animatable.Text
              style={{
                fontFamily: appFont.rM,
                fontSize: fontScalling(1.7),
                color: appColor.white,
                flex: 1,
                textAlign: 'right',
              }}>
              Total
            </Animatable.Text>
          )}
        </View>
      </View>
    );
  };

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
          alignItems: 'center',
          borderWidth: 1,
        }}>
        <Animatable.Text
          animation={'zoomIn'}
          duration={duration}
          style={{
            fontFamily: appFont.rB,
            fontSize: fontScalling(1.8),
            color: appColor.textGrey,
            width: NutrientsWidth,
          }}>
          {`${keys} `}
        </Animatable.Text>
        <View
          style={{
            flexDirection: 'row',
            width: valueWidth,
          }}>
          {perDayValue ? (
            <>
              <Animatable.Text
                animation={'fadeInDown'}
                duration={duration}
                style={{
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.65),
                  color: appColor.textGrey,
                  paddingRight: 15,
                  textAlign: 'right',
                  width: '50%',
                }}>
                {perDayValue
                  ? `${(values / days).toFixed(2)} ${
                      keys == 'Carbs' ? 'cal' : 'g'
                    }  `
                  : null}
              </Animatable.Text>
              <Animatable.Text
                style={{
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.8),
                  color: appColor.Textlightblack,
                  width: '50%',
                  textAlign: 'right',
                }}>
                {values != 0
                  ? `${values.toFixed(2)} ${keys == 'Carbs' ? 'cal' : 'g'}`
                  : 'N/A'}
              </Animatable.Text>
            </>
          ) : (
            <Animatable.Text
              style={{
                fontFamily: appFont.rM,
                fontSize: fontScalling(2),
                color: appColor.Textlightblack,
                width: '100%',
                textAlign: 'right',
              }}>
              {values != 0
                ? `${values.toFixed(2)} ${keys == 'Carbs' ? 'cal' : 'g'}`
                : 'N/A'}
            </Animatable.Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      {Object.values(data).join('') != '' && (
        <View
          style={{
            // backgroundColor: appColor.cartBg,
            // paddingBottom: 10,
            borderRadius: 10,
            // paddingHorizontal: 10,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: appColor.sliderGreyBg,
            marginBottom: 15,
            marginHorizontal: 0,
            elevation: 1,
            backgroundColor: appColor.white,
            shadowColor: appColor.bgBlack,
            shadowOpacity: 0.9,
            shadowOffset: {width: 5, height: 5},

            // marginTop:
          }}>
          {/* {(data.totalProtein != '' ||
            data.totalCalories != '' ||
            data.totalFats != '' ||
            data.totalCarbs != '') && (
            <Animatable.Text
              animation={'slideInLeft'}
              duration={800}
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2.1),
                color: appColor.Textlightblack,
                textAlign: 'center',
                paddingVertical: 10,
                textTransform: 'uppercase',
                backgroundColor: appColor.white,
              }}>
              {title == '' ? 'Nutrients Value' : title}
            </Animatable.Text>
          )} */}
          <NutritionListHead />

          {data.totalCalories != '' && (
            <NutritionList
              keys={'Calories'}
              values={data.totalCalories}
              duration={1000}
            />
          )}
          {data.totalProtein != '' && (
            <NutritionList
              keys={'Proteins'}
              values={data.totalProtein}
              duration={700}
            />
          )}
          {data.totalCarbs != '' && (
            <NutritionList
              keys={'Carbs'}
              values={data.totalCarbs}
              duration={1600}
            />
          )}
          {data.totalFats != '' && (
            <NutritionList
              keys={'Fats'}
              values={data.totalFats}
              duration={1300}
            />
          )}
        </View>
      )}
    </>
  );
};

export default NutritionCard;

const styles = StyleSheet.create({});
