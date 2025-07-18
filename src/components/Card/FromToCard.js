import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {widthResponse, fontScalling} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';

const FromToCard = ({title, to, deliveredTime, phone, location, email}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const iconCard = (iconName, iconSize, iconCompName, label) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: 10,
        }}>
        <Icon
          name={iconName}
          ComponentName={iconCompName}
          size={iconSize}
          color={appColor.bgBlack}
        />
        <Text
          style={[
            styles.roboto_light,
            {marginHorizontal: 8, color: appColor.Textlightblack},
          ]}>
          {label}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.dotOut}>
      <View style={styles.dotIn}>
        <View style={styles.dot} />
        {!to && <View style={styles.line} />}
      </View>
      <Pressable style={[styles.dotContent]}>
        {title && title != '' && (
          <Text style={[styles.baby_blk]}>
            <Text style={{color: appColor.themeYellow}}>
              {to ? 'To : ' : 'From : '}
            </Text>
            {title}
          </Text>
        )}
        {deliveredTime && deliveredTime != '' && (
          <>
            {iconCard(
              'back-in-time',
              widthResponse ? 17 : 20,
              'Entypo',
              deliveredTime,
            )}
          </>
        )}
        {location && location != '' && (
          <>
            {iconCard('location', widthResponse ? 17 : 20, 'Entypo', location)}
          </>
        )}
        {phone && phone != '' && (
          <>
            {iconCard('phone-call', widthResponse ? 17 : 20, 'Feather', phone)}
          </>
        )}
        {email && email != '' && (
          <>{iconCard('email', widthResponse ? 17 : 20, 'Fontisto', email)}</>
        )}
      </Pressable>
    </View>
  );
};

export default FromToCard;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    dotOut: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dotIn: {
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    },
    dotContent: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 3,
      paddingBottom: widthResponse ? 20 : 30,
    },
    dot: {
      width: widthResponse ? 20 : 24,
      height: widthResponse ? 20 : 24,
      backgroundColor: appColor.themeYellow,
      borderRadius: 60,
      zIndex: 10,
      borderColor: appColor.yellowDotBorder,
      borderWidth: widthResponse ? 4 : 6,
    },
    line: {
      borderColor: appColor.themeYellow,
      width: widthResponse ? 1.5 : 2,
      height: '100%',
      backgroundColor: appColor.yellowLine,
      borderRadius: 30,
      marginTop: -10,
      position: 'absolute',
      top: 15,
      bottom: 0,
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
  });

  return {styles};
};
