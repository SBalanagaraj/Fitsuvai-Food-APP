import {View, StyleSheet} from 'react-native';
import appColors from '../../utilities/appColors';

export const TriangleCorner = props => {
  const {styles} = useStyle();

  return <View style={[styles.triangleCorner, props.style]} />;
};

export const TriangleCornerBottomRight = ({reverse = false}) => {
  const {styles} = useStyle();

  return (
    <TriangleCorner
      style={{transform: [{rotate: reverse ? '270deg' : '180deg'}]}}
    />
  );
};

export const TriangleCornerTopRight = ({reverse = false}) => {
  const {styles} = useStyle();

  return (
    <TriangleCorner
      style={{transform: [{rotate: reverse ? '0deg' : '90deg'}]}}
    />
  );
};

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    triangleCorner: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: 13.5,
      borderTopWidth: 13.5,
      borderRightColor: 'transparent',
      borderTopColor: appColor.gold,
    },
    triangleCornerBottomRight: {
      transform: [{rotate: '180deg'}],
    },
    triangleCornerTopRight: {
      transform: [{rotate: '90deg'}],
    },
  });
  return {styles};
};
