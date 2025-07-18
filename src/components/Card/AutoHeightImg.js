import {Image, ImageBackground} from 'react-native';
import React, {Children, useEffect, useState} from 'react';

const AutoHeightImg = ({url, altStyle, imgBg = false, children = ''}) => {
  const [aspectRatio, setAspectRatio] = useState(0);
  useEffect(() => {
    if (url && url != '') {
      Image.getSize(
        url,
        (width, height) => {
          const aspectRatio = width / height;
          setAspectRatio(aspectRatio);
        },
        error => {
          console.log('Error loading image', error);
          setAspectRatio(0);
        },
      );
    }
  }, []);

  return (
    <>
      {url && url != '' && (
        <>
          {!imgBg ? (
            <Image
              source={{uri: url}}
              resizeMode="contain"
              style={[
                aspectRatio != 0 && {aspectRatio: aspectRatio},
                {
                  width: '100%',
                },
                altStyle,
              ]}
            />
          ) : (
            <ImageBackground
              source={{uri: url}}
              resizeMode="contain"
              style={[
                aspectRatio != 0 && {aspectRatio: aspectRatio},
                {
                  width: '100%',
                },
                altStyle,
              ]}>
              {children}
            </ImageBackground>
          )}
        </>
      )}
    </>
  );
};

export default AutoHeightImg;
