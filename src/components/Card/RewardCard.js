import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import { appFont } from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import { Icon } from '../../utilities/icon';
import { fontScalling, scrnHeight,scrnWidth } from '../../utilities/helperFunction';

function RewardCard({index, data}) {
    const appColor = appColors();
    const {styles} = useStyle();
  return (
    <>
      {data != '' && (
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                index % 2 == 0 ? appColor.cardbg : appColor.white,
            },
          ]}
          key={index}>
          <View style={{}}>
            <View style={{width: scrnWidth / 1.7}}>
              <Text numberOfLines={1} style={styles.textMedium}>
                {data.product_name}
              </Text>
            </View>
            
            <Text style={styles.TextSemiBold}>
            {data.status == 0
              ? ` To be credited by ${data.date}`
              : `Credited on ${data.date}`}
          </Text>
          </View>
          <View style={styles.Row1}>
              {data.status == 0 && data.points.includes('+') && (
                <Icon
                  ComponentName={'MaterialCommunityIcons'}
                  name={'timer-sand'}
                  size={17}
                  color={appColor.Textlightblack}
                />
              )}
              <Text
                style={[
                  styles.TextBoldsmall,
                  {
                    paddingLeft: 5,
                    color:
                      data.type === 'Debited'
                        ? appColor.formError
                        : data.status == 0
                        ? appColor.Textlightblack
                        : appColor.themeYellow,
                  },
                ]}>
                {data.points}
              </Text>
        </View>
        </View>
      )}
    </>
  );
}

export default RewardCard;

const useStyle = () => {
    const appColor = appColors();
const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 15,
    paddingVertical:13,
    backgroundColor: appColor.cardbg,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderRadius:7
  },
  Row1: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  TextBold: {
    fontFamily: appFont.BW_Bold,
    color: appColor.textBlack,
    fontSize: fontScalling(2),
  },
  TextBoldsmall: {
    fontFamily: appFont.rM,
    color: appColor.textBlack,
    fontSize: fontScalling(2),
  },
  textMedium: {
    fontFamily: appFont.rM,
    color: appColor.textBlack,
    fontSize: fontScalling(2.4),
    marginBottom:5
  },
  TextSemiBold: {
    fontFamily: appFont.rR,
    color: appColor.textBlack,
    fontSize: fontScalling(1.8),
  },
});
return {styles};
};
