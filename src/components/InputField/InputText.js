import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
// file import:
import {Icon} from '../../utilities/icon';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  scrnHeight,
  widthResponse,
} from '../../utilities/helperFunction';
import appColor from '../../utilities/appColors';
import {stateList, districtList} from '../../utilities/localFiles';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {setStateName} from '../../redux/SettingSlice';

export function InputText({
  formError,
  Title,
  placeholder,
  icon,
  iconName,
  iconSize,
  row,
  onChangeText,
  value,
  keyboardType,
  onFocus,
  onBlur,
  ref,
  dark = false,
  numberOfLines,
  multiline,
  autoFocus,
  maxLength,
  editable,
  secureTextEntry,
  leftIcon,
  custom,
  path,
  imgFill,
  textVertical,
  required,
  noelevation,
  onPressLeft = () => {},
  onPress = () => {},
  unLink = () => {},
  onPressTextInput = () => {},
  unLinkComponent = false,
  autoCapitalize = false,
  login = false,
  customStyle,
  dialProp = [
    {
      emoji: '🇮🇳',
      name: 'India',
      phone: '+91',
      phoneLength: 10,
    },
    () => {},
  ],
}) {
  const appColors = appColor();
  const [visible, setVisible] = useState(secureTextEntry);

  const {stateName} = useSelector(state => state.setting);

  const [stateVisible, setStateVisible] = useState(false);
  const [districtVisible, setDistrictVisible] = useState(false);
  const isStateInputs = Title == 'State';
  const isCityInputs = Title == 'City';
  const [districtLists, setDistrictLists] = useState(districtList[stateName]);

  const dispatch = useDispatch();

  // const handleDoneClick = () => {
  //   console.log('Done button clicked, input:');
  //   // You can handle your logic here, e.g., submit the form or close the keyboard
  // };

  useEffect(() => {
    if (stateName != '') {
      setDistrictLists(districtList[stateName]);
    }
    if (isCityInputs && editable) {
      onChangeText('');
    }
  }, [stateName]);

  return (
    <View style={[{paddingBottom: widthResponse ? 12 : 17}, customStyle]}>
      {/* label */}
      <Text
        style={{
          color: dark ? appColors.textWhite : appColors.textBlack,
          fontFamily: appFont.rM,
          paddingBottom: widthResponse ? 7 : 12,
          fontSize: fontScalling(1.7),
        }}>
        {Title}
        {required && <Text style={{color: appColors.ToastError}}>*</Text>}
      </Text>
      {/* input field */}
      <Pressable
        onPress={
          (isCityInputs || isStateInputs) && editable //BN
            ? () => {
                if (isStateInputs) {
                  setStateVisible(true);
                } else if (isCityInputs) {
                  setDistrictVisible(true);
                }
              }
            : onPress
        }
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingVertical: widthResponse ? 5 : 10, //@@
          paddingHorizontal: widthResponse ? 6 : 10, //@@
          backgroundColor: dark ? appColors.inputBackDark : appColors.cartBg,
          borderRadius: 8,
          position: 'relative',
          // opacity: custom ? 1 : 0.7,
          width: '100%',
          elevation: noelevation ? 0 : 2,
        }}>
        {leftIcon && (
          <Pressable onPress={onPressLeft} style={{paddingHorizontal: 5}}>
            <Icon
              ComponentName={icon}
              name={iconName}
              color={dark ? appColors.white : appColors.black}
              size={iconSize}
            />
          </Pressable>
        )}
        {custom && (
          <Pressable
            onPress={onPressLeft}
            style={{
              paddingHorizontal: imgFill ? 0 : 5,
              paddingVertical: imgFill ? 0 : 5,
            }}>
            {path != '' ? (
              <Image
                style={{
                  width: imgFill ? 40 : 25,
                  height: imgFill ? 40 : 25,
                  borderTopLeftRadius: imgFill ? 3 : 0,
                  borderBottomLeftRadius: imgFill ? 3 : 0,
                  borderRightWidth: 0.5,
                  borderColor: appColors.TextInputborderbg,
                }}
                resizeMode={imgFill ? 'cover' : 'contain'}
                source={imgFill ? {uri: path} : path}
              />
            ) : (
              <Pressable
                onPress={onPressLeft}
                style={{
                  width: imgFill ? 40 : 25,
                  height: imgFill ? 40 : 25,
                  paddingHorizontal: imgFill ? 0 : 5,
                  paddingVertical: imgFill ? 0 : 5,
                  backgroundColor: appColors.bgWhite,
                  borderRightWidth: 0.5,
                  borderLeftWidth: 0.2,
                  borderLeftColor: appColors.TextInputborderbg,
                  borderRightColor: appColors.TextInputborderbg,
                  borderTopLeftRadius: imgFill ? 3 : 0,
                  borderBottomLeftRadius: imgFill ? 3 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  ComponentName={'FontAwesome5'}
                  name={'user-tie'}
                  size={25}
                  color={appColors.boldBlacktext}
                />
              </Pressable>
            )}
          </Pressable>
        )}

        {login && dialProp && (
          <Pressable style={{flexDirection: 'row'}} onPress={dialProp[1]}>
            <Text style={{paddingHorizontal: 5}}>{dialProp[0].emoji}</Text>
            <Text
              style={{
                paddingHorizontal: 5,
                color: appColors.boldBlacktext,
              }}>
              {dialProp[0].phone}
            </Text>
          </Pressable>
        )}
        <TextInput
          // onPress={() => {
          //   if (isStateInputs) {
          //     setStateVisible(true);
          //   } else if (isCityInputs) {
          //     setDistrictVisible(true);
          //   }
          // }}
          autoCapitalize={autoCapitalize ? 'none' : 'words'}
          onTouchStart={onPressTextInput}
          onKeyPress={onPressTextInput}
          secureTextEntry={visible}
          ref={ref}
          autoFocus={autoFocus}
          lineBreakStrategy="word-wrap"
          onFocus={onFocus}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={
            dark ? appColors.placeHolderTextDark : appColors.placeHolderText
          }
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          value={value}
          editable={isStateInputs || isCityInputs ? false : editable} //BN
          returnKeyType="done" // This makes the return key show "Done" on iOS
          // onSubmitEditing={handleDoneClick} // Captures the Done button click
          blurOnSubmit={true} // Closes the keyboard after submitting
          style={{
            flex: 1,
            color: dark ? appColors.textWhite : appColors.boldBlacktext,
            fontFamily: appFont.rR,
            paddingVertical: 5,
            paddingHorizontal: 6,
            textAlignVertical: textVertical ? 'top' : 'center',
            fontSize: fontScalling(1.6),
          }}
        />
        {secureTextEntry ? (
          <Pressable
            style={{paddingRight: 10}}
            onPress={() => {
              setVisible(!visible);
            }}>
            <Icon
              ComponentName={'Feather'}
              name={visible ? 'eye-off' : 'eye'}
              color={dark ? appColors.bgWhite : appColors.Textlightblack}
              size={20}
            />
          </Pressable>
        ) : null}
        {/* BN */}
        {isStateInputs && editable ? (
          <Pressable
            style={{paddingRight: 10}}
            onPress={() => {
              setStateVisible(!stateVisible);
            }}>
            <Icon
              ComponentName={'AntDesign'}
              name={stateVisible ? 'caretup' : 'caretdown'}
              color={dark ? appColors.bgWhite : appColors.Textlightblack}
              size={15}
            />
          </Pressable>
        ) : null}
        {/* BN */}
        {isCityInputs && editable ? (
          <Pressable
            style={{paddingRight: 10}}
            onPress={() => {
              setDistrictVisible(!districtVisible);
            }}>
            <Icon
              ComponentName={'AntDesign'}
              name={districtVisible ? 'caretup' : 'caretdown'}
              color={dark ? appColors.bgWhite : appColors.Textlightblack}
              size={15}
            />
          </Pressable>
        ) : null}
      </Pressable>
      {/* form errors */}
      {formError && (
        <Text
          style={{
            marginTop: 3,
            marginLeft: 3,
            color: appColors.formError,
            fontSize: fontScalling(1.45),
            fontFamily: appFont.rR,
          }}>
          {formError.message}
        </Text>
      )}
      {/* ------- State List Modal --------- */}
      <Modal
        animationType="slide"
        onBackdropPress={() => {
          setStateVisible(!stateVisible);
        }}
        backdropColor={appColors.overlayBgCorousel}
        backdropOpacity={1}
        transparent={true}
        isVisible={stateVisible && editable} //BN
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
          marginHorizontal: 20,
        }}>
        <View
          style={{
            backgroundColor: appColors.white,
            paddingHorizontal: 20,
            paddingVertical: 20,
            maxHeight: scrnHeight / 2.5,
            bottom: 60,
            zIndex: 100,
            borderRadius: 10,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 0.7,
              borderBlockColor: appColors.black,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2.5),
                color: appColors.gold,
              }}>
              Select State
            </Text>
            <Pressable
              onPress={() => {
                setStateVisible(!stateVisible);
              }}>
              <Icon
                ComponentName={'AntDesign'}
                name={'close'}
                size={28}
                color={appColors.bgBlack}
              />
            </Pressable>
          </View>
          <ScrollView
            nestedScrollEnabled={true} // Allows nested scrolling for this ScrollView inside a parent ScrollView
            contentContainerStyle={{
              marginTop: 5,
            }} // Additional padding to avoid clipping
          >
            {stateList.map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    onChangeText(item.name);
                    dispatch(setStateName(item.name));
                    setStateVisible(false);
                  }}
                  key={index}
                  style={{
                    alignItems: 'flex-start',
                    padding: 5,
                    paddingVertical: 10,
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.rB,
                      color: appColors.bgBlack,
                    }}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
      {/* ------- District List Modal --------- */}
      <Modal
        animationType="slide"
        onBackdropPress={() => {
          setDistrictVisible(!districtVisible);
        }}
        backdropColor={appColors.overlayBgCorousel}
        backdropOpacity={1}
        transparent={true}
        isVisible={districtVisible && editable} //BN
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
          marginHorizontal: 20,
          // position: 'absolute',
          // bottom: 200,
        }}>
        <View
          style={{
            backgroundColor: appColors.white,
            paddingHorizontal: 20,
            paddingVertical: 20,
            maxHeight: scrnHeight / 2.5,
            // bottom: 60,
            zIndex: 100,
            borderRadius: 10,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 0.7,
              borderBlockColor: appColors.black,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2.5),
                color: appColors.gold,
              }}>
              Select City
            </Text>
            <Pressable
              onPress={() => {
                setDistrictVisible(false);
              }}>
              <Icon
                ComponentName={'AntDesign'}
                name={'close'}
                size={28}
                color={appColors.bgBlack}
              />
            </Pressable>
          </View>
          <ScrollView
            nestedScrollEnabled={true} // Allows nested scrolling for this ScrollView inside a parent ScrollView
          >
            {districtLists &&
              districtLists.length > 0 &&
              districtLists.map((item, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      onChangeText(item);
                      setDistrictVisible(false);
                    }}
                    key={index}
                    style={{
                      alignItems: 'flex-start',
                      padding: 5,
                      justifyContent: 'flex-start',
                    }}>
                    <Text
                      style={{
                        fontFamily: appFont.rB,
                        color: appColors.bgBlack,
                      }}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
