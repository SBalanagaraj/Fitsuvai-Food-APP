import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {scrnWidth} from '../../utilities/helperFunction';
import {SvgUri} from 'react-native-svg';

const BottomCard = ({item}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  return (
    <View style={{paddingRight: 10}} key={item.id}>
      <View style={styles.view}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 30,
              width: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SvgUri
              height={40}
              width={46}
              style={styles.image}
              uri={item.icon}
              fill={appColor.white}
              onError={error => {
                console.error('Failed to load SVG:', error);
              }}
            />
          </View>

          <ScrollView
            indicatorStyle="white"
            nestedScrollEnabled={true}
            style={{flex: 1, paddingLeft: 15}}>
            <Text style={styles.headtxt}>{item.heading}</Text>
            <Text style={styles.desText}>{item.description}</Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default BottomCard;

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    view: {
      backgroundColor: appColor.transparentGray,
      borderRadius: 5,
      justifyContent: 'center',
      paddingRight: 15,
      paddingLeft: 15,
      width: scrnWidth / 2,
      height: scrnWidth / 3.5,
      paddingVertical: 10,
    },
    image: {
      height: 40,
      width: 46,
    },
    headtxt: {
      color: appColor.white,
      fontFamily: appFont.bB,
      paddingBottom: 10,
    },
    desText: {
      color: appColor.white,
    },
  });
  return {styles};
};
