import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import appColors from '../../utilities/appColors';
import {
  cleanTimeString,
  currencyConvertor,
  fontScalling,
  isTimeInRange,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputField/InputText';
import FilterButton from '../../components/Buttons/FilterButton';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import OrderPriceContainer from '../../components/Card/OrderPriceContainer';
import RadioButton from '../../components/Buttons/RadioButton';
import {useShowToast} from '../../components/Toast/ToastAlert';
import useCartPriceInfo from '../../Hooks/useCartPriceInfo';
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import sha256 from 'sha256';
import base64 from 'react-native-base64';
import ButtonDropDown from '../../components/InputField/ButtonDropDown';
import {url} from '../../utilities/appApi';
import {userSettingApi} from '../../redux/SettingSlice';
import {setIfCoinApply} from '../../redux/CartSlice';
import SelectDrop from '../../components/InputField/SelectDrop';
import {
  AdminDistanceRadius,
  getCoordinatesFromUserLocation,
  getPincodeFromAddress,
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../../utilities/GeolocationFunctions';
import LottieView from 'lottie-react-native';
import NutritionCard from '../../components/Card/NutritionCard';
import ExpectedTime from '../../components/InputField/ExpectedTime';

const CheckOut = ({navigation, route}) => {
  const appColor = appColors();
  const {styles} = useStyles();
  const textFocus = useRef();
  const showToast = useShowToast();

  const {userSettings} = useSelector(state => state.setting);
  const {userType, profileData} = useSelector(state => state.auth);
  const {cart, total, ifCoinApply} = useSelector(state => state.cart);

  const {calculatePriceInfo} = useCartPriceInfo();
  const dispatch = useDispatch();

  const [altNumber, setAltNumber] = useState(false);
  const [expectedTime, setExpectedTime] = useState({
    devision: 'AM',
    time: '',
    isValid: false,
  });
  const [altLocation, setAltLocation] = useState(false);

  // toggle + - state
  const [ifPersionalInfo, setIfPersionalInfo] = useState(true);
  const [shopingCart, setShopingCart] = useState(true);
  const [deliverySlot, setDeleverySlot] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(true);
  const [packagepopup, setPackagepopup] = useState(true);
  const [oilType, setOilType] = useState('');
  const [spicyType, setSpicyType] = useState('');
  const [prefrence, setPrefrence] = useState(true);

  const [persionalInfo, setPersionalInfo] = useState({
    name: '',
    email: '',
    number: '',
    altNumber: '',
    Fnumber: '',
    pincode: '',
    street: '',
    city: '',
    state: '',
    nearLocation: '',
    Type: 'Home',
    cooking_comments: '',
    dislikes: '',
  });
  const [promoCode, setpromoCode] = useState('');
  const [ifpromoApply, setIfPromoApply] = useState(0);
  const [blockButton, setBlockButton] = useState('');
  const [color, setColor] = useState(false);
  const [slotdate, setSlotdate] = useState('');
  const [slotChoosed, setSlotChoosed] = useState([]); //@@
  const [pay, setPay] = useState('');
  const [payIsValid, setPayIsValid] = useState(true);
  const [formValid, setIsFormValid] = useState(false);
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [editable, setEditable] = useState(true);
  const [loadCL, setLoadCl] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [vessalName, setVessalName] = useState(
    userSettings && userSettings?.package && userSettings?.package[0].name,
  );
  const [vesselDropDown, setVesselDropDown] = useState(false);
  const [rewardCoin, setRewardCoin] = useState('');
  const [slotDateList, setSlotDateList] = useState(
    userSettings &&
      userSettings?.delivery_slots &&
      userSettings?.delivery_slots[0][1],
  );
  const [packagePrice, SetPackagePrice] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [paymentLoad, setPaymentLoad] = useState(false);

  var merchantTransactionId = '';
  var merchantUserId = '';
  var disinkm = '';
  var paymentStatus = '';

  const coin =
    total.pointsShown || total.pointsShown == 0 ? total.pointsShown : 'empty';

  const packageType =
    userSettings &&
    userSettings.package &&
    userSettings?.package &&
    userSettings?.package.length > 0 &&
    userSettings?.package.filter(data => data.one_time_purchase == 0);

  const productCount =
    cart && cart.length > 0
      ? cart.reduce((acc, curr) => {
          const count = acc + curr.quantity;
          return count;
        }, 0)
      : 0;

  // --------------- route changes from manageAdderss ---------------------
  const manageAdderss = route?.params?.details ? route?.params?.details : '';

  // when changeAddress trigger
  useEffect(() => {
    if (manageAdderss != '') {
      // setPersionalInfo({...manageAdderss});
      setPersionalInfo({
        name: manageAdderss.name,
        email: manageAdderss.email,
        number: manageAdderss.phone, //adressbook
        altNumber: manageAdderss.alterphone,
        Fnumber: manageAdderss.flatno, //adressbook
        pincode: manageAdderss.pincode,
        street: manageAdderss.street,
        city: manageAdderss.city,
        state: manageAdderss.state,
        cooking_comments: yup
          .string()
          .required('please enter cooking comments '),
        dislikes: yup.string().required('please enter dislikes '),
        nearLocation: manageAdderss.landmark, //adressbook
        Type:
          manageAdderss.place.charAt(0).toUpperCase() +
          manageAdderss.place.slice(1),
      });
    } else if (userType == 'user' && profileData) {
      setPersionalInfo({
        name: profileData.name,
        email: profileData.email,
        number: profileData.number, //adressbook
        altNumber: '',
        Fnumber: profileData.flatNumber, //adressbook
        pincode: profileData.pincode,
        street: profileData.street,
        city: profileData.city,
        state: profileData.state,
        nearLocation: '', //adressbook
        Type: 'Home',
      });
    }
  }, [manageAdderss]);

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
      number: yup
        .string()
        .required('Mobile Number is required')
        .min(10, 'invalid Mobile Number'),
      altNumber: yup
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
            return value !== this.parent.number;
          },
        ),
      Fnumber: yup.string().required('Please Provide flat number'),
      pincode: yup
        .number()
        .typeError('Please Enter a valid Number')
        .required('please enter pincode '),
      street: yup.string().required('please enter street name '),
      city: yup.string().required('please enter city name '),
      state: yup.string().required('please enter state name '),
      cooking_comments: yup.string().required('please enter cooking comments '),
      dislikes: yup.string().required('please enter dislikes '),
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

  // ------------------ Geolocation functions --------------------------
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
    setLoadCl(true);
    const userCurrentLocation = await getUserLocation();
    print(userCurrentLocation, 'userCurrentLocation');
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

  // ------------------------------------------------------------
  const toreddemRewardPoints = () => {
    if (coin != 'empty' && userSettings && userSettings.REWARD) {
      const coinsReddem = Number(userSettings.REWARD.points);
      let amount_reduced =
        Number(userSettings.REWARD.points) * (userSettings.REWARD.amount / 100);
      if (
        ifCoinApply == 0 &&
        blockButton != 'promoApply' &&
        amount_reduced &&
        distance
      ) {
        calculatePriceInfo(
          {
            code: null,
            percent: null,
          },
          distance,
          amount_reduced,
          coinsReddem,
          'checkDistance',
          total.vesselPrice,
          total.vesselName,
        );
        showToast(
          'custom',
          `Amount redeemed ${currencyConvertor(amount_reduced)}`,
          '',

          3000,
        );
        dispatch(setIfCoinApply(1));
        setBlockButton('coinApply');
      } else if (ifCoinApply > 0) {
        showToast('error', '', 'you have already redeem your coins', 1000);
      } else if (blockButton == 'promoApply') {
        showToast(
          'error',
          'you have already used Promo Code you did not redeem your coins',
          '',
          1200,
        );
      }
    }
  };

  //apply Promo code -------------//
  const toapplyPromocode = async () => {
    // setLoad(true);
    const fdata = new FormData();
    if (userSettings?.userInfo?.user_id) {
      fdata.append('userId', userSettings?.userInfo?.user_id);
    }
    fdata.append('code', promoCode);
    fdata.append('context', 'general');
    try {
      const apply = await fetch(url().promoCode, {
        method: 'POST',
        body: fdata,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let respo = await apply.json();
      if (respo.message && ifCoinApply == 0) {
        if (respo.percent) {
          calculatePriceInfo(
            {
              code: promoCode,
              percent: parseInt(respo.percent),
            },
            distance,
            0,
            0,
            'checkDistance',
            total.vesselPrice,
            total.vesselName,
          );
          setIfPromoApply(previous => previous + 1);
          setBlockButton('promoApply');
          if (textFocus.current) {
            textFocus.current.scrollToEnd({animated: true});
          }
        } else {
          setpromoCode('');
        }
        showToast('custom', respo.message, '', 1500);
      }
    } catch (err) {
      console.log(err, 'check-err');
    }
  };

  // handlepromoCode
  const handlepromoCode = async () => {
    const validpromoCode = promoCode && promoCode.trim().length != 0;
    if (!validpromoCode) {
      validpromoCode
        ? null
        : showToast('error', 'promoCode field is Empty', 1000);
    } else {
      validpromoCode
        ? null
        : showToast('error', 'promoCode field is Empty', 1000);
      toapplyPromocode();
    }
  };

  // final submition function
  const handleOrderSubmition = async () => {
    const payIsValid = pay.trim().length > 0;
    setPayIsValid(payIsValid);
    if (timeValid != true) {
      setExpectedTime(preData => {
        return {...preData, isValid: true};
      });
    }
    if (isValid && payIsValid && timeValid == true) {
      // setPayIsValid(payIsValid);
      if (pay == 'phonePe') {
        console.log('its work');
        toPhonepeSubmit();
      }
      if (pay == 'cash') {
        paymentStatus = 'pending';
        apiCall();
      }
    } else {
      showToast('error', 'inValid details', 1000);
      setBtnDisabled(false);
    }
  };

  // for phonePe payment
  const generateTransactionId = () => {
    const timeStamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000000);
    const merchantPrefix = 'T';
    return `${merchantPrefix}${timeStamp}${randomNumber}`;
  };

  const generateUserId = () => {
    const timeStamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000000);
    const merchantPrefix = 'UI';
    return `${merchantPrefix}${timeStamp}${randomNumber}`;
  };

  // phone pe payment start function
  const toPhonepeSubmit = async () => {
    if (userSettings && userSettings.PHONEPE) {
      const environment =
        userSettings.PHONEPE.mode == 0 ? 'SANDBOX' : 'PRODUCTION';
      const merchantId = userSettings.PHONEPE.merchantId;
      merchantTransactionId = generateTransactionId();
      merchantUserId = generateUserId();
      const appId = 'grocarto';
      const enableLoggin = true;
      setPaymentLoad(true);

      PhonePePaymentSDK.init(environment, merchantId, appId, enableLoggin)
        .then(resp => {
          if (resp) {
            const requestBody = {
              merchantId: merchantId,
              merchantTransactionId: merchantTransactionId,
              merchantUserId: merchantUserId,
              amount: Number(total.totalamt).toFixed(2) * 100,
              callbackUrl: 'https://webhook.site/callback-url',
              mobileNumber: currentValues.number,
              paymentInstrument: {
                type: 'PAY_PAGE',
              },
            };
            const saltKey = userSettings.PHONEPE.api;
            const saltIndex = userSettings.PHONEPE.saltIndex;
            const payload = JSON.stringify(requestBody);
            // print(payload, 'payload');
            const payloadMain = base64.encode(payload);
            const string = payloadMain + '/pg/v1/pay' + saltKey;
            const checkSum = sha256(string) + '###' + saltIndex;

            PhonePePaymentSDK.startTransaction(
              payloadMain,
              checkSum,
              'com.fitsuvai',
              null,
            )
              .then(resp => {
                if (resp.status == 'SUCCESS') {
                  paymentStatus = 'paid';
                  paymentData = payload;
                  apiCall(paymentData);
                } else {
                  setPaymentLoad(false);
                  setBtnDisabled(false);
                }
                console.log(resp, 'transsaction status in phonepe');
              })
              .catch(err => {
                setBtnDisabled(false);
                setPaymentLoad(true);
                console.log(err, 'error in transsaction');
              });
          }
        })
        .catch(err => {
          setPaymentLoad(true);
          setBtnDisabled(false);
          console.log(err, 'init ERROR');
        });
    }
  };

  // get the month integer:
  const getMonth = str => {
    switch (str.toLowerCase()) {
      case 'jan':
        return '01';
      case 'feb':
        return '02';
      case 'mar':
        return '03';
      case 'apr':
        return '04';
      case 'may':
        return '05';
      case 'jun':
        return '06';
      case 'jul':
        return '07';
      case 'aug':
        return '08';
      case 'sep':
        return '09';
      case 'oct':
        return '10';
      case 'nov':
        return '11';
      case 'dec':
        return '12';
    }
  };

  const slotSelection = (key = 0, data) => {
    if (userSettings && userSettings?.delivery_slots.length > 0) {
      setSlotdate(userSettings && userSettings?.delivery_slots[key][0]);
      setSlotDateList(userSettings && userSettings?.delivery_slots[key][1]);
    }
  };

  // Address and delivery distance validate
  const handlePersonalInfo = async data => {
    if (
      isValid &&
      userSettings &&
      userSettings?.RADIUS &&
      userSettings?.SITEINFO &&
      userSettings?.SITEINFO?.location &&
      Object.keys(destination).length > 0
    ) {
      const distancematrix = await AdminDistanceRadius(
        userSettings?.SITEINFO?.location,
        destination,
        userSettings?.RADIUS,
      );
      if (distancematrix.status) {
        setDistance(Number(distancematrix.distance));
        setIsFormValid(!formValid);
        setEditable(!editable);
        setBlockButton('');
        if (coin != 'empty') {
          setRewardCoin(coin);
        }
        if (
          userSettings &&
          userSettings?.spicy_list &&
          userSettings?.spicy_list.length > 0 &&
          userSettings?.spicy_list[3]
        ) {
          setOilType(
            userSettings?.spicy_list[3]
              ? userSettings?.spicy_list[3]
              : userSettings?.spicy_list[0]
              ? userSettings?.spicy_list[0]
              : '',
          );
        }
        if (
          userSettings &&
          userSettings?.oilPreference &&
          userSettings?.oilPreference.length > 0 &&
          userSettings?.oilPreference[1]
        ) {
          setSpicyType(
            userSettings?.oilPreference[1]
              ? userSettings?.oilPreference[1]
              : userSettings?.oilPreference[0]
              ? userSettings?.oilPreference[0]
              : '',
          );
        }
        const packagePrice =
          packageType[0].one_time_purchase == 1
            ? packageType[0].price
            : packageType[0].price * productCount;
        calculatePriceInfo(
          {
            code: null,
            percent: null,
          },
          distancematrix.distance,
          0,
          0,
          'checkDistance',
          packagePrice,
          packageType[0].name,
        );
        if (packageType[0].name) {
          setVessalName(packageType[0].name);
        } //BN
        if (textFocus.current) {
          textFocus.current.scrollToEnd({animated: true});
        }
        if (
          userSettings &&
          userSettings?.delivery_slots &&
          userSettings?.delivery_slots.length > 0
        ) {
          setSlotdate(userSettings && userSettings?.delivery_slots[0][0]);
          setSlotChoosed([
            userSettings?.delivery_slots[0][0],
            userSettings?.delivery_slots[0][1][0],
          ]);
        }
      } else {
        // setIsFormValid(!formValid);
        // setEditable(!editable);
        showToast('error', '', 'Distance not in our Range');
      }
    }
  };

  useEffect(() => {
    if (total.kms > 0) {
      setIsFormValid(false);
      setEditable(true);
      setTimeout(() => {
        if (
          textFocus &&
          textFocus.current &&
          textFocus.current.scrollToPosition
        ) {
          textFocus.current.scrollToPosition(0, 0, true);
          setBlockButton('');
        }
      }, 800);
    }
  }, [cart]);

  let slot = slotChoosed && String(slotChoosed[1]).split(' ');
  let slotSelect = slot?.shift();
  const slot_times = slot.join(' ').split('-');

  print(expectedTime.time, 'time');
  const expectDeliveryTime = cleanTimeString(`${expectedTime.time}`);
  const startTime = cleanTimeString(slot_times[0]);
  const endTime = cleanTimeString(slot_times[1]);
  const timeValid = isTimeInRange(expectDeliveryTime, startTime, endTime);

  // api
  const apiCall = async (paymentData = '') => {
    // get the slot date format:
    let dateformat =
      slotChoosed[0] && slotChoosed[0] != ''
        ? `${slotChoosed[0].split(' ')[1]}-${getMonth(
            slotChoosed[0].split(' ')[2],
          )}-${slotChoosed[0].split(' ')[3]}`
        : '';

    try {
      // request data for backend:
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      const formData = new FormData();
      formData.append('info', JSON.stringify(currentValues));
      formData.append(
        'CartItems',
        JSON.stringify(
          cart.map(data => ({
            ...data,
            total: data.offer * data.quantity,
          })),
        ),
      );
      formData.append('orderTot', JSON.stringify(total));
      formData.append('slotDate', dateformat); //@@
      formData.append('slotTime', slotChoosed[1]); //@@
      formData.append('expect_delivery_time', expectDeliveryTime);
      formData.append('payment', pay);
      formData.append('paymentStatus', paymentStatus);
      if (spicyType && spicyType != '') {
        formData.append('oilType', spicyType);
      }
      if (oilType && oilType != '') {
        formData.append('spicyType', oilType);
      }
      if (userSettings?.userInfo?.user_id) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      if (paymentData != '') {
        formData.append('paymentData', JSON.stringify(paymentData));
      }

      // print(formData, 'formData in checkout');
      currentValues?.Type &&
        currentValues?.Type != '' &&
        formData.append('type', currentValues?.Type);
      distance && distance != '' && formData.append('distance', distance);
      print(formData, 'formData');
      var requestOptions = {
        method: 'POST',
        body: formData,
        header: myHeaders,
      };
      // get the response:
      const response = await fetch(url().checkout, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          dispatch(userSettingApi());
          setPaymentLoad(false);
          navigation.navigate('thanksScreen');
        }
      } else {
        setPaymentLoad(false);
        print(response.status, 'status in checkout screen');
      }
      setBtnDisabled(false);
    } catch (e) {
      setBtnDisabled(false);
      setPaymentLoad(false);
      console.log(e, 'error in checkout screen');
    }
  };

  return (
    <>
      <View style={{backgroundColor: appColor.bgBlack}}>
        {userType == 'guest' && (
          <View
            style={[
              {
                marginHorizontal: 10,
                backgroundColor: appColor.white,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingBottom: 20,
                paddingTop: 10,
                height: 65,
                zIndex: 1,
              },
            ]}
          />
        )}
      </View>
      {userType == 'guest' && (
        <Text
          onPress={() => navigation.navigate('login')}
          style={[
            styles.subText,
            {textAlign: 'center', marginTop: -40, marginBottom: 15},
          ]}>
          Already have an Account?{' '}
          <Text style={{color: appColor.gold}}>Login</Text>
        </Text>
      )}
      <>
        {paymentLoad ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <LottieView
              autoPlay={true}
              style={{width: 200, height: 200, top: 5}}
              source={require('../../../assets/lottieFiles/load.json')}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: appColor.white,
            }}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{
                paddingHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: widthResponse ? 15 : 10,
                paddingBottom: 90,
                backgroundColor: appColor.white,
              }}
              scrollEnabled={true}
              enableAutomaticScroll={true}
              extraHeight={350}
              ref={textFocus}
              showsVerticalScrollIndicator={false}>
              {/* Personal Information */}
              <Pressable //@@
                onPress={() => {
                  setIfPersionalInfo(!ifPersionalInfo); //@@
                }}
                style={styles.SideHeadingCont}>
                <Text style={styles.HeadingText}>Personal information</Text>
                <Pressable
                  onPress={() => {
                    setIfPersionalInfo(!ifPersionalInfo);
                  }}
                  style={{padding: 5}}>
                  <Icon
                    ComponentName={'Entypo'}
                    name={ifPersionalInfo ? 'minus' : 'plus'}
                    color={appColor.bgBlack}
                    size={widthResponse ? 25 : 30}
                  />
                </Pressable>
              </Pressable>
              {/* {ifPersionalInfo && (
          )} */}
              <View style={{display: ifPersionalInfo ? 'flex' : 'none'}}>
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
                        iconSize={widthResponse ? 18 : 25}
                        Title={'Your Name'}
                        placeholder={'Your Name'}
                        onChangeText={onChange}
                        formError={errors.name}
                        editable={editable}
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
                      iconSize={widthResponse ? 18 : 25}
                      Title={'Email Address'}
                      onChangeText={onChange}
                      editable={editable}
                      formError={errors.email}
                      onFocus={event => {
                        textFocus.current.scrollToFocusedInput(event.target);
                      }}
                    />
                  )}
                />
                {/* Number */}
                <Controller
                  name="number"
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
                      iconSize={widthResponse ? 18 : 25}
                      Title={'Mobile Number'}
                      onChangeText={onChange}
                      formError={errors.number}
                      editable={editable}
                      onFocus={event => {
                        textFocus.current.scrollToFocusedInput(event.target);
                      }}
                    />
                  )}
                />
                {/* Alter Number */}
                {altNumber && (
                  <Controller
                    name="altNumber"
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
                        iconSize={widthResponse ? 18 : 25}
                        Title={'Alternate Number'}
                        onChangeText={onChange}
                        formError={errors.altNumber}
                        editable={editable}
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
                  onPress={
                    !editable
                      ? () => {}
                      : async () => {
                          const isGranted = await requestLocationPermission();
                          console.log(isGranted, 'isGranted');
                          if (isGranted && isGranted != 'settings') {
                            getUserLocations();
                          } else {
                            await handleLocationPermission();
                          }
                        }
                  }
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
                    opacity: editable ? 1 : 0.4,
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
                    name="Fnumber"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <InputText
                        value={value}
                        customStyle={{flex: 1, marginRight: 10}}
                        editable={editable}
                        Title="Flat Number"
                        leftIcon
                        placeholder="Enter Flat Number"
                        icon="MaterialCommunityIcons"
                        iconName="locker"
                        iconSize={widthResponse ? 18 : 25}
                        // autoCapitalize="none"
                        onChangeText={onChange}
                        formError={errors.Fnumber}
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
                        editable={editable}
                        customStyle={{flex: 1}}
                        leftIcon
                        keyboardType={'numeric'}
                        Title="Pincode"
                        placeholder="Enter your Pincode"
                        icon="MaterialCommunityIcons"
                        iconName="mailbox-up-outline"
                        iconSize={widthResponse ? 18 : 25}
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
                  editable={editable}
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
                        leftIcon
                        iconName="road"
                        iconSize={widthResponse ? 20 : 30}
                        multiline={true}
                        onChangeText={onChange}
                        formError={errors.street}
                        editable={editable}
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
                        editable={editable}
                        iconSize={widthResponse ? 15 : 30}
                        rightIcon="AntDesign"
                        onChangeText={onChange}
                        formError={errors.state}
                        onFocus={event => {
                          textFocus.current.scrollToFocusedInput(event.target);
                        }}
                      />
                    )}
                  />
                  {/* city */}
                  <Controller
                    editable={editable}
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
                        iconSize={widthResponse ? 18 : 25}
                        editable={editable}
                        autoCapitalize="none"
                        onChangeText={onChange}
                        formError={errors.city}
                        onFocus={event => {
                          textFocus.current.scrollToFocusedInput(event.target);
                        }}
                      />
                    )}
                  />
                </View>
                {/* Cooking comments & Dislikes  */}
                <View
                  style={{
                    flexDirection: 'row',
                    // alignItems: 'center',
                    marginTop: 15,
                  }}>
                  {/* flatNumber */}
                  <Controller
                    name="cooking_comments"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <InputText
                        value={value}
                        customStyle={{flex: 1, marginRight: 10}}
                        editable={editable}
                        Title="Cooking Comments"
                        placeholder="Enter Cooking Comments"
                        leftIcon //@@
                        icon="FontAwesome"
                        iconName="comments"
                        iconSize={widthResponse ? 18 : 25} //@@
                        // autoCapitalize="none"
                        onChangeText={onChange}
                        formError={errors.cooking_comments}
                        onFocus={event => {
                          textFocus.current.scrollToFocusedInput(event.target);
                        }}
                      />
                    )}
                  />
                  {/* pin code */}
                  <Controller
                    name="dislikes"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <InputText
                        value={value}
                        editable={editable}
                        customStyle={{flex: 1}}
                        leftIcon
                        Title="Dislikes"
                        placeholder="Enter Dislike Comments"
                        iconName="dislike2"
                        icon="AntDesign"
                        iconSize={widthResponse ? 18 : 25} //@@
                        onChangeText={onChange}
                        formError={errors.dislikes}
                        onFocus={event => {
                          textFocus.current.scrollToFocusedInput(event.target);
                        }}
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
                          editable={editable}
                          row
                          Title=" Add Nearby Famous Shop/Mall/Landmark"
                          placeholder=" Add Nearby Famous Shop/Mall/Landmark"
                          icon="Ionicons"
                          iconName="ios-business-outline"
                          iconSize={widthResponse ? 20 : 30}
                          multiline={true}
                          onChangeText={onChange}
                          onFocus={event => {
                            textFocus.current.scrollToFocusedInput(
                              event.target,
                            );
                          }}
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
                  {editable &&
                  userSettings &&
                  userSettings?.userInfo &&
                  userSettings?.userInfo?.user_id ? (
                    <Pressable
                      onPress={() => {
                        navigation.navigate('manageAddress', {
                          verify: 'checkout',
                        });
                      }}
                      style={[styles.commenStyle, {width: 'auto'}]}>
                      <Icon
                        ComponentName={'FontAwesome'}
                        name={'refresh'}
                        size={20}
                        color={appColor.gold}
                      />
                      <Text
                        style={[
                          styles.subText,
                          {paddingLeft: 15, fontSize: responsiveFontSize(2)},
                        ]}>
                        {'Change Address'}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {}}
                      style={[styles.commenStyle, {width: '45%'}]}
                    />
                  )}
                  {/* totally change the structure //@@ */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FilterButton
                      onPress={() =>
                        !editable
                          ? () => {}
                          : setPersionalInfo({
                              ...currentValues,
                              Type: 'Home',
                            })
                      }
                      altStyle={{marginRight: widthResponse ? 10 : 20}}
                      btnName={persionalInfo.Type}
                      ICN="Ionicons"
                      IN="home-outline"
                      title={'Home'}
                      bgGolg={true}
                    />
                    <FilterButton
                      onPress={() =>
                        !editable
                          ? () => {}
                          : setPersionalInfo({
                              ...currentValues,
                              Type: 'Work',
                            })
                      }
                      bgGolg={true}
                      btnName={persionalInfo.Type}
                      ICN={'MaterialCommunityIcons'}
                      IN={'office-building-cog-outline'}
                      title={'Work'}
                    />
                  </View>
                </View>
                <PrimaryButton
                  onPress={handleSubmit(handlePersonalInfo)}
                  Title={
                    editable
                      ? 'Deliver to this address'
                      : 'Edit delivery address'
                  }
                  altStyle={{marginTop: 20}}
                />
              </View>
              {formValid && (
                <>
                  {/* promoCode block && coin block */}
                  {userSettings &&
                    userSettings?.userInfo &&
                    userSettings?.userInfo?.user_id &&
                    blockButton == '' && (
                      <View
                        style={{
                          width: scrnWidth,
                          backgroundColor: appColor.black,
                          paddingVertical: 20,
                          paddingHorizontal: 20,
                          marginTop: persionalInfo ? 25 : 5,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: appColor.Textlightblack,
                            borderRadius: 30,
                            padding: 3,
                            paddingLeft: 20,
                          }}>
                          <TextInput
                            placeholder="Enter promoCode"
                            placeholderTextColor={appColor.white}
                            style={{
                              flex: 1,
                              marginLeft: 20,
                              fontSize: fontScalling(2),
                              fontFamily: appFont.rR,
                              color: appColor.white,
                            }}
                            onFocus={event => {
                              textFocus.current.scrollToFocusedInput(
                                event.target,
                              );
                            }}
                            value={promoCode}
                            onChangeText={value => {
                              setpromoCode(value);
                            }}
                          />
                          <Animatable.View
                            animation={'slideInLeft'}
                            duration={1000}
                            onTouchEnd={() => {
                              handlepromoCode();
                            }}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 10,
                              paddingVertical: 15,
                              borderRadius: 30,
                              backgroundColor: appColor.white,
                              flex: 0.5,
                            }}>
                            <Text
                              style={[
                                styles.subText,
                                {fontFamily: appFont.bB},
                              ]}>
                              Apply code
                            </Text>
                          </Animatable.View>
                        </View>
                        {print(coin, 'reward')}
                        {/* Reward coins */}
                        {userSettings &&
                          userSettings?.userInfo &&
                          userSettings?.userInfo?.user_id && (
                            <>
                              {coin != 0 &&
                                coin > 0 &&
                                userSettings &&
                                userSettings.REWARD &&
                                userSettings.REWARD.maximum_amount &&
                                total.totalamt >
                                  userSettings.REWARD.maximum_amount &&
                                userSettings &&
                                ifCoinApply == 0 && (
                                  <Animatable.View
                                    animation={'fadeInRight'}
                                    duration={1000}
                                    onTouchEnd={() => {
                                      toreddemRewardPoints();
                                    }}
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor: appColor.gold,
                                      borderRadius: 5,
                                      paddingVertical: 10,
                                      marginTop: 15,
                                      paddingHorizontal: 10,
                                      width: '100%',
                                    }}>
                                    {coin != 'empty' && (
                                      <Text
                                        style={{
                                          color: appColor.gold,
                                          fontFamily: appFont.bR,
                                          fontSize: fontScalling(2.3),
                                        }}>
                                        <Icon
                                          ComponentName="FontAwesome5"
                                          name="coins"
                                          color={appColor.gold}
                                          size={18}
                                        />
                                        {ifCoinApply == 0
                                          ? `   Redeem your ${userSettings?.REWARD?.points} coins  `
                                          : 'coins redeemed'}
                                      </Text>
                                    )}
                                  </Animatable.View>
                                )}
                            </>
                          )}
                      </View>
                    )}
                  <Pressable
                    onPress={() => {
                      setPackagepopup(!packagepopup);
                    }}
                    style={[styles.SideHeadingCont, {marginBottom: 10}]}>
                    <Text style={styles.HeadingText}>Packaging type</Text>
                    <Pressable
                      onPress={() => {
                        setPackagepopup(!packagepopup);
                      }}
                      style={{padding: 5}}>
                      <Icon
                        ComponentName={'Entypo'}
                        name={packagepopup ? 'minus' : 'plus'}
                        color={appColor.bgBlack}
                        size={widthResponse ? 25 : 30}
                      />
                    </Pressable>
                  </Pressable>
                  {packageType && packagepopup && (
                    <ButtonDropDown
                      onPress={() => {
                        setVesselDropDown(!vesselDropDown);
                      }}
                      dropDown={vesselDropDown}
                      title={vessalName}
                      active={false}>
                      <>
                        <View
                          style={{
                            // paddingBottom: 5,
                            borderWidth: 0.2,
                            borderRadius: 7,
                            marginBottom: 10,
                          }}>
                          {packageType.length > 0 &&
                            vesselDropDown &&
                            packageType.map((data, index) => {
                              const packagePrice =
                                data.one_time_purchase == 1
                                  ? data.price
                                  : data.price * productCount;
                              return (
                                <Pressable
                                  key={index}
                                  onPress={() => {
                                    SetPackagePrice(data.price);
                                    calculatePriceInfo(
                                      {
                                        code: total.discount.code,
                                        percent: total.discount.percent,
                                      },
                                      distance,
                                      total.amount_reduced,
                                      total.points_redeemed,
                                      'checkDistance',
                                      packagePrice,
                                      data.name,
                                    );
                                    setVessalName(data.name);
                                    setVesselDropDown(false);
                                  }}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    marginHorizontal: 10,
                                    paddingVertical: 5,
                                    borderBottomWidth:
                                      index != packageType.length - 1 ? 0.5 : 0,
                                  }}>
                                  <Image
                                    resizeMode="contain"
                                    source={{uri: data.image}}
                                    style={{width: 40, height: 40}}
                                  />
                                  <Text
                                    style={[
                                      styles.normalText,
                                      {paddingLeft: 15},
                                    ]}>
                                    {data.name}
                                    {'  ' + currencyConvertor(data.price)}
                                  </Text>
                                </Pressable>
                              );
                            })}
                        </View>
                      </>
                    </ButtonDropDown>
                  )}
                  {/* prefrence */}
                  <Pressable
                    onPress={() => {
                      setPrefrence(!prefrence);
                    }}
                    style={[styles.SideHeadingCont]} //@@
                  >
                    <Text style={styles.HeadingText}>Prefrence</Text>
                    <View style={{padding: 5}}>
                      <Icon
                        ComponentName={'Entypo'}
                        name={prefrence ? 'minus' : 'plus'} //@@
                        color={appColor.bgBlack}
                        size={widthResponse ? 25 : 30}
                      />
                    </View>
                  </Pressable>

                  {prefrence && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: widthResponse ? 10 : 16, //@@
                        zIndex: 10, //@@
                      }}>
                      {/* spices */}
                      <View
                        style={{flex: 1, marginRight: widthResponse ? 10 : 20}}>
                        {userSettings &&
                          userSettings.spicy_list &&
                          userSettings.spicy_list.length > 0 && (
                            <SelectDrop
                              placeholder={'Select Spices'}
                              title={'Spice prefrences'}
                              value={spicyType}
                              options={userSettings.oilPreference}
                              optionsHeight={widthResponse ? 80 : 100} //@@
                              icon={'MaterialCommunityIcons'}
                              iconName={'food-outline'}
                              iconSize={widthResponse ? 18 : 22}
                              onChange={setSpicyType}
                              altStyle={{
                                zIndex: 10, //@@
                              }}
                            />
                          )}
                      </View>
                      {/* oil */}
                      <View
                        style={{
                          flex: 1,
                        }}>
                        {userSettings &&
                          userSettings.spicy_list &&
                          userSettings.spicy_list.length > 0 && (
                            <SelectDrop
                              placeholder={'Select oil'}
                              title={'Choose your oil'}
                              value={oilType}
                              options={userSettings.spicy_list}
                              // dark
                              optionsHeight={widthResponse ? 80 : 100} //@@
                              icon={'SimpleLineIcons'}
                              iconName={'drop'}
                              iconSize={widthResponse ? 18 : 22}
                              onChange={setOilType}
                              altStyle={{
                                zIndex: 10, //@@
                                paddingHorizontal: 5,
                              }}
                            />
                          )}
                      </View>
                    </View>
                  )}
                  <Pressable
                    onPress={() => {
                      setShopingCart(!shopingCart);
                    }}
                    style={[styles.SideHeadingCont, {marginBottom: 5}]}>
                    <Text style={styles.HeadingText}>Shopping cart</Text>
                    <Pressable
                      onPress={() => {
                        setShopingCart(!shopingCart);
                      }}
                      style={{padding: 5}}>
                      <Icon
                        ComponentName={'Entypo'}
                        name={shopingCart ? 'minus' : 'plus'}
                        color={appColor.bgBlack}
                        size={widthResponse ? 25 : 30}
                      />
                    </Pressable>
                  </Pressable>
                  {shopingCart && (
                    <View style={{width: scrnWidth}}>
                      {cart && cart.length > 0 && (
                        <FlatList
                          scrollEnabled={false}
                          showsVerticalScrollIndicator={false}
                          data={cart.map(data => ({
                            ...data,
                            offerQuantity: data.offer * data.quantity,
                          }))}
                          contentContainerStyle={{width: '100%'}}
                          horizontal={false}
                          keyExtractor={(item, index) => index}
                          renderItem={({item, index}) => {
                            return (
                              <View key={index} style={styles.card}>
                                <View
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    flexDirection: 'row',
                                  }}>
                                  <View
                                    style={{
                                      width: scrnWidth / 5,
                                      height: scrnWidth / 5,
                                      borderRadius: scrnWidth / 10,
                                      overflow: 'hidden',
                                      backgroundColor: appColor.cardbg,
                                      padding: 10,
                                    }}>
                                    <Animatable.Image
                                      animation={'fadeInLeft'}
                                      duration={1000 * index}
                                      resizeMode="cover"
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: scrnWidth / 10,
                                        overflow: 'hidden',
                                      }}
                                      source={{uri: item.image}}
                                    />
                                  </View>
                                  <Animatable.View
                                    animation={'fadeInDown'}
                                    duration={500 * index}
                                    style={{paddingLeft: 15}}>
                                    <Text
                                      style={[
                                        styles.HeadingText,
                                        {fontSize: fontScalling(2.5)},
                                      ]}>
                                      {item.name}
                                    </Text>
                                    <Text style={styles.normalText}>
                                      {`${item.offer} X ${item.quantity}`}
                                    </Text>
                                  </Animatable.View>
                                </View>
                                <View
                                  style={{
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={[
                                      styles.price,
                                      {color: appColor.gold},
                                    ]}>
                                    {currencyConvertor(item.offerQuantity, 2)}
                                  </Text>
                                </View>
                              </View>
                            );
                          }}
                          ListFooterComponent={() => {
                            return (
                              <View
                                style={{
                                  backgroundColor: appColor.cardbg,
                                  paddingVertical: 5,
                                }}>
                                <NutritionCard data={total} />
                                <OrderPriceContainer
                                  data={total}
                                  km={distance}
                                />
                              </View>
                            );
                          }}
                          ItemSeparatorComponent={() => {
                            return (
                              <View
                                style={{
                                  height: 1,
                                  width: '100%',
                                  backgroundColor: appColor.greyBg,
                                }}
                              />
                            );
                          }}
                        />
                      )}
                    </View>
                  )}

                  {/* Delivery slot sideHead */}
                  <Pressable
                    onPress={() => {
                      setDeleverySlot(!deliverySlot);
                    }}
                    style={[styles.SideHeadingCont]} //@@
                  >
                    <Text style={styles.HeadingText}>
                      Choose a delivery slot
                    </Text>
                    <Pressable
                      style={{padding: 5}}
                      onPress={() => {
                        setDeleverySlot(!deliverySlot);
                      }}>
                      <Icon
                        ComponentName={'Entypo'}
                        name={deliverySlot ? 'minus' : 'plus'}
                        color={appColor.bgBlack}
                        size={widthResponse ? 25 : 30}
                      />
                    </Pressable>
                  </Pressable>
                  {deliverySlot ? (
                    <>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        {/* // =========== Schedule Date and Time ===========// */}
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                          }}>
                          {userSettingApi &&
                            userSettings.delivery_slots &&
                            userSettings.delivery_slots.length > 0 &&
                            userSettings.delivery_slots.map((data, index) => {
                              const selectDate = color == index;
                              // @@
                              const week =
                                data[0] &&
                                data[0] != '' &&
                                data[0].split(' ')[0];
                              const date =
                                data[0] &&
                                data[0] != '' &&
                                `${data[0].split(' ')[1]} ${
                                  data[0].split(' ')[2]
                                }`;
                              return (
                                <View
                                  key={index}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 5,
                                    paddingHorizontal: 5,
                                  }}>
                                  <Pressable
                                    style={{
                                      alignItems: 'center',
                                      borderRadius: 10,
                                      // width: scrnWidth / 3.6,
                                      borderWidth: 1,
                                      overflow: 'hidden',
                                      borderColor: selectDate
                                        ? appColor.gold
                                        : appColor.Textlightblack, //@@
                                      // elevation: 1.5,
                                    }}
                                    onPress={() => {
                                      setColor(index);
                                      slotSelection(index, data);
                                    }}>
                                    {/* week */}
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: selectDate
                                          ? appColor.gold
                                          : appColor.bgBlack,
                                        borderTopLeftRadius: 5,
                                        borderTopRightRadius: 5,
                                        paddingHorizontal: widthResponse
                                          ? 8
                                          : 14, //@@
                                        paddingVertical: 10,
                                        width: '100%',
                                      }}>
                                      {week && week != '' && (
                                        <Text
                                          style={{
                                            fontFamily: appFont.bB,
                                            color: appColor.white,
                                            fontSize: fontScalling(2.2),
                                            lineHeight: fontScalling(2.2),
                                          }}>
                                          {/* //@@ */}
                                          {week}
                                        </Text>
                                      )}
                                    </View>
                                    {/* dates */}
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: appColor.white,
                                        borderBottomLeftRadius: 5,
                                        borderBottomRightRadius: 5,
                                        paddingHorizontal: widthResponse
                                          ? 8
                                          : 14, //@@
                                        paddingVertical: widthResponse ? 5 : 10, //@@
                                        width: '100%',
                                      }}>
                                      {date && date != '' && (
                                        <Text
                                          style={{
                                            fontFamily: appFont.rM,
                                            color: selectDate
                                              ? appColor.gold
                                              : appColor.bgBlack,
                                            fontSize: fontScalling(1.7), //@@
                                          }}>
                                          {/* //@@ */}
                                          {date}
                                        </Text>
                                      )}
                                    </View>
                                  </Pressable>
                                </View>
                              );
                            })}
                        </ScrollView>
                      </View>
                      {slotDateList && slotDateList.length > 0 && (
                        <ScrollView
                          contentContainerStyle={{
                            flex: 1,
                            alignItems: 'flex-start',
                          }}
                          style={{flexDirection: 'row'}}>
                          {slotDateList.map((time, index) => {
                            let isChecked = //@@
                              slotdate == slotChoosed[0] &&
                              slotChoosed[1] == time
                                ? true
                                : false;
                            return (
                              <Pressable key={index} style={{padding: 0}}>
                                <RadioButton
                                  onPress={() => {
                                    // console.log(time, 'time');
                                    setSlotChoosed([slotdate, time]); //@@
                                  }}
                                  key={index}
                                  text={time}
                                  ind={index}
                                  altStyle={{width: '95%'}}
                                  isChecked={isChecked} //@@
                                />
                              </Pressable>
                            );
                          })}
                        </ScrollView>
                      )}
                    </>
                  ) : null}
                  <View
                    style={{
                      width: '100%',
                      borderTopWidth: 0.5,
                      zIndex: 100,
                      paddingVertical: 10,
                    }}>
                    <ExpectedTime
                      placeholder={`Enter Time btwn ${slot.join(' ')}`}
                      onChange={setExpectedTime}
                      value={expectedTime}
                      slotTime={slot.join(' ')}
                      error={timeValid}
                    />
                  </View>
                  {/* <View
                    style={{
                      width: scrnWidth,
                      backgroundColor: appColor.cartBg,
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                    }}></View> */}
                  <View
                    style={{
                      width: scrnWidth,
                      backgroundColor: appColor.cartBg,
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                    }}>
                    {/* Payment Method */}
                    <Pressable
                      onPress={() => {
                        setPaymentMethod(!paymentMethod);
                      }}
                      style={[
                        styles.SideHeadingCont,
                        {marginBottom: 5, borderBottomWidth: 0},
                      ]}>
                      <Text style={styles.HeadingText}>Payment Method</Text>
                      <Pressable
                        style={{padding: 5}}
                        onPress={() => {
                          setPaymentMethod(!paymentMethod);
                        }}>
                        <Icon
                          ComponentName={'Entypo'}
                          name={paymentMethod ? 'minus' : 'plus'}
                          color={appColor.bgBlack}
                          size={widthResponse ? 25 : 30}
                        />
                      </Pressable>
                    </Pressable>
                    {paymentMethod && userSettings['payment_method'] && (
                      <View>
                        {[
                          {
                            name: 'Phone Pe',
                            img: require('../../../assets/images/phonePe.png'),
                            btnName: 'phonePe',
                            key: 'phonepe',
                          },
                          {
                            name: 'Cash On Delivery',
                            img: require('../../../assets/images/cod.png'),
                            btnName: 'cash',
                            key: 'cash_on_delivery',
                          },
                        ]
                          .filter(val => {
                            return (
                              userSettings['payment_method'][val.key] == '1'
                            );
                          })
                          .map((val, ind) => {
                            return (
                              <Pressable
                                key={ind}
                                onPress={() => {
                                  setPayIsValid(true);
                                  setPay(val.btnName);
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderRadius: 10,
                                  backgroundColor: appColor.white,
                                  paddingHorizontal: 15,
                                  marginVertical: 5,
                                }}>
                                <RadioButton
                                  onPress={() => {
                                    setPayIsValid(true);
                                    setPay(val.btnName);
                                  }}
                                  key={ind}
                                  text={val.name}
                                  ind={ind}
                                  altStyle={{width: '65%'}}
                                  isChecked={pay == val.btnName}
                                />
                                <Image
                                  resizeMode="contain"
                                  style={{width: 50, height: 30}}
                                  source={val.img}
                                />
                              </Pressable>
                            );
                          })}
                      </View>
                    )}
                    {!payIsValid && (
                      <Text style={[styles.normalText, {color: 'red'}]}>
                        Please select any one paymentMethod
                      </Text>
                    )}
                    <PrimaryButton
                      onPress={() => {
                        setBtnDisabled(true);
                        !btnDisabled && handleOrderSubmition();
                      }}
                      Title={'Place Your Order'}
                      altStyle={{marginTop: 20}}
                    />
                  </View>
                </>
              )}
            </KeyboardAwareScrollView>
          </View>
        )}
      </>
    </>
  );
};

export default CheckOut;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    card: {
      // width: scrnWidth - 30,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
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
      paddingVertical: widthResponse ? 10 : 15,
      borderBottomWidth: 0.5,
      marginBottom: widthResponse ? 10 : 15,
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
