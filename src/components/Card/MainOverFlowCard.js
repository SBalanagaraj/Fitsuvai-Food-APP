import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {scrnWidth, widthResponse} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {RefreshControl} from 'react-native-gesture-handler';
import {duration} from 'moment';

// Note : To render the overflow content must give these style:
// {
//   left: 15 + paddingLeft,
//   width: scrnWidth,
// }

const MainOverflowCard = ({
  altStyle,
  children,
  borderRadius = 40,
  refresh = false,
  onRefresh,
  productId = false,
}) => {
  const appColor = appColors();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (productId) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
        duration: 900,
      });
    }
  }, [productId]);

  return (
    <View style={{flex: 1, position: 'relative', backgroundColor: 'white'}}>
      {/* curve stucture */}
      <View
        style={{
          width: scrnWidth,
          height: 70,
          borderTopRightRadius: borderRadius,
          borderTopLeftRadius: borderRadius,
          borderWidth: 15,
          borderTopWidth: 20,
          borderBottomWidth: 0,
          position: 'absolute',
          top: -15,
          zIndex: 100,
          backgroundColor: 'transparent',
        }}></View>
      {/* scroll view */}
      <ScrollView
        ref={scrollRef}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}
            colors={[appColor.themeYellow]}
            style={{backgroundColor: appColor.bgBlack}}
            tintColor={appColor.themeYellow}
          />
        }
        stickyHeaderIndices={[0, 2]}
        showsVerticalScrollIndicator={false}
        style={{marginTop: -10, zIndex: 10, backgroundColor: 'white'}}
        contentContainerStyle={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingBottom: widthResponse ? 90 : 120,
        }}>
        {/* side black */}
        <View
          style={{
            height: 60,
            width: 15,
            zIndex: 2,
            backgroundColor: appColor.bgBlack,
          }}></View>
        {/* content View */}
        <View
          style={[
            {
              flex: 1,
              zIndex: 3,
              paddingHorizontal: 8,
              paddingTop: 15,
            },
            altStyle,
          ]}>
          {children}
        </View>
        {/* side black */}
        <View
          style={{
            zIndex: 2,
            height: 50,
            width: 15,
            backgroundColor: appColor.bgBlack,
          }}></View>
      </ScrollView>
    </View>
  );
};

export default MainOverflowCard;
