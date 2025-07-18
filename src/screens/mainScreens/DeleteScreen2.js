import React, {useState} from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import {BigSpacer} from '../../utilities/spacer';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {TextInput} from 'react-native-gesture-handler';
import MainCard from '../../components/Card/MainCard';
import {fontScalling} from '../../utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

export default function DeleteScreen2({navigation, route}) {
  const appColor = appColors();
  const [input, setInput] = useState('');
  const {title} = route.params;

  return (
    <MainCard>
      <View>
        <View style={{alignItems: 'center'}}>
          {title && title != '' && (
            <Text
              style={{
                color: appColor.textBlack,
                fontFamily: appFont.bB,
                fontSize: fontScalling(3),
                paddingTop: 10,
                paddingBottom: 15,
                textAlign: 'center',
              }}>
              {title}
            </Text>
          )}
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: appFont.rM,
              paddingVertical: 15,
              borderTopWidth: 1,
              fontSize: fontScalling(2),
              color: appColor.textBlack,
              borderTopColor: appColor.borderColor,
              textAlign: 'center',
              lineHeight: fontScalling(3),
            }}>
            Do you have feedback for us? We would love to hear from you!
            <Text style={{color: appColor.themeYellow}}> (Optional)</Text>
          </Text>
        </View>
        <TextInput
          numberOfLines={5}
          textAlignVertical="top"
          multiline={true}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            backgroundColor: appColor.cardbg,
            borderRadius: 10,
            color: appColor.Textlightblack,
          }}
          onChangeText={val => setInput(val)}
          value={input}
          placeholder="Enter your message..."
          placeholderTextColor={appColor.Textlightblack}
        />
        {/* /---------------------BUTTONS-------------------/ */}

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <PrimaryButton
            Title="NEXT"
            altStyle={{marginHorizontal: 15}}
            parentStyle={{flex: 1}}
            onPress={() => {
              navigation.navigate('deleteScreen3', {reason: title, feedback: input});
            }}
          />
        </View>

        <BigSpacer />
      </View>
    </MainCard>
  );
}
