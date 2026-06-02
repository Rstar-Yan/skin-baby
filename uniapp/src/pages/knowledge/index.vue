<template>
  <view class="page-knowledge">
    <view v-if="loading" class="loading-mask">
      <text class="loading-text">加载中...</text>
    </view>

    <template v-for="section in sections" :key="section.category">
      <view class="k-section">
        <view class="k-section-title">
          <view class="k-dot" :style="{ background: section.dotColor }"></view>
          <text>{{ section.categoryName }}（{{ section.items.length }}）</text>
        </view>

        <view
          v-for="article in section.items"
          :key="article._id"
          class="k-card"
          @click="onArticleTap(article._id)"
        >
          <view class="k-card-icon" :class="'icon-' + article.category">
            <text>{{ article.icon }}</text>
          </view>
          <view class="k-card-info">
            <text class="k-title">{{ article.title }}</text>
            <text class="k-desc">{{ article.desc }}</text>
          </view>
          <text class="k-card-arrow">›</text>
        </view>
      </view>
    </template>

    <view v-if="!loading && sections.length === 0" class="empty-mask">
      <text>暂无养护知识文章</text>
    </view>

    <view style="height:24px"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, onShow } from 'vue'
import { knowledgeApi } from '@/utils/cloud.js'

const loading = ref(true)
const sections = ref([])

const buildSections = (articles) => {
  const catOrder = ['beginner', 'daily', 'trigger', 'acute']
  const catNames = {
    beginner: '新手入门',
    daily: '日常护理',
    trigger: '诱因识别',
    acute: '发作应对'
  }
  const catColors = {
    beginner: '#4A90D9',
    daily: '#52B788',
    trigger: '#E6A718',
    acute: '#D9534F'
  }

  const result = []
  catOrder.forEach(cat => {
    const items = articles.filter(a => a.category === cat)
    if (items.length > 0) {
      result.push({
        category: cat,
        categoryName: catNames[cat],
        dotColor: catColors[cat],
        items
      })
    }
  })
  sections.value = result
}

const loadArticles = async () => {
  loading.value = true
  try {
    const res = await knowledgeApi.list()
    if (res.code === 0) {
      buildSections(res.data)
    }
  } catch (err) {
    console.error('加载知识列表失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadArticles)

const onArticleTap = (id) => {
  uni.navigateTo({ url: '/pages/article-detail/index?id=' + id })
}
</script>

<style lang="scss" scoped>
.page-knowledge {
  padding: 0 18px;
}

.loading-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.loading-text {
  font-size: 14px;
  color: #9AA0A6;
}

.empty-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40vh;
  font-size: 14px;
  color: #9AA0A6;
}

.k-section {
  margin-bottom: 20px;
}

.k-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #7A828E;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.k-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.k-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.985);
    box-shadow: 0 4px 16px rgba(56,62,72,0.08);
  }
}

.k-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;

  &.icon-beginner { background: #EBF2FA; }
  &.icon-daily { background: #EDF7F1; }
  &.icon-trigger { background: #FBF5E8; }
  &.icon-acute { background: #FCEEED; }
}

.k-card-info {
  flex: 1;

  .k-title {
    font-size: 14px;
    font-weight: 600;
    color: #383E48;
    display: block;
  }

  .k-desc {
    font-size: 11px;
    color: #9AA0A6;
    margin-top: 3px;
    display: block;
  }
}

.k-card-arrow {
  color: #9AA0A6;
  font-size: 16px;
  font-weight: 300;
}
</style>