const mock = require('../../utils/mock-data.js');

Page({
  data: {
    trendTab: 'week',
    weekData: {},
    monthData: {},
    calendar: []
  },
  onLoad() {
    this.setData({
      weekData: mock.itchTrendWeek,
      monthData: mock.itchTrendMonth
    });
    this.buildCalendar(mock.medicationCalendar);
  },
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ trendTab: tab });
  },
  buildCalendar(cal) {
    const rows = [];
    const medSet = new Set(cal.medDays);
    let row = [];
    // fill leading empty cells
    for (let i = 0; i < cal.startDay; i++) {
      row.push({ empty: true });
    }
    for (let d = 1; d <= cal.totalDays; d++) {
      const item = {
        day: d,
        today: d === cal.today,
        med: medSet.has(d),
        empty: false
      };
      row.push(item);
      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
    }
    if (row.length > 0) rows.push(row);
    this.setData({ calendar: rows });
  },

  // canvas 绘制折线图
  onChartReady(canvasId, dataPoints) {
    const query = wx.createSelectorQuery();
    query.select('#' + canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const w = res[0].width;
        const h = res[0].height;
        const padLeft = 50, padRight = 20, padTop = 10, padBottom = 30;
        const plotW = w - padLeft - padRight;
        const plotH = h - padTop - padBottom;

        ctx.clearRect(0, 0, w, h);

        // 网格线
        ctx.strokeStyle = '#E8ECF0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const y = padTop + (plotH / 4) * i;
          ctx.beginPath();
          ctx.moveTo(padLeft, y);
          ctx.lineTo(w - padRight, y);
          ctx.stroke();
        }

        // Y轴刻度
        ctx.fillStyle = '#9AA0A6';
        ctx.font = '10px -apple-system';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
          const val = Math.round(10 - i * 2.5);
          const y = padTop + (plotH / 4) * i;
          ctx.fillText(val, padLeft - 6, y + 4);
        }

        if (dataPoints.length === 0) return;

        const maxScore = 10;
        const stepX = plotW / Math.max(dataPoints.length - 1, 1);

        // 面积填充
        ctx.beginPath();
        ctx.moveTo(padLeft, padTop + plotH);
        dataPoints.forEach((pt, i) => {
          const x = padLeft + stepX * i;
          const y = padTop + plotH - (pt.score / maxScore) * plotH;
          if (i === 0) ctx.lineTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.lineTo(padLeft + stepX * (dataPoints.length - 1), padTop + plotH);
        ctx.closePath();
        ctx.fillStyle = 'rgba(74,144,217,0.12)';
        ctx.fill();

        // 折线
        ctx.beginPath();
        ctx.strokeStyle = '#4A90D9';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        dataPoints.forEach((pt, i) => {
          const x = padLeft + stepX * i;
          const y = padTop + plotH - (pt.score / maxScore) * plotH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // 数据点
        dataPoints.forEach((pt, i) => {
          const x = padLeft + stepX * i;
          const y = padTop + plotH - (pt.score / maxScore) * plotH;
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          ctx.strokeStyle = '#4A90D9';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // X轴标签
          ctx.fillStyle = '#9AA0A6';
          ctx.font = '9px -apple-system';
          ctx.textAlign = 'center';
          ctx.fillText(pt.label, x, padTop + plotH + 18);
        });
      });
  },

  onWeekChartReady() {
    this.onChartReady('weekChart', this.data.weekData.days);
  },
  onMonthChartReady() {
    const dataPoints = this.data.monthData.dates.map(d => ({ label: d.label, score: d.score }));
    this.onChartReady('monthChart', dataPoints);
  }
});