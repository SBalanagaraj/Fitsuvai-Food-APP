import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Pdf from 'react-native-pdf';
import {scrnHeight, scrnWidth} from '../../utilities/helperFunction';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {setTermsPage} from '../../redux/TitleSlice';
import {
  addListener,
  enableSecureView,
  enabled,
  disableSecureView,
} from 'react-native-screenshot-prevent';
import {useShowToast} from '../../components/Toast/ToastAlert';

const MenuScreen = ({route}) => {
  const source = {
    uri: route.params.menuPdf,
    cache: true,
  };
  const scrnShot =
    route && route.params && route?.params?.scrnShot
      ? route?.params?.scrnShot
      : '';
  const showToast = useShowToast();

  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocus) {
      dispatch(setTermsPage(true));
    } else if (!isFocus) {
      dispatch(setTermsPage(false));
    }
  }, [isFocus]);

  // handle scrnShot:
  useEffect(() => {
    if (isFocus && !scrnShot) {
      // disable Screenshot
      enabled(true);
      enableSecureView();
      const subscription = addListener(() => {
        console.log('Screenshot taken');
        showToast(
          'info',
          '',
          'You have taken a screenshot of the app. This is prohibited due to security reasons.',
          2000,
        );
      });
      return () => {
        subscription.remove();
      };
    } else if (!isFocus) {
      // enable Screenshot
      enabled(false);
      disableSecureView();
    }
  }, [isFocus]);

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: scrnWidth,
    height: scrnHeight,
  },
});
