import React, {useEffect} from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
// file import:
import DashBoard from '../screens/mainScreens/DashBoard';
import Profile from '../screens/mainScreens/Profile';
import Cart from '../screens/mainScreens/Cart';
import Order from '../screens/mainScreens/Order';
import Register from '../screens/auth/Register';
import AppHeaders from '../components/Headers/AppHeaders';
import MainStack from './MainStack';
import Login from '../screens/auth/Login';
import ForgotPassword from '../screens/auth/ForgotPassword';
import appColors from '../utilities/appColors';
import BlogOverview from '../screens/mainScreens/BlogOverview';
import ProductOverView from '../screens/mainScreens/ProductOverView';
import ProductDetails from '../screens/mainScreens/ProductDetails';
import CheckOut from '../screens/mainScreens/CheckOut';
import DeleteScreen2 from '../screens/mainScreens/DeleteScreen2';
import DeleteScreen3 from '../screens/mainScreens/DeleteScreen3';
import DeleteScreen1 from '../screens/mainScreens/DeleteScreen1';
import ReviewPage from '../screens/mainScreens/ReviewPage';
import ReviewProduct from '../screens/mainScreens/ReviewProduct';
import TermsAndConditions from '../screens/auth/TermsAndConditions';
import RewardCoin from '../screens/mainScreens/RewardCoin';
import BlogDetail from '../screens/mainScreens/BlogDetail';
import ThanksScreen from '../screens/mainScreens/ThanksScreen';
import MyAddress from '../screens/mainScreens/MyAddress';
import ManageAddress from '../screens/mainScreens/ManageAddress';
import OrderDetail from '../screens/mainScreens/OrderDetail';
import OrderTrack from '../screens/mainScreens/OrderTrack';
import GenralCourseOverview from '../screens/mainScreens/GenralCourseOverview';
import CourseOverview from '../screens/mainScreens/CourseOverview';
import CourseDetail from '../screens/mainScreens/CourseDetail';
import ContactUs from '../screens/mainScreens/ContactUs';
import EditProfile from '../screens/mainScreens/EditProfile';
import AboutUs from '../screens/mainScreens/AboutUs';
import Assesments from '../screens/mainScreens/Assesments';
import SearchScreen from '../screens/mainScreens/SearchScreen';
import MemberReg1 from '../screens/auth/MemberReg1';
import MemberReg2 from '../screens/auth/MemberReg2';
import MemberReg3 from '../screens/auth/MemberReg3';
import Notification from '../screens/mainScreens/Notification';
import Summary from '../screens/mainScreens/Summary';
import Wishlist from '../screens/mainScreens/WishListScreen';
import WishListView from '../screens/mainScreens/WishListView';
import SubscribedPlanDetail from '../screens/mainScreens/SubscribedPlanDetail';
import SubscriptionOverview from '../screens/mainScreens/SubscriptionOverview';
import Step7 from '../screens/mainScreens/Step7';
import Otp_auth from '../screens/auth/OtpScreen';
import ReviewOverView from '../screens/mainScreens/ReviewOverView';
import MenuScreen from '../screens/mainScreens/MenuScreen';
import {setTermsPage} from '../redux/TitleSlice';
import {useIsFocused} from '@react-navigation/native';
import Menu from '../screens/mainScreens/Menu';
import SubcategoryScreen from '../screens/mainScreens/SubCatogary';
import ChefLogin from '../screens/mainScreens/ChefLogin';
import EditFood from '../screens/mainScreens/EditFood';
import {print} from '../utilities/helperFunction';

const Stack = createStackNavigator();

export const AuthStack = () => {
  const appColor = appColors();

  return (
    <>
      <>
        <Stack.Navigator
          initialRouteName="main"
          screenOptions={{
            headerShown: false,
            CardStyleInterpolators:
              CardStyleInterpolators.forScaleFromCenterAndroid,
          }}>
          <Stack.Screen name="main" component={MainStack} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="forgot" component={ForgotPassword} />
          <Stack.Screen name="otpScreen" component={Otp_auth} />

          <Stack.Screen
            name="TermsAndConditions"
            component={TermsAndConditions}
          />
        </Stack.Navigator>
      </>
    </>
  );
};

