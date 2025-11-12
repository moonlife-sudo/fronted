import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  name: string
  role: string
  email: string
}

interface LoginData {
  role: string
  username: string
  password: string
  rememberMe: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const login = async (loginData: LoginData): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData: User = {
          name: loginData.username || '用户',
          role: loginData.role,
          email: `${loginData.username}@edusphere.com`
        }
        user.value = userData
        isAuthenticated.value = true
        resolve(userData)
      }, 1000)
    })
  }

  const logout = (): void => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})