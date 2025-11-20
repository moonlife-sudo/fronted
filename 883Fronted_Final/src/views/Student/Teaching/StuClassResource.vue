<template>
  <div class="resources-page">
    <div class="page-header">
      <h2>课程资源</h2>
      <div class="header-actions">
        <button class="back-btn" @click="goBackToCourses">返回课程列表</button>
      </div>
    </div>

    <div class="breadcrumb">
      <span class="crumb-item" :class="{ active: currentFolderId === null }" @click="navigateToFolder(null, '根目录')">
        📁 根目录
      </span>
      <span v-for="(folder, index) in breadcrumbStack" :key="folder.id" class="crumb-separator">
        /
        <span class="crumb-item" :class="{ active: index === breadcrumbStack.length - 1 }"
          @click="navigateToFolder(folder.id, folder.name, index)">
          {{ folder.name }}
        </span>
      </span>
    </div>

    <div v-if="loading" class="loading">加载资源中...</div>

    <div v-else class="resource-list">
      <div v-for="folder in folders" :key="folder.folder_id" class="resource-item folder" @click="enterFolder(folder)">
        <span class="icon">📂</span>
        <div class="info">
          <div class="name">{{ folder.folder_name }}</div>
          <div class="meta">文件夹</div>
        </div>
        <span class="arrow">›</span>
      </div>

      <div v-for="file in files" :key="file.resource_id" class="resource-item file" @click="downloadFile(file)">
        <span class="icon">📄</span>
        <div class="info">
          <div class="name">{{ file.file_name }}</div>
          <div class="meta">
            {{ formatSize(file.file_size) }} | {{ formatTime(file.upload_at) }}
          </div>
        </div>
        <span class="download-icon">⬇️</span>
      </div>

      <div v-if="folders.length === 0 && files.length === 0" class="empty">
        此文件夹下暂无内容
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'StuClassResource',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const classId = computed(() => route.query.classId || localStorage.getItem('currentClassId'))

    // 状态管理
    const currentFolderId = ref(null)
    const breadcrumbStack = ref([])
    const folders = ref([])
    const files = ref([])
    const loading = ref(false)

    onMounted(() => {
      if (classId.value) fetchResources()
    })
    const goBackToCourses = () => {
      router.push({ path: '/student/teachinghome' })
    }
    // 获取资源列表 (接口文档 5.1)
    const fetchResources = async () => {
      loading.value = true
      try {
        let url = `http://127.0.0.1:8081/classes/${classId.value}/resources`
        if (currentFolderId.value) {
          url += `?folder_id=${currentFolderId.value}`
        }

        const res = await fetch(url)
        const result = await res.json()
        if (result.code === 1) {
          folders.value = result.data.folders || []
          files.value = result.data.files || []
        }
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    // 进入文件夹
    const enterFolder = (folder) => {
      currentFolderId.value = folder.folder_id
      breadcrumbStack.value.push({ id: folder.folder_id, name: folder.folder_name })
      fetchResources()
    }

    // 导航跳转（面包屑点击）
    const navigateToFolder = (folderId, name, index) => {
      currentFolderId.value = folderId
      if (folderId === null) {
        breadcrumbStack.value = []
      } else if (index !== undefined) {
        breadcrumbStack.value = breadcrumbStack.value.slice(0, index + 1)
      }
      fetchResources()
    }

    // 下载文件
    const downloadFile = (file) => {
      if (file.file_url) {
        window.open(file.file_url, '_blank')
      } else {
        alert('文件链接无效')
      }
    }

    // 工具函数
    const formatSize = (bytes) => {
      if (!bytes) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    const formatTime = (t) => new Date(t).toLocaleDateString()

    return {
      router,
      classId,
      currentFolderId,
      breadcrumbStack,
      folders,
      files,
      loading,
      goBackToCourses,
      fetchResources,
      enterFolder,
      navigateToFolder,
      downloadFile,
      formatSize,
      formatTime
    }
  }
}
</script>

<style scoped>
.resources-page {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.breadcrumb {
  background: #f5f7fa;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.crumb-item {
  cursor: pointer;
  color: #2A5CAA;
}

.crumb-item:hover {
  text-decoration: underline;
}

.crumb-item.active {
  color: #666;
  cursor: default;
  text-decoration: none;
}

.crumb-separator {
  margin: 0 5px;
  color: #ccc;
}

.resource-list {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.resource-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.resource-item:hover {
  background: #f9f9f9;
}

.resource-item:last-child {
  border-bottom: none;
}

.icon {
  font-size: 24px;
  margin-right: 15px;
}

.info {
  flex: 1;
}

.name {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}

.meta {
  font-size: 12px;
  color: #999;
}

.arrow,
.download-icon {
  color: #ccc;
  font-size: 18px;
}

.download-icon:hover {
  color: #2A5CAA;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>