const NoBottomTab = () => {
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocus) {
      dispatch(setTermsPage(true));
      // setTimeout(() => {}, 100);
    } else if (!isFocus) {
      dispatch(setTermsPage(false));
    }
  }, [isFocus]);
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          CardStyleInterpolators:
            CardStyleInterpolators.forScaleFromCenterAndroid,
        }}>
        <Stack.Screen name="member_1" component={MemberReg1} />
        <Stack.Screen name="member_2" component={MemberReg2} />
        <Stack.Screen name="member_3" component={MemberReg3} />
      </Stack.Navigator>
    </>
  );
};

const NoBottomTabAssesment = () => {
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocus) {
      dispatch(setTermsPage(true));
      // setTimeout(() => {}, 100);
    } else if (!isFocus) {
      dispatch(setTermsPage(false));
    }
  }, [isFocus]);
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          CardStyleInterpolators:
            CardStyleInterpolators.forScaleFromCenterAndroid,
        }}>
        <Stack.Screen
          name="assesment"
          options={{title: 'START YOUR MEALS'}}
          component={Assesments}
        />
      </Stack.Navigator>
    </>
  );
};

export const DashBoardStack = () => {
  const {title, altTitle} = useSelector(state => state.title);
  const {userType} = useSelector(state => state.auth);
  const {userSettings} = useSelector(state => state.setting);

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          CardStyleInterpolators:
            CardStyleInterpolators.forScaleFromCenterAndroid,
        }}>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return (
                <AppHeaders
                  title={options.title}
                  // drawer={true}
                  backIconDisabled
                  searchDisabled
                  welcome={true}
                />
              );
            },
          }}>
          <Stack.Screen
            name="home"
            options={{
              title:
                userType == 'guest'
                  ? 'Guest Users'
                  : userSettings &&
                    userSettings?.userInfo &&
                    userSettings?.userInfo?.first_name,
            }}
            component={DashBoard}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="search" component={SearchScreen} />
          <Stack.Screen name="menuScreen" component={MenuScreen} />
          <Stack.Screen name="noTab" component={NoBottomTab} />
          <Stack.Screen
            name="assesments"
            options={{title: 'START YOUR MEALS'}}
            component={Assesments}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return <AppHeaders title={options.title} />;
            },
          }}>
          <Stack.Screen
            name="menu"
            options={{title: 'Menu'}}
            component={Menu}
          />
          <Stack.Screen
            name="Subcategory"
            options={{title: title}}
            component={SubcategoryScreen}
          />
          <Stack.Screen
            options={{title: 'Review OverView'}}
            name="reviewOverView"
            component={ReviewOverView}
          />
          <Stack.Screen
            name="blog_overview"
            options={{title: 'Blog Overview'}}
            component={BlogOverview}
          />
          <Stack.Screen
            name="blog_detail"
            options={{title: 'Blog Detail'}}
            component={BlogDetail}
          />
          <Stack.Group
            screenOptions={{
              headerShown: true,
              header: ({options}) => {
                return (
                  <AppHeaders title={options.title} toggleDisable={false} />
                );
              },
            }}>
            <Stack.Screen
              name="productDetail"
              options={{title: 'ProductDetails'}}
              component={ProductDetails}
            />
          </Stack.Group>
          <Stack.Screen
            name="gen_course"
            options={{title: 'Course Overview'}}
            component={GenralCourseOverview}
          />
          <Stack.Screen
            name="course_overview"
            options={{title: title}}
            component={CourseOverview}
          />
          <Stack.Screen
            name="course_detail"
            options={{title: altTitle}}
            component={CourseDetail}
          />
          <Stack.Screen
            name="about_us"
            options={{title: 'About Us'}}
            component={AboutUs}
          />
          <Stack.Screen
            name="editFood"
            options={{title: 'EDIT YOUR MEALS'}}
            component={EditFood}
          />
          <Stack.Screen
            name="step7"
            options={{title: 'START YOUR MEALS'}}
            component={Step7}
          />
          <Stack.Screen
            name="summary"
            options={{title: 'Summary'}}
            component={Summary}
          />
          <Stack.Screen
            name="thanksScreen"
            options={{title: 'Thank You'}}
            component={ThanksScreen}
          />
          <Stack.Screen
            name="subscriptionPlanHistory"
            component={SubscriptionOverview}
            options={{
              title: 'Plan history',
            }}
          />
          <Stack.Screen
            name="SubscribedPlanDetail"
            options={{title: 'best deal'}}
            component={SubscribedPlanDetail}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return <AppHeaders title={options.title} drawer={true} />;
            },
          }}>
          <Stack.Screen
            options={{title: 'product overview'}}
            name="productOverView"
            component={ProductOverView}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return (
                <AppHeaders
                  title={options.title}
                  bellDisabled={true}
                  deleteIcon={true}
                />
              );
            },
          }}>
          <Stack.Screen
            name="notification"
            options={{title: 'Notification'}}
            component={Notification}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export const CartStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          CardStyleInterpolators:
            CardStyleInterpolators.forScaleFromCenterAndroid,
        }}>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return (
                <AppHeaders
                  title={options.title}
                  coinIcon
                  toggleDisable={false}
                />
              );
            },
          }}>
          <Stack.Screen
            name="cart"
            options={{title: 'My Cart'}}
            component={Cart}
          />
          <Stack.Screen
            name="thanksScreen"
            options={{title: 'Thank You'}}
            component={ThanksScreen}
          />
          <Stack.Screen
            name="myAddress"
            options={{title: 'My Address'}}
            component={MyAddress}
          />
          <Stack.Screen
            name="manageAddress"
            options={{title: 'Saved address'}}
            component={ManageAddress}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return (
                <AppHeaders
                  title={options.title}
                  coinIcon
                  toggleDisable={false}
                />
              );
            },
          }}>
          <Stack.Screen
            name="checkOut"
            options={{title: 'Checkout'}}
            component={CheckOut}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export const MenuStack = () => {
  const {title} = useSelector(state => state.title);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        CardStyleInterpolators:
          CardStyleInterpolators.forScaleFromCenterAndroid,
      }}>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options}) => {
            return <AppHeaders title={options.title} />;
          },
        }}>
        <Stack.Screen name="menu" options={{title: 'Menu'}} component={Menu} />
        <Stack.Screen
          name="Subcategory"
          options={{title: title}}
          component={SubcategoryScreen}
        />
        <Stack.Screen
          options={{title: 'product overview'}}
          name="productOverView"
          component={ProductOverView}
        />
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return <AppHeaders title={options.title} toggleDisable={false} />;
            },
          }}>
          <Stack.Screen
            name="productDetail"
            options={{title: 'ProductDetails'}}
            component={ProductDetails}
          />
        </Stack.Group>
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const OrderStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          // cardStyle: {paddingBottom: 70},
          CardStyleInterpolators:
            CardStyleInterpolators.forScaleFromCenterAndroid,
          headerShown: false,
        }}>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return <AppHeaders title={options.title} toggleDisable={false} />;
            },
          }}>
          <Stack.Screen
            name="order"
            options={{title: 'Order'}}
            component={Order}
          />
          <Stack.Screen
            name="order_detail"
            options={{title: 'Order Detail'}}
            component={OrderDetail}
          />
          <Stack.Screen
            name="order_track"
            options={{title: 'Track Order'}}
            component={OrderTrack}
          />
          <Stack.Screen
            name="ReviewProduct"
            options={{title: 'ReviewProduct'}}
            component={ReviewProduct}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export const ProfileStack = () => {
  const {title, altTitle} = useSelector(state => state.title);
  const {assesmentRoute} = useSelector(state => state.setting);
  print(assesmentRoute, 'assesmentRoute----');
  return (
    <>
      <Stack.Navigator
        initialRouteName={assesmentRoute ? 'assesments' : 'profile'}
        screenOptions={{
          headerShown: false,
          CardStyleInterpolators:
            CardStyleInterpolators.forScaleFromCenterAndroid,
        }}>
        {/* <Stack.Screen
          name="assesments"
          // options={{title: 'START YOUR MEALS'}}
          component={Assesments}
        /> */}

        <Stack.Group
          screenOptions={{
            headerShown: true,
            header: ({options}) => {
              return <AppHeaders title={options.title} toggleDisable={false} />;
            },
          }}>
          <Stack.Screen
            name="profile"
            options={{title: 'Profile'}}
            component={Profile}
          />
          <Stack.Screen
            name="deleteScreen1"
            options={{title: 'delete account1'}}
            component={DeleteScreen1}
          />
          <Stack.Screen
            name="deleteScreen2"
            options={{title: 'delete account2'}}
            component={DeleteScreen2}
          />
          <Stack.Screen
            name="deleteScreen3"
            options={{title: 'delete account3'}}
            component={DeleteScreen3}
          />
          <Stack.Screen
            name="ReviewPage"
            options={{title: 'user account review'}}
            component={ReviewPage}
          />
          <Stack.Screen
            name="ReviewProduct"
            options={{title: 'ReviewProduct'}}
            component={ReviewProduct}
          />
          <Stack.Screen
            name="RewardCoin"
            options={{title: 'RewardCoin'}}
            component={RewardCoin}
          />
          <Stack.Screen
            name="myAddress"
            options={{title: 'My Address'}}
            component={MyAddress}
          />
          <Stack.Screen
            name="manageAddress"
            options={{title: 'Saved address'}}
            component={ManageAddress}
          />
          <Stack.Screen
            name="ContactUs"
            options={{title: 'ContactUs'}}
            component={ContactUs}
          />

          <Stack.Screen
            name="WishList"
            options={{title: 'WishList'}}
            component={Wishlist}
          />
          <Stack.Screen
            name="WishListView"
            options={{title: 'WishListView'}}
            component={WishListView}
          />
          <Stack.Screen
            options={{title: 'Review OverView'}}
            name="reviewOverView"
            component={ReviewOverView}
          />
          <Stack.Screen
            name="blog_overview"
            options={{title: 'Blog Overview'}}
            component={BlogOverview}
          />
          <Stack.Screen
            name="blog_detail"
            options={{title: 'Blog Detail'}}
            component={BlogDetail}
          />

          <Stack.Screen
            name="gen_course"
            options={{title: 'Course Overview'}}
            component={GenralCourseOverview}
          />
          <Stack.Screen
            name="course_overview"
            options={{title: title}}
            component={CourseOverview}
          />
          <Stack.Screen
            name="course_detail"
            options={{title: altTitle}}
            component={CourseDetail}
          />
          <Stack.Screen
            name="about_us"
            options={{title: 'About Us'}}
            component={AboutUs}
          />
          {/* <Stack.Screen
            name="editFood"
            options={{title: 'EDIT YOUR MEALS'}}
            component={EditFood}
          />
          <Stack.Screen
            name="summary"
            options={{title: 'Summary'}}
            component={Summary}
          />
          <Stack.Screen
            name="subscriptionPlanHistory"
            component={SubscriptionOverview}
            options={{
              title: 'Plan history',
            }}
          />
          <Stack.Screen
            name="SubscribedPlanDetail"
            options={{title: 'best deal'}}
            component={SubscribedPlanDetail}
          /> */}
          <Stack.Screen
            name="notification"
            options={{title: 'Notification'}}
            component={Notification}
          />
          <Stack.Group
            screenOptions={{
              headerShown: true,
              header: ({options}) => {
                return (
                  <AppHeaders title={options.title} toggleDisable={false} />
                );
              },
            }}>
            <Stack.Screen
              name="EditProfile"
              options={{title: 'EditProfile'}}
              component={EditProfile}
            />
            <Stack.Screen
              name="chefLogin"
              options={{title: title}}
              component={ChefLogin}
            />
          </Stack.Group>
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="TermsAndConditions"
            options={{title: ''}}
            component={TermsAndConditions}
          />
          <Stack.Screen
            name="step7"
            options={{title: 'START YOUR MEALS'}}
            component={Step7}
          />
          <Stack.Screen
            name="thanksScreen"
            options={{title: 'Thank You'}}
            component={ThanksScreen}
          />
          <Stack.Screen name="search" component={SearchScreen} />
          <Stack.Screen name="noTab" component={NoBottomTab} />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};
