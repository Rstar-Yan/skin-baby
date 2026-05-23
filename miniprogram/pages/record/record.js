const mock = require('../../utils/mock-data.js');

Page({
  data: {
    triggerCategories: [],
    selectedAreas: [],
    selectedTriggers: [],
    customTrigger: '',
    itchScore: 6
  },
  onLoad() {
    this.setData({
      triggerCategories: mock.triggerCategories
    });
  },
  onTakePhoto() {
    wx.showToast({ title: '模拟拍照完成', icon: 'none' });
  },
  onAreaSelect(e) {
    const areas = e.detail.areas;
    this.setData({ selectedAreas: areas });
  },
  onItchChange(e) {
    this.setData({ itchScore: e.detail.score });
  },
  onTriggerToggle(e) {
    const { catId, tag } = e.currentTarget.dataset;
    const selected = this.data.selectedTriggers;
    const key = `${catId}:${tag}`;
    const idx = selected.indexOf(key);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(key);
    }
    this.setData({ selectedTriggers: selected });
  },
  onCustomInput(e) {
    this.setData({ customTrigger: e.detail.value });
  },
  onSave() {
    const count = this.data.selectedTriggers.length;
    const msg = count > 0 ? `✅ 已保存症状 + ${count}个诱因` : '✅ 记录已保存（未标记诱因）';
    wx.showToast({ title: msg, icon: 'none' });
    setTimeout(() => {
      wx.switchTab({ url: '/pages/home/home' });
    }, 1500);
  }
});