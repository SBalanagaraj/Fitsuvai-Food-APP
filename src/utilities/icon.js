import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OctIcons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export const Icon = ({ComponentName, name, color, size}) => {
  switch (ComponentName) {
    case 'Entypo':
      return <Entypo name={name} color={color} size={size} />;

    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name} color={color} size={size} />;

    case 'Ionicons':
      return <Ionicons name={name} color={color} size={size} />;

    case 'AntDesign':
      return <AntDesign name={name} color={color} size={size} />;

    case 'EvilIcons':
      return <EvilIcons name={name} color={color} size={size} />;

    case 'Feather':
      return <Feather name={name} color={color} size={size} />;

    case 'FontAwesome':
      return <FontAwsome name={name} color={color} size={size} />;

    case 'FontAwesome5':
      return <FontAwsome5 name={name} color={color} size={size} />;

    case 'FontAwesome6':
      return <FontAwesome6 name={name} color={color} size={size} />;

    case 'FontAwesome5Pro':
      return <FontAwesome5Pro name={name} color={color} size={size} />;

    case 'Fontisto':
      return <Fontisto name={name} color={color} size={size} />;

    case 'Foundation':
      return <Foundation name={name} color={color} size={size} />;

    case 'MaterialIcons':
      return <MaterialIcons name={name} color={color} size={size} />;

    case 'Octicons':
      return <OctIcons name={name} color={color} size={size} />;

    case 'Zocial':
      return <Zocial name={name} color={color} size={size} />;

    case 'SimpleLineIcons':
      return <SimpleLineIcons name={name} color={color} size={size} />;
  }
};
