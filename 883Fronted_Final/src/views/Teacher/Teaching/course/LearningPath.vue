<template>
    <div class="learning-path-container">
        <div class="header">
            <h2>📚 课程知识图谱</h2>
            <button class="add-node-btn">+ 添加章节</button>
        </div>

        <!-- 弹窗 -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-card">
                <h3>添加章节</h3>
                <div class="form-group">
                    <label>章节标题</label>
                    <input v-model="newChapter.title" class="input" />
                </div>
                <div class="form-group">
                    <label>章节描述</label>
                    <textarea v-model="newChapter.description" rows="3" class="input"></textarea>
                </div>
                <div class="form-group">
                    <label>资源标签 (用逗号分隔)</label>
                    <input v-model="newChapter.resources" class="input" />
                </div>
                <div class="modal-actions">
                    <button class="btn" @click="confirmAdd">确认</button>
                    <button class="btn-cancel" @click="showModal = false">取消</button>
                </div>
            </div>
        </div>

        <div class="timeline-wrapper">
            <div v-for="(chapter, index) in chapters" :key="index" class="chapter-node">
                <div class="node-line"></div>
                <div class="node-content">
                    <div class="node-header">
                        <span class="chapter-index">Chapter {{ index + 1 }}</span>
                        <span class="status-badge" :class="chapter.status">{{ chapter.statusText }}</span>
                    </div>
                    <h3>{{ chapter.title }}</h3>
                    <p class="desc">{{ chapter.description }}</p>

                    <div class="resources-tags">
                        <span v-for="res in chapter.resources" :key="res" class="tag">{{ res }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const chapters = ref([
    {
        title: '课程介绍与导论',
        description: '了解课程基本结构、评分标准及计算机科学基础概念。',
        status: 'completed',
        statusText: '已完成',
        resources: ['PPT', '视频', '大纲']
    },
    {
        title: '基础语法与数据类型',
        description: '掌握变量、常量、基本数据类型及类型转换。',
        status: 'active',
        statusText: '进行中',
        resources: ['练习题', '代码示例']
    }
])

const showModal = ref(false)
const newChapter = ref({
    title: '',
    description: '',
    resources: ''
})

const openAdd = () => {
    showModal.value = true
    newChapter.value = { title: '', description: '', resources: '' }
}

const confirmAdd = () => {
    if (!newChapter.value.title) {
        alert('章节标题不能为空')
        return
    }

    chapters.value.push({
        title: newChapter.value.title,
        description: newChapter.value.description,
        status: 'locked',
        statusText: '未开始',
        resources: newChapter.value.resources
            ? newChapter.value.resources.split(',').map(r => r.trim())
            : []
    })
    showModal.value = false
}
</script>



<style scoped>
.learning-path-container {
    padding: 24px;
    max-inline-size: 1000px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 40px;
}

.add-node-btn {
    background: #2A5CAA;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
}

.timeline-wrapper {
    position: relative;
    padding-inline-start: 20px;
}

.chapter-node {
    position: relative;
    margin-block-end: 40px;
    padding-inline-start: 30px;
}

.node-line {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: 0;
    inset-block-end: -40px;
    inline-size: 2px;
    background: #e2e8f0;
}

.chapter-node:last-child .node-line {
    inset-block-end: 0;
    block-size: 20px;
}

.chapter-node::before {
    content: '';
    position: absolute;
    inset-inline-start: -4px;
    inset-block-start: 0;
    inline-size: 10px;
    block-size: 10px;
    border-radius: 50%;
    background: #2A5CAA;
    border: 2px solid white;
    box-shadow: 0 0 0 2px #2A5CAA;
    z-index: 2;
}

.node-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #edf2f7;
    transition: transform 0.2s;
}

.node-content:hover {
    transform: translateX(5px);
    border-color: #cbd5e1;
}

.node-header {
    display: flex;
    justify-content: space-between;
    margin-block-end: 8px;
    font-size: 12px;
}

.chapter-index {
    color: #64748b;
    font-weight: 600;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
}

.status-badge.completed {
    background: #dcfce7;
    color: #166534;
}

.status-badge.active {
    background: #dbeafe;
    color: #1e40af;
}

.status-badge.locked {
    background: #f1f5f9;
    color: #64748b;
}

h3 {
    margin: 0 0 8px 0;
    color: #334155;
}

.desc {
    color: #64748b;
    font-size: 14px;
    margin-block-end: 12px;
}

.tag {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-inline-end: 8px;
}

/* 弹窗 */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-card {
    background: white;
    padding: 24px;
    border-radius: 10px;
    inline-size: 420px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-block-end: 16px;
}

.input {
    inline-size: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-block-start: 12px;
}

.btn {
    background: #2A5CAA;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-cancel {
    background: #f0f0f0;
    border: 1px solid #ccc;
}
</style>