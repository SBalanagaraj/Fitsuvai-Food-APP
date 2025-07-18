import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import {appFont} from '../../utilities/appFont';
import {useNavigation} from '@react-navigation/native';

const RecordModal = ({
  isVisible = false,
  setPermissionModal = () => {},
  startRecognizing = () => {},
  isDashboard = false,
}) => {
  const appColor = appColors();
  const navigation = useNavigation();

  return (
    <Modal
      backdropColor={appColor.overlayBg}
      onBackdropPress={() => {
        setPermissionModal(false);
      }}
      isVisible={isVisible}
      style={{}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appColor.white,
          borderRadius: 15,
          overflow: 'hidden',
          elevation: 15,
          shadowColor: appColor.gold,
          marginHorizontal: 20,
          padding: 15,
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 30,
            paddingBottom: 20,
            backgroundColor: appColor.cardbg,
            elevation: 5,
            shadowColor: appColor.gold,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            ComponentName={'FontAwesome5'}
            name={'microphone-slash'}
            color={appColor.gold}
            size={25}
          />
        </View>
        <Text
          style={{
            color: appColor.bgBlack,
            fontFamily: appFont.rB,
            fontSize: fontScalling(2),
            paddingBottom: 15,
          }}>
          MicroPhone permission is not enabled
        </Text>
        <Text
          style={{
            color: appColor.textGrey,
            fontFamily: appFont.rB,
            fontSize: fontScalling(2),
            paddingBottom: 15,
          }}>
          please grant us permission to access voice search
        </Text>
        <Pressable
          onPress={() => {
            setPermissionModal(false);
            if (isDashboard) {
              navigation.navigate('search', {query: true});
            } else {
              setTimeout(() => {
                startRecognizing();
              }, 250);
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopColor: appColor.textGrey,
            borderTopWidth: 0.8,
            width: '100%',
            paddingVertical: 10,
          }}>
          <Icon
            ComponentName={'FontAwesome5'}
            name={'microphone'}
            size={18}
            color={appColor.gold}
          />
          <Text
            style={{
              color: appColor.gold,
              fontFamily: appFont.rB,
              fontSize: fontScalling(1.5),
              paddingLeft: 10,
            }}>
            Grant microphone permission
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default RecordModal;

const styles = StyleSheet.create({});
