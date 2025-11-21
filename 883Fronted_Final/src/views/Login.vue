<template>
    <div class="login-container">
        <div class="login-content">
            <div class="login-left">
                <div class="campus-image">
                    <img src="@/assets/images/login_left_image.jpg" alt="校园图片" class="cover-img">
                </div>
            </div>

            <div class="login-right">
                <div class="login-form-wrapper">
                    <div class="login-header">
                        <h1>欢迎登录 智慧校园</h1>
                        <p>Smart Campus Management System</p>
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

                        <button type="submit" class="login-btn" :disabled="loading">
                            {{ loading ? '登录中...' : '登录' }}
                        </button>
                    </form>

                    <div class="account-help">
                        <p>📋 <strong>账号说明</strong></p>
                        <p>• 学生账号：学号（如：2021001001）</p>
                        <p>• 教师账号：工号（以T开头，如：T2025001）</p>
                        <p>• 管理员账号：admin</p>
                        <p>• 初始密码：123456</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    name: 'Login',
    setup() {
        const router = useRouter()
        const store = useStore()
        const loading = ref(false)

        // 登录表单数据
        const loginForm = reactive({
            username: '',
            password: '',
            rememberMe: false
        })

        // 登录处理逻辑
        const handleLogin = async () => {
            if (!loginForm.username || !loginForm.password) {
                alert('请输入用户名和密码')
                return
            }

            loading.value = true

            // === 模拟登录逻辑 (为了让你先跑通) ===
            try {
                // 模拟网络延迟
                await new Promise(resolve => setTimeout(resolve, 800))

                // 1. 构造模拟的用户数据
                let role = 'student'
                let name = '同学'

                // 根据用户名简单判断角色（实际开发中由后端返回）
                if (loginForm.username === 'admin') {
                    role = 'admin'
                    name = '管理员'
                } else if (loginForm.username.startsWith('T') || loginForm.username.startsWith('t')) {
                    role = 'teacher'
                    name = '老师'
                }

                const userData = {
                    username: loginForm.username,
                    name: loginForm.username + name,
                    role: role,
                    token: 'mock-token-' + Date.now()
                }

                // 2. 保存状态 (关键：这会让路由守卫放行)
                localStorage.setItem('token', userData.token)
                localStorage.setItem('userInfo', JSON.stringify(userData))
                store.commit('SET_USER', userData)

                // 3. 根据角色跳转到不同首页
                if (role === 'admin') {
                    router.push('/admin/campushome')
                } else if (role === 'teacher') {
                    router.push('/teacher/teachinghome')
                } else {
                    router.push('/student/teachinghome') // 学生默认去教学首页
                }

            } catch (error) {
                console.error('登录错误:', error)
                alert('登录失败，请重试')
            } finally {
                loading.value = false
            }
        }

        const handleForgotPassword = () => {
            alert('请联系管理员重置密码')
        }

        return {
            loginForm,
            loading,
            handleLogin,
            handleForgotPassword
        }
    }
}
</script>

<style scoped>
/* 这里直接合并了你提供的 login.css 
  并做了一些微调以适应 Vue 组件 
*/

.login-container {
    min-block-size: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
    /* 稍微改了一下背景色 */
}

.login-content {
    display: flex;
    inline-size: 85%;
    max-inline-size: 1000px;
    block-size: 600px;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* 左侧图片区 */
.login-left {
    flex: 1.2;
    background: #f8f9fa;
    position: relative;
    overflow: hidden;
}

.campus-image {
    inline-size: 100%;
    block-size: 100%;
}

.cover-img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    /* 确保图片铺满且不变形 */
    display: block;
}

/* 右侧表单区 */
.login-right {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
}

.login-form-wrapper {
    inline-size: 100%;
    max-inline-size: 360px;
    margin: 0 auto;
}

.login-header {
    text-align: center;
    margin-block-end: 30px;
}

.login-header h1 {
    color: #2c3e50;
    font-size: 26px;
    font-weight: 600;
    margin-block-end: 8px;
}

.login-header p {
    color: #7f8c8d;
    font-size: 14px;
}

.form-group {
    margin-block-end: 20px;
}

.form-group label {
    display: block;
    margin-block-end: 8px;
    font-weight: 500;
    color: #2d3748;
    font-size: 14px;
}

.form-input {
    inline-size: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: #fafafa;
    box-sizing: border-box;
    /* 关键：防止padding撑大 */
}

.form-input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    background: #fff;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 25px;
    font-size: 14px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #5a6c7d;
}

.checkbox-label input {
    margin-inline-end: 8px;
}

.forgot-password {
    color: #3498db;
    text-decoration: none;
    transition: color 0.2s;
}

.forgot-password:hover {
    color: #2980b9;
    text-decoration: underline;
}

.login-btn {
    inline-size: 100%;
    padding: 12px;
    background: #2a5caa;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-block-end: 20px;
}

.login-btn:hover {
    background: #1e4b8b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(42, 92, 170, 0.3);
}

.login-btn:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
}

/* 账号说明区域 */
.account-help {
    font-size: 12px;
    color: #7f8c8d;
    margin-block-start: 20px;
    line-height: 1.6;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #eee;
}

.account-help p {
    margin: 4px 0;
}

.account-help strong {
    color: #2c3e50;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .login-content {
        flex-direction: column;
        block-size: auto;
        inline-size: 90%;
        margin: 20px 0;
    }

    .login-left {
        block-size: 200px;
        flex: none;
    }

    .login-right {
        padding: 30px 20px;
    }
}
</style>