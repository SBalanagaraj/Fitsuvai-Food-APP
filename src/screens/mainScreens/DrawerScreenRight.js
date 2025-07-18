import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling, print, scrnWidth} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '../../utilities/icon';
import {useDispatch, useSelector} from 'react-redux';
import {
  setStepsIndex,
  setSummeryContent,
  setTriggerEdit,
} from '../../redux/SummerySlice';

const DrawerScreenRight = () => {
  const appColor = appColors();
  const {styles} = useStyles();
  const navigation = useNavigation();
  const [finalOutput, setFinalOutPut] = useState([]);
  const dispatch = useDispatch();

  const {summeryContent, triggerEdit} = useSelector(state => state.summary);

  const summeryContents = [
    {key: 'Your Goal', value: ''},
    {key: 'Age', value: ''},
    {key: 'weight', value: ''},
    {key: 'height', value: ''},
    {key: 'activity', value: ''},
    {key: 'Your Meal', value: ''},
  ];

  function calculateBMI(weight = 0, height = 0) {
    const bmi = (weight / (height / 100) ** 2).toFixed(1);
    // dispatch(setSummeryContent({bmi: bmi}));
    return bmi; // Return BMI rounded to two decimal places
  }

  useEffect(() => {
    if (summeryContents && summeryContents.length > 0) {
      const updatedArray = summeryContents.map(updateItem => {
        // Find the corresponding item in originalArray based on a normalized key
        const originalItem = summeryContent.find(item => {
          const originalKey = Object.keys(item)[0]
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase();
          const updateKey = updateItem.key.toLowerCase();
          return originalKey === updateKey;
        });

        // If found, replace the value; if not, use the original value
        const originalValue = originalItem
          ? Object.values(originalItem)[0]
          : updateItem.value;

        return {key: updateItem.key, value: originalValue};
      });

      setFinalOutPut(updatedArray);
    }
  }, [summeryContent]);

  const weight = summeryContent.find(item => item?.weight);
  const height = summeryContent.find(item => item?.height);
  const bmi =
    weight && height
      ? calculateBMI(
          Number(weight && weight?.weight ? weight.weight : 0),
          Number(height && height?.height ? height.height : 0),
        )
      : '';

  useEffect(() => {
    if (bmi > 0) {
      dispatch(setSummeryContent({bmi: bmi}));
    }
  }, [bmi]);

  const handleAssesmentScreen = item => {
    switch (item.key) {
      case 'Your Goal': {
        dispatch(setStepsIndex(2));
        break;
      }
      case 'Age': {
        dispatch(setStepsIndex(0));
        break;
      }
      case 'weight': {
        dispatch(setStepsIndex(0));
        break;
      }
      case 'activity': {
        dispatch(setStepsIndex(0));
        break;
      }
      case 'height': {
        dispatch(setStepsIndex(0));
        break;
      }
      case 'Your Meal': {
        dispatch(setStepsIndex(1));
        break;
      }
    }
  };

  return (
    <View
      style={{
        backgroundColor: appColor.white,
        paddingTop: 20,
        flex: 1,
      }}>
      {/* Drawer heading */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginBottom: 25,
          marginHorizontal: 20,
        }}>
        <Text style={styles.HeadingText}>Summary</Text>
        <Animatable.View
          animation={'zoomIn'}
          duration={2000}
          onTouchEnd={() => {
            navigation.goBack();
          }}
          style={{}}>
          <Icon
            ComponentName={'AntDesign'}
            name={'closecircle'}
            size={30}
            color={appColor.black}
          />
        </Animatable.View>
      </View>
      <View>
        <View
          style={{
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            flexDirection: 'row',
            marginHorizontal: 20,
          }}>
          {finalOutput &&
            finalOutput.length > 0 &&
            finalOutput.map((item, index) => {
              print(item.value, 'value');
              return (
                <Pressable
                  key={index}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width:
                      item.key === 'Age' || item.key === 'weight'
                        ? scrnWidth / 2.95
                        : '100%',
                    backgroundColor: appColor.cartBg,
                    borderRadius: 10,
                    padding: 10,
                    marginLeft: item.key === 'weight' ? 10 : 0,
                    marginBottom: 10,
                  }}>
                  <View style={{width: '70%'}}>
                    <Text
                      style={[
                        styles.normalText,
                        {textTransform: 'capitalize'},
                      ]}>
                      {item.key == 'activity'
                        ? 'Select a Life Style'
                        : item.key}
                    </Text>
                    <Text
                      style={[
                        styles.subText,
                        {fontWeight: '600', textTransform: 'capitalize'},
                      ]}>
                      {item.value == 'moderate'
                        ? 'Moderately Active'
                        : item.value == ''
                        ? '---'
                        : item.value}
                    </Text>
                  </View>
                  {item?.value != '' && (
                    <Pressable
                      onPress={() => {
                        navigation.navigate('assesments');
                        handleAssesmentScreen(item);
                        dispatch(setTriggerEdit(triggerEdit + 1));
                      }}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 20,
                        backgroundColor: appColor.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        ComponentName={'Feather'}
                        name={'edit'}
                        size={18}
                        color={appColor.gold}
                      />
                    </Pressable>
                  )}
                </Pressable>
              );
            })}
        </View>
        <View
          style={{
            backgroundColor: appColor.bgBlack,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 25,
            paddingRight: 40,
            paddingVertical: 20,
            marginTop: 20,
          }}>
          <Text style={[styles.normalText, {color: appColor.white}]}>
            Your BMI
          </Text>
          <Text
            style={[
              styles.subText,
              {fontWeight: '600', color: appColor.white},
            ]}>
            {typeof bmi == 'string' && bmi.length > 0 ? bmi : '---'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DrawerScreenRight;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      paddingBottom: 5,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(2.2),
      color: appColor.black,
    },
    normalText: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.black,
    },

    commenStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });

  return {styles};
};
