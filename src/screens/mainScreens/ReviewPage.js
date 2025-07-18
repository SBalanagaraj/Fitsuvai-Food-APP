import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import ToggleButton from '../../components/Buttons/ToggleButtons';
import appColors from '../../utilities/appColors';
import MainCard from '../../components/Card/MainCard';
import PendingList from './PendingList';
import PublishedList from './PublishedList';
import {useSelector} from 'react-redux';
import {url} from '../../utilities/appApi';
import {useIsFocused} from '@react-navigation/native';
import {useShowToast} from '../../components/Toast/ToastAlert';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import {fontScalling, scrnWidth} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Pressable} from 'react-native';

function ReviewPage() {
  const appColor = appColors();
  const [selection, setSelection] = useState(1);
  const [pending, setPending] = useState([]);
  const [publish, setPublish] = useState([]);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {userSettings} = useSelector(state => state.setting);
  const isFocus = useIsFocused();
  const showToast = useShowToast();
  const [deleteModal, setdeleteModal] = useState(false);
  const [reviewId, setReviewId] = useState('');

  const deleteAnimRef = useRef(null);

  const pullRefresh = useCallback(() => {
    setRefresh(true);
    apiCall();
  }, []);

  // api
  const apiCall = async () => {
    setLoad(true);
    if (
      userSettings &&
      userSettings.userInfo &&
      userSettings.userInfo.user_id
    ) {
      try {
        // request data for backend:
        const formdata = new FormData();
        formdata.append('userId', userSettings.userInfo.user_id);
        formdata.append('context', 'myReview');
        var requestOptions = {
          method: 'POST',
          body: formdata,
        };
        // get the response:
        const response = await fetch(url().reviewApi, requestOptions);
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
            setSelection(1);
            if (resparse.pending) {
              setPending(resparse.pending);
            }
            if (resparse.publish) {
              setPublish(resparse.publish);
            }
            // showToast('success', '', resparse.message, 2000);
          }
        } else {
          print(response.status, 'status in home screen');
        }
        setLoad(false);
        setRefresh(false);
      } catch (e) {
        console.log(e, 'error in home screen');
        setRefresh(false);
        setLoad(false);
      }
    }
  };

  // delete api
  const deleteApi = async reviewId => {
    try {
      // request data for backend:
      const formdata = new FormData();
      formdata.append('id', reviewId);
      formdata.append('context', 'deleteReview');
      var requestOptions = {
        method: 'POST',
        body: formdata,
      };
      // get the response:
      const response = await fetch(url().reviewApi, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          deleteAnimRef?.current.play(0, 150);
          showToast('info', '', resparse.message, 2000);
          setTimeout(() => {
            setdeleteModal(false);
          }, 1500);
          setTimeout(() => {
            apiCall();
          }, 2500);
        }
      } else {
        print(response.status, 'status in home screen');
      }
    } catch (e) {
      console.log(e, 'error in home screen');
      setRefresh(false);
      setLoad(false);
    }
  };

  useEffect(() => {
    (() => {
      apiCall();
    })();
  }, [isFocus]);

  const switchSelection = select => {
    setSelection(select);
  };

  function deleteButton(id) {
    setReviewId(id);
    setdeleteModal(true);
  }

  return (
    <MainCard>
      {load ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <ActivityIndicator color={appColor.themeYellow} size={35} />
        </View>
      ) : (
        <View style={{paddingVertical: 13, paddingBottom: 210}}>
          <ToggleButton
            switchOne="Pending"
            switchTwo="Published"
            activeSwitch={selection}
            onSelect={switchSelection}
          />
          <View>
            <View>
              {selection == 1 && (
                <PendingList
                  data={pending}
                  load={load}
                  // editFn={editReview}
                  refresh={refresh}
                  deleteFn={deleteButton}
                  pullRefresh={pullRefresh}
                />
              )}
              {selection == 2 && (
                <PublishedList
                  data={publish}
                  load={load}
                  refresh={refresh}
                  pullRefresh={pullRefresh}
                />
              )}
            </View>
          </View>
          <View style={{height: 80}}></View>
          {/* -------delete modal--------- */}
          <Modal
            animationType="slide"
            onBackdropPress={() => setdeleteModal(!deleteModal)}
            backdropColor={appColor.overlayBg}
            backdropOpacity={1}
            transparent={true}
            isVisible={deleteModal}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
              width: scrnWidth / 1,
              marginHorizontal: 'auto',
            }}>
            <View
              style={{
                backgroundColor: appColor.white,
                paddingHorizontal: 15,
                paddingBottom: 25,
                borderRadius: 5,
                alignItems: 'center',
                paddingTop: 0,
              }}>
              <LottieView
                ref={deleteAnimRef}
                resizeMode="contain"
                style={{
                  width: scrnWidth / 2,
                  height: scrnWidth / 2.5,
                  marginTop: -35,
                }}
                source={require('../../../assets/lottieFiles/trash_1.json')}
                loop={false}
              />
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(2.1),
                  color: appColor.textBlack,
                  paddingBottom: 10,
                }}>
                Are you sure you want to delete?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Pressable
                  onPress={() => {
                    setdeleteModal(!deleteModal);
                  }}
                  style={{
                    backgroundColor: appColor.black,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.rB,
                      fontSize: fontScalling(1.5),
                      color: appColor.white,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                    no
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    deleteApi(reviewId);
                  }}
                  style={{
                    backgroundColor: appColor.themeYellow,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginLeft: 15,
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.rB,
                      fontSize: fontScalling(1.5),
                      color: appColor.white,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                    yes
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </MainCard>
  );
}

export default ReviewPage;
