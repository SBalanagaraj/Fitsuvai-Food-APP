import {Text, View, Pressable, StyleSheet} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {
  fontScalling,
  objectLength,
  print,
  scrnWidth,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputField/InputText';
import FilterButton from '../../components/Buttons/FilterButton';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {widthResponse} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useDispatch, useSelector} from 'react-redux';
import {url} from '../../utilities/appApi';
import {
  AdminDistanceRadius,
  getCoordinatesFromAdminLocation,
  getCoordinatesFromUserLocation,
  getPincodeFromAddress,
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../../utilities/GeolocationFunctions';

const MyAddress = ({navigation, route}) => {
  const appColor = appColors();
  const {styles} = useStyles();
  const textFocus = useRef();
  const showToast = useShowToast();
  const dispatch = useDispatch();

  const [altNumber, setAltNumber] = useState(false);
  const [altLocation, setAltLocation] = useState(false);
  const [loadCL, setLoadCl] = useState(false);
  const [destination, setDestination] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [persionalInfo, setPersionalInfo] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    alterMobileNumber: '',
    flatNumber: '',
    pincode: '',
    street: '',
    city: '',
    state: '',
    nearLocation: '',
    addressType: 'home',
  });
  const {userSettings} = useSelector(state => state.setting);

  // checks for the editfunction and geting the values to edit
  const verify =
    route?.params?.verify == 'edit' || route?.params?.verify == 'editCheckOut';
  const {editItem, maps = ''} = route?.params ? route?.params : '';

  // initially setting the values to edit
  useEffect(() => {
    if (verify) {
      setPersionalInfo({
        name: editItem?.name ? editItem?.name : '',
        email: editItem?.email ? editItem?.email : '',
        mobileNumber: editItem?.phone ? editItem?.phone : '',
        alterMobileNumber: editItem?.alterphone ? editItem?.alterphone : '',
        flatNumber: editItem?.flatno ? editItem?.flatno : '',
        pincode: editItem?.pincode ? editItem?.pincode : '',
        street: editItem?.street ? editItem?.street : '',
        city: editItem?.city ? editItem?.city : '',
        state: editItem?.state ? editItem?.state : '',
        nearLocation: editItem?.landmark ? editItem?.landmark : '',
        addressType: editItem?.place ? editItem?.place : '',
      });
    }
  }, []);

  //  ----------------------- useForm functions ----------------------------

  // validation in personal info:
  const schema = yup
    .object()
    .shape({
      name: yup.string('must be string').required('Name is required'),
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
      mobileNumber: yup
        .number()
        .typeError('Please Enter a valid Number')
        .required('Mobile Number is required')
        .min(10, 'invalid Mobile Number'),
      alterMobileNumber: yup
        .string()
        // .typeError('Please Enter a valid Number')
        .test(
          'empty-or-valid',
          'Invalid Mobile Number or Number already exists',
          function (value) {
            // If value is empty, it's valid (i.e., not required)
            if (!value) return true;

            // Check minimum length
            if (value.length < 10) return false;

            // Check if altNumber is not the same as the number
            return value !== this.parent.mobileNumber;
          },
        ),
      flatNumber: yup.string().required('Please Provide flat number'),
      pincode: yup
        .number()
        .typeError('Please Enter a valid Number')
        .required('please enter pincode '),
      street: yup.string().required('please enter street name '),
      city: yup.string().required('please enter city name '),
      state: yup.string().required('please enter state name '),
      nearLocation: yup.string().notRequired(),
    })
    .required();

  //  useForms
  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: {errors, isValid},
  } = useForm({defaultValues: persionalInfo, resolver: yupResolver(schema)});

  // reset data for state updation in useForms
  useEffect(() => {
    reset(persionalInfo);
  }, [persionalInfo, reset]);

  // Watch for changes in form fields
  const currentValues = watch();

  // -----------------------------------------------------------------------

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
        setDestination(userCoordinates ? userCoordinates : '');
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

  // function to get permission for location
  useEffect(() => {
    if (!verify) {
      getUserLocations();
    }
  }, []);

  // get the manual Location
  useEffect(() => {
    if (maps != '' && objectLength(maps)) {
      setPersionalInfo({
        ...currentValues,
        street: maps.street,
        state: maps.state,
        city: maps.city,
        pincode: maps.pincode,
      });
    }
  }, [maps]);

  // get current location
  const getUserLocations = async () => {
    const userCurrentLocation = await getUserLocation();
    if (userCurrentLocation && Object.keys(userCurrentLocation).length > 0) {
      setLoadCl(true);
      setPersionalInfo(inputs => {
        return {
          ...currentValues,
          street: userCurrentLocation.street,
          state: userCurrentLocation.state,
          city: userCurrentLocation.city,
          pincode: userCurrentLocation.pincode,
        };
      });
      setLoadCl(false);
    }
  };

  // Address and delivery distance validate
  const handlePersonalInfo = async data => {
    if (
      isValid &&
      userSettings &&
      userSettings.RADIUS &&
      userSettings?.ADDRESS &&
      Object.keys(destination).length > 0
    ) {
      const adminCoordinates = await getCoordinatesFromAdminLocation(
        userSettings?.ADDRESS,
      );
      const distancematrix = await AdminDistanceRadius(
        adminCoordinates,
        destination,
        userSettings?.RADIUS,
      );
      if (distancematrix.status) {
        apiCall();
      } else if (!distancematrix.status) {
        showToast('error', '', 'Distance not in our Range');
      } else {
        showToast('error', 'some Thing Went Wrong!', 1500);
      }
    }
    if (destination == '') {
      showToast('error', '', 'Please fill in the valid address');
    }
  };

  //api call function

  const apiCall = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      const formdata = new FormData();
      formdata.append('info', JSON.stringify(currentValues));
      if (userSettings?.userInfo?.user_id) {
        formdata.append('userId', userSettings?.userInfo?.user_id);
      }
      formdata.append('context', verify ? 'edit' : 'add');
      if (verify) {
        formdata.append('addressId', editItem.id);
      }
      var requestOptions = {
        method: 'POST',
        body: formdata,
        header: myHeaders,
      };
      const response = await fetch(url().addressBook, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          setTimeout(() => {
            navigation.navigate('manageAddress', {
              verify: route?.params?.verify,
            });
          }, 100);
          showToast(
            'success',
            verify ? 'Address is updated' : 'Address is saved',
            2000,
          );
        }
      }
    } catch (error) {
      console.log(error, 'Error from my address');
      showToast('error', 'some Thing Went Wrong!', 1500);
    }
  };

  return (
    <MainCard altStyle={{paddingHorizontal: 10}}>
      <Text
        style={[
          styles.HeadingText,
          {
            textAlign: 'center',
            paddingBottom: 10,
            paddingTop: widthResponse ? 7 : 15, //@@
          },
        ]}>
        Enter your{' '}
        <Text style={[styles.HeadingText, {color: appColor.gold}]}>
          address
        </Text>
      </Text>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{
          paddingTop: widthResponse ? 15 : 10,
          paddingBottom: widthResponse ? 90 : 140, //@@
          backgroundColor: appColor.white,
        }}
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={350}
        ref={textFocus}
        showsVerticalScrollIndicator={false}>
        <Controller
          name="name"
          control={control}
          render={({field: {onChange, value}}) => {
            return (
              <InputText
                value={value}
                row
                leftIcon
                icon={'FontAwesome'}
                iconName={'user-o'}
                iconSize={widthResponse ? 18 : 25} //@@
                Title={'Your Name'}
                placeholder={'Your Name'}
                onChangeText={onChange}
                formError={errors.name}
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
              />
            );
          }}
        />
        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({field: {onChange, value}}) => (
            <InputText
              row
              placeholder={'Enter email address'}
              value={value}
              leftIcon
              keyboardType={'email-address'}
              autoCapitalize
              icon={'Feather'}
              iconName={'mail'}
              iconSize={widthResponse ? 18 : 25} //@@
              Title={'Email address'}
              onChangeText={onChange}
              formError={errors.email}
              onFocus={event => {
                textFocus.current.scrollToFocusedInput(event.target);
              }}
            />
          )}
        />
        {/* Number */}
        <Controller
          name="mobileNumber"
          control={control}
          render={({field: {onChange, value}}) => (
            <InputText
              row
              placeholder={'Enter mobile number'}
              value={value}
              leftIcon
              keyboardType={'numeric'}
              maxLength={10}
              icon={'Feather'}
              iconName={'phone'}
              iconSize={widthResponse ? 18 : 25} //@@
              Title={'Phone number'}
              onChangeText={onChange}
              formError={errors.mobileNumber}
              onFocus={event => {
                textFocus.current.scrollToFocusedInput(event.target);
              }}
            />
          )}
        />
        {/* Alter Number */}
        {altNumber && (
          <Controller
            name="alterMobileNumber"
            control={control}
            render={({field: {onChange, value}}) => (
              <InputText
                row
                placeholder={'Enter mobile number'}
                value={value}
                leftIcon
                keyboardType={'numeric'}
                maxLength={10}
                icon={'Feather'}
                iconName={'phone'}
                iconSize={18}
                Title={'Alternate Number'}
                onChangeText={onChange}
                formError={errors.alterMobileNumber}
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
              />
            )}
          />
        )}
        {/* add or remove alternate number */}
        <Pressable
          onPress={() => setAltNumber(!altNumber)}
          style={styles.commenStyle}>
          <Icon
            ComponentName={'AntDesign'}
            name={altNumber ? 'minuscircleo' : 'pluscircleo'}
            size={20}
            color={appColor.gold}
          />
          <Text style={[styles.subText, {paddingLeft: 15}]}>
            {altNumber
              ? 'Remove alternate number'
              : 'Add alternative phone number'}
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
          }}>
          <FilterButton
            load={loadCL}
            onPress={async () => {
              const isGranted = await requestLocationPermission();
              console.log(isGranted, 'isGranted');
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
              backgroundColor: appColor.black,
              paddingVertical: 10,
              justifyContent: 'center',
            }}
            bgBlack={true}
          />
          <FilterButton
            onPress={() => {
              navigation.navigate('manualLocation', {
                page: 'myAddress',
                verify:
                  route?.params?.verify == 'checkout'
                    ? route?.params?.verify
                    : '',
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
            alignItems: 'center',
            marginTop: 15,
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
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
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
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
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
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
              />
            );
          }}
        />
        {/* city & state name  */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
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
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
                editable={true}
              />
            )}
          />
        </View>
        {/* alter location */}
        {altLocation && (
          <Controller
            name="nearLocation"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  value={value}
                  row
                  Title=" Add Nearby Famous Shop/Mall/Landmark"
                  placeholder=" Add Nearby Famous Shop/Mall/Landmark"
                  icon="Ionicons"
                  iconName="ios-business-outline"
                  iconSize={20}
                  multiline={true}
                  onChangeText={onChange}
                  onFocus={event => {
                    textFocus.current.scrollToFocusedInput(event.target);
                  }}
                />
              );
            }}
          />
        )}
        {/* add or remove landmark */}
        <Pressable
          onPress={() => setAltLocation(!altLocation)}
          style={styles.commenStyle}>
          <Icon
            ComponentName={'AntDesign'}
            name={altLocation ? 'minuscircleo' : 'pluscircleo'}
            size={20}
            color={appColor.gold}
          />
          <Text
            style={[
              styles.subText,
              {paddingLeft: 15, fontSize: fontScalling(1.8)},
            ]}>
            {altLocation
              ? 'Remove Nearby Famous Shop/Mall/Landmark'
              : 'Add Nearby Famous Shop/Mall/Landmark'}
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 10,
          }}>
          <Text style={[styles.subText, {fontSize: fontScalling(1.8)}]}>
            Select Type of Address
          </Text>
          {/* totally change the structure //@@ */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FilterButton
              onPress={() =>
                setPersionalInfo({...currentValues, addressType: 'home'})
              }
              altStyle={{marginRight: widthResponse ? 10 : 20}}
              btnName={persionalInfo.addressType}
              ICN="Ionicons"
              IN="home-outline"
              title={'home'}
              bgGolg={true}
            />
            <FilterButton
              onPress={() =>
                setPersionalInfo({...currentValues, addressType: 'work'})
              }
              bgGolg={true}
              btnName={persionalInfo.addressType}
              ICN={'MaterialCommunityIcons'}
              IN={'office-building-cog-outline'}
              title={'work'}
            />
          </View>
        </View>
        <PrimaryButton
          onPress={handleSubmit(handlePersonalInfo)}
          Title={'Save address'}
          altStyle={{marginTop: 20}}
        />
      </KeyboardAwareScrollView>
    </MainCard>
  );
};

export default MyAddress;

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
      fontSize: fontScalling(2),
      color: appColor.black,
    },
    normalText: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(2),
      color: appColor.black,
      paddingBottom: 5,
    },
    price: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.2),
      color: appColor.black,
    },
    line: {
      width: scrnWidth,
      height: 0.5,
      backgroundColor: appColor.textGrey,
      alignSelf: 'center',
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.bgBlack,
      marginTop: 5,
    },
    dotWhite: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.white,
      marginTop: 5,
    },
    SideHeadingCont: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingBottom: 10,
      borderBottomWidth: 0.5,
      marginBottom: 15,
      // marginHorizontal: 20,
      borderBottomColor: appColor.greyBack,
      width: '100%',
    },
    commenStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
    },
  });

  return {styles};
};
