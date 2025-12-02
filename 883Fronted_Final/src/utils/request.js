// API请求工具类
const BASE_URL = 'http://127.0.0.1:8081'

/**
 * 通用请求方法
 * @param {string} url - 请求路径
 * @param {object} options - 请求选项
 * @returns {Promise} 响应数据
 */
async function request(url, options = {}) {
  const token = localStorage.getItem('token')
  
  // 详细的token调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Token调试信息:')
    console.log('- Token存在:', !!token)
    if (token) {
      console.log('- Token长度:', token.length)
      console.log('- Token前20字符:', token.substring(0, 20))
      console.log('- Token是否包含点号:', token.includes('.'))
      console.log('- localStorage中的userInfo:', localStorage.getItem('userInfo'))
    }
  }
  
  // 检查token是否存在（排除登录接口）
  if (!token && !url.includes('/login')) {
    console.warn('警告: 未找到token，请求可能失败')
    // 如果不在登录页，跳转到登录页
    if (window.location.pathname !== '/login') {
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
      throw new Error('未登录，请先登录')
    }
  }
  
  // 构建请求头
  const headers = {
    'Content-Type': 'application/json'
  }
  
  // 如果有token，添加到请求头（尝试多种格式）
  if (token) {
    headers.token = token
    headers.Authorization = `Bearer ${token}`  // 也添加标准的Authorization头
  }
  
  const defaultOptions = {
    headers: headers
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  }

  // 调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('请求URL:', `${BASE_URL}${url}`)
    console.log('请求方法:', config.method || 'GET')
    console.log('请求头token:', token ? `存在token (长度: ${token.length})` : '未找到token')
    console.log('完整请求头:', config.headers)
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, config)
    
    // 详细的HTTP状态码检查
    console.log('HTTP响应状态:', response.status, response.statusText)
    
    // 检查401认证错误
    if (response.status === 401) {
      console.error('🚨 401认证失败详情:')
      console.error('- URL:', `${BASE_URL}${url}`)
      console.error('- Token存在:', !!token)
      console.error('- Token值:', token ? `${token.substring(0, 20)}...` : 'null')
      console.error('- 请求头:', config.headers)
      
      // 尝试获取响应体中的错误信息
      try {
        const errorText = await response.text()
        console.error('- 401响应内容:', errorText)
      } catch (e) {
        console.error('- 无法读取401响应内容')
      }
      
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      throw new Error('认证失败，token可能无效或已过期')
    }
    
    // 检查其他HTTP错误
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP错误 ${response.status}:`, errorText)
      throw new Error(`请求失败: ${response.status} - ${errorText || response.statusText}`)
    }
    
    // 处理非JSON响应
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return { code: 1, msg: 'success', data: null }
    }

    const result = await response.json()
    
    // 检查是否是静态资源错误
    if (result.code === 0 && result.msg && result.msg.includes('No static resource')) {
      console.error('静态资源错误，可能是路径参数问题:', url)
      throw new Error('请求路径错误，请检查参数是否正确')
    }

    // 处理token过期或未授权
    if (result.code === 0 && (result.msg?.includes('token') || result.msg?.includes('登录'))) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      throw new Error(result.msg || '登录已过期，请重新登录')
    }

    return result
  } catch (error) {
    console.error('请求错误:', error)
    throw error
  }
}

/**
 * GET请求
 */
export function get(url, params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url
  return request(fullUrl, { method: 'GET' })
}

/**
 * POST请求
 */
export function post(url, data = {}) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * PUT请求
 */
export function put(url, data = {}) {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * DELETE请求
 */
export function del(url) {
  return request(url, { method: 'DELETE' })
}

/**
 * 文件上传
 */
export function upload(url, file) {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('file', file)

  return fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      ...(token && { token: token })
    },
    body: formData
  }).then(async (response) => {
    const result = await response.json()
    if (result.code === 0) {
      throw new Error(result.msg || '上传失败')
    }
    return result
  })
}

export default {
  get,
  post,
  put,
  delete: del,
  upload
}

