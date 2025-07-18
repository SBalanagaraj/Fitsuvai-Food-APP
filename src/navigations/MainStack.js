import React, {useEffect} from 'react';
// file import:
import BottomTab from './BottomTab';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {print, scrnWidth} from '../utilities/helperFunction';
import DrawerScreen from '../screens/mainScreens/DrawerScreen';
import {useDispatch, useSelector} from 'react-redux';
import {userSettingApi} from '../redux/SettingSlice';

const Drawer = createDrawerNavigator();

const MainStack = () => {
  const {position} = useSelector(state => state.setting);
  const {profileData} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // call userSetting Api when app will invoke
  useEffect(() => {
    (() => {
      dispatch(userSettingApi());
    })();
  }, [profileData]);

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: position,
          headerShown: false,
          swipeEnabled: false,
          drawerStatusBarAnimation: 'slide',
          swipeEdgeWidth: 20,
          drawerType: 'front',
          drawerStyle: {
            width: scrnWidth - 75,
          },
        }}
        drawerContent={DrawerScreen}>
        <Drawer.Screen name="BottomTab" component={BottomTab} />
      </Drawer.Navigator>
    </>
  );
};

export default MainStack;
