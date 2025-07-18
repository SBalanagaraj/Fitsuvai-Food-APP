import React, {useMemo, useRef, useCallback, useEffect} from 'react';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import * as Animatable from 'react-native-animatable';
import {BackHandler, View} from 'react-native';

const ModalBottomSheet = ({
  children,
  snapPoints,
  SheetStyle,
  isVisible,
  close,
  chatbot,
  indicateStyle,
}) => {
  const bottomSheetModalRef = useRef(null);

  const appColor = appColors();

  // Backdrop close:
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        enableTouchThrough={true}
        pressBehavior={'close'}
      />
    ),
    [],
  );

  //---------bottom sheet handlers--------//
  const handleModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  // modal Toggle:
  useEffect(() => {
    if (isVisible) {
      handleModalPress();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleCloseModalPress();
          return true;
        },
      );
      return () => backHandler.remove();
    } else {
      handleCloseModalPress();
    }
  }, [isVisible]);

  return (
    <>
      {/* {isVisible && !chatbot && (
        <Animatable.View
          animation={'zoomIn'}
          duration={2000}
          onTouchEnd={() => {
            close();
          }}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            bottom: snapPoints[1],
            marginBottom: 66,
            zIndex: 100,
            elevation: 0.3,
            shadowOffset: 2,
          }}>
          <Icon
            ComponentName={'AntDesign'}
            name={'closecircle'}
            size={40}
            color={appColor.black}
          />
        </Animatable.View>
      )} */}
      <BottomSheetModal
        enableDismissOnClose={true}
        ref={bottomSheetModalRef}
        backgroundStyle={{
          backgroundColor: chatbot ? 'transparent' : appColor.bgWhite,
        }}
        index={1}
        snapPoints={useMemo(() => snapPoints, [])}
        style={[{}, SheetStyle]}
        handleIndicatorStyle={[
          {borderRadius: 30, width: chatbot ? 0 : '30%'},
          indicateStyle,
        ]}
        enablePanDownToClose={true}
        onDismiss={close}
        backdropComponent={renderBackdrop}>
        {children}
      </BottomSheetModal>
    </>
  );
};

export default ModalBottomSheet;
