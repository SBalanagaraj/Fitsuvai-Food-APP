import React, {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';

export default appColors = () => {
  const [Theme, setTheme] = useState('light');
  const {statusTheme} = useSelector(state => state.theme);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setTheme(statusTheme == 'system' ? colorScheme : statusTheme);
  }, [statusTheme]);

  return Theme == 'light'
    ? {
        // light Theme:
        themeYellow: '#f4a045',
        greyBack: '#333333',
        white: '#fff',
        black: '#000',
        textWhite: '#fff',
        textBlack: '#000',
        bgWhite: '#fff',
        bgBlack: '#000',
        ToastSuccess: '#228B22',
        ToastInfo: '#ffcc00',
        ToastError: '#ff0000',
        ToastSuccessBack: '#e5f6df',
        ToastInfoBack: '#FFFACD',
        ToastErrorBack: '#FFCCCB',
        formError: '#cc3300',
        boldBlacktext: '#333333',
        Textlightblack: '#666666',
        TextInputborderbg: '#d3d3d3',
        placeHolderText: '#d6d6d6',
        placeHolderTextDark: '#b9b9b9',
        inputBackDark: '#111111',
        borderColor: '#e5e5e5',
        cardBack: '#f3f3f3',
        greyBg: '#f4f4f4',
        searchPlaceHolder: '#bbbbbb',
        cartBg: '#f4f4f4',
        gold: '#f4a045',
        sliderGreyBg: '#dedede',
        ratingGold: '#e5a820',
        textGrey: '#a3a2a2',
        cardbg: '#f4f4f4',
        subtotalBack: '#fef5ec',
        ratingGray: '#dbdbdb',
        overlayBg: 'rgba(0, 0, 0, 0.5)',
        overlayBgCorousel: 'rgba(0, 0, 0, 0.2)',
        paid: '#32ba7c',
        cancel: '#e51313',
        cancelLight: '#fce7e7',
        themeyellowLight: '#fdecda',
        yellowDotBorder: '#fce2c7',
        yellowLine: '#fbdab7',
        lightGreyLine: '#d9d9d9',
        lightBlue: '#43bbd9',
        themeYellowDark: '#ea9a43',
        lightBlue2: '#6dcef6',
        activegreen: '#06a23a',
        lightGreen: '#daf5e3',
        active: '#06a23a',
        deactive: '#f2252c',
        lightBlackBack: '#393939',
        toggleGreen: '#17A772',
        lightYellow: 'rgba(	244,	160,	69, 0.3);',
        transparentGray: 'rgba(255, 255, 255, 0.2)',
        backgroundPink: '#c0dee3',
        lightBackground: '#00000099',
      }
    : {
        // Dark Theme:
        white: '#fff',
        black: '#000',
        textBlack: '#fff',
        textWhite: '#000',
        bgBlack: '#fff',
        bgWhite: '#000',
        ToastSuccess: '#228B22',
        ToastInfo: '#ffcc00',
        ToastError: '#cc3300',
        ToastSuccessBack: '#013220',
        ToastInfoBack: '#8B8000',
        ToastErrorBack: '#8B0000',
        formError: '#cc3300',
        boldBlacktext: '#333333',
        Textlightblack: '#666666',
        TextInputborderbg: '#d3d3d3',
        placeHolderText: '#d6d6d6',
        toggleGreen: '#17A772',
      };
};
