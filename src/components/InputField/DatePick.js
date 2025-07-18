import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Capitalize,
  fontScalling,
  formatedDate,
  formatedDates,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import Modal from 'react-native-modal';
import {CalendarList} from 'react-native-calendars';
import PrimaryButton from '../Buttons/PrimaryButton';
import {useSelector} from 'react-redux';
import {useShowToast} from '../Toast/ToastAlert';

const DatePick = ({
  title,
  onChange,
  dark,
  icon,
  iconName,
  iconSize,
  value,
  altStyle,
  singleSelection = false,
  chooseDates,
  maxDate = Infinity,
  onPress = () => {},
  selectedDates = [],
  children = null,
}) => {
  // states
  const [modalVisible, setModalVisible] = useState(false);
  const [validDate, setValidDate] = useState(false);
  const [dates, setDates] = useState({
    isfromDate: null,
    isendDate: null,
    MarkedDates: {},
  });
  const showToast = useShowToast();
  const {userSettings} = useSelector(state => state.setting);
  const holidayDates =
    userSettings && userSettings?.HOLIDAY && userSettings?.HOLIDAY.split(',');

  const appColor = appColors();
  const currentDate = new Date();
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);

  const minimumDate = new Date(currentDate);
  minimumDate.setDate(currentDate.getDate() + 1);
  const formatedMinDate = minimumDate.toISOString().split('T')[0];

  const singleDaySelection = dates.isfromDate
    ? new Date(dates.isfromDate).toISOString().split('T')[0]
    : 'selectDate';

  const customPlanSelection =
    dates.isfromDate && dates.isendDate
      ? `${new Date(dates.isfromDate).toISOString().split('T')[0]} - ${
          new Date(dates.isendDate).toISOString().split('T')[0]
        }`
      : 'selectDate';

  // Format the next day as 'YYYY-MM-DD'
  const formattedNextDay = nextDay.toISOString().split('T')[0];

  // singleDay and Multiple day select function
  const onDayPress = day => {
    const currentDates = new Date(day.dateString);

    if (currentDates.getDay() !== 0) {
      const selectedDate = day.dateString;
      if (singleSelection) {
        // Single date selection logic
        setDates({
          isfromDate: selectedDate,
          isendDate: null,
          MarkedDates: {
            [selectedDate]: {
              startingDay: true,
              endingDay: true,
              selected: true,
              marked: true,
              color: '#f4a045',
              selectedColor: appColor.bgBlack,
              dotColor: 'transparent',
            },
          },
        });
      } else {
        // Multi-selection (range) logic
        if (!dates.isfromDate || (dates.isfromDate && dates.isendDate)) {
          const range = getDateRange(dates.isfromDate, dates.isendDate);
          // Set start date and reset end date
          setDates(preDate => ({
            ...preDate,
            isfromDate: selectedDate,
            isendDate: null,
            MarkedDates: {
              [selectedDate]: {
                startingDay: true,
                selected: true,
                marked: true,
                color: holidayDates.includes(selectedDate)
                  ? appColor.greyBack
                  : appColor.gold,
                selectedColor: holidayDates.includes(selectedDate)
                  ? appColor.greyBack
                  : appColor.gold,
                dotColor: 'transparent',
              },
            },
          }));
        } else if (!dates.isendDate) {
          // Set end date and mark the range
          const range = getDateRange(dates.isfromDate, selectedDate);
          chooseDates(range);
          const markedRange = range.reduce((acc, date, index) => {
            acc[date] = {
              selected: true,
              marked: true,
              color: holidayDates.includes(date)
                ? appColor.greyBack
                : appColor.gold,
              selectedColor: holidayDates.includes(date)
                ? appColor.greyBack
                : appColor.gold,
              dotColor: 'transparent',
              ...(index === 0 && {startingDay: true}),
              ...(index === range.length - 1 && {endingDay: true}),
            };
            return acc;
          }, {});
          const key = Object.keys(markedRange).length;
          setDates(preDate => ({
            ...preDate,
            isendDate: Object.keys(markedRange)[key - 1],
            MarkedDates: markedRange,
            endingDay: Object.keys(markedRange)[key - 1] ? true : false,
          }));
        }
      }
      if (holidayDates.includes(selectedDate)) {
        showToast('custom', `Balck color indicates Holidays`, '', 6000);
      }
    }
  };

  // Function to get date range and skip Sundays
  const getDateRange = (start, end, mDate = maxDate) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      // Check if the day is Sunday (0 = Sunday)
      const holidays = currentDate.getDay() !== 0;
      if (holidays) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
      }
      print(maxDate, 'max');
      print(
        dateArray.filter(data => {
          print(data, 'data');
          return !holidayDates.includes(data);
        }).length,
        'arrayLength',
      );
      if (
        dateArray.filter(data => {
          print(data, 'data');
          return !holidayDates.includes(data);
        }).length == maxDate
      ) {
        break;
      }
      if (singleSelection) {
        currentDate;
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return dateArray;
  }; //BN

  // when clear the date reset the calender:
  useEffect(() => {
    if (selectedDates && selectedDates.length == 0) {
      //@@
      setValidDate(false);
      setDates({
        isfromDate: null,
        isendDate: null,
        MarkedDates: {},
      });
    }
  }, [selectedDates]);

  return (
    <>
      <View style={[altStyle]}>
        {title && (
          <Text
            style={{
              color: dark ? appColor.textWhite : appColor.textBlack,
              fontSize: fontScalling(1.7),
              fontFamily: appFont.rM,
              paddingBottom: widthResponse ? (dark ? 8 : 12) : 10,
            }}>
            {Capitalize(title)}
          </Text>
        )}
        <Pressable
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            width: '100%',
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: dark ? appColor.inputBackDark : appColor.greyBg,
            fontSize: fontScalling(1.6),
            paddingVertical: dark ? 4 : 6,
            paddingHorizontal: dark ? 10 : 5,
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              ComponentName={icon}
              name={iconName}
              size={iconSize}
              color={dark ? appColor.bgWhite : appColor.bgBlack}
            />
            <Text
              style={{
                fontFamily: appFont.rR,
                fontSize: fontScalling(1.7),
                color: dark ? appColor.textWhite : appColor.boldBlacktext,
                textAlign: 'center',
                paddingVertical: 6,
                paddingHorizontal: 8,
                paddingLeft: dark ? 10 : 8,
                textTransform: 'capitalize',
                textAlign: 'left',
                lineHeight: fontScalling(3),
              }}>
              {
                <Text
                  style={{
                    color: dark
                      ? value?.isfromDate != null
                        ? appColor.white
                        : appColor.placeHolderTextDark
                      : value?.isfromDate != null
                      ? appColor.bgBlack
                      : appColor.placeHolderText,
                  }}>
                  {singleSelection
                    ? value && value != null
                      ? formatedDate(value)
                      : 'select Date'
                    : value.isfromDate != null && value.isendDate != null
                    ? `${formatedDate(value?.isfromDate)} - ${formatedDate(
                        value?.isendDate, //BN
                      )}`
                    : value?.isfromDate != null
                    ? formatedDate(value?.isfromDate)
                    : maxDate != Infinity &&
                      maxDate > 0 &&
                      value != '' &&
                      value.length > 0
                    ? `${formatedDate(value.split(' - ')[0])} - ${formatedDate(
                        value.split(' - ')[1],
                      )}`
                    : 'Select Date'}
                </Text>
              }
            </Text>
          </View>

          <Icon
            ComponentName={'MaterialCommunityIcons'}
            name={'calendar-month-outline'}
            size={widthResponse ? 20 : 30}
            color={dark ? appColor.bgWhite : appColor.bgBlack}
          />
        </Pressable>
        {children && (
          <Pressable onPress={() => setModalVisible(true)}>
            {children}
          </Pressable>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={modalVisible}
        backdropColor={appColor.overlayBg}
        onBackdropPress={() => {
          if (maxDate == Infinity) {
            setModalVisible(false);
            setValidDate(false);
          } else if (maxDate != Infinity) {
            if (Object.keys(dates.MarkedDates).length != maxDate) {
              onChange({
                isfromDate: null,
                isendDate: null,
                MarkedDates: {},
              });
              setModalVisible(false);
              setValidDate(false);
            } else if (Object.keys(dates.MarkedDates).length == maxDate) {
              setModalVisible(false);
              setValidDate(false);
            }
          }
        }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        backdropOpacity={1}>
        <View
          style={{
            width: scrnWidth - 40,
            height:
              (singleSelection && validDate && dates.isfromDate == null) ||
              (dates.isfromDate != null &&
                maxDate != Infinity &&
                Object.keys(dates.MarkedDates).length != maxDate) ||
              (!singleSelection && validDate && dates.isendDate == null)
                ? fontScalling(widthResponse ? 63 : 45)
                : fontScalling(widthResponse ? 60 : 43),
            // alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColor.white,
            borderRadius: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              position: 'absolute',
              width: scrnWidth - 80,
              top: 20,
              zIndex: 1000,
            }}>
            <Text
              style={{
                fontFamily: appFont.bB,
                color: appColor.bgBlack,
                fontSize: fontScalling(3),
              }}>
              SELECT DATE
            </Text>
            <Pressable
              onPress={() => {
                if (maxDate == Infinity) {
                  setModalVisible(false);
                  setValidDate(false);
                } else if (maxDate != Infinity) {
                  if (Object.keys(dates.MarkedDates).length != maxDate) {
                    onChange({
                      isfromDate: null,
                      isendDate: null,
                      MarkedDates: {},
                    });
                    setModalVisible(false);
                    setValidDate(false);
                  } else if (Object.keys(dates.MarkedDates).length == maxDate) {
                    setModalVisible(false);
                    setValidDate(false);
                  }
                }
              }}>
              <Icon
                ComponentName={'AntDesign'}
                name={'close'}
                size={25}
                color={appColor.bgBlack}
              />
            </Pressable>
          </View>

          <CalendarList
            horizontal={true}
            hideArrows={false}
            scrollEnabled={false}
            current={formattedNextDay}
            enableSwipeMonths={true}
            calendarStyle={{
              borderRadius: 15,
              backgroundColor: appColor.bgWhite,
              paddingVertical: 10,
              paddingTop: 50,
              // justifyContent: 'center',
            }}
            calendarWidth={scrnWidth - 40}
            theme={{
              backgroundColor: appColor.bgWhite,
              calendarBackground: 'transparent',
              selectedDayBackgroundColor: appColor.bgBlack,
              arrowColor: appColor.white,
              arrowHeight: 150,
              arrowWidth: 150,
              arrowStyle: {
                backgroundColor: appColor.bgBlack,
                borderRadius: 10,
                cursor: 'pointer',
              },

              selectedDotColor: appColor.themeYellow,
              selectedDayTextColor: appColor.white,
              monthTextColor: appColor.textBlack,
              monthFontFamily: appFont.bB,
              monthFontSize: fontScalling(2.5),
              textInactiveColor: appColor.Textlightblack,
              textDisabledColor: appColor.Textlightblack,
              textMonthFontFamily: appFont.bB,
              textMonthFontSize: fontScalling(2.5),
              textSectionTitleDisabledColor: appColor.textBlack,
              dayTextColor: appColor.textBlack,
              textSectionTitleColor: appColor.textBlack,

              'stylesheet.calendar.header': {
                dayTextAtIndex0: {
                  color: appColor.greyBg,
                  backgroundColor: appColor.lightYellow,
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  borderRadius: 10,
                },
              },
            }}
            firstDay={7}
            markingType="period"
            markedDates={dates.MarkedDates}
            onDayPress={onDayPress}
            minDate={formatedMinDate}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 15,
              width: '100%',
              paddingHorizontal: 15,
            }}>
            <View style={{alignSelf: 'center', paddingBottom: 5}}>
              {!singleSelection && validDate && dates.isendDate == null && (
                <Text
                  style={{
                    color: appColor.ToastError,
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(2),
                  }}>
                  {dates.isfromDate == null && dates.isendDate == null
                    ? 'Please choose Dates'
                    : 'Please choose end Date'}
                </Text>
              )}
              {singleSelection && validDate && dates.isfromDate == null && (
                <Text
                  style={{
                    color: appColor.ToastError,
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(2),
                  }}>
                  Please choose Dates
                </Text>
              )}
              {dates.isfromDate != null &&
                maxDate != Infinity &&
                Object.keys(dates.MarkedDates).filter(
                  date => !holidayDates.includes(date),
                ).length != maxDate && (
                  <Text
                    style={{
                      color: appColor.ToastError,
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(2),
                    }}>
                    {`Insufficient days: only ${maxDate} days available.`}
                  </Text>
                )}
            </View>
            <PrimaryButton
              onPress={() => {
                setValidDate(true);
                singleSelection
                  ? onChange(singleDaySelection)
                  : onChange(
                      maxDate != Infinity && maxDate > 0
                        ? customPlanSelection
                        : dates,
                    );
                if (!singleSelection) {
                  onPress();
                  if (
                    Object.keys(dates.MarkedDates).filter(
                      date => !holidayDates.includes(date),
                    ).length == maxDate
                  ) {
                    setTimeout(() => {
                      setDates({
                        isfromDate: null,
                        isendDate: null,
                        MarkedDates: {},
                      });
                    }, 2000);
                  }
                }
                if (dates.isfromDate != null && dates.isendDate !== null) {
                  if (maxDate == Infinity) {
                    setModalVisible(false);
                  } else if (maxDate != Infinity) {
                    if (
                      Object.keys(dates.MarkedDates).filter(
                        date => !holidayDates.includes(date),
                      ).length == maxDate
                    ) {
                      setModalVisible(false);
                    }
                  }
                }
                if (singleSelection && dates.isfromDate != null) {
                  setModalVisible(false);
                }
              }}
              Title={'OK'}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DatePick;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      lineHeight: fontScalling(2.2),
      color: appColor.textBlack,
    },
  });

  return {styles};
};
