import React from 'react';
import {View, Text} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {currencyConvertor, fontScalling} from '../../utilities/helperFunction';
import {useSelector} from 'react-redux';
import * as Animatable from 'react-native-animatable';

// Android FIles

const OrderPriceContainer = ({
  data,
  km,
  orders = false,
  pinkColor = false,
  isPersent = false,
  feePerMeal = false,
}) => {
  const {userSettings} = useSelector(state => state.setting);
  const appColor = appColors();

  return (
    <View>
      <View
        style={{
          backgroundColor: pinkColor ? appColor.subtotalBack : appColor.cartBg,
          paddingVertical: 10,
          borderRadius: 10,
          paddingHorizontal: 10,
        }}>
        <Animatable.Text
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
          Bill Details
        </Animatable.Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            Sub Total :
          </Text>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            {' '}
            {data.subTotal
              ? currencyConvertor(data.subTotal, 2)
              : currencyConvertor(0.0)}
          </Text>
        </View>

        {!orders && (
          <>
            {data.discount &&
            data.discount?.amount &&
            data.discount.amount != 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: appFont.rB,
                    fontSize: fontScalling(2),
                    color: appColor.gold,
                  }}>
                  Discount Amount :{' '}
                  {!isPersent &&
                    `(${
                      data?.discount?.percent && data.discount.percent != ''
                        ? Number(data.discount.percent).toFixed(
                            Number(data.discount.percent) % 1 == 0 ? 0 : 2,
                          )
                        : ''
                    }%)`}
                </Text>

                <Text
                  style={{
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(2),
                    color: appColor.gold,
                  }}>
                  -{' '}
                  {data.discount.amount && data.discount.amount != 0
                    ? currencyConvertor(data.discount.amount, 2)
                    : currencyConvertor(0.0)}
                </Text>
              </View>
            ) : null}
          </>
        )}

        <>
          {data.disCount && data.disCount != 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(2),
                  color: appColor.gold,
                }}>
                Discount Amount :{' '}
                {!isPersent &&
                  `(${
                    data?.disCount?.percent && data.disCount.percent != ''
                      ? data.disCount.percent
                      : ''
                  }%)`}
                {data?.discount_percent &&
                  data?.discount_percent != '' &&
                  `(${data?.discount_percent} %)`}
              </Text>

              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2),
                  color: appColor.gold,
                }}>
                -{' '}
                {data.disCount && data.disCount != 0
                  ? currencyConvertor(data.disCount, 2)
                  : currencyConvertor(0.0)}
              </Text>
            </View>
          ) : null}
        </>

        {data.amount_reduced && data.amount_reduced != 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              Reward redeemed amount :
            </Text>
            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              -
              {data.amount_reduced
                ? currencyConvertor(data.amount_reduced, 2)
                : currencyConvertor(0.0)}
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          {userSettings?.CGST && (
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.Textlightblack,
              }}>
              CGST {' ' + `(${userSettings?.CGST}%)`} :
            </Text>
          )}
          {
            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.black,
              }}>
              +{' '}
              {data.cgst
                ? currencyConvertor(Number(data.cgst), 2)
                : currencyConvertor(0.0)}
            </Text>
          }
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          {userSettings?.SGST && (
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.Textlightblack,
              }}>
              SGST {' ' + `(${userSettings?.SGST}%)`} :
            </Text>
          )}
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            +{' '}
            {data.sgst
              ? currencyConvertor(Number(data.sgst), 2)
              : currencyConvertor(0.0)}
          </Text>
        </View>
        {data.vesselPrice > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              Package :{`${'(' + data.vesselName + ')'}`}
            </Text>

            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              +{' '}
              {data.vesselPrice > 0
                ? currencyConvertor(data.vesselPrice, 2)
                : currencyConvertor(0.0)}
            </Text>
          </View>
        )}
        {data.delfee && data.delfee != 0 && km != 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              {km && km > 0
                ? 'Delivery Fee :' +
                  ' (' +
                  (Number(km).toFixed(2) + ' Km') +
                  ')'
                : 'Delivery Fee :'}
            </Text>
            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2),
                  color: appColor.bgBlack,
                }}>
                {feePerMeal &&
                  currencyConvertor(
                    Number(data.delfee) / Number(data.dishCount),
                  ) + '/Meal '}
              </Text>
              {data.delfee
                ? feePerMeal
                  ? ` ( ${currencyConvertor(Number(data.delfee), 0)} )`
                  : ' + ' + currencyConvertor(Number(data.delfee), 2)
                : currencyConvertor(0.0)}
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            Total
          </Text>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2),
              color: appColor.gold,
              fontSize: 20,
            }}>
            {' '}
            {data.totalamt
              ? currencyConvertor(Number(data.totalamt), 2)
              : currencyConvertor(0.0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderPriceContainer;
