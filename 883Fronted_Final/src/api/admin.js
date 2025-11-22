// 管理员相关API
import { get, post, put, del } from '@/utils/request'

// ========== 角色管理 ==========
/**
 * 角色列表查询
 */
export function getRoles(params = {}) {
  return get('/admin/roles', params)
}

/**
 * 添加角色
 */
export function addRole(data) {
  return post('/admin/roles', data)
}

/**
 * 根据ID查询角色
 */
export function getRoleById(id) {
  return get(`/admin/roles/${id}`)
}

/**
 * 修改角色
 */
export function updateRole(data) {
  return put('/admin/roles', data)
}

/**
 * 删除角色
 */
export function deleteRole(id) {
  return del(`/admin/roles/${id}`)
}

/**
 * 查询所有角色（下拉列表）
 */
export function getAllRoles() {
  return get('/admin/roles/list')
}

// ========== 学生管理 ==========
/**
 * 学生列表查询
 */
export function getStudents(params = {}) {
  return get('/admin/students', params)
}

/**
 * 添加学生
 */
export function addStudent(data) {
  return post('/admin/students', data)
}

/**
 * 根据ID查询学生
 */
export function getStudentById(id) {
  return get(`/admin/students/${id}`)
}

/**
 * 修改学生
 */
export function updateStudent(data) {
  return put('/admin/students', data)
}

/**
 * 删除学生
 * @param {string} ids - 学生ID，多个用逗号分隔，如 "1001,1002"
 */
export function deleteStudents(ids) {
  if (!ids || ids.trim() === '') {
    throw new Error('学生ID不能为空')
  }
  // 确保路径正确，移除可能的空格
  const cleanIds = ids.trim().replace(/\s+/g, '')
  return del(`/admin/students/${cleanIds}`)
}

// ========== 教师管理 ==========
/**
 * 教师列表查询
 */
export function getTeachers(params = {}) {
  return get('/admin/teachers', params)
}

/**
 * 添加教师
 */
export function addTeacher(data) {
  return post('/admin/teachers', data)
}

/**
 * 根据ID查询教师
 */
export function getTeacherById(id) {
  return get(`/admin/teachers/${id}`)
}

/**
 * 修改教师
 */
export function updateTeacher(data) {
  return put('/admin/teachers', data)
}

/**
 * 删除教师
 * @param {string} ids - 教师ID，多个用逗号分隔，如 "2001,2002"
 */
export function deleteTeachers(ids) {
  if (!ids || ids.trim() === '') {
    throw new Error('教师ID不能为空')
  }
  // 确保路径正确，移除可能的空格
  const cleanIds = ids.trim().replace(/\s+/g, '')
  return del(`/admin/teachers/${cleanIds}`)
}

