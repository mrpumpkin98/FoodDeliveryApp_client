import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import orderSlice, {Order} from '../slices/order';
import {useCallback, useState} from 'react';
import {useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import EncryptedStorage from 'react-native-encrypted-storage/lib/typescript/EncryptedStorage';

function EachOrder({item}: {item: Order}) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const toggleDetail = useCallback(() => {
    setDetail(prev => !prev);
  }, []);

  const onAccept = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/accept`,
        {orderId: item.orderId},
        {headers: {authorization: `Bearer ${accessToken}`}},
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      navigation.navigate('Delivery');
      setLoading(false);
    } catch (error) {
      let errorResponse = (error as AxiosError).response;
      if (errorResponse?.status === 400) {
        // 타인이 이미 수락한 경우
        Alert.alert('알림', errorResponse?.data?.message);
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
      }
      if (errorResponse?.status === 419) {
        // 토큰 재발급하는 코드
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${refreshToken}`,
            },
          },
        );
        await axios.post(
          `${Config.API_URL}/accept`,
          {orderId: item.orderId},
          {
            headers: {
              authorization: `Bearer ${response.data.data.accessToken}`,
            },
          },
        );
      }
    } finally {
      setLoading(true);
    }

    dispatch(orderSlice.actions.acceptOrder(item.orderId));
  }, [accessToken, navigation, dispatch, item.orderId]);

  const onReject = useCallback(async () => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item.orderId]);

  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text>삼성동</Text>
        <Text>왕심리동</Text>
      </Pressable>
      {detail ? (
        <View>
          <View>
            <Text>네이버맵이 들어갈 장소</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={onAccept}
              disabled={loading}
              style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable
              onPress={onReject}
              disabled={loading}
              style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
      {detail}
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eachInfo: {},
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EachOrder;
