<template>
  <view class="page-article">
    <view v-if="loading" class="loading-mask">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="article" class="article-wrap">
      <view class="article-meta">
        <view class="article-tag" :style="{ background: tagBg }">{{ article.categoryName }}</view>
        <text class="article-date">{{ article.order }} / 8</text>
      </view>

      <view class="article-content md-content">{{ article.content }}</view>

      <!-- 编辑按钮 -->
      <view class="edit-actions" v-if="article" @click="onEdit">
        <text style="font-size:12px;color:#9AA0A6">编辑内容</text>
      </view>
    </view>

    <view v-else class="loading-mask">
      <text>{{ error || '加载失败' }}</text>
    </view>
  </view>
</template>

<script>
// 在 script setup 外保留一个普通 script 块来接收 onLoad
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { knowledgeApi } from '@/utils/cloud.js'
import { onLoad } from '@dcloudio/uni-app'

const loading = ref(true)
const article = ref(null)
const error = ref('')
const articleId = ref('')

const catColors = {
  beginner: '#4A90D9',
  daily: '#52B788',
  trigger: '#E6A718',
  acute: '#D9534F'
}

const tagBg = computed(() => {
  if (!article.value) return '#9AA0A6'
  return catColors[article.value.category] || '#9AA0A6'
})

onLoad((query) => {
  articleId.value = query.id || ''
})

onMounted(async () => {
  if (!articleId.value) {
    error.value = '缺少文章ID'
    loading.value = false
    return
  }

  try {
    const res = await knowledgeApi.getById(articleId.value)
    if (res.code === 0) {
      article.value = res.data
    } else {
      error.value = res.message
    }
  } catch (err) {
    error.value = '加载失败'
    console.error(err)
  } finally {
    loading.value = false
  }
})

function onEdit() {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page-article {
  padding: 0 18px;
  padding-bottom: 40px;
}

.loading-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-size: 14px;
  color: #9AA0A6;
}

.article-wrap {
  padding-top: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.article-tag {
  padding: 3px 10px;
  border-radius: 9999px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.article-date {
  font-size: 12px;
  color: #9AA0A6;
}

.article-content {
  font-size: 15px;
  line-height: 1.8;
  color: #383E48;
  white-space: pre-wrap;
  word-break: break-word;
}

.edit-actions {
  margin-top: 24px;
  text-align: center;
  padding: 10px;
  border-top: 1px solid #EDF0F4;
}
</style>
