<template>
    <div class="learning-path-container">
        <div class="header">
            <h2>📚 课程知识图谱</h2>
            <button class="add-node-btn">+ 添加章节</button>
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
    },
    {
        title: '控制流与循环结构',
        description: 'if-else, switch, for, while 等逻辑控制。',
        status: 'locked',
        statusText: '未开始',
        resources: ['测验']
    }
])
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
</style>