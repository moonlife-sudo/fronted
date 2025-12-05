<template>
    <div class="learning-path-container">
        <div class="header">
            <h2>📚 Course Knowledge Graph - Teaching Plan</h2>
            <button class="add-node-btn" @click="openAdd">
                <i class="bi bi-plus-lg"></i> Add Chapter
            </button>
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-card">
                <h3>Add New Chapter</h3>
                <form @submit.prevent="confirmAdd">
                    <div class="form-group">
                        <label>Chapter Title <span style="color:red">*</span></label>
                        <input v-model="newChapter.title" class="input" placeholder="e.g., Chapter 3 Vue Component Communication" required />
                    </div>
                    <div class="form-group">
                        <label>Teaching Objectives/Description</label>
                        <textarea v-model="newChapter.description" rows="3" class="input"
                            placeholder="This chapter focuses on Props and Emit..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Related Resources (comma separated)</label>
                        <input v-model="newChapter.resources" class="input" placeholder="PPT, Video, Source Code" />
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" @click="showModal = false">Cancel</button>
                        <button type="submit" class="btn">Confirm Add</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="timeline-wrapper">
            <div v-if="chapters.length === 0" style="text-align:center; color:#999; padding:40px;">
                No chapters yet, please click the top right corner to add
            </div>

            <div v-else v-for="(chapter, index) in chapters" :key="index" class="chapter-node">
                <div class="node-line"></div>
                <div class="node-content">
                    <div class="node-header">
                        <span class="chapter-index">Chapter {{ index + 1 }}</span>
                        <span class="status-badge" :class="chapter.status">{{ chapter.statusText }}</span>
                    </div>
                    <h3>{{ chapter.title }}</h3>
                    <p class="desc">{{ chapter.description }}</p>

                    <div class="resources-tags">
                        <span v-for="res in chapter.resources" :key="res" class="tag">
                            <i class="bi bi-file-earmark-text"></i> {{ res }}
                        </span>
                    </div>

                    <button class="btn-delete-node" @click="deleteNode(index)">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 1. 演示用的初始数据（让页面不为空）
const chapters = ref([
    {        
        title: 'Course Introduction and Overview',
        description: 'Understand the basic structure of the course, grading criteria, and fundamental computer science concepts.',
        status: 'completed',
        statusText: 'Completed',
        resources: ['PPT', 'Syllabus']
    },
    {
        title: 'Basic Syntax and Data Types',
        description: 'Master variables, constants, basic data types, and type conversion.',
        status: 'active',
        statusText: 'In Progress',
        resources: ['Practice Questions', 'Code Examples']
    },
    {
        title: 'Control Flow and Functions',
        description: 'Deeply understand if-else, switch, loops, and function definitions.',
        status: 'locked',
        statusText: 'Not Started',
        resources: ['Preview Video']
    }
])

const showModal = ref(false)
const newChapter = ref({
    title: '',
    description: '',
    resources: ''
})

const openAdd = () => {
    newChapter.value = { title: '', description: '', resources: '' }
    showModal.value = true
}

const confirmAdd = () => {
    if (!newChapter.value.title) {
        alert('Chapter title cannot be empty')
        return
    }

    // 前端模拟添加，直接推入数组
    chapters.value.push({
        title: newChapter.value.title,
        description: newChapter.value.description || '暂无描述',
        status: 'locked',
        statusText: 'Not Started', // Newly added chapters default to Not Started
        resources: newChapter.value.resources
            ? newChapter.value.resources.split(/[,，]/).map(r => r.trim()) // 兼容中英文逗号
            : []
    })

    showModal.value = false
    // 演示反馈
    // alert('添加成功！') 
}

const deleteNode = (index) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
        chapters.value.splice(index, 1)
    }
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
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s;
}

.add-node-btn:hover {
    background: #1e4b8b;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(42, 92, 170, 0.2);
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

/* 连接线 */
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

/* 圆点 */
.chapter-node::before {
    content: '';
    position: absolute;
    inset-inline-start: -4px;
    inset-block-start: 0;
    inline-size: 10px;
    block-size: 10px;
    border-radius: 50%;
    background: #2A5CAA;
    border: 3px solid #eef2ff;
    box-shadow: 0 0 0 1px #2A5CAA;
    z-index: 2;
}

.node-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #edf2f7;
    transition: all 0.3s;
    position: relative;
}

.node-content:hover {
    transform: translateX(5px);
    border-color: #2A5CAA;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
    font-weight: 500;
}

.status-badge.completed {
    background: #dcfce7;
    color: #166534;
}

/* 绿色 */
.status-badge.active {
    background: #dbeafe;
    color: #1e40af;
}

/* 蓝色 */
.status-badge.locked {
    background: #f1f5f9;
    color: #64748b;
}

/* 灰色 */

h3 {
    margin: 0 0 8px 0;
    color: #334155;
    font-size: 18px;
}

.desc {
    color: #64748b;
    font-size: 14px;
    margin-block-end: 12px;
    line-height: 1.5;
}

.tag {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    margin-inline-end: 8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.btn-delete-node {
    position: absolute;
    inset-inline-end: 20px;
    inset-block-end: 20px;
    font-size: 12px;
    color: #ff4d4f;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}

.node-content:hover .btn-delete-node {
    opacity: 1;
}

/* 弹窗 */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.modal-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    inline-size: 420px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.form-group {
    margin-block-end: 16px;
}

.form-group label {
    display: block;
    margin-block-end: 6px;
    font-weight: 500;
    font-size: 14px;
}

.input {
    inline-size: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ddd;
    transition: border-color 0.2s;
}

.input:focus {
    outline: none;
    border-color: #2A5CAA;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-block-start: 24px;
}

.btn {
    background: #2A5CAA;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-cancel {
    background: white;
    border: 1px solid #ddd;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
}
</style>