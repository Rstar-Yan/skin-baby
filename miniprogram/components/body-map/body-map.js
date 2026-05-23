const mock = require('../../utils/mock-data.js');

Component({
  data: {
    dots: [],
    selectedIds: []
  },
  lifetimes: {
    attached() {
      this.setData({ dots: mock.bodyAreas });
    }
  },
  methods: {
    onDotTap(e) {
      const id = e.currentTarget.dataset.id;
      const selectedIds = [...this.data.selectedIds];
      const idx = selectedIds.indexOf(id);
      if (idx >= 0) {
        selectedIds.splice(idx, 1);
      } else {
        selectedIds.push(id);
      }
      this.setData({ selectedIds });

      // 去重提取区域名
      const areas = [];
      const seen = new Set();
      selectedIds.forEach(sid => {
        const dot = this.data.dots.find(d => d.id === sid);
        if (dot && !seen.has(dot.name)) {
          seen.add(dot.name);
          areas.push(dot.name);
        }
      });
      this.triggerEvent('areaselect', { areas });
    }
  }
});