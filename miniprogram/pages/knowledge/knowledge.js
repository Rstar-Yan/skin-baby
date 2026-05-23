const mock = require('../../utils/mock-data.js');

Page({
  data: {
    sections: []
  },
  onLoad() {
    const articles = mock.knowledgeArticles;
    const cats = ['beginner', 'daily', 'trigger', 'acute'];
    const sections = [];
    cats.forEach(cat => {
      const items = articles.filter(a => a.category === cat);
      if (items.length > 0) {
        sections.push({
          category: cat,
          categoryName: items[0].categoryName,
          dotColor: items[0].dotColor,
          items
        });
      }
    });
    this.setData({ sections });
  },
  onArticleTap(e) {
    const title = e.currentTarget.dataset.title;
    wx.showToast({ title: '打开：' + title, icon: 'none' });
  }
});