import {View, Text, Image} from 'react-native';
import React, {useState, useEffect} from 'react';

const ImgCard = ({src, altStyle}) => {
  const [aspectRatio, setAspectRatio] = useState(0);
  useEffect(() => {
    if (src && src != '') {
      Image.getSize(
        src,
        (width, height) => {
          const aspectRatio = width / height;
          setAspectRatio(aspectRatio);
        },
        error => {
          console.error('Error loading image', error);
        },
      );
    }
  }, []);
  return (
    <Image
      style={[
        {resizeMode: 'contain', width: '100%', aspectRatio: aspectRatio},
        altStyle,
      ]}
      source={src}
    />
  );
};

export default ImgCard;
