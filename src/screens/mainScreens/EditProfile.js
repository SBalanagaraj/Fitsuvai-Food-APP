import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useRef, useEffect} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import CircleProgress from '../../components/AnimatedStyle/CircleProgress';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import ImageCropPicker from 'react-native-image-crop-picker';
import {appFont} from '../../utilities/appFont';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputField/InputText';
import {
  bmiBasedValues,
  fontScalling,
  objectLength,
  permissionAlert,
  print,
  scrnWidth,
  widthResponse,
  requestPermissions,
  isFloat,
} from '../../utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import SelectDrop from '../../components/InputField/SelectDrop';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {setProfileData} from '../../redux/authSlice';
import FilterButton from '../../components/Buttons/FilterButton';
import {
  AdminDistanceRadius,
  getCoordinatesFromAdminLocation,
  getCoordinatesFromUserLocation,
  getPincodeFromAddress,
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../../utilities/GeolocationFunctions';
import FastImage from 'react-native-fast-image';

const EditProfile = ({navigation, route}) => {
  const {maps = ''} = route?.params ? route?.params : '';

  const appColor = appColors();
  const styles = useStyles();
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const {profileData} = useSelector(state => state.auth);
  const {userSettings} = useSelector(state => state.setting);
  const adminCoordinates =
    userSettings?.SITEINFO?.location &&
    userSettings?.SITEINFO?.location != '' &&
    userSettings?.SITEINFO?.location;
  const [loadCL, setLoadCl] = useState(false);
  const [drop, setDrop] = useState(false);
  const [pinCode, setPinCode] = useState('');

  const gender = ['Female', 'Male', 'Others'];
  // state:
  const [profile, setProfile] = useState({
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
    weight: '',
    height: '',
    age: '',
    bmi: '',
    activity: '',
    bmr: '',
    tef: '',
    tdee: '',
    goal: '',
    mac_protein: '',
    mac_calories: '',
    mac_fats: '',
  });

  const [load, setLoad] = useState(false);
  const [animButton, setAnimButton] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const textFocus = useRef(null);
  const deleteAnimRef = useRef(null);
  const [destination, setDestination] = useState('');

  const activity = ['sedentary', 'moderate', 'very active'];
  const yourGoal = ['Muscle gain', 'Fat Loss', 'Weight Maintanence'];

  const guestLogin = userSettings?.userInfo?.user_type != 'G';

  // handleDrop //@@
  const handleDrop = () => {
    setDrop(true);
    setTimeout(() => setDrop(false), 100);
  };

  // onFocus input:   //@@
  const onFocus = event => {
    if (textFocus.current) {
      textFocus.current.scrollToFocusedInput(event.target);
    }
    handleDrop();
  };

  const OpenCamera = async () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      width: 200,
      height: 200,
      cropping: true,
      compressImageMaxHeight: 200,
      compressImageMaxWidth: 200,
    })
      .then(image => {
        let fileName = 'profile.' + image.mime.split('/')[1];
        setProfile({
          ...currentValues,
          profile_picture: {
            ...currentValues.profile_picture,
            name: fileName,
            uri: image.path,
            type: 'image/jpeg',
          },
        });
      })
      .catch(error => {
        print(error.message, 'error');
        if (error.message == 'User did not grant camera permission.') {
          permissionAlert('Camera');
        }
      });
    setAnimButton(!animButton);
  };

  const OpenGallery = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      width: 200,
      height: 200,
      cropping: true,
      compressImageMaxHeight: 200,
      compressImageMaxWidth: 200,
    })
      .then(image => {
        let fileName = 'profile.' + image.mime.split('/')[1];
        setProfile({
          ...currentValues,
          profile_picture: {
            ...currentValues.profile_picture,
            name: fileName,
            uri: image.path,
            type: 'image/jpeg',
          },
        });
      })
      .catch(error => {
        print(error.message, 'message');
        if (error.message == 'User did not grant library permission.') {
          permissionAlert('Gallery');
        }
      });
    setAnimButton(!animButton);
  };

  // Handle delete logic
  const handleDeleteImage = () => {
    setdeleteModal(!deleteModal);
  };

  function calculateBMI(weight = 0, height = 0) {
    const bmi = (weight / (height / 100) ** 2).toFixed(1);
    let bmi_percentage = ((Number(bmi) - 18.5) * 100) / (30 - 18.5);
    bmi_percentage = bmi_percentage <= 100 ? bmi_percentage : 100;
    return bmi; // Return BMI rounded to two decimal places
  }

  const calculateFitness = userData => {
    if (
      userData?.weight &&
      userData?.weight != '' &&
      userData?.height &&
      userData?.height != ''
    ) {
      let bmi = calculateBMI(userData?.weight, userData?.height);

      let bmr =
        10 * userData?.weight + 6.25 * userData?.height - 5 * userData?.age;
      bmr = userData?.gender == 'Female' ? bmr - 161 : bmr + 5;

      let tef = bmr * 0.1;

      let tdee = (
        bmr *
          (userData?.activity == 'Sedentary'
            ? 1.2
            : userData?.activity == 'Moderately Active'
            ? 1.55
            : 1.725) +
        tef
      ).toFixed(isFloat ? 2 : 0);

      //   const goalNames = userSettings?.macro_formula
      //     ? userSettings?.macro_formula?.map(data => data.goal.toLowerCase())
      //     : [];
      //   const index = goalNames?.findIndex(data => {
      //     return data == (userData?.goal).toLowerCase().toLowerCase();
      //   });

      //   const macroObj =
      //     index != -1
      //       ? {
      //           protein: userSettings.macro_formula[index].protein / 100,
      //           carbs: userSettings.macro_formula[index].carbs / 100,
      //           fats: userSettings.macro_formula[index].fats / 100,
      //         }
      //       : {
      //           protein: 0,
      //           carbs: 0,
      //           fats: 0,
      //         };
      //   // print(macroObj, 'macroObj');

      //   let proteins = ((tdee * macroObj.protein) / 4).toFixed(2);
      //   let carbs = ((tdee * macroObj.carbs) / 4).toFixed(2);
      //   let fats = ((tdee * macroObj.fats) / 9).toFixed(2);

      let ideal_protein;
      let cdiff;
      let cdiffaction;
      let carb_fat_total;
      let carb_only;
      let fat_only;
      let protein_cal_gm = 4;
      let carb_cal_gm = 4;
      let fat_cal_gm = 9;

      if (tdee && userData?.goal) {
        const goal = userData?.goal?.toLowerCase();
        if (goal == 'fat loss') {
          ideal_protein = 2.5;
          cdiff = 500;
          cdiffaction = 1;
          carb_fat_total = 2.3;
          carb_only = 1.5;
          fat_only = 0.8;
        } else if (goal == 'muscle gain') {
          ideal_protein = 2;
          cdiff = 300;
          cdiffaction = 2;
          carb_fat_total = 3.5;
          carb_only = 2.5;
          fat_only = 1;
        } else if (goal == 'weight maintanence') {
          ideal_protein = 1.8;
          cdiff = 0;
          cdiffaction = 0;
          carb_fat_total = 2.8;
          carb_only = 2;
          fat_only = 0.8;
        }
      }

      const finalTdee =
        cdiffaction == 1
          ? Number(tdee) - Number(cdiff)
          : cdiffaction == 2
          ? Number(tdee) + Number(cdiff)
          : cdiffaction == 0
          ? tdee
          : 0;

      let protein_c =
        (userData.weight * ideal_protein).toFixed(2) * protein_cal_gm;
      let protein_p = (protein_c / finalTdee) * 100;
      let carbs_p = ((100 - protein_p) / carb_fat_total) * carb_only;
      let fats_p = ((100 - protein_p) / carb_fat_total) * fat_only;
      let carbs_c = (finalTdee + carbs_p / 100) / carb_cal_gm;
      let fats_c = (finalTdee + fats_p / 100) / fat_cal_gm;

      let proteins = (userData.weight * ideal_protein).toFixed(isFloat ? 2 : 0);
      let carbs = ((finalTdee * (carbs_p / 100)) / carb_cal_gm).toFixed(
        isFloat ? 2 : 0,
      );
      let fats = ((finalTdee * (fats_p / 100)) / fat_cal_gm).toFixed(
        isFloat ? 2 : 0,
      );

      tdee = Number(finalTdee).toFixed(isFloat ? 2 : 0);

      const data = {
        name: userData?.name,
        email: userData?.email,
        number: userData?.number,
        gender: userData?.gender,
        flatNumber: userData?.flatNumber,
        pincode: userData?.pincode,
        street: userData?.street,
        city: userData?.city,
        state: userData?.state,
        profile_picture: userData?.profile_picture,
        weight: userData?.weight,
        height: userData?.height,
        age: userData?.age,
        bmi: bmi,
        activity: userData?.activity,
        bmr: bmr,
        tef: tef,
        tdee: tdee,
        goal: userData?.goal,
        mac_protein: proteins,
        mac_calories: carbs,
        mac_fats: fats,
      };
      apiCall(data);
      // print(data, 'data');
      if (proteins && carbs && fats && bmi && bmr && tdee && tef) {
      }
    } else {
      const data = {
        name: userData?.name,
        email: userData?.email,
        number: userData?.number,
        gender: userData?.gender,
        flatNumber: userData?.flatNumber,
        pincode: userData?.pincode,
        street: userData?.street,
        city: userData?.city,
        state: userData?.state,
        profile_picture: userData?.profile_picture,
      };
      apiCall(data);
    }
  };

  const measureMents = {
    age: yup
      .number()
      .required('Please enter your current age')
      .min(13, 'Age must grater than 13')
      .max(90, 'Age must less than 90')
      .typeError('Age must be a number'),
    weight: yup
      .number()
      .required('Please enter your weight')
      .min(30, 'Please enter a value greater than or equal to 30.')
      .max(360, 'Please enter a value less than or equal to 360.')
      .typeError('Weight must be a number'),
    height: yup
      .number()
      .required('Please provide your height in foot')
      .min(121.92, 'Please enter a value greater than or equal to 121.92')
      .max(250, 'Please enter a value less than or equal to 250')
      .typeError('Height must be a number'),
    activity: yup.string().required('Select your activity'),
    goal: yup.string().required('Select your Goal'),
  };

  const generalValidation = {
    name: yup.string('Must be string').required('Name is required'),
    email: yup
      .string()
      .email('Please Enter a valid Email')
      .required('Email is required'),
    number: yup
      .number()
      .typeError('Please Enter a valid Number')
      .required('Mobile Number is required')
      .min(10, 'Invalid Mobile Number'),
    gender: yup.string().required('Select gender'),
    flatNumber: yup.string().required('Please Provide flat number'),
    pincode: yup
      .number()
      .typeError('Please Enter a valid Number')
      .required('Please enter pincode '),
    street: yup.string().required('Please enter street name '),
    city: yup.string().required('Please enter city name '),
    state: yup.string().required('Please enter state name '),
  };

  // validation:
  const schema = yup
    .object()
    .shape(
      !guestLogin ? generalValidation : {...generalValidation, ...measureMents},
    )
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: profile,
    resolver: yupResolver(schema),
  });

  // navigation:
  const onPressSend = async data => {
    if (
      isValid &&
      userSettings &&
      userSettings?.ADDRESS &&
      userSettings?.RADIUS &&
      Object.keys(destination).length > 0
    ) {
      // const adminCoordinates = await getCoordinatesFromAdminLocation(
      //   userSettings?.ADDRESS,
      // );
      const distancematrix = await AdminDistanceRadius(
        adminCoordinates,
        destination,
        userSettings?.RADIUS,
      );

      if (distancematrix.status) {
        calculateFitness(data);
      } else {
        showToast('error', '', 'Distance not in our Range');
      }
    }
    if (destination == '') {
      showToast('error', '', 'Please fill in the valid address');
    }
  };

  // Watch for changes in form fields
  const currentValues = watch();
  // api call
  const apiCall = async datas => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      formData.append('name', datas.name);
      formData.append('gender', datas.gender);
      formData.append('email', datas.email);
      formData.append('phone', datas.number);
      formData.append('flatno', datas.flatNumber);
      formData.append('pincode', datas.pincode);
      formData.append('street', datas.street);
      formData.append('city', datas.city);
      formData.append('state', datas.state);
      formData.append(
        'profile',
        profile.profile_picture.uri != '' ? profile.profile_picture : '',
      );
      if (
        datas.weight &&
        datas.weight != '' &&
        datas.height &&
        datas.height != ''
      ) {
        formData.append('age', datas.age);
        formData.append('weight', datas.weight);
        formData.append('height', datas.height);
        formData.append('bmi', datas.bmi);
        formData.append('activity', datas.activity);
        formData.append('bmr', datas.bmr);
        formData.append('tef', datas.tef);
        formData.append('tdee', datas.tdee);
        formData.append('goal', datas.goal);
        formData.append('mac_protein', datas.mac_protein);
        formData.append('mac_calories', datas.mac_calories);
        formData.append('mac_fats', datas.mac_fats);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // loading enable:
      if (!objectLength(profile)) {
        setLoad(true);
      }

      // get the response:
      const response = await fetch(url().edit_profile, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          resparse?.data &&
            setProfile({
              ...currentValues,
              name: resparse.data.name,
              email: resparse.data.email,
              number: resparse.data.phone,
              gender: resparse.data.gender,
              flatNumber: resparse.data.flat,
              pincode: resparse.data.pincode,
              street: resparse.data.street,
              city: resparse.data.city,
              state: resparse.data.state,
              profile_picture: {
                ...currentValues.profile_picture,
                uri: resparse.data.profile_picture,
              },
              weight: resparse.data?.weight,
              height: resparse.data?.height,
              age: resparse?.data?.age,
              bmi: resparse?.data?.bmi,
              activity: resparse.data?.activity,
              bmr: resparse.data?.bmr,
              tef: resparse.data?.tef,
              tdee: resparse.data?.tdee,
              goal: resparse.data?.goal,
              mac_protein: resparse.data?.mac_protein,
              mac_calories: resparse.data?.mac_calories,
              mac_fats: resparse.data?.mac_fats,
            });
          resparse?.data &&
            dispatch(
              setProfileData({
                userId: userSettings?.userInfo?.user_id,
                name: resparse.data.name,
                email: resparse.data.email,
                number: resparse.data.phone,
                gender: resparse.data.gender,
                flatNumber: resparse.data.flat,
                pincode: resparse.data.pincode,
                street: resparse.data.street,
                city: resparse.data.city,
                state: resparse.data.state,
                profile_picture: {
                  ...currentValues.profile_picture,
                  uri: resparse.data.profile_picture,
                },
                weight: resparse.data?.weight,
                height: resparse.data?.height,
                age: resparse?.data?.age,
                bmi: resparse?.data?.bmi,
                activity: resparse.data?.activity,
                bmr: resparse.data?.bmr,
                tef: resparse.data?.tef,
                tdee: resparse.data?.tdee,
                goal: resparse.data?.goal,
                mac_protein: resparse.data?.mac_protein,
                mac_calories: resparse.data?.mac_calories,
                mac_fats: resparse.data?.mac_fats,
              }),
            );
          if (
            datas?.name == profileData.name &&
            datas?.email == profileData.email &&
            datas?.number == profileData.number &&
            datas?.gender == profileData.gender &&
            datas?.flatNumber == profileData.flatNumber &&
            datas?.pincode == profileData.pincode &&
            datas?.street == profileData.street &&
            datas?.city == profileData.city &&
            datas?.state == profileData.state &&
            datas?.profile_picture.uri == profileData.profile_picture.uri
          ) {
            showToast('success', resparse.status, 'No changes done', 1500);
          } else {
            showToast('success', resparse.status, resparse.message, 1500);
          }
          navigation.goBack();
        } else if (resparse.status == 'warning') {
          showToast('info', '', resparse.message, 2000);
        }
      } else {
        console.log('edit profile status code:', response.status);
      }
      setLoad(false);
    } catch (e) {
      console.log(e, 'error edit profile');
      setLoad(false);
    }
  };

  const getProfile = () => {
    if (userSettings && userSettings?.userInfo) {
      setProfile({
        ...currentValues,
        name: userSettings.userInfo.first_name,
        email: userSettings.userInfo.email,
        number: userSettings.userInfo.phone,
        gender: userSettings.userInfo.gender,
        flatNumber: userSettings.userInfo.flat,
        pincode: userSettings.userInfo.pincode,
        street: userSettings.userInfo.street,
        city: userSettings.userInfo.city,
        state: userSettings.userInfo.state,
        profile_picture: {
          ...currentValues.profile_picture,
          uri: userSettings.userInfo.picture,
        },
        weight: userSettings.userInfo.weight,
        height: userSettings.userInfo.height,
        age: userSettings.userInfo.age,
        bmi: userSettings.userInfo.bmi,
        activity: userSettings.userInfo.activity,
        bmr: userSettings.userInfo.bmr,
        tef: userSettings.userInfo.tef,
        tdee: userSettings.userInfo.tdee,
        goal: userSettings.userInfo.goal,
        mac_protein: userSettings.userInfo.mac_protein,
        mac_calories: userSettings.userInfo.mac_calories,
        mac_fats: userSettings.userInfo.mac_fats,
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  // get the manual Location
  useEffect(() => {
    if (maps != '' && objectLength(maps)) {
      setProfile({
        ...currentValues,
        street: maps.street,
        state: maps.state,
        city: maps.city,
        pincode: maps.pincode,
      });
    }
  }, [maps]);

  // reset data for state updation in useForms
  useEffect(() => {
    reset(profile);
  }, [reset, profile]);

  // get User Coordinates & PinCode
  useEffect(() => {
    (async () => {
      const userCoordinates = await getCoordinatesFromUserLocation(
        [
          currentValues.flatno,
          currentValues.street,
          currentValues.city,
          currentValues.state,
          currentValues.pincode,
        ],
        currentValues.pincode,
      );
      setDestination(userCoordinates ? userCoordinates : '');
      if (currentValues.street && currentValues.city && currentValues.state) {
        const getPincode = await getPincodeFromAddress([
          currentValues.flatno,
          currentValues.street,
          currentValues.city,
          currentValues.state,
        ]);
        if (getPincode.length > 5) {
          setPinCode(getPincode);
        }
      }
    })();
  }, [
    currentValues.pincode,
    currentValues.street,
    currentValues.state,
    currentValues.city,
  ]);

  const getUserLocations = async () => {
    setLoadCl(true);
    const userCurrentLocation = await getUserLocation();
    if (userCurrentLocation && Object.keys(userCurrentLocation).length > 0) {
      setProfile(inputs => {
        return {
          ...currentValues,
          street: userCurrentLocation.street,
          state: userCurrentLocation.state,
          city: userCurrentLocation.city,
          pincode: userCurrentLocation.pincode,
        };
      });
      setLoadCl(false);
    } else {
      setLoadCl(false);
    }
  };

  return (
    <MainCard>
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: widthResponse ? 90 : 140,
        }}
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={300}
        ref={textFocus}
        showsVerticalScrollIndicator={false}>
        <Pressable style={{marginTop: 15, width: '100%'}} onPress={handleDrop}>
          {/* Profile Picture */}
          <View style={styles.imgContainer}>
            <Pressable
              onPress={() => {
                handleDrop(); //@@
                setTimeout(() => {
                  setAnimButton(!animButton), 1000;
                });
              }}>
              <View
                style={[
                  styles.profileImg,
                  {
                    backgroundColor: appColor.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <CircleProgress load={false} />
                {profile?.profile_picture?.uri &&
                profile?.profile_picture?.uri != '' ? (
                  <FastImage
                    source={{
                      uri: profile?.profile_picture?.uri,
                      priority: FastImage.priority.high,
                    }}
                    style={[
                      styles.profileImg,
                      {
                        width: scrnWidth / 4,
                        height: scrnWidth / 4,
                        backgroundColor: appColor.cardBack,
                        position: 'absolute',
                        zIndex: 10,
                      },
                    ]}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.profileImg,
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: appColor.themeYellow,
                        borderWidth: 3,
                        borderColor: appColor.white,
                      },
                    ]}>
                    <Text
                      style={{
                        fontFamily: appFont.rB,
                        fontSize: fontScalling(6),
                        color: appColor.white,
                        textTransform: 'uppercase',
                      }}>
                      {profile?.name && profile?.name != ''
                        ? profile.name.charAt(0)
                        : 'P'}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                handleDrop(); //@@
                setTimeout(() => {
                  setAnimButton(!animButton), 1000;
                });
              }}
              style={styles.editImg}>
              <Icon
                color={appColor.white}
                size={widthResponse ? 11 : 20} //@@
                ComponentName={'FontAwesome5'}
                name={'edit'}
              />
            </Pressable>
            {animButton && (
              <>
                <Animatable.View
                  isInteraction={true}
                  duration={!animButton ? 500 : 400}
                  animation={!animButton ? 'fadeInRight' : 'fadeInLeft'}
                  onTouchStart={async () => {
                    await requestPermissions('camera', OpenCamera);
                  }}
                  style={{
                    backgroundColor: appColor.themeYellow,
                    width: scrnWidth > 500 ? 50 : 30,
                    height: scrnWidth > 500 ? 50 : 30,
                    borderRadius: scrnWidth > 500 ? 25 : 15,
                    shadowColor: appColor.bgBlack,
                    elevation: 5,
                    shadowOpacity: 0.3,
                    shadowOffset: {height: 10},
                    position: 'absolute',
                    // top: -width / 3.5,
                    left: '65%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    color={appColor.white}
                    size={scrnWidth > 500 ? 22 : 13}
                    ComponentName={'FontAwesome5'}
                    name={'camera'}
                  />
                </Animatable.View>
                <Animatable.View
                  duration={!animButton ? 900 : 800}
                  animation={!animButton ? 'fadeInRight' : 'fadeInLeft'}
                  onTouchStart={async () => {
                    await requestPermissions('storage', OpenGallery);
                  }}
                  style={{
                    backgroundColor: appColor.themeYellow,
                    width: scrnWidth > 500 ? 50 : 30,
                    height: scrnWidth > 500 ? 50 : 30,
                    borderRadius: scrnWidth > 500 ? 25 : 15,
                    shadowColor: appColors.boldBlacktext,
                    elevation: 5,
                    shadowOpacity: 0.3,
                    shadowOffset: {height: 10},
                    position: 'absolute',
                    top: '25%',
                    left: '67%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 5,
                  }}>
                  <Icon
                    color={appColor.white}
                    size={scrnWidth > 500 ? 22 : 13}
                    ComponentName={'MaterialCommunityIcons'}
                    name={'folder-multiple-image'}
                  />
                </Animatable.View>
                {profile?.profile_picture?.uri &&
                  profile?.profile_picture?.uri != '' && (
                    <Animatable.View
                      duration={!animButton ? 1300 : 1200}
                      animation={!animButton ? 'fadeInRight' : 'fadeInLeft'}
                      onTouchStart={() => {
                        handleDeleteImage();
                      }}
                      style={{
                        backgroundColor: appColor.themeYellow,
                        width: scrnWidth > 500 ? 50 : 30,
                        height: scrnWidth > 500 ? 50 : 30,
                        borderRadius: scrnWidth > 500 ? 25 : 15,
                        shadowColor: appColors.boldBlacktext,
                        elevation: 5,
                        shadowOpacity: 0.3,
                        shadowOffset: {height: 10},
                        position: 'absolute',
                        top: '60%',
                        left: '63%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        color={appColor.white}
                        size={scrnWidth > 500 ? 22 : 13}
                        ComponentName={'FontAwesome5'}
                        name={'trash'}
                      />
                    </Animatable.View>
                  )}
              </>
            )}
          </View>
          <View>
            {profile.name && profile.name != '' && (
              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2.8),
                  textAlign: 'center',
                  color: appColor.black,
                }}>
                {profile.name}
              </Text>
            )}
            {profile.email && profile.email != '' && (
              <Text
                style={{
                  fontFamily: appFont.rR,
                  fontSize: fontScalling(2),
                  textAlign: 'center',
                  color: appColor.black,
                  marginBottom: 20,
                }}>
                {profile.email}
              </Text>
            )}
          </View>
          {/* Form */}
          <View
            style={{
              backgroundColor: appColor.white,
              paddingBottom: 0,
              borderRadius: 10,
            }}>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={'Enter name'}
                  value={value}
                  row
                  noelevation
                  leftIcon
                  icon={'FontAwesome'}
                  iconName={'user-o'}
                  iconSize={widthResponse ? 18 : 25} //@@
                  Title={'Your Name'}
                  onChangeText={onChange}
                  formError={errors.name}
                  onFocus={onFocus} //@@
                />
              )}
            />
            {/* gender dropdown */}

            <View style={{marginBottom: 15, zIndex: 1}}>
              <Controller
                name="gender"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <>
                    <SelectDrop
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      title={'Gender'}
                      drop={drop}
                      placeholder={'Select your gender'}
                      optionsHeight={widthResponse ? 90 : 120}
                      options={gender}
                    />
                  </>
                )}
              />
              {errors.gender && (
                <Text
                  style={{
                    marginTop: 3,
                    color: appColor.formError,
                    fontSize: fontScalling(1.6),
                    fontFamily: appFont.rR,
                  }}>
                  {errors.gender.message}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Enter email address'}
                    value={value}
                    noelevation
                    leftIcon
                    icon={'Feather'}
                    iconName={'mail'}
                    iconSize={widthResponse ? 18 : 25} //@@
                    customStyle={{flex: 1, marginRight: 10}}
                    keyboardType={'email-address'}
                    autoCapitalize
                    Title={'Email Address'}
                    onChangeText={onChange}
                    formError={errors.email}
                    onFocus={onFocus} //@@
                  />
                )}
              />
              {/* Number */}
              <Controller
                name="number"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Enter mobile number'}
                    value={value}
                    noelevation
                    customStyle={{flex: 1}}
                    keyboardType={'numeric'}
                    maxLength={10}
                    leftIcon
                    icon={'Feather'}
                    iconName={'phone'}
                    iconSize={widthResponse ? 18 : 25} //@@
                    Title={'Mobile Number'}
                    onChangeText={onChange}
                    formError={errors.number}
                    onFocus={onFocus}
                  />
                )}
              />
            </View>
            {/* current Location */}
            <View
              style={{
                flexDirection: 'row',
              }}>
              <FilterButton
                load={loadCL}
                onPress={async () => {
                  handleDrop();
                  const isGranted = await requestLocationPermission();
                  if (isGranted && isGranted != 'settings') {
                    getUserLocations();
                  } else {
                    await handleLocationPermission();
                  }
                }}
                ICN={'FontAwesome6'}
                IN={'location-crosshairs'}
                title={'Current location'}
                altTextStyle={{
                  color: appColor.white,
                  paddingLeft: 10,
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2.5),
                }}
                altStyle={{
                  flex: 1,
                  marginVertical: 10,
                  backgroundColor: appColor.gold,
                  paddingVertical: 10,
                  justifyContent: 'center',
                  opacity: 1,
                  borderColor: appColor.gold,
                }}
                bgBlack={true}
              />
              <FilterButton
                onPress={() => {
                  navigation.navigate('manualLocation', {
                    page: 'EditProfile',
                    intial: false,
                  });
                }}
                ICN={'FontAwesome6'}
                IN={'map-location-dot'}
                ICNSIZE={widthResponse ? 17 : 24}
                title={'Choose location'}
                altTextStyle={{
                  color: appColor.white,
                  paddingLeft: 10,
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2.5),
                }}
                altStyle={{
                  flex: 1,
                  marginLeft: 10,
                  marginVertical: 10,
                  backgroundColor: appColor.black,
                  paddingVertical: 10,
                  justifyContent: 'center',
                }}
                bgBlack={true}
              />
            </View>

            {/* flat & pin code  */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                // marginTop: 15,
              }}>
              {/* flatNumber */}
              <Controller
                name="flatNumber"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    value={value}
                    customStyle={{flex: 1, marginRight: 10}}
                    Title="Flat number"
                    placeholder="Enter Flat Number"
                    leftIcon={true} //@@
                    icon="MaterialCommunityIcons"
                    iconName="locker"
                    iconSize={widthResponse ? 18 : 25} //@@
                    // autoCapitalize="none"
                    onChangeText={onChange}
                    formError={errors.flatNumber}
                    onFocus={onFocus} //@@
                  />
                )}
              />
              {/* pin code */}
              <Controller
                name="pincode"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    value={value}
                    customStyle={{flex: 1}}
                    leftIcon
                    Title="Pincode"
                    keyboardType={'numeric'}
                    placeholder="Enter your Pincode"
                    icon="MaterialCommunityIcons"
                    iconName="mailbox-up-outline"
                    iconSize={widthResponse ? 18 : 25} //@@
                    onChangeText={onChange}
                    formError={errors.pincode}
                    onFocus={onFocus} //@@
                  />
                )}
              />
            </View>
            {/* street */}
            <Controller
              name="street"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <InputText
                    value={value}
                    row
                    Title="Street"
                    placeholder="Enter Your  Street"
                    leftIcon //@@
                    icon="FontAwesome5"
                    iconName="road"
                    iconSize={widthResponse ? 20 : 30} //@@
                    multiline={true}
                    onChangeText={onChange}
                    formError={errors.street}
                    onFocus={onFocus} //@@
                  />
                );
              }}
            />
            {/* city & state name  */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              {/* state*/}
              <Controller
                name="state"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    value={value}
                    customStyle={{flex: 1, marginRight: 10}}
                    leftIcon
                    Title="State"
                    placeholder="Enter Your state"
                    icon="MaterialCommunityIcons"
                    iconName="town-hall"
                    iconSize={widthResponse ? 18 : 30} //@@
                    rightIcon="AntDesign"
                    onChangeText={onChange}
                    formError={errors.state}
                    onFocus={onFocus} //@@
                    editable={true}
                  />
                )}
              />
              {/* city */}
              <Controller
                name="city"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    value={value}
                    customStyle={{flex: 1}}
                    leftIcon
                    Title="City"
                    placeholder="Enter Your City"
                    icon="FontAwesome5"
                    iconName="city"
                    iconSize={widthResponse ? 18 : 25} //@@
                    autoCapitalize="none"
                    onChangeText={onChange}
                    formError={errors.city}
                    onFocus={onFocus} //@@
                    editable={true}
                  />
                )}
              />
            </View>

            {guestLogin && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}>
                  {/* Number */}
                  <Controller
                    name="age"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <InputText
                        customStyle={{flex: 1, marginRight: 10}}
                        // autoFocus={true}
                        row
                        placeholder={'Enter age'}
                        value={value}
                        leftIcon
                        keyboardType={'numeric'}
                        Title={'Age'}
                        onChangeText={onChange}
                        formError={errors.age}
                        onFocus={event => {
                          textFocus.current.scrollToFocusedInput(event.target);
                        }}
                      />
                    )}
                  />
                  {/* Number */}
                  <Controller
                    name="weight"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <InputText
                        row
                        placeholder={'Enter Weight'}
                        customStyle={{flex: 1, marginRight: 10}}
                        value={value}
                        leftIcon
                        keyboardType={'numeric'}
                        Title={'Weight(KG)'}
                        onChangeText={onChange}
                        formError={errors.weight}
                        onFocus={event => {
                          textFocus.current.scrollToFocusedInput(event.target);
                        }}
                      />
                    )}
                  />
                  {/* Number */}
                  <Controller
                    name="height"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <InputText
                        customStyle={{flex: 1}}
                        row
                        placeholder={'Enter Height'}
                        value={value}
                        keyboardType={'numeric'}
                        Title={'Height (CM)'}
                        onChangeText={onChange}
                        formError={errors.height}
                        onFocus={event => {
                          textFocus.current.scrollToFocusedInput(event.target);
                        }}
                      />
                    )}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    zIndex: 1,
                  }}>
                  <View style={{flex: 1, marginRight: 10}}>
                    <Controller
                      name="activity"
                      control={control}
                      render={({field: {onChange, onBlur, value}}) => (
                        <>
                          <SelectDrop
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            title={'Select a Life Style'}
                            placeholder={'Select your Activity level'}
                            options={activity}
                            optionsHeight={200}
                            altStyle={{zIndex: 1, flex: 1}}
                            drop={drop}
                          />
                        </>
                      )}
                    />
                    {errors.activity && (
                      <Text
                        style={{
                          marginTop: 3,
                          color: appColor.formError,
                          fontSize: fontScalling(1.6),
                          fontFamily: appFont.rR,
                        }}>
                        {errors.activity.message}
                      </Text>
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    <Controller
                      name="goal"
                      control={control}
                      render={({field: {onChange, onBlur, value}}) => (
                        <>
                          <SelectDrop
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            title={'Select a Goal'}
                            placeholder={'Select your Goal'}
                            options={yourGoal}
                            optionsHeight={200}
                            altStyle={{zIndex: 1, flex: 1}}
                            drop={drop}
                          />
                        </>
                      )}
                    />
                    {errors.activity && (
                      <Text
                        style={{
                          marginTop: 3,
                          color: appColor.formError,
                          fontSize: fontScalling(1.6),
                          fontFamily: appFont.rR,
                        }}>
                        {errors.activity.message}
                      </Text>
                    )}
                  </View>
                </View>
              </>
            )}
            {guestLogin && (
              <View
                style={{
                  backgroundColor: appColor.borderColor,
                  borderRadius: 10,
                  elevation: 0.4,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  marginTop: 15,
                }}>
                <Text
                  style={[
                    styles.text,
                    {fontSize: fontScalling(1.8), paddingBottom: 5},
                  ]}>
                  According to your goal :
                </Text>
                <Text
                  style={[
                    styles.text,
                    {fontSize: fontScalling(1.8), color: appColor.gold},
                  ]}>
                  Below are the energy(kcal), macro nutrients expectations that
                  you need to meet!
                </Text>
                {/* nutrients Block */}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginTop: 10,
                  }}>
                  {/* BMI */}
                  {
                    // <InputText
                    //   customStyle={{flex: 1, marginRight: 10}}
                    //   autoFocus={true}
                    //   row
                    //   placeholder={'52'}
                    //   value={profile.bmi}
                    //   editable={false}
                    //   leftIcon
                    //   keyboardType={'numeric'}
                    //   Title={'BMI'}
                    //   // onChangeText={onChange}
                    //   onFocus={event => {
                    //     textFocus.current.scrollToFocusedInput(event.target);
                    //   }}
                    // />
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: appColor.bgBlack,
                          fontFamily: appFont.rB,
                          paddingBottom: widthResponse ? 7 : 12,
                          fontSize: fontScalling(1.7),
                        }}>
                        BMI
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: appColor.cardbg,
                          paddingVertical: 5,
                          paddingHorizontal: 6,
                          marginBottom: 10,
                          marginRight: 10,
                          borderRadius: 10,
                          alignItems: 'center',
                          flexDirection: 'row',
                          elevation: 2,
                        }}>
                        <Text
                          style={{
                            color: appColor.boldBlacktext,
                            fontFamily: appFont.rR,
                            paddingVertical: 5,
                            paddingHorizontal: 6,
                            textAlignVertical: 'center',
                            fontSize: fontScalling(1.6),
                          }}>
                          {profile.bmi}
                        </Text>
                        <Text
                          style={{
                            color: bmiBasedValues(profile.bmi).bmiColor,
                          }}>
                          {`( ${bmiBasedValues(profile.bmi).bmiCategory} )`}
                        </Text>
                      </View>
                    </View>
                  }
                  {/* TDEE */}
                  <InputText
                    row
                    placeholder={'44'}
                    customStyle={{
                      flex: widthResponse ? 0.8 : 1,
                      marginRight: 10,
                    }}
                    value={profile.tdee}
                    leftIcon
                    keyboardType={'numeric'}
                    editable={false}
                    Title={'TDEE'}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    // marginTop: 10,
                  }}>
                  {/* BMR */}
                  <InputText
                    customStyle={{flex: 1, marginRight: 10}}
                    row
                    placeholder={'55'}
                    value={profile.bmr}
                    keyboardType={'numeric'}
                    Title={'BMR'}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                    editable={false}
                  />
                  {/* TEF */}
                  <InputText
                    customStyle={{flex: 1, marginRight: 10}}
                    row
                    placeholder={'25'}
                    value={profile.tef}
                    keyboardType={'numeric'}
                    Title={'TEF'}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                    editable={false}
                  />
                </View>
                <Text
                  style={[
                    styles.text,
                    {fontSize: fontScalling(1.8), paddingVertical: 5},
                  ]}>
                  Muscle Gain Macro Distribution:
                </Text>
                <Text
                  style={[
                    styles.text,
                    {fontSize: fontScalling(1.8), color: appColor.gold},
                  ]}>
                  When aiming for muscle gain, the body needs extra energy to
                  build muscle, so carbohydrates are increased, and protein is
                  crucial for muscle repair and growth. A calorie surplus is
                  typically required.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginTop: 10,
                  }}>
                  {/* Proteins */}
                  <InputText
                    customStyle={{flex: 1, marginRight: 10}}
                    autoFocus={true}
                    row
                    placeholder={'52'}
                    value={profile.mac_protein}
                    editable={false}
                    leftIcon
                    keyboardType={'numeric'}
                    Title={'Proteins'}
                    // onChangeText={onChange}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                  {/* TDEE */}
                  <InputText
                    row
                    placeholder={'44'}
                    customStyle={{flex: 1, marginRight: 10}}
                    value={profile.mac_calories}
                    leftIcon
                    keyboardType={'numeric'}
                    editable={false}
                    Title={'Carbohydrates '}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                  {/* BMR */}
                  <InputText
                    customStyle={{flex: 1, marginRight: 10}}
                    row
                    placeholder={'55'}
                    value={profile.mac_fats}
                    keyboardType={'numeric'}
                    Title={'Fats '}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                    editable={false}
                  />
                </View>
              </View>
            )}
            {/*BUTTONS*/}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
              }}>
              <PrimaryButton
                Title="RESET"
                black
                parentStyle={{flex: 1}}
                altStyle={{marginRight: 10}}
                onPress={() => {
                  getProfile();
                }}
              />
              <PrimaryButton
                Title="CONFIRM"
                profile
                parentStyle={{flex: 1}}
                onPress={handleSubmit(onPressSend)}
              />
            </View>
          </View>
          {/* -------delete modal--------- */}
          <Modal
            animationType="slide"
            onBackdropPress={() => {
              setdeleteModal(!deleteModal);
            }}
            backdropColor={appColor.overlayBg}
            backdropOpacity={1}
            transparent={true}
            isVisible={deleteModal}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
              width: scrnWidth / 1.2,
              marginHorizontal: 'auto',
            }}>
            <View
              style={{
                backgroundColor: appColor.white,
                paddingHorizontal: 15,
                paddingBottom: 15,
                borderRadius: 5,
                alignItems: 'center',
                paddingTop: 0,
                width: '100%',
              }}>
              <LottieView
                ref={deleteAnimRef}
                resizeMode="contain"
                style={{
                  width: scrnWidth / 2,
                  height: scrnWidth / 2.5,
                  // marginTop: -35,
                }}
                source={require('../../../assets/lottieFiles/trash_1.json')}
                loop={false}
              />
              {profile?.profile_picture?.uri &&
                profile?.profile_picture?.uri != '' && (
                  <Text
                    style={{
                      marginBottom: 10,
                      fontFamily: appFont.rB,
                      fontSize: fontScalling(2.1),
                      color: appColor.textBlack,
                      paddingBottom: 10,
                    }}>
                    Are you sure you want to delete?
                  </Text>
                )}
              {profile?.profile_picture?.uri &&
                profile?.profile_picture?.uri != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                    <Pressable
                      style={{
                        backgroundColor: appColor.themeYellow,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        setProfile({
                          ...currentValues,
                          profile_picture: '',
                        });
                        setAnimButton(false);
                        deleteAnimRef?.current.play(0, 150);
                        setTimeout(() => {
                          setdeleteModal(false);
                        }, 2000);
                      }}>
                      <Text
                        style={{
                          fontFamily: appFont.rB,
                          fontSize: fontScalling(1.5),
                          color: appColor.white,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        }}>
                        delete
                      </Text>
                    </Pressable>
                    <Pressable
                      style={{
                        backgroundColor: appColor.themeYellow,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginLeft: 10,
                      }}
                      onPress={() => setdeleteModal(false)}>
                      <Text
                        style={{
                          fontFamily: appFont.rB,
                          fontSize: fontScalling(1.5),
                          color: appColor.white,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        }}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                )}
            </View>
          </Modal>
        </Pressable>
      </KeyboardAwareScrollView>
    </MainCard>
  );
};

export default EditProfile;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    imgContainer: {
      alignItems: 'center',
    },
    profileImg: {
      width: scrnWidth / 4,
      height: scrnWidth / 4,
      borderRadius: scrnWidth / 8,
      position: 'relative',
      backgroundColor: appColor.white,
    },
    editImg: {
      backgroundColor: appColor.themeYellow,
      width: widthResponse ? 25 : 45,
      height: widthResponse ? 25 : 45,
      borderRadius: 200,
      borderWidth: 1.5,
      borderColor: appColor.white,
      position: 'relative',
      top: -scrnWidth / 4,
      left: scrnWidth / 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreText: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.boldBlacktext,
      textAlign: 'center',
      paddingVertical: 6,
      paddingHorizontal: 5,
    },
    text: {
      color: appColor.boldBlacktext,
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.6),
    },
  });
  return styles;
};
