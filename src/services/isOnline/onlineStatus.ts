import axios from 'axios';
import { userToken } from '../authentication';

export type ProfileStatus = {
  profileId: string;
  isOnline: boolean;
};

// TODO convert to useAxios hook
const postOnlineStatus = async (profileId: string): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    const config = await requestConfig();
    try {
      await axios.post(`is-online/status/${profileId}`, {}, config);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const requestConfig = async () => {
  const token = await userToken(false);
  return { headers: { Authorization: `Bearer ${token}` } };
};

export { postOnlineStatus };
