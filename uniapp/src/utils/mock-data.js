// 肤小宝 Mock 数据 (uni-app Vue3 版本)

export const userInfo = {
  name: '小贝壳',
  gender: '男',
  age: '2岁3个月',
  diagnosis: '2024年1月确诊AD',
  avatar: '👶'
}

// 今日护理状态
export const todayStatus = {
  date: '2026-05-23',
  moisturizing: { current: 1, target: 2, done: false },
  itchScore: 6,
  medication: { taken: true, time: '08:30' },
  photoTaken: false,
  environment: { city: '上海', temp: 26, humidity: 38 }
}

// 最近记录缩略图
export const recentRecords = [
  { date: '05.23', area: '手臂', icon: '📸' },
  { date: '05.22', area: '膝盖窝', icon: '📸' },
  { date: '05.21', area: '面部', icon: '📸' },
  { date: '05.20', area: '手肘', icon: '📸' }
]

// 诱因分类及标签
export const triggerCategories = [
  {
    id: 'food',
    icon: '🍎',
    name: '饮食',
    tags: ['牛奶', '鸡蛋', '海鲜', '坚果', '芒果', '小麦', '新辅食']
  },
  {
    id: 'clothing',
    icon: '👕',
    name: '衣物',
    tags: ['羊毛', '化纤', '新衣未洗', '不透气面料']
  },
  {
    id: 'environment',
    icon: '🌿',
    name: '环境',
    tags: ['花粉', '雾霾', '宠物毛屑', '尘螨']
  },
  {
    id: 'skincare',
    icon: '🧴',
    name: '洗护',
    tags: ['新沐浴露', '新洗衣液', '新润肤霜']
  },
  {
    id: 'other',
    icon: '📋',
    name: '其他',
    tags: ['情绪激动', '出汗', '疫苗', '感冒发烧']
  }
]

// 本月可疑诱因
export const triggerInsight = {
  trigger: '化纤衣物',
  count: 3,
  description: '化纤衣物被标记3次，均伴随瘙痒加重',
  level: 'high' // high / medium / low
}

// 瘙痒评分本周数据
export const itchTrendWeek = {
  highest: 7.8,
  average: 4.3,
  lowest: 2,
  days: [
    { label: '六', date: '05/17', score: 3 },
    { label: '日', date: '05/18', score: 5 },
    { label: '一', date: '05/19', score: 6.5 },
    { label: '二', date: '05/20', score: 5 },
    { label: '三', date: '05/21', score: 7.8 },
    { label: '四', date: '05/22', score: 4 },
    { label: '五', date: '05/23', score: 6 }
  ]
}

// 瘙痒评分本月数据
export const itchTrendMonth = {
  highest: 8,
  average: 4.1,
  lowest: 1,
  dates: [
    { label: '5/1', score: 2.5 },
    { label: '5/5', score: 4 },
    { label: '5/10', score: 5.5 },
    { label: '5/15', score: 3 },
    { label: '5/16', score: 6 },
    { label: '5/17', score: 3 },
    { label: '5/18', score: 5 },
    { label: '5/19', score: 6.5 },
    { label: '5/20', score: 5 },
    { label: '5/21', score: 8 },
    { label: '5/22', score: 4 },
    { label: '5/23', score: 6 }
  ]
}

// 用药日历（2026年5月）
export const medicationCalendar = {
  year: 2026,
  month: 5,
  startDay: 5, // 0=Sun, 5=Fri
  totalDays: 31,
  today: 23,
  medDays: [2, 3, 4, 5, 8, 9, 10, 15, 16, 17, 22, 23]
}

