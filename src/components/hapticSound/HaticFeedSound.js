// note: please needed sounds all to save this path
// path: android/app/src/main/res/raw

import Sound from 'react-native-sound';

export const hapticFeedSound = fileName => {
  var hapticFeed = new Sound(fileName, Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }

    // Play the sound with an onEnd callback:
    hapticFeed.play(success => {
      if (success) {
        // console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });

    // // loaded successfully
    // console.log(
    //   'duration in seconds: ' +
    //     hapticFeed.getDuration() +
    //     'number of channels: ' +
    //     hapticFeed.getNumberOfChannels(),
    // );
  });
};
