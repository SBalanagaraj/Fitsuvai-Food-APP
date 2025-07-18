import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import * as Progress from 'react-native-progress';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import Carousel from 'react-native-reanimated-carousel';
import MainCard from '../../components/Card/MainCard';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import StepHeading from '../../components/Card/StepHeading';
import {useDispatch, useSelector} from 'react-redux';
import {setPosition} from '../../redux/SettingSlice';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setassesMentIds, setStepsIndex} from '../../redux/SummerySlice';
import {url} from '../../utilities/appApi';
import {appFont} from '../../utilities/appFont';
import AppHeaders from '../../components/Headers/AppHeaders';

const Assesments = ({route}) => {
  const [progressvalue, setProgressValue] = useState(0.25);
  const [heading, setHeading] = useState('Your Goals');
  const [pageIndex, setPageIndex] = useState(0);
  const [assesData, setAssesMent] = useState({});
  const [assTitle, setAssesMentTitle] = useState('');
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isFocus = useIsFocused();

  const [pageSwipe, setPageSwipe] = useState(false);

  const appColor = appColors();
  const carosalRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const assId = route?.params?.id ? route?.params?.id : '';

  //CarosalPage Spec
  const baseOptions = {
    vertical: false,
    width: scrnWidth,
    height: scrnHeight,
  };

  const {stepsIndex, assesMentIds, summeryContent, triggerEdit} = useSelector(
    state => state.summary,
  );

  // page ScrollAnimation
  const goToPage = index => {
    console.log(index, 'index');
    if (carosalRef.current && carosalRef.current.scrollTo) {
      carosalRef.current.scrollTo({index, animated: true});
    }
  };

  // click to back press previous step:
  useEffect(() => {
    if (isFocus) {
      console.log(pageIndex, 'pageIndex');
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        // backPress(),
        () => {
          if (pageIndex != 0) {
            goToPage(pageIndex - 1);
          } else {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Dashboard', {screen: 'home'});
            }
          }
          return true;
        },
      );
      return () => backHandler.remove();
    }
  }, [pageIndex, isFocus]);

  // changes
  const backPress = () => {
    if (pageIndex != 0) {
      goToPage(pageIndex - 1);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Dashboard', {screen: 'home'});
      }
    }
    return true;
  };

  // stepIndex Updation
  useEffect(() => {
    dispatch(setStepsIndex(0));
  }, []);

  useEffect(() => {
    goToPage(stepsIndex);
    setPageIndex(stepsIndex);
  }, [stepsIndex, triggerEdit]);

  // print(stepsIndex, 'stepIndex');
  // console.log(pageIndex, 'content');

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('context', 'plan');
      if (route.params.id) {
        formData.append('assessment', route.params.id);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (Object.keys(assesData).length == 0) {
        setLoad(true);
      }
      if (route?.params?.assName) {
        setAssesMentTitle(route?.params?.assName);
      }
      // get the response:
      const response = await fetch(url().assesment, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setAssesMent(resparse.data);
          dispatch(setassesMentIds({assessmentId: 5}));
          dispatch(setassesMentIds({yourMealId: ''}));
          dispatch(setassesMentIds({yourGoalId: ''}));
        }
      } else {
        print(response.status, 'status in assesmentScreen');
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error in assesmentScreen');
      setRefresh(false);
      setLoad(false);
    }
  };

  useEffect(() => {
    if (assId != '') {
      apiCall();
    }
  }, [assId]);

  // HeadingUpdate
  useEffect(() => {
    if (assesMentIds) {
      switch (pageIndex) {
        case 0: {
          setHeading('bmi calculator');
          summeryContent[1].age?.length > 0 &&
          summeryContent[2].weight?.length > 0 &&
          summeryContent[3].height?.length > 0
            ? setPageSwipe(true)
            : setPageSwipe(false);

          break;
        }
        case 1: {
          setHeading('your meal');
          assesMentIds[1]?.yourMealId?.length > 0
            ? setPageSwipe(true)
            : setPageSwipe(false);

          break;
        }
        case 2: {
          setHeading('your goals');
          assesMentIds[2]?.yourGoalId?.length > 0
            ? setPageSwipe(true)
            : setPageSwipe(false);

          break;
        }
        case 3: {
          setHeading('plan preferences');
          setPageSwipe(true);
          break;
        }
      }
    }
  }, [pageIndex, isFocus]);

  // render page based on Condition
  const renderItem = ({item, index}) => {
    switch (index) {
      case 0: {
        return <Step1 handlePage={goToPage} />;
      }
      case 1: {
        return (
          <Step2
            handlePage={goToPage}
            mealData={assesData['food_preferences']}
          />
        );
      }
      case 2: {
        return (
          <Step3
            ind={index}
            handlePage={goToPage}
            goalData={assesData['goals']}
          />
        );
      }
      case 3: {
        return <Step4 handlePage={goToPage} />;
      }
    }
  };

  return (
    <>
      {/* changes in App header */}
      <AppHeaders title={'START YOUR MEAL'} backIconFn={() => backPress()} />
      <MainCard>
        {load ? (
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <ActivityIndicator color={appColor.gold} size={'large'} />
          </View>
        ) : (
          <>
            <View
              style={{
                height: '100%', //@@
              }}>
              <View style={{paddingVertical: 10, alignSelf: 'center'}}>
                {assTitle && assTitle != '' && (
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: appFont.bB,
                      color: appColor.bgBlack,
                      // paddingBottom: 15,
                      fontSize: fontScalling(2.5),
                    }}>
                    {assTitle}
                  </Text>
                )}
                <Text
                  style={{
                    fontFamily: appFont.bB,
                    color: appColor.bgBlack,
                    fontSize: fontScalling(2.2),
                    paddingVertical: 20,
                  }}>
                  Welcome to Fitsuvai's Personalized Food Experience
                </Text>
                <Progress.Bar
                  progress={progressvalue}
                  width={scrnWidth - 70}
                  height={9}
                  borderRadius={10}
                  borderColor={appColor.white}
                  color={appColor.gold}
                  unfilledColor={appColor.sliderGreyBg}
                />
              </View>
              <View style={{paddingTop: 5, flex: 1}}>
                <StepHeading
                  title={heading}
                  btnInActive={
                    !(summeryContent && summeryContent[4].bmi.length > 0)
                  }
                  onPress={() => {
                    dispatch(setPosition('right'));
                    navigation.getParent().openDrawer();
                  }}
                />
                <Carousel
                  {...baseOptions}
                  loop={false}
                  ref={carosalRef}
                  style={{alignSelf: 'center', flex: 1}}
                  autoPlay={false}
                  data={[1, 2, 3, 4]}
                  pagingEnabled={true}
                  onSnapToItem={index => {
                    setPageIndex(index);
                    setProgressValue(0.25 * (index + 1));
                  }}
                  enabled={pageSwipe}
                  renderItem={renderItem}
                />
              </View>
            </View>
          </>
        )}
      </MainCard>
    </>
  );
};

export default Assesments;

const styles = StyleSheet.create({});
