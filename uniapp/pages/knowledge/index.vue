<template>
  <view class="page-knowledge">
    <view
      v-for="section in sections"
      :key="section.category"
      class="k-section"
    >
      <view class="k-section-title">
        <view class="k-dot" :style="{ background: section.dotColor }"></view>
        <text>{{ section.categoryName }}</text>
      </view>

      <view
        v-for="article in section.items"
        :key="article.id"
        class="k-card"
        @click="onArticleTap(article.title)"
      >
        <view
          class="k-card-icon"
          :class="'icon-' + article.category"
        >
          <text>{{ article.icon }}</text>
        </view>
        <view class="k-card-info">
          <text class="k-title">{{ article.title }}</text>
          <text class="k-desc">{{ article.desc }}</text>
        </view>
        <text class="k-card-arrow">›</text>
      </view>
    </view>
    <view style="height:24px"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { knowledgeArticles } from '@/utils/mock-data.js'

const sections = ref([])

const buildSections = () => {
  const cats = ['beginner', 'daily', 'trigger', 'acute']
  const result = []
  cats.forEach(cat => {
    const items = knowledgeArticles.filter(a => a.category === cat)
    if (items.length > 0) {
      result.push({
        category: cat,
        categoryName: items[0].categoryName,
        dotColor: items[0].dotColor,
        items
      })
    }
  })
  sections.value = result
}
buildSections()

const onArticleTap = (title) => {
  uni.showToast({ title: '打开：' + title, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page-knowledge {
  padding: 0 18px;
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