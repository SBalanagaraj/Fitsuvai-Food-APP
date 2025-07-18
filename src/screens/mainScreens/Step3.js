import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import { scrnHeight, widthResponse} from '../../utilities/helperFunction';
import {FlatList} from 'react-native-gesture-handler';
import appColors from '../../utilities/appColors';
import {useDispatch} from 'react-redux';
import InfoCard from '../../components/Card/InfoCard';
import {setassesMentIds, setSummeryContent} from '../../redux/SummerySlice';

const Step3 = ({handlePage, goalData}) => {
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
        paddingHorizontal: container,
        paddingBottom: scrnHeight / (widthResponse ? 2.4 : 3.4), //@@

      }}>
      {goalData && goalData.length > 0 && (
        <FlatList
          numColumns={2}
          data={goalData}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return <View style={{marginBottom: gap}} />; //@@
          }}
          renderItem={({item, index}) => {
            const active = index == activeCard;
            return (
              <>
              <InfoCard
                item={item}
                active={active}
                index={index}
                onPress={() => {
                  dispatch(setassesMentIds({yourGoalId: item.id}));
                  dispatch(setSummeryContent({yourGoal: item.name}));
                  setActiveCard(index);
                  handlePage(3);
                }}
              />
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default Step3;

const styles = StyleSheet.create({});
