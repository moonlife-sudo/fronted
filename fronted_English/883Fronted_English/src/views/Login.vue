<template>
    <div class="login-container">
        <div class="login-content">
            <div class="login-left">
                <div class="campus-image">
                    <img src="@/assets/images/login_left_image.jpg" alt="Campus Image" class="cover-img">
                </div>
            </div>

            <div class="login-right">
                <div class="login-form-wrapper">
                    <div class="login-header">
                        <h1>Welcome to Smart Campus</h1>
                        <p>Smart Campus Management System</p>
                    </div>

                    <form @submit.prevent="handleLogin">
                        <div class="form-group">
                            <label for="username">Student ID / Employee ID</label>
                            <input type="text" id="username" v-model="loginForm.username" placeholder="Please enter student ID or employee ID"
                                class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" v-model="loginForm.password" placeholder="Please enter password"
                                class="form-input" required>
                        </div>

                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="loginForm.rememberMe">
                                Remember Me
                            </label>
                            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">Forgot Password?</a>
                        </div>

                        <button type="submit" class="login-btn" :disabled="loading">
                            {{ loading ? 'Logging in...' : 'Login' }}
                        </button>
                    </form>

                    <div class="account-help">
                        <p>📋 <strong>Account Information</strong></p>
                        <p>• Student Account: Student ID </p>
                        <p>• Teacher Account: Employee ID </p>
                        <p>• Admin Account: Admin ID </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'

export default {
    name: 'Login',
    setup() {
        const router = useRouter()
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
                alert('Please enter username and password')
                return
            }

            loading.value = true

            try {
                // 调用登录API
                const result = await login({
                    username: loginForm.username,
                    password: loginForm.password
                })

                if (result.code === 1 && result.data) {
                    // 后端返回的字段名是camelCase
                    const { token, userId, username, fullName, roles } = result.data

                    console.log('🔍 登录成功，后端返回的数据:', result.data)

                    // 保存token和用户信息
                    localStorage.setItem('token', token)
                    const userInfoToSave = {
                        user_id: userId,           // 转换字段名
                        username,
                        full_name: fullName,       // 转换字段名
                        roles,
                        token
                    }
                    console.log('💾 保存到localStorage的用户信息:', userInfoToSave)
                    localStorage.setItem('userInfo', JSON.stringify(userInfoToSave))

                  // 根据roles判断角色并跳转
                  const roleKeys = roles || []
                  console.log('当前用户角色:', roleKeys) // 建议加上这行日志，方便按F12看看到底返回了啥

                  let redirectPath = '/student/home' // 默认跳转

                  // 1. 优先精确匹配 admin
                  if (roleKeys.includes('super_admin')) {
                    redirectPath = '/admin/home'
                  }
                  // 2. 其次匹配 teacher
                  else if (roleKeys.includes('teacher')) {
                    redirectPath = '/teacher/home'
                  }
                  // 3. 其他情况（包括 student）都去学生首页
                  else {
                    redirectPath = '/student/home'
                  }

                    router.push(redirectPath)
                } else {
                    alert(result.msg || 'Login failed, please check username and password')
                }
            } catch (error) {
                console.error('登录错误:', error)
                alert(error.message || 'Login failed, please try again later')
            } finally {
                loading.value = false
            }
        }

        const handleForgotPassword = () => {
            alert('Please contact administrator to reset password')
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
.login-container {
    min-block-size: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
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
}

.form-input:focus {
    outline: none;
    border-color: #2A5CAA;
    box-shadow: 0 0 0 3px rgba(42, 92, 170, 0.1);
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
    color: #2A5CAA;
    text-decoration: none;
    transition: color 0.2s;
}

.forgot-password:hover {
    color: #1e4b8b;
    text-decoration: underline;
}

.login-btn {
    inline-size: 100%;
    padding: 12px;
    background: #2A5CAA;
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
}

/* Account Information区域 */
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