let lastWatchId = 0;

export default {
  watchPosition: jest.fn(() => lastWatchId++),
  clearWatch: jest.fn(),
};
