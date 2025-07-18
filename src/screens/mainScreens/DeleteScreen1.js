import React from 'react';
import {View, SafeAreaView, Text, ScrollView, StyleSheet} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import NavCard from '../../components/Card/NavCard';
import {BigSpacer} from '../../utilities/spacer';
import MainCard from '../../components/Card/MainCard';
import {
  arrayLength,
  fontScalling,
  widthResponse,
} from '../../utilities/helperFunction';
import {useSelector} from 'react-redux';
// import Lines from '../../utilities/lines';

export default function DeleteScreen1({navigation}) {
  const appColor = appColors();
  const {styles} = useStyle();
  const {userSettings} = useSelector(state => state.setting);

  return (
    <MainCard>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: widthResponse ? 90 : 140}}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: appColor.textBlack,
              fontFamily: appFont.bB,
              fontSize: fontScalling(3),
              paddingTop: 10,
              paddingBottom: 20,
              textAlign: 'center',
            }}>
            WHY WOULD YOU LIKE TO DELEYTE YOUR ACCOUNT?
          </Text>
        </View>
        {/* <Lines /> */}
        {arrayLength(userSettings?.User_delete_reasons) &&
          userSettings?.User_delete_reasons.map(
            (data, i) =>
              data != '' && (
                <NavCard
                  key={i}
                  cardbg
                  deletePage
                  title={data}
                  onpress={() => {
                    navigation.navigate('deleteScreen2', {title: data});
                  }}
                />
              ),
          )}
        <BigSpacer />
      </ScrollView>
    </MainCard>
  );
}

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    ScrContainer: {
      marginTop: -17,
      flex: 1,
      overflow: 'visible',
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
      paddingTop: 10,
      // position: 'relative',
      // zIndex: 10,
    },
  });

  return {styles};
};
