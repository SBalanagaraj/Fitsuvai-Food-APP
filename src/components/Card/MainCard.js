import {View, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';

const MainCard = ({children, altStyle, cartBg = false}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: !cartBg ? appColor.white : appColor.cartBg},
      ]}>
      <View style={styles.topBlack} />
      <View
        style={[
          styles.ScrContainer,
          altStyle,
          {backgroundColor: !cartBg ? appColor.white : appColor.cartBg},
        ]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default MainCard;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    ScrContainer: {
      marginTop: -40,
      flex: 1,
      overflow: 'visible',
      backgroundColor: appColor.cartBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 10,
      paddingHorizontal: 10,
      zIndex: 2,
      marginHorizontal: 10,
    },
    safeArea: {
      flex: 1,
      backgroundColor: appColor.white,
      position: 'relative',
    },
    topBlack: {
      height: 50,
      zIndex: 1,
      widht: '100%',
      backgroundColor: appColor.bgBlack,
    },
  });

  return {styles};
};

// import {View, Text, ScrollView} from 'react-native';
// import React from 'react';
// import {scrnWidth} from '../../utilities/helperFunction';
// import appColors from '../../utilities/appColors';

// const BlogOverview = () => {
//   const appColor = appColors();
//   return (
//     <View style={{position: 'relative', backgroundColor: 'white'}}>
//       <View
//         style={{
//           width: '100%',
//           height: 30,
//           position: 'absolute',
//           top: 0,
//           backgroundColor: 'black',
//         }}></View>
//       <View
//         style={{
//           width: scrnWidth - 30,
//           height: 40,
//           borderTopRightRadius: 20,
//           borderTopLeftRadius: 20,
//           position: 'absolute',
//           top: 0,
//           left: 15,
//           backgroundColor: 'white',
//         }}></View>
//       <ScrollView
//         stickyHeaderIndices={[0, 2]}
//         showsVerticalScrollIndicator={false}
//         style={{marginTop: 20}}
//         contentContainerStyle={{
//           width: '100%',
//           flexDirection: 'row',
//           alignItems: 'flex-start',
//         }}>
//         <View
//           style={{
//             height: 40,
//             width: 15,
//             zIndex: 1,
//             backgroundColor: appColor.bgBlack,
//           }}></View>
//         <View
//           style={{
//             flex: 1,
//             paddingHorizontal: 10,
//             zIndex: 100,
//             zIndex: 3,
//             backgroundColor: 'white',
//             overflow: 'visible',
//             elevation: 0,
//           }}>
//           <Text>BlogOverview</Text>
//           <Text>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
//             possimus voluptatibus iusto molestias dolore et veniam neque ipsam
//             hic modi! Maiores voluptate beatae veritatis porro, quos aspernatur
//             eligendi nostrum sed. sectetur adipisicing elit. Accusamus possimus
//             voluptatibus iusto molestias dolore et veniam neque ipsam hic modi!
//             Maiores voluptate beatae veritatis porro, quos aspernatur eligendi
//           </Text>
//           <View
//             style={{
//               width: scrnWidth,
//               backgroundColor: 'red',
//               height: 20,
//               left: -25,
//             }}></View>
//           <Text>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
//             possimus voluptatibus iusto molestias dolore et veniam neque ipsam
//             hic modi! Maiores voluptate beatae veritatis porro, quos aspernatur
//             eligendi nostrum sed. sectetur adipisicing elit. Accusamus possimus
//             voluptatibus iusto molestias dolore et veniam neque ipsam hic modi!
//             Maiores voluptate beatae veritatis porro, quos aspernatur eligendi
//             nostrum sed. sectetur adipisicing elit. Accusamus possimus
//             voluptatibus iusto molestias dolore et veniam neque ipsam hic modi!
//             Maiores voluptate beatae veritatis porro, quos aspernatur eligendi
//             nostrum sed. sectetur adipisicing elit. Accusamus possimus
//             voluptatibus iusto molestLorem ipsum dolor sit amet consectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed. sectetur
//             adipisicing elit. Accusamus possimus voluptatibus iusto molestias
//             dolore et veniam neque ipsam hic modi! Maiores voluptate beatae
//             veritatis porro, quos aspernatur eligendi nostrum sed.
//           </Text>
//         </View>
//         <View
//           style={{
//             zIndex: 2,
//             height: 40,
//             borderWidth: 2,
//             width: 15,
//             backgroundColor: appColor.bgBlack,
//           }}></View>
//       </ScrollView>
//     </View>
//   );
// };

// export default BlogOverview;
