const mock = require('../../utils/mock-data.js');

Page({
  data: {
    userInfo: {},
    todayStatus: {},
    recentRecords: [],
    triggerInsight: {}
  },
  onLoad() {
    this.setData({
      userInfo: mock.userInfo,
      todayStatus: mock.todayStatus,
      recentRecords: mock.recentRecords,
      triggerInsight: mock.triggerInsight
    });
  },
  onMoisturize() {
    const s = this.data.todayStatus;
    if (s.moisturizing.current >= s.moisturizing.target) {
      wx.showToast({ title: '今日润肤已完成', icon: 'none' });
      return;
    }
    s.moisturizing.current++;
    s.moisturizing.done = s.moisturizing.current >= s.moisturizing.target;
    this.setData({ todayStatus: s });
    wx.showToast({ title: '润肤打卡成功', icon: 'success' });
  },
  onQuickRecord() {
    wx.switchTab({ url: '/pages/record/record' });
  },
  onViewTrends() {
    wx.switchTab({ url: '/pages/trends/trends' });
  }
});