// 知识库文章
export const knowledgeArticles = [
  // L1: 新手入门
  {
    id: 'k1',
    category: 'beginner',
    categoryName: '新手入门',
    dotColor: '#4A90D9',
    icon: '📖',
    iconBg: 'bg-blue-soft',
    title: '什么是特应性皮炎？',
    desc: '了解AD的病因、症状与诊断标准'
  },
  {
    id: 'k2',
    category: 'beginner',
    categoryName: '新手入门',
    dotColor: '#4A90D9',
    icon: '🧴',
    iconBg: 'bg-blue-soft',
    title: '皮肤屏障与润肤的重要性',
    desc: '为什么每天涂润肤剂是治疗的基础'
  },
  {
    id: 'k3',
    category: 'beginner',
    categoryName: '新手入门',
    dotColor: '#4A90D9',
    icon: '💊',
    iconBg: 'bg-blue-soft',
    title: '正确认识激素药膏',
    desc: '外用激素的安全用法与常见误区'
  },
  // L2: 日常养护
  {
    id: 'k4',
    category: 'daily',
    categoryName: '日常养护',
    dotColor: '#52B788',
    icon: '🌸',
    iconBg: 'bg-green-soft',
    title: '四季护理要点',
    desc: '春夏秋冬不同季节的护理策略'
  },
  {
    id: 'k5',
    category: 'daily',
    categoryName: '日常养护',
    dotColor: '#52B788',
    icon: '🛁',
    iconBg: 'bg-green-soft',
    title: '洗澡、穿衣有讲究',
    desc: '水温、频率、衣物材质与款式建议'
  },
  {
    id: 'k6',
    category: 'daily',
    categoryName: '日常养护',
    dotColor: '#52B788',
    icon: '🍎',
    iconBg: 'bg-green-soft',
    title: '辅食添加注意事项',
    desc: '如何科学添加辅食并观察过敏反应'
  },
  // L3: 常见诱因排查
  {
    id: 'k7',
    category: 'trigger',
    categoryName: '常见诱因排查',
    dotColor: '#D4A843',
    icon: '👕',
    iconBg: 'bg-amber-soft',
    title: '衣物材质与AD的关系',
    desc: '羊毛、化纤、新衣服不洗——哪些是隐形杀手？'
  },
  {
    id: 'k8',
    category: 'trigger',
    categoryName: '常见诱因排查',
    dotColor: '#D4A843',
    icon: '🥛',
    iconBg: 'bg-amber-soft',
    title: '食物过敏排查表',
    desc: '八大常见过敏原逐一排除法'
  },
  {
    id: 'k9',
    category: 'trigger',
    categoryName: '常见诱因排查',
    dotColor: '#D4A843',
    icon: '🌿',
    iconBg: 'bg-amber-soft',
    title: '环境因素自查清单',
    desc: '花粉、尘螨、宠物、新装修——一表自测'
  },
  {
    id: 'k10',
    category: 'trigger',
    categoryName: '常见诱因排查',
    dotColor: '#D4A843',
    icon: '🧴',
    iconBg: 'bg-amber-soft',
    title: '洗护产品成分避坑指南',
    desc: '哪些成分可能刺激AD皮肤？怎么选才安全'
  },
  // L4: 急性期处理
  {
    id: 'k11',
    category: 'acute',
    categoryName: '急性期处理',
    dotColor: '#D9534F',
    icon: '🏥',
    iconBg: 'bg-red-soft',
    title: '出现这些情况请立即就医',
    desc: '识别需要紧急处理的危险信号'
  },
  {
    id: 'k12',
    category: 'acute',
    categoryName: '急性期处理',
    dotColor: '#D9534F',
    icon: '💧',
    iconBg: 'bg-red-soft',
    title: '湿包疗法怎么做？',
    desc: '急性加重期的有效家庭护理方法'
  },
  {
    id: 'k13',
    category: 'acute',
    categoryName: '急性期处理',
    dotColor: '#D9534F',
    icon: '🧊',
    iconBg: 'bg-red-soft',
    title: '6个安全止痒小技巧',
    desc: '冷敷、拍打替代抓挠，减少皮肤损伤'
  }
]

// AD常见部位（13个）
export const bodyAreas = [
  { id: 'top_head', name: '头顶', cx: 100, cy: 18 },
  { id: 'face_l', name: '面部', cx: 85, cy: 28 },
  { id: 'face_r', name: '面部', cx: 115, cy: 28 },
  { id: 'neck', name: '颈部', cx: 100, cy: 55 },
  { id: 'trunk', name: '躯干', cx: 100, cy: 90 },
  { id: 'elbow_l', name: '手肘', cx: 44, cy: 118 },
  { id: 'elbow_r', name: '手肘', cx: 156, cy: 118 },
  { id: 'wrist_l', name: '手腕', cx: 36, cy: 155 },
  { id: 'wrist_r', name: '手腕', cx: 164, cy: 155 },
  { id: 'knee_l', name: '膝盖', cx: 88, cy: 195 },
  { id: 'knee_r', name: '膝盖', cx: 112, cy: 195 },
  { id: 'ankle_l', name: '脚踝', cx: 80, cy: 240 },
  { id: 'ankle_r', name: '脚踝', cx: 120, cy: 240 }
]