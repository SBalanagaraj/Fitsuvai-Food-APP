import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import appColors from '../../utilities/appColors';

const ReadMore = ({
  numOfLine = 4,
  content,
  contentStyle,
  parentStyle,
  readStyle,
}) => {
  const appColor = appColors();
  const [expand, setExpand] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(undefined);

  // onTextLayout:
  const onTextLayout = useCallback(
    async e => {
      if (e.nativeEvent.lines.length > numOfLine && !showMoreBtn) {
        setShowMoreBtn(true);
        setNumberOfLines(numOfLine);
      }
    },
    [showMoreBtn],
  );
  return (
    <View style={[parentStyle]}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={numberOfLines}
        style={[contentStyle]}>
        {content}
      </Text>
      {showMoreBtn && (
        <TouchableOpacity
          onPress={() => {
            setExpand(!expand);
            setNumberOfLines(!expand ? undefined : numOfLine);
          }}
          style={[
            {
              //   marginLeft: 'auto',
              position: expand ? 'relative' : 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: appColor.greyBg,
            },
          ]}>
          <Text
            style={[
              contentStyle,
              {
                color: appColor.inputBackDark,
              },
              readStyle,
            ]}>
            {!expand && '... '}
            <Text style={{textDecorationLine: 'underline'}}>
              {expand ? 'ReadLess' : 'ReadMore'}
            </Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReadMore;
