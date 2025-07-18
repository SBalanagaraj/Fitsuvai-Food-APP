import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import appColors from '../../utilities/appColors';

const RatingComponent = ({rating, size = 18, fullbg}) => {
  const appColor = appColors();
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStar = 5 - Number(Math.ceil(rating));
    const hasHalfStar = rating - fullStars;
    let i = 0;

    for (i = 0; i < Number(fullStars); i++) {
      stars.push(
        <Icon key={i} name="star" size={size} color={appColor.ratingGold} />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon
          key={i}
          name="star-half-empty"
          size={size}
          color={appColor.ratingGold}
        />,
      );
      i++;
    }

    for (let j = i; j < Number(emptyStar) + i; j++) {
      stars.push(
        <Icon
          key={j}
          name={fullbg ? 'star' : 'star-o'}
          size={size}
          color={fullbg ? appColor.ratingGray : appColor.ratingGold}
        />,
      );
    }
    if (rating != 0.0) {
      return stars;
    } else {
      return stars;
      // <View
      //   style={{
      //     padding: 8,
      //   }}>
      //   {''}
      // </View>
    }
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 1}}>
      {renderStars()}
    </View>
  );
};

export default RatingComponent;
