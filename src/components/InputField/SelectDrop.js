import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {
  Capitalize,
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {ScrollView} from 'react-native-gesture-handler';

const SelectDrop = ({
  value,
  onChange,
  onBlur,
  title,
  placeholder,
  options,
  dark,
  drop,
  altStyle,
  altTextStyle = {},
  icon,
  iconName,
  iconSize,
  optionsHeight,
}) => {
  const [showsuggest, setShowsuggest] = React.useState(false);
  const [selectedGender, setSelectedGender] = React.useState(value);
  const appColor = appColors();
  const styles = useStyles();

  useEffect(() => {
    setSelectedGender(value);
  }, [value]);

  useEffect(() => {
    if (drop) {
      setShowsuggest(false);
    }
  }, [drop]);

  return (
    <View style={[{position: 'relative'}, altStyle]}>
      <View>
        {title && (
          <Text
            style={{
              color: dark ? appColor.textWhite : appColor.textBlack,
              fontSize: fontScalling(1.7),
              fontFamily: appFont.rM,
              paddingBottom: widthResponse ? (dark ? 8 : 12) : 10,
            }}>
            {Capitalize(title)}
          </Text>
        )}
        <Pressable
          onPress={() => {
            setShowsuggest(!showsuggest);
          }}
          style={{
            width: '100%',
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: dark ? appColor.inputBackDark : appColor.greyBg,
            fontSize: fontScalling(1.6),
            paddingVertical: dark ? 4 : 6,
            paddingHorizontal: dark ? 10 : 5,
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              ComponentName={icon}
              name={iconName}
              size={iconSize}
              color={dark ? appColor.bgWhite : appColor.bgBlack}
            />
            <Text
              numberOfLines={1}
              style={[
                {
                  fontFamily: appFont.rR,
                  fontSize: fontScalling(1.7),
                  color: dark ? appColor.textWhite : appColor.boldBlacktext,
                  textAlign: 'center',
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  paddingLeft: dark ? 10 : 8,
                  textTransform: 'capitalize',
                  textAlign: 'left',
                  lineHeight: fontScalling(3),
                },
                altTextStyle,
              ]}>
              {selectedGender != undefined &&
              selectedGender != null &&
              selectedGender == 'moderate'
                ? 'Moderately Active'
                : selectedGender}
              {(selectedGender == undefined ||
                selectedGender == null ||
                selectedGender == '') && (
                <Text
                  style={{
                    color: dark
                      ? appColor.placeHolderTextDark
                      : appColor.placeHolderText,
                  }}>
                  {placeholder}
                </Text>
              )}
            </Text>
          </View>
          <Icon
            ComponentName={'Feather'}
            name={'chevron-down'}
            size={widthResponse ? 20 : 30}
            color={dark ? appColor.bgWhite : appColor.bgBlack}
          />
        </Pressable>
      </View>
      {showsuggest && (
        <Animatable.View
          duration={1000}
          easing={'linear'}
          direction="reverse"
          collapsable={true}
          useNativeDriver={true}
          style={[
            styles.AnimatableView,
            {
              maxHeight: optionsHeight ? optionsHeight : 90,
              backgroundColor: dark ? appColor.inputBackDark : appColor.white,
            },
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
            nestedScrollEnabled={true}
            style={{borderRadius: 10, overflow: 'hidden'}}>
            {options.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedGender(item);
                      setShowsuggest(false);
                      onChange(item); // Update the form value
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 7,
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        color: dark
                          ? appColor.textWhite
                          : appColor.boldBlacktext,
                        fontFamily: appFont.rR,
                        fontSize: fontScalling(1.6),
                      }}>
                      {item == 'moderate' ? 'Moderately Active' : item}

                      {/* {Capitalize(item ? item : item?.name)} */}
                    </Text>
                  </TouchableOpacity>
                  {options.length != index && !dark && (
                    <View style={styles.separator} />
                  )}
                </View>
              );
            })}
          </ScrollView>
        </Animatable.View>
      )}
    </View>
  );
};

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    label: {
      color: appColor.textBlack,
      fontSize: fontScalling(2),
      paddingBottom: 8,
    },
    pressable: {
      width: '100%',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingVertical: 6,
      paddingHorizontal: 5,
    },
    AnimatableView: {
      flex: 1,
      alignSelf: 'center',
      position: 'absolute',
      top: '104%',
      width: '95%',
      zIndex: 1000,
      elevation: 20,
      shadowColor: appColor.overlayBg,
      shadowOpacity: 0.2,
      borderRadius: 5,
    },
    selectedText: {
      width: '85%',
      textAlign: 'left',
    },
    dropdown: {
      position: 'absolute',
      top: 50,
      width: '100%',
      backgroundColor: appColor.white,
      borderRadius: 5,
      zIndex: 1000,
    },
    item: {
      paddingVertical: 7,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemText: {
      textTransform: 'capitalize',
    },
    separator: {
      height: 0.4,
      backgroundColor: appColor.borderColor,
    },
  });
  return styles;
};

export default SelectDrop;
