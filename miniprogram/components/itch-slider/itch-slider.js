Component({
  properties: {
    score: {
      type: Number,
      value: 6
    }
  },
  data: {
    thumbLeft: '60%',
    descText: '中度瘙痒，建议冷敷缓解',
    descClass: 'mild'
  },
  observers: {
    'score': function(val) {
      this.updateUI(val || 0);
    }
  },
  lifetimes: {
    attached() {
      this.updateUI(this.properties.score);
    }
  },
  methods: {
    onRailTap(e) {
      const rect = this.getRailRect();
      if (!rect) return;
      const pct = (e.detail.x - rect.left) / rect.width;
      this.setScoreByPct(pct);
    },
    onThumbMove(e) {
      const rect = this.getRailRect();
      if (!rect) return;
      const pct = (e.detail.x - rect.left) / rect.width;
      this.setScoreByPct(pct);
    },
    getRailRect() {
      const query = this.createSelectorQuery();
      return new Promise((resolve) => {
        query.select('.slider-rail').boundingClientRect(res => resolve(res)).exec();
      });
    },
    setScoreByPct(pct) {
      let p = Math.max(0, Math.min(1, pct));
      const score = Math.round(p * 10);
      this.setData({ score: score });
      this.updateUI(score);
      this.triggerEvent('scorechange', { score });
    },
    updateUI(score) {
      const left = (score / 10 * 100) + '%';
      let descText, descClass;
      if (score <= 2) {
        descText = '基本不痒，继续保持';
        descClass = 'none';
      } else if (score <= 5) {
        descText = '轻度瘙痒，日常润肤即可';
        descClass = 'mild';
      } else if (score <= 7) {
        descText = '中度瘙痒，建议冷敷缓解';
        descClass = 'mild';
      } else {
        descText = '重度瘙痒，请考虑就医';
        descClass = 'severe';
      }
      this.setData({ thumbLeft: left, descText, descClass });
    }
  }
});