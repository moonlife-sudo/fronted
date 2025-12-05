// 用户相关API
import { get, post, put, del, upload } from '@/utils/request'

/**
 * 登录
 */
export function login(data) {
  return post('/login', data)
}

/**
 * 获取当前用户信息
 */
export function getProfile() {
  return get('/profile')
}

/**
 * 修改用户信息
 */
export function updateProfile(data) {
  return put('/profile', data)
}

/**
 * 修改密码
 */
export function updatePassword(data) {
  return put('/profile/password', data)
}

/**
 * 文件上传
 */
export function uploadFile(file) {
  return upload('/upload', file)
}

