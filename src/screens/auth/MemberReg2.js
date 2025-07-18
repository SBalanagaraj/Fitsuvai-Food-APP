import {View, Text, Pressable} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useIsFocused} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
// file import:
import appColors from '../../utilities/appColors';
import {
  fontScalling,
  objectLength,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import MemberRegCard from '../../components/Card/MemberRegCard';
import {appFont} from '../../utilities/appFont';
import {useDispatch, useSelector} from 'react-redux';
import FilterButton from '../../components/Buttons/FilterButton';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {setMemberShipData} from '../../redux/SummerySlice';
import CheckBox from '../../components/InputField/CheckBox';
import UserPlanPrice from '../../Hooks/UserPlanPrice';
import {
  AdminDistanceRadius,
  getCoordinatesFromUserLocation,
  getPincodeFromAddress,
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../../utilities/GeolocationFunctions';

const MemberReg2 = ({navigation, route}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const showToast = useShowToast();
  const dispatch = useDispatch();
  const {maps = ''} = route?.params ? route?.params : '';

  // states
  const [loadCL, setLoadCl] = useState(false);
  const [destination, setDestination] = useState('');
  const [persionalInfo, setPersionalInfo] = useState({
    flatno: '',
    pincode: '',
    street: '',
    city: '',
    state: '',
    nearLocation: '',
    is_weekEnd: 1,
  });

  const {planAmmount} = useSelector(state => state.summary);
  const {userSettings} = useSelector(state => state.setting);
  const {userType} = useSelector(state => state.auth);
  const userData =
    userSettings && userSettings?.userInfo != '' && userSettings?.userInfo;
  const [pinCode, setPinCode] = useState('');

  // const adminCoordinates = `${
  //   userSettings?.SITEINFO?.latitude &&
  //   userSettings?.SITEINFO?.latitude != '' &&
  //   userSettings?.SITEINFO?.latitude
  // },
  //   ${
  //     userSettings?.SITEINFO?.longitude &&
  //     userSettings?.SITEINFO?.longitude != '' &&
  //     userSettings?.SITEINFO?.longitude
  //   }`;

  const adminCoordinates =
    userSettings?.SITEINFO?.location &&
    userSettings?.SITEINFO?.location != '' &&
    userSettings?.SITEINFO?.location;

  const {PlanPriceInfo} = UserPlanPrice();

  useEffect(() => {
    if (userType == 'user' && userData) {
      setPersionalInfo({
        flatno: userData.flat, //adressbook
        pincode: userData.pincode,
        street: userData.street,
        city: userData.city,
        state: userData.state,
        nearLocation: '', //adressbook
        is_weekEnd: 1,
      });
    } else if (userType != 'user') {
      setPersionalInfo({
        flatno: '',
        pincode: '',
        street: '',
        city: '',
        state: '',
        nearLocation: '',
        is_weekEnd: 1,
      });
    }
  }, [userData]);
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
  // reset data for state updation in useForms
  useEffect(() => {
    reset(persionalInfo);
  }, [persionalInfo, reset]);

  // validation:
  const schema = yup
    .object()
    .shape({
      flatno: yup.string().required('Please Provide flat number'),
      pincode: yup
        .number()
        .typeError('Please Enter a valid Number')
        .required('Please enter pincode '),
      street: yup.string().required('Please enter street name '),
      city: yup.string().required('Please enter city name '),
      state: yup.string().required('Please enter state name '),
      nearLocation: yup.string().notRequired(),
      is_weekEnd: yup.string().notRequired(),
    })
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {errors, isValid},
  } = useForm({defaultValues: persionalInfo, resolver: yupResolver(schema)});

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
        print(getPincode, 'getPincode');
      }
    })();
  }, [
    currentValues.pincode,
    currentValues.street,
    currentValues.state,
    currentValues.city,
  ]);

  // get current location
  const getUserLocations = async () => {
    setLoadCl(true);
    const userCurrentLocation = await getUserLocation();
    if (userCurrentLocation && Object.keys(userCurrentLocation).length > 0) {
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
      userSettings?.ADDRESS &&
      userSettings?.RADIUS &&
      Object.keys(destination).length > 0
    ) {
      const distancematrix = await AdminDistanceRadius(
        adminCoordinates,
        destination,
        userSettings?.RADIUS,
      );
      if (distancematrix.status) {
        if (planAmmount) {
          PlanPriceInfo(
            planAmmount.subTotal,
            {
              code: null,
              percent: planAmmount.discount.percent,
            },
            planAmmount.sectionCount, //BN
            distancematrix.distance,
            'checkDistance',
            planAmmount.vesselPrice,
            planAmmount.vesselName,
            planAmmount.dishCount, //BN
          );
        }
        dispatch(setMemberShipData(data));
        isValid && navigation.navigate('member_3');
      } else {
        showToast('error', 'your location currently unavailable!!', '', 1200);
      }
    } else {
      showToast('error', 'some Thing Went Wrong!', '', 1500);
    }
    if (destination == '') {
      showToast('error', '', 'Please fill in the valid address');
    }
  };

  return (
    <MemberRegCard textFocus={textFocus}>
      {/* form */}
      <View style={{width: '100%', marginBottom: widthResponse ? 10 : 25}}>
        {/* flat & pin code  */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
          }}>
          {/* flatNumber */}
          <Controller
            name="flatno"
            control={control}
            render={({field: {onChange, value}}) => (
              <InputText
                value={value}
                customStyle={{flex: 1, marginRight: 10}}
                Title="Flat Number"
                placeholder="Enter Flat Number"
                icon="MaterialCommunityIcons"
                iconName="locker"
                leftIcon={true} //@@
                dark
                // autoCapitalize="none"
                iconSize={widthResponse ? 18 : 25} //@@
                onChangeText={onChange}
                formError={errors.flatno}
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
                dark
                keyboardType={'numeric'}
                Title="Pincode"
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
                leftIcon={true} //@@
                icon="FontAwesome5"
                iconName="road"
                iconSize={widthResponse ? 20 : 30}
                dark
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
            marginBottom: 10,
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
                iconSize={widthResponse ? 18 : 25} //@@
                dark
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
                dark
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
        {/* nearLocation */}
        <Controller
          name="nearLocation"
          control={control}
          render={({field: {onChange, value}}) => {
            return (
              <InputText
                value={value}
                // editable={editable}
                row
                dark
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
        <Controller
          name="is_weekEnd"
          control={control}
          render={({field: {onChange, value}}) => {
            return (
              <Pressable
                onPress={() => onChange(currentValues.is_weekEnd == 1 ? 0 : 1)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: widthResponse ? 5 : 10,
                }}>
                <CheckBox
                  // onPress={() =>
                  //   onChange(currentValues.is_weekEnd == 1 ? 0 : 1)
                  // }
                  checkBox={value == 1}
                />
                <Text
                  style={{
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(2),
                    color: appColor.white,
                    paddingLeft: 15,
                  }}>
                  Is your weekend address same?
                </Text>
              </Pressable>
            );
          }}
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
            color: appColor.textBlack,
            fontFamily: appFont.bB,
            fontSize: fontScalling(2.5),
          }}
          altStyle={{
            flex: 1,
            marginVertical: widthResponse ? 15 : 20,
            backgroundColor: appColor.bgWhite,
            paddingVertical: 12,
            justifyContent: 'center',
          }}
        />
        <FilterButton
          onPress={() => {
            navigation.navigate('manualLocation', {
              page: 'member_2',
              intial: false,
            });
          }}
          ICN={'FontAwesome6'}
          IN={'map-location-dot'}
          ICNSIZE={widthResponse ? 17 : 24}
          title={'Choose location'}
          altTextStyle={{
            color: appColor.textBlack,
            paddingLeft: 10,
            fontFamily: appFont.bB,
            fontSize: fontScalling(2.5),
          }}
          altStyle={{
            flex: 1,
            marginLeft: 10,
            marginVertical: widthResponse ? 15 : 20,
            backgroundColor: appColor.bgWhite,
            paddingVertical: 10,
            justifyContent: 'center',
          }}
        />
      </View>
      {/* Next */}
      <PrimaryButton
        Title={'Next'}
        onPress={handleSubmit(handlePersonalInfo)}
        altStyle={{elevation: 10}}
      />
    </MemberRegCard>
  );
};

export default MemberReg2;
