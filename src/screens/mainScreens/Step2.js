import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {scrnHeight, widthResponse} from '../../utilities/helperFunction';
import {FlatList} from 'react-native-gesture-handler';
import appColors from '../../utilities/appColors';

import {useDispatch, useSelector} from 'react-redux';
import {setassesMentIds, setSummeryContent} from '../../redux/SummerySlice';
import InfoCard from '../../components/Card/InfoCard';

const Step2 = ({handlePage, mealData}) => {
  const appColor = appColors();
  const [activeCard, setActiveCard] = useState('string');
  const dispatch = useDispatch();
  const container = 20; //@@
  const gap = widthResponse ? 10 : 15; //@@

  return (
    <View
      style={{
        flex: 1, //@@
        width: '100%',
        paddingBottom: scrnHeight / (widthResponse ? 3 : 3.4), //@@
        paddingHorizontal: container,
      }}>
      {mealData && mealData.length > 0 && (
        <FlatList
          numColumns={2}
          contentContainerStyle={{paddingBottom: 100}} //@@
          showsVerticalScrollIndicator={false}
          data={mealData}
          nestedScrollEnabled={true}
          ItemSeparatorComponent={() => {
            return <View style={{marginBottom: gap}} />; //@@
          }}
          renderItem={({item, index}) => {
            const active = index == activeCard;
            return (
              <InfoCard
                item={item}
                active={active}
                index={index}
                onPress={() => {
                  dispatch(setassesMentIds({yourMealId: item.id}));
                  dispatch(setSummeryContent({yourMeal: item.name}));
                  setActiveCard(index);
                  handlePage(2);
                }}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default Step2;

const styles = StyleSheet.create({});
