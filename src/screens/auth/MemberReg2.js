import {View, Text, Pressable} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useIsFocused} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Geolocation from 'react-native-geolocation-service';
// file import:
import appColors from '../../utilities/appColors';
import {
  fontScalling,
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

const MemberReg2 = ({navigation}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const showToast = useShowToast();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

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
  const [pinCode, setPinCode] = useState('');

  const {userType, profileData} = useSelector(state => state.auth);

  const {PlanPriceInfo} = UserPlanPrice();

  useEffect(() => {
    if (userType == 'user' && profileData) {
      setPersionalInfo({
        flatno: profileData.flatNumber, //adressbook
        pincode: profileData.pincode,
        street: profileData.street,
        city: profileData.city,
        state: profileData.state,
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
  }, [profileData]);

  // reset data for state updation in useForms
  useEffect(() => {
    reset(persionalInfo);
  }, [persionalInfo, reset]);

  // // reset the data:
  useEffect(() => {
    if (!isFocus) {
      reset();
    }
  }, [isFocus]);

  // validation:
  const schema = yup
    .object()
    .shape({
      flatno: yup.string().required('Please Provide flat number'),
      pincode: yup.string().required('please enter pincode '),
      street: yup.string().required('please enter street name '),
      city: yup.string().required('please enter city name '),
      state: yup.string().required('please enter state name '),
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
      print(userCoordinates, 'userCoordinates');
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
    } else {
      setLoadCl(false);
    }
  };

  // Address and delivery distance validate
  const handlePersonalInfo = async data => {
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
                dark
                leftIcon={true} //@@
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
                icon="FontAwesome5"
                iconName="road"
                dark
                leftIcon={true} //@@
                iconSize={widthResponse ? 20 : 30} //@@                dark
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
          paddingLeft: 10,
          fontFamily: appFont.bB,
          fontSize: fontScalling(2.5),
        }}
        altStyle={{
          width: '100%',
          marginBottom: 15,
          backgroundColor: appColor.bgWhite,
          paddingVertical: 12,
          justifyContent: 'center',
        }}
      />
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
