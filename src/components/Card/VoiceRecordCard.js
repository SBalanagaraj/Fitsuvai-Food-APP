import {Pressable, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import React, {useState, useEffect} from 'react';
import appColors from '../../utilities/appColors';
import LottieView from 'lottie-react-native';
import {appFont} from '../../utilities/appFont';
import {fontScalling} from '../../utilities/helperFunction';
import useVoiceRecognition from '../../utilities/useVoiceRecognition';


const VoiceRecordCard = ({
  setVoiceModal,
  voiceModal,
  started,
  setStarted,
  startRecognizing,
  isCompleted,
  results,
  searchFn,
  setSrchKey,
}) => {
  const appColor = appColors();
  const [noSpeech, setNoSpeech] = useState(false);
  const {cancelRecognizing, stopRecognizing} = useVoiceRecognition();

  useEffect(() => {
    let noSpeechTimer;
    let closeTimer;

    // If voice recognition starts but no result yet — start a 5-second timeout
    if (started && (!results || results.length === 0)) {
      noSpeechTimer = setTimeout(() => {
        setNoSpeech(true); // Show "Sorry, I didn't hear that"
      }, 5000);
    }

    // If speech is recognized
    if (results[0] && results.length > 0) {
      clearTimeout(noSpeechTimer);
      setNoSpeech(false);

      closeTimer = setTimeout(() => {
        setVoiceModal(false);
        stopRecognizing();
      }, 500);

      setTimeout(() => {
        setSrchKey(results[0]);
        searchFn(results[0]);
        results[0] = '';
      }, 1000);
    }

    return () => {
      clearTimeout(noSpeechTimer);
      clearTimeout(closeTimer);
    };
  }, [results, started]);

  const getVoiceTextDisplay = () => {
    if (started && !noSpeech) return 'Listening ...';
    if (noSpeech) return "Sorry, I Didn't hear that";
    if (results && results.length > 0) return results[0];
    return '';
  };

  const showGreenTick = !started && isCompleted && results[0];

  return (
    <Modal
      backdropColor={appColor.overlayBg}
      onBackdropPress={() => {
        setStarted(false);
        cancelRecognizing();
        setVoiceModal(false);
      }}
      isVisible={voiceModal}
      style={{}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appColor.white,
          borderRadius: 15,
          overflow: 'hidden',
          elevation: 15,
          marginHorizontal: 20,
          paddingVertical: 15,
        }}>
        <Text
          style={{
            color: appColor.textGrey,
            fontFamily: appFont.rB,
            fontSize: fontScalling(2),
          }}>
          {getVoiceTextDisplay()}
        </Text>
        {showGreenTick ? (
          <LottieView
            resizeMode="contain"
            style={{
              width: 170,
              height: 170,
              margin: 0,
              padding: 0,
              marginVertical: -20,
            }}
            autoPlay
            loop={false}
            speed={0.5}
            duration={1000}
            source={require('../../../assets/lottieFiles/GreenTick.json')}
          />
        ) : (
          <Pressable
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
              !started ? startRecognizing() : () => {};
            }}>
            <LottieView
              resizeMode="contain"
              style={{
                width: 170,
                height: 170,
                margin: 0,
                padding: 0,
                marginVertical: -20,
              }}
              autoPlay={!!started}
              duration={1000}
              source={require('../../../assets/lottieFiles/microPhone.json')}
            />
            {!started && (
              <Text
                style={{
                  color: appColor.gold,
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(1.8),
                }}>
                Tap microphone to try again
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </Modal>
  );
};

// Inside VoiceRecordCard.js
export default React.memo(VoiceRecordCard);

const styles = StyleSheet.create({});
