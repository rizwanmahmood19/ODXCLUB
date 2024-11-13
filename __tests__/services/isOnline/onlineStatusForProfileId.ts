import axios from 'axios';
import { postOnlineStatus } from '../../../src/services/isOnline/onlineStatus';

beforeAll(() => {
  return jest.mock('axios');
});

test('test postOnlineStatuson success', async () => {
  axios.post = jest.fn().mockResolvedValue(undefined);
  expect.assertions(1);
  await expect(postOnlineStatus('x')).resolves.toEqual(undefined);
});

test('test postOnlineStatus on error', async () => {
  axios.post = jest.fn().mockRejectedValue(new Error('postOnlineStatus error'));
  expect.assertions(1);
  await expect(postOnlineStatus('x')).rejects.toThrow('postOnlineStatus error');
});
