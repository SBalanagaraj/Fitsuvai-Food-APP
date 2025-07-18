import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {fontScalling, print, scrnWidth} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputField/InputText';
import FilterButton from '../../components/Buttons/FilterButton';
import Geolocation from 'react-native-geolocation-service';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {widthResponse} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useDispatch, useSelector} from 'react-redux';
import {AddToaddress} from '../../redux/AddressSlice';
import {url} from '../../utilities/appApi';
import {
  AdminDistanceRadius,
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
  const {userSettings, adminLocation} = useSelector(state => state.setting);

  // checks for the editfunction and geting the values to edit
  console.log(route?.params?.verify, 'verify in my Address');
  const verify =
    route?.params?.verify == 'edit' || route?.params?.verify == 'editCheckOut';
  const {editItem} = route.params;

  // initially setting the values to edit
  useEffect(() => {
    if (verify) {
      print(editItem, 'info');
      setPersionalInfo({
        name: editItem.name,
        email: editItem.email,
        mobileNumber: editItem.phone,
        alterMobileNumber: editItem.alterphone,
        flatNumber: editItem.flatno,
        pincode: editItem.pincode,
        street: editItem.street,
        city: editItem.city,
        state: editItem.state,
        nearLocation: editItem.landmark,
        addressType: editItem.place,
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
        .string()
        .required('Mobile Number is required')
        .min(10, 'invalid Mobile Number'),
      alterMobileNumber: yup
        .string()
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
      landMark: yup.string().notRequired(),
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

  // function to get permission for location
  useEffect(() => {
    if (!verify) {
      getUserLocations();
    }
  }, []);

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
    } else {
      setLoadCl(false);
    }
  };

  // Address and delivery distance validate
  const handlePersonalInfo = async data => {
    if (
      isValid &&
      userSettings &&
      userSettings.RADIUS &&
      userSettings?.SITEINFO &&
      userSettings?.SITEINFO?.location &&
      Object.keys(destination).length > 0
    ) {
      const distancematrix = await AdminDistanceRadius(
        userSettings?.SITEINFO?.location,
        destination,
        userSettings?.RADIUS,
      );
      print(distancematrix, 'distancematrix');
      if (distancematrix.status) {
        dispatch(AddToaddress(data));
        apiCall();
        setTimeout(() => {
          navigation.navigate('manageAddress', {
            verify: route.params.verify,
          });
        }, 800);
      } else if (!distancematrix.status) {
        showToast('error', '', 'Distance not in our Range');
      } else {
        showToast('error', 'some Thing Went Wrong!', 1500);
      }
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
      print(formdata, 'formdata');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
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
        style={[styles.HeadingText, {textAlign: 'center', paddingBottom: 10}]}>
        Enter your{' '}
        <Text style={[styles.HeadingText, {color: appColor.gold}]}>
          address
        </Text>
      </Text>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{
          paddingTop: widthResponse ? 15 : 10,
          paddingBottom: 90,
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
                iconSize={18}
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
              iconSize={18}
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
              iconSize={18}
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
            marginTop: 15,
            backgroundColor: appColor.black,
            paddingVertical: 10,
            justifyContent: 'center',
          }}
          bgBlack={true}
        />
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
                icon="MaterialCommunityIcons"
                iconName="locker"
                iconSize={18}
                // autoCapitalize="none"
                onChangeText={onChange}
                formError={errors.flatNumber}
                keyboardType={'numeric'}
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
                iconSize={18}
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
                icon="FontAwesome5"
                iconName="road"
                iconSize={20}
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
                iconSize={15}
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
                iconSize={18}
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
            name="landMark"
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
                  editable={true}
                />
              );
            }}
          />
        )}
        {/* add or remove alternate number */}
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
          <FilterButton
            onPress={() =>
              setPersionalInfo({...currentValues, addressType: 'home'})
            }
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
