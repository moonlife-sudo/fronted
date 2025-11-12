<template>
    <div class="login-container">
        <div class="login-content">
            <!-- 左侧图片 -->
            <div class="login-left">
                <div class="campus-image">
                    <img src="..\..\assets\images\login_left_image.jpg" alt="校园图片">
                </div>
            </div>

            <!-- 右侧表单 -->
            <div class="login-right">
                <div class="login-form">
                    <div class="login-header">
                        <h1>欢迎登录 EduSphere</h1>
                        <p>智慧校园管理平台</p>
                    </div>

                    <form @submit.prevent="handleLogin">
                        <div class="form-group">
                            <label for="username">学号/工号</label>
                            <input type="text" id="username" v-model="loginForm.username" placeholder="请输入学号或工号"
                                class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label for="password">密码</label>
                            <input type="password" id="password" v-model="loginForm.password" placeholder="请输入密码"
                                class="form-input" required>
                        </div>

                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="loginForm.rememberMe">
                                记住我
                            </label>
                            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">忘记密码？</a>
                        </div>

                        <button type="submit" class="login-btn">登录</button>
                    </form>

                    <div class="account-help">
                        <p>📋 <strong>账号说明</strong></p>
                        <p>• 学生账号：学号（如：2021001001）</p>
                        <p>• 教师账号：工号（如：T2025001）</p>
                        <p>• 初始密码：身份证后6位</p>
                        <p>• 如需账号，请联系院系管理员</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isLoginForm = ref(true)

// 登录表单数据
const loginForm = ref({
    username: '',
    password: '',
    rememberMe: false,
    role: ''
})

// 登录处理
const handleLogin = async () => {
    if (!loginForm.value.username || !loginForm.value.password) {
        alert('请输入用户名和密码')
        return
    }

    try {
        await authStore.login(loginForm.value)
        alert('登录成功！')
        router.push('/')
    } catch (error) {
        alert('登录失败，请检查用户名和密码')
        console.error('登录错误:', error)
    }
}

// 忘记密码
const handleForgotPassword = () => {
    alert('忘记密码请联系管理员重置密码')
}

// 显示注册信息
const showRegisterInfo = () => {
    isLoginForm.value = false
}

// 显示登录表单
const showLoginForm = () => {
    isLoginForm.value = true
}
</script>

<style>
/* 全局导入登录页面样式 */
@import '@/assets/styles/pages/auth/login.css';
</style>

<style scoped>
/* 注册信息页面样式 */
.register-info {
    inline-size: 100%;
}

.info-content {
    margin-block-end: 20px;
}

.info-item {
    margin-block-end: 25px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-item h3 {
    margin: 0 0 10px 0;
    color: #2c3e50;
    font-size: 16px;
}

.info-item p {
    margin: 5px 0;
    color: #5a6c7d;
    font-size: 14px;
    line-height: 1.5;
}

.register-link {
    text-align: center;
    margin-block-start: 20px;
}

.register-link a {
    color: #3498db;
    text-decoration: none;
}

.register-link a:hover {
    text-decoration: underline;
}

/* 账号说明样式调整 */
.account-help {
    font-size: 12px;
    /* 减小字体大小 */
    color: #7f8c8d;
    /* 使用更淡的灰色 */
    margin-block-start: 20px;
    line-height: 1.5;
    padding: 12px;
    background-color: #f8f9fa;
    /* 添加浅灰色背景 */
    border-radius: 8px;
}

.account-help p {
    margin: 5px 0;
}

.account-help strong {
    color: #2c3e50;
    /* 标题颜色稍深 */
}
</style>