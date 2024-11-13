import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAxios } from '../../util/useAxios';
import moment from 'moment';
import { ASYNC_STORAGE_KEYS } from '../../constants';

export const useChatTokenSelector = () => {
  const [, getChatTokenExternal] = useAxios({
    url: 'conversation/chat-token',
    method: 'GET',
    initial: false,
  });

  const fetchTokenFromExternal = async (): Promise<string | undefined> => {
    try {
      const newToken = await getChatTokenExternal().then((result) => {
        return result.response.data;
      });
      return newToken;
    } catch (e) {
      return undefined;
    }
  };

  const updateNewToken = async (): Promise<string | undefined> => {
    const newToken = await fetchTokenFromExternal();
    if (newToken) {
      await saveStoredChatToken(newToken);
    }
    return newToken;
  };

  const fetchToken = async (): Promise<string | undefined> => {
    const storedToken = await getStoredChatToken();

    if (!storedToken) {
      return updateNewToken();
    }

    if (isTokenExpired(storedToken.timestamp)) {
      return updateNewToken();
    } else {
      return storedToken.token;
    }
  };

  return { fetchToken };
};

const isTokenExpired = (timestamp: string): boolean => {
  try {
    if (moment().diff(moment(timestamp), 'days', true) > 2.0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return true;
  }
};

// FIXME: try to use https://github.com/oblador/react-native-keychain
const getStoredChatToken = async (): Promise<{
  token: string;
  timestamp: string;
} | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('CHAT_TOKEN');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};

// FIXME: try to use https://github.com/oblador/react-native-keychain
const saveStoredChatToken = async (token: string): Promise<void> => {
  return AsyncStorage.setItem(
    ASYNC_STORAGE_KEYS.CHAT_TOKEN,
    JSON.stringify({
      token: token,
      timestamp: new Date(),
    }),
  );
};
