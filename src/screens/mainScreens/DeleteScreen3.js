import React from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {BigSpacer} from '../../utilities/spacer';
import {
  fontScalling,
  objectLength,
  print,
  TabReset,
} from '../../utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import MainCard from '../../components/Card/MainCard';
import {url} from '../../utilities/appApi';
import {useDispatch, useSelector} from 'react-redux';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {
  setProfileData,
  setUserSkipOption,
  setUserType,
} from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeleteScreen3({navigation, route}) {
  const appColor = appColors();
  const {reason, feedback} = route.params;
  const showToast = useShowToast();
  const dispatch = useDispatch();
  const {userSettings} = useSelector(state => state.setting);

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      const formData = new FormData();

      if (
        objectLength(userSettings?.userInfo) &&
        userSettings?.userInfo?.user_id &&
        userSettings?.userInfo?.user_id != ''
      ) {
        formData.append('id', userSettings?.userInfo?.user_id);
      }
      if (reason && reason != '') {
        formData.append('reason', reason);
      }
      if (feedback && feedback != '') {
        formData.append('feedback', feedback);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // get the response:
      const response = await fetch(url().deleteAccount, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        dispatch(setUserType('guest'));
        dispatch(setUserSkipOption(0));
        dispatch(
          setProfileData({
            userId: '',
            name: '',
            email: '',
            number: '',
            gender: '',
            flatNumber: '',
            pincode: '',
            street: '',
            city: '',
            state: '',
            profile_picture: {
              name: 'profile.jpeg',
              uri: '',
              type: 'image/jpeg',
            },
          }),
        );
        AsyncStorage.clear();
        showToast(
          'success',
          resparse.success,
          resparse.message ? resparse.message : '',
          1200,
        );
        TabReset(navigation);
        setTimeout(() => {
          navigation.navigate('Dashboard', {screen: 'home'});
        }, 1300);
      } else {
        console.log('Delete account status code:', response.status);
      }
    } catch (e) {
      console.log(e, 'error in Delete account');
    }
  };

  return (
    <MainCard>
      <View>
        <View
          style={{
            paddingTop: 10,
            alignItems: 'center',
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: appColor.borderColor,
          }}>
          <Text
            style={{
              fontFamily: appFont.bB,
              color: appColor.textBlack,
              fontSize: fontScalling(3),
              textAlign: 'center',
            }}>
            ARE YOU SURE TO DELETE YOUR ACCOUNT?
          </Text>
        </View>
        <View style={{alignItems: 'center', paddingTop: 10}}>
          <Text
            style={{
              fontFamily: appFont.rR,
              color: appColor.textBlack,
              textAlign: 'center',
              fontSize: fontScalling(2),
              lineHeight: fontScalling(2.5),
            }}>
            All the data accessed with it (including your profile,photos,reviews
            and Subscriptions.) Will be permanently deleted in 30 days. This
            information can't be removed once the account is deleted.
          </Text>
        </View>

        {/* /---------------------BUTTONS-------------------/ */}

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <PrimaryButton
            Title="CANCEL"
            black
            parentStyle={{flex: 1}}
            altStyle={{marginRight: 10}}
            onPress={() => {
              navigation.navigate('deleteScreen1');
            }}
          />
          <PrimaryButton
            Title="DELETE"
            profile
            parentStyle={{flex: 1}}
            onPress={() => {
              apiCall();
            }}
          />
        </View>

        <BigSpacer />
      </View>
    </MainCard>
  );
}
