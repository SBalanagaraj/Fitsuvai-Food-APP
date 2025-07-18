import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import LottieView from 'lottie-react-native';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {setTermsPage} from '../../redux/TitleSlice';

const ChefLogin = ({route}) => {
  const [load, setLoad] = useState(true);
  const url = route && route.params && route.params.url ? route.params.url : '';
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocus) {
      dispatch(setTermsPage(true));
      // setTimeout(() => {}, 100);
    } else if (!isFocus) {
      dispatch(setTermsPage(false));
    }
    setTimeout(() => {
      setLoad(false);
    }, 1111);
  }, [isFocus]);

  if (load) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <LottieView
          autoPlay={true}
          style={{width: 200, height: 200, top: 5}}
          source={require('../../../assets/lottieFiles/load.json')}
        />
      </View>
    );
  }

  return <>{url != '' && <WebView source={{uri: url}} style={{flex: 1}} />}</>;
};

export default ChefLogin;

const styles = StyleSheet.create({});
