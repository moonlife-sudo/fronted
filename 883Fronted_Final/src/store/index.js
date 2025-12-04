import { createStore } from 'vuex'

export default createStore({
  state: {
    posts: [
      {
        id: 1,
        title: '宿舍热水供应时间调整',
        content: '从下周一开始，宿舍热水供应时间调整为早上6:00-9:00，下午17:00-23:00。请各位同学合理安排洗浴时间，避开用水高峰期。如有疑问，请联系宿管阿姨。',
        author: '王老师',
        createTime: '2023-06-14T10:30:00Z',
        likes: 15,
        comments: 8
      },
      {
        id: 2,
        title: '关于宿舍安全检查的通知',
        content: '下周三将进行全校宿舍安全检查，请各位同学整理好个人物品，不要在宿舍内存放违禁物品。检查时间为上午9:00-12:00，请配合检查人员的工作。',
        author: '李老师',
        createTime: '2023-06-12T15:20:00Z',
        likes: 23,
        comments: 12
      }
    ],
    loading: false,
    // 请假记录数据
    leaveRecords: [
      {
        id: 1, 
        month: '11', 
        day: '20',
        type: '病假', 
        typeClass: 'sick',
        reason: '突发高烧，去校医院就诊',
        duration: 1,
        status: 'approved', 
        statusText: '已通过',
        createTime: '2023-11-20T09:00:00Z',
        courseName: 'Modern Cryptography'
      },
      {
        id: 2, 
        month: '10', 
        day: '15',
        type: '事假', 
        typeClass: 'personal',
        reason: '家里有急事需回家处理',
        duration: 2,
        status: 'rejected', 
        statusText: '已驳回',
        createTime: '2023-10-15T14:30:00Z',
        courseName: 'Data Structures'
      },
      {
        id: 3, 
        month: '09', 
        day: '28',
        type: '事假', 
        typeClass: 'personal',
        reason: '参加学术会议',
        duration: 3,
        status: 'approved', 
        statusText: '已通过',
        createTime: '2023-09-28T16:45:00Z',
        courseName: 'Computer Networks'
      }
    ]
  },
  getters: {
    // 获取所有帖子
    getAllPosts: state => state.posts,
    // 获取最新的几个帖子（用于首页显示）
    getLatestPosts: state => limit => {
      return state.posts.slice(0, limit || 5)
    },
    // 获取帖子总数
    getPostsCount: state => state.posts.length,
    // 获取加载状态
    getLoadingState: state => state.loading,
    // 获取所有请假记录
    getAllLeaveRecords: state => state.leaveRecords,
    // 获取请假记录总数
    getLeaveRecordsCount: state => state.leaveRecords.length
  },
  mutations: {
    // 设置帖子列表
    SET_POSTS(state, posts) {
      state.posts = posts
    },
    // 添加新帖子
    ADD_POST(state, post) {
      state.posts.unshift(post)
    },
    // 更新帖子
    UPDATE_POST(state, { id, updates }) {
      const index = state.posts.findIndex(post => post.id === id)
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...updates }
      }
    },
    // 删除帖子
    DELETE_POST(state, postId) {
      state.posts = state.posts.filter(post => post.id !== postId)
    },
    // 设置加载状态
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    // 增加点赞数
    INCREASE_LIKES(state, postId) {
      const post = state.posts.find(p => p.id === postId)
      if (post) {
        post.likes = (post.likes || 0) + 1
      }
    },
    // 增加评论数
    INCREASE_COMMENTS(state, postId) {
      const post = state.posts.find(p => p.id === postId)
      if (post) {
        post.comments = (post.comments || 0) + 1
      }
    },
    // 添加新的请假记录
    ADD_LEAVE_RECORD(state, record) {
      state.leaveRecords.unshift(record)
    },
    // 更新请假记录状态
    UPDATE_LEAVE_RECORD(state, { id, updates }) {
      const index = state.leaveRecords.findIndex(record => record.id === id)
      if (index !== -1) {
        state.leaveRecords[index] = { ...state.leaveRecords[index], ...updates }
      }
    }
  },
  actions: {
    // 获取帖子列表
    async fetchPosts({ commit }) {
      commit('SET_LOADING', true)
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        // 这里可以替换为真实的API调用
        // const response = await api.getPosts()
        // commit('SET_POSTS', response.data)
        
        // 暂时使用state中的数据，实际项目中会被API数据覆盖
        commit('SET_LOADING', false)
        return true
      } catch (error) {
        commit('SET_LOADING', false)
        throw error
      }
    },
    
    // 发布新帖子
    async createPost({ commit }, postData) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 获取当前用户信息作为默认作者
        let authorName = postData.author
        if (!authorName) {
          try {
            const savedUser = localStorage.getItem('userInfo')
            if (savedUser) {
              const parsedUser = JSON.parse(savedUser)
              authorName = parsedUser.full_name || parsedUser.name || parsedUser.username || '同学'
            } else {
              authorName = '同学'
            }
          } catch (e) {
            console.error('获取用户信息失败:', e)
            authorName = '同学'
          }
        }
        
        const newPost = {
          id: Date.now(),
          title: postData.title,
          content: postData.content,
          author: authorName,
          createTime: new Date().toISOString(),
          likes: 0,
          comments: 0
        }
        
        // 这里可以替换为真实的API调用
        // const response = await api.createPost(postData)
        // commit('ADD_POST', response.data)
        
        commit('ADD_POST', newPost)
        return newPost
      } catch (error) {
        throw error
      }
    },
    
    // 点赞帖子
    async likePost({ commit }, postId) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('INCREASE_LIKES', postId)
        return true
      } catch (error) {
        throw error
      }
    },
    
    // 提交请假申请
    async submitLeaveApplication({ commit }, applicationData) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const now = new Date()
        const startDate = new Date(applicationData.start)
        const endDate = new Date(applicationData.end)
        
        // 计算请假天数
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
        
        // 创建新的请假记录
        const newRecord = {
          id: Date.now(),
          month: (now.getMonth() + 1).toString(),
          day: now.getDate().toString(),
          type: applicationData.type === 'sick' ? '病假' : '事假',
          typeClass: applicationData.type,
          reason: applicationData.reason,
          duration: duration,
          status: 'pending',
          statusText: '审批中',
          createTime: now.toISOString(),
          courseName: applicationData.courseName || 'Modern Cryptography'
        }
        
        // 添加到store
        commit('ADD_LEAVE_RECORD', newRecord)
        
        return newRecord
      } catch (error) {
        throw error
      }
    }
  },
  modules: {
  }
})
