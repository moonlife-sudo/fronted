<!-- src/views/teaching/resources/List.vue -->
<template>
  <div class="resources-list">
    <div class="page-header">
      <h1>课程资源详情</h1>
      <p class="page-description">查看和管理课程资源文件</p>
    </div>

    <!-- 查询区域 -->
    <section class="card filter-card">
      <div class="filter-form">
        <div class="form-row">
          <div class="form-group">
            <label for="class_id" class="form-label required">班级ID</label>
            <input
              id="class_id"
              v-model="queryForm.class_id"
              type="text"
              placeholder="请输入班级ID"
              class="input"
            />
          </div>
          <div class="form-actions-inline">
            <button type="button" class="button" @click="loadResources" :disabled="loading">
              <span v-if="loading">查询中...</span>
              <span v-else>查询</span>
            </button>
            <button type="button" class="button" @click="$router.push('/teaching/resources/upload')">上传资源</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 资源列表 -->
    <section v-if="resources" class="card resources-card">
      <header class="card-header">
        <h3>资源列表</h3>
        <span v-if="currentFolder" class="folder-path">
          当前路径：{{ getFolderPath() }}
        </span>
      </header>
      <div class="resources-content">
        <!-- 文件夹列表 -->
        <div v-if="resources.folders && resources.folders.length > 0" class="folders-section">
          <h4 class="section-title">文件夹</h4>
          <div class="folders-list">
            <div
              v-for="folder in resources.folders"
              :key="folder.folder_id"
              class="folder-item"
              @click="enterFolder(folder.folder_id)"
            >
              <span class="folder-icon">📁</span>
              <span class="folder-name">{{ folder.folder_name }}</span>
            </div>
          </div>
        </div>

        <!-- 文件列表 -->
        <div v-if="resources.files && resources.files.length > 0" class="files-section">
          <h4 class="section-title">文件</h4>
          <div class="files-table-wrapper">
            <table class="files-table">
              <thead>
                <tr>
                  <th>文件名</th>
                  <th>文件类型</th>
                  <th>文件大小</th>
                  <th>上传者</th>
                  <th>上传时间</th>
                  <th>下载次数</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="file in resources.files" :key="file.resource_id">
                  <td>
                    <span class="file-name">{{ file.file_name }}</span>
                    <span v-if="file.description" class="file-desc">{{ file.description }}</span>
                  </td>
                  <td>{{ file.file_type }}</td>
                  <td>{{ formatFileSize(file.file_size) }}</td>
                  <td>{{ file.uploader_name }}</td>
                  <td>{{ formatTime(file.upload_at) }}</td>
                  <td>{{ file.download_count }}</td>
                  <td>
                    <button type="button" class="button button--outline button--small" @click="downloadFile(file)">下载</button>
                    <button
                      type="button"
                      class="button button--outline button--small"
                      style="margin-left: 8px;"
                      @click="deleteFile(file.resource_id)"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 返回上级 -->
        <div v-if="currentFolder" class="back-section">
          <button type="button" class="button button--text" @click="goBack">← 返回上级</button>
        </div>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-if="!loading && !resources && queryForm.class_id" class="card empty-card">
      <div class="empty-state">
        <p>暂无资源</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'ResourcesList'
})

const queryForm = reactive({
  class_id: ''
})

const loading = ref(false)
const resources = ref(null)
const currentFolder = ref(null)
const folderPath = ref([])

onMounted(() => {
  const classId = sessionStorage.getItem('selectedClassId')
  if (classId) {
    queryForm.class_id = classId
  }
})

const loadResources = async () => {
  if (!queryForm.class_id) {
    alert('请填写班级ID')
    return
  }

  loading.value = true
  try {
    const params = new URLSearchParams()
    if (currentFolder.value) {
      params.append('folder_id', currentFolder.value.toString())
    }

    const response = await fetch(
      `http://127.0.0.1:8081/classes/${queryForm.class_id}/resources${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1 && result.data) {
      resources.value = result.data
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询资源失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    resources.value = null
  } finally {
    loading.value = false
  }
}

const enterFolder = folderId => {
  folderPath.value.push(folderId)
  currentFolder.value = folderId
  loadResources()
}

const goBack = () => {
  if (folderPath.value.length > 0) {
    folderPath.value.pop()
    currentFolder.value = folderPath.value.length > 0 ? folderPath.value[folderPath.value.length - 1] : null
  } else {
    currentFolder.value = null
  }
  loadResources()
}

const getFolderPath = () => {
  return folderPath.value.length > 0 ? `文件夹 ${folderPath.value.length} 级` : '根目录'
}

const formatFileSize = size => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const formatTime = time => {
  if (!time) return '-'
  try {
    const date = new Date(time)
    return date.toLocaleString('zh-CN')
  } catch {
    return time
  }
}

const downloadFile = file => {
  window.open(file.file_url, '_blank')
}

const deleteFile = async resourceId => {
  if (!confirm('确定要删除这个文件吗？')) return

  try {
    const response = await fetch(
      `http://127.0.0.1:8081/classes/resources/${resourceId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1) {
      alert('删除成功！')
      loadResources()
    } else {
      throw new Error(result.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除文件失败:', error)
    alert(error instanceof Error ? error.message : '删除失败，请稍后重试')
  }
}
</script>

<style scoped>
.resources-list {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-block-end: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.filter-card,
.resources-card,
.empty-card {
  margin-block-start: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.input {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: #2A5CAA;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.button:hover:not(:disabled) {
  background: #214a88;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--outline {
  background: #fff;
  color: #2A5CAA;
  border: 1px solid #2A5CAA;
}

.button--small {
  padding: 4px 10px;
  font-size: 12px;
}

.button--text {
  background: none;
  color: #2A5CAA;
  border: none;
  padding: 0;
}

.filter-form {
  padding: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-block-end: 8px;
}

.form-label.required::after {
  content: ' *';
  color: #ff4d4f;
}

.form-actions-inline {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.folder-path {
  font-size: 14px;
  color: #666;
  margin-inline-start: 16px;
}

.resources-content {
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.folders-section {
  margin-block-end: 24px;
}

.folders-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}

.folder-item:hover {
  border-color: #2A5CAA;
  background: #f0f7ff;
}

.folder-icon {
  font-size: 20px;
}

.folder-name {
  font-size: 14px;
  color: #333;
}

.files-section {
  margin-block-end: 24px;
}

.files-table-wrapper {
  overflow-x: auto;
}

.files-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.files-table th,
.files-table td {
  padding: 12px;
  text-align: left;
  border-block-end: 1px solid #e8e8e8;
}

.files-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.files-table tbody tr:hover {
  background: #f5f7fa;
}

.file-name {
  font-weight: 500;
  color: #333;
}

.file-desc {
  display: block;
  font-size: 12px;
  color: #999;
  margin-block-start: 4px;
}

.back-section {
  margin-block-start: 24px;
  padding-block-start: 24px;
  border-block-start: 1px solid #e8e8e8;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
