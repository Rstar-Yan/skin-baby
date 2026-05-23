App({
  globalData: {
    userInfo: null,
    currentDate: '2026-05-23'
  },
  onLaunch() {
    const mock = require('./utils/mock-data.js');
    this.globalData.userInfo = mock.userInfo;
    this.globalData.mockData = mock;
  }
});