import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  PermissionsAndroid,
} from 'react-native';
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
import {useIsFocused} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputField/InputText';
import {
  fontScalling,
  objectLength,
  print,
  requestPermissions,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import SelectDrop from '../../components/InputField/SelectDrop';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {setProfileData} from '../../redux/authSlice';
import Geolocation from 'react-native-geolocation-service';
import FilterButton from '../../components/Buttons/FilterButton';
import {setLocationGranted} from '../../redux/SettingSlice';
import {
  AdminDistanceRadius,
  getCoordinatesFromUserLocation,
  getPincodeFromAddress,
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../../utilities/GeolocationFunctions';

const EditProfile = ({navigation}) => {
  const appColor = appColors();
  const styles = useStyles();
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const {profileData} = useSelector(state => state.auth);
  const {userSettings} = useSelector(state => state.setting);
  const [drop, setDrop] = useState(false);
  const [loadCL, setLoadCl] = useState(false);
  const [pinCode, setPinCode] = useState('');

  const gender = ['female', 'male', 'others'];
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
  });
  const [load, setLoad] = useState(false);
  const [animButton, setAnimButton] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const textFocus = useRef(null);
  const deleteAnimRef = useRef(null);
  const [destination, setDestination] = useState('');

  const {locationGranted} = useSelector(state => state.setting);

  // print(locationGranted, 'locationGranted');

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
        console.log(error);
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
        console.log(error);
      });
    setAnimButton(!animButton);
  };

  const handleDeleteImage = () => {
    setdeleteModal(!deleteModal);
  };

  // print(profile, 'profile');

  // validation:
  const schema = yup
    .object()
    .shape({
      name: yup.string('must be string').required('Name is required'),
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
      number: yup
        .string()
        .required('Mobil Number is required')
        .min(10, 'invalid Mobile Number'),
      gender: yup.string().required('select gender'),
      flatNumber: yup.string().required('Please Provide flat number'),
      pincode:
        // pinCode != ''
        // ? yup
        //     .string()
        //     .required('please enter pincode ')
        //     .test(
        //       'please enter pincode ',
        //       `invalid pincode please use this ${pinCode}`,
        //       function (value) {
        //         // If value is empty, it's valid (i.e., not required)
        //         if (!value) return true;

        //         // Check minimum length
        //         if (value.length < 5) return false;

        //         // Check if altNumber is not the same as the number
        //         return value == Number(pinCode);
        //       },
        //     )
        yup
          .number()
          .typeError('Please Enter a valid Number')
          .required('please enter pincode '),
      street: yup.string().required('please enter street name '),
      city: yup.string().required('please enter city name '),
      state: yup.string().required('please enter state name '),
    })
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
      userSettings?.SITEINFO &&
      userSettings?.SITEINFO?.location &&
      userSettings?.RADIUS &&
      Object.keys(destination).length > 0
    ) {
      const distancematrix = await AdminDistanceRadius(
        userSettings?.SITEINFO?.location,
        destination,
        userSettings?.RADIUS,
      );
      // print(distancematrix, 'distancematrix');
      if (distancematrix.status) {
        apiCall(data);
      } else {
        showToast('error', '', 'Distance not in our Range');
      }
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
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

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
      if (userCoordinates) {
        setDestination(userCoordinates);
      }
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
    const userCurrentLocation = await getUserLocation();
    setLoadCl(true);
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
          paddingBottom: widthResponse ? 90 : 130,
        }}
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={300}
        ref={textFocus}
        showsVerticalScrollIndicator={false}>
        <Pressable style={{marginTop: 15}}>
          {/* Profile Picture */}
          <Pressable
            onPress={() => {
              handleDrop();
            }}
            style={styles.imgContainer}>
            <Pressable
              onPress={() => {
                handleDrop();
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
                  <Image
                    source={{uri: profile?.profile_picture?.uri}}
                    style={[
                      styles.profileImg,
                      {
                        width: scrnWidth / 4,
                        height: scrnWidth / 4,
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
                handleDrop();
                setTimeout(() => {
                  setAnimButton(!animButton), 1000;
                });
              }}
              style={styles.editImg}>
              <Icon
                color={appColor.white}
                size={11}
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
                  // onTouchStart={() => {
                  //   requestPermissions('storage', OpenCamera);
                  // }}
                  onTouchStart={async () => {
                    const Camera = await requestPermissions('camera');
                    const Storage = await requestPermissions('storage');
                    if (Camera == 'granted' && Storage == 'granted') {
                      OpenCamera();
                    }
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
                  onTouchStart={() => {
                    requestPermissions('storage', OpenGallery);
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
          </Pressable>
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
                  iconSize={18}
                  Title={'Your Name'}
                  onChangeText={onChange}
                  formError={errors.name}
                  onFocus={onFocus}
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
                      drop={drop}
                      title={'Gender'}
                      placeholder={'Select your gender'}
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
                    iconSize={18}
                    customStyle={{flex: 1, marginRight: 10}}
                    keyboardType={'email-address'}
                    autoCapitalize
                    Title={'Email Address'}
                    onChangeText={onChange}
                    formError={errors.email}
                    onFocus={onFocus}
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
                    iconSize={18}
                    Title={'Mobile Number'}
                    onChangeText={onChange}
                    formError={errors.number}
                    onFocus={onFocus}
                  />
                )}
              />
            </View>
            {/* current Location */}
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
                marginVertical: 10,
                backgroundColor: appColor.black,
                paddingVertical: 10,
                justifyContent: 'center',
                opacity: 1,
              }}
              bgBlack={true}
            />
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
                    leftIcon
                    icon="MaterialCommunityIcons"
                    iconName="locker"
                    iconSize={18}
                    // autoCapitalize="none"
                    onChangeText={onChange}
                    formError={errors.flatNumber}
                    onFocus={onFocus}
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
                    keyboardType={'numeric'}
                    customStyle={{flex: 1}}
                    leftIcon
                    Title="Pincode"
                    placeholder="Enter your Pincode"
                    icon="MaterialCommunityIcons"
                    iconName="mailbox-up-outline"
                    iconSize={18}
                    onChangeText={onChange}
                    formError={errors.pincode}
                    onFocus={onFocus}
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
                    leftIcon
                    icon="FontAwesome5"
                    iconName="road"
                    iconSize={20}
                    multiline={true}
                    onChangeText={onChange}
                    formError={errors.street}
                    onFocus={onFocus}
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
                    iconSize={15}
                    rightIcon="AntDesign"
                    onChangeText={onChange}
                    formError={errors.state}
                    onFocus={onFocus}
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
                    iconSize={18}
                    autoCapitalize="none"
                    onChangeText={onChange}
                    formError={errors.city}
                    onFocus={onFocus}
                    editable={true}
                  />
                )}
              />
            </View>
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
                  // setProfile({
                  //   ...currentValues,
                  //   name: '',
                  //   email: '',
                  //   number: '',
                  //   gender: '',
                  //   flatNumber: '',
                  //   pincode: '',
                  //   street: '',
                  //   city: '',
                  //   state: '',
                  //   profile_picture: {
                  //     name: 'profile.jpeg',
                  //     uri: '',
                  //     type: 'image/jpeg',
                  //   },
                  // });
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
      width: 25,
      height: 25,
      borderRadius: 12.5,
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
