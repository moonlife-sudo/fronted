<template>
  <div class="dorm-assign-page">
    <main class="container">
      <section class="view-section">
        <div class="student-container">
          <!-- 宿舍偏好问卷模块 -->
          <div class="questionnaire-card">
            <h2><i class="bi bi-clipboard2-pulse"></i> 宿舍偏好问卷</h2>
            <form @submit.prevent="submitQuestionnaire">
              <!-- 一、作息习惯 -->
              <div class="form-section">
                <h3>一、作息习惯</h3>
                
                <div class="form-group">
                  <label>1. 睡觉时间：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="before12" v-model="questionnaire.sleepTime" required> 
                      12点前睡觉
                    </label>
                    <label>
                      <input type="radio" value="after12" v-model="questionnaire.sleepTime"> 
                      12点后睡觉
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>2. 起床时间：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="before7" v-model="questionnaire.wakeUpTime" required> 
                      7点前起床
                    </label>
                    <label>
                      <input type="radio" value="after7" v-model="questionnaire.wakeUpTime"> 
                      7点后起床
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>3. 是否午睡：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.nap" required> 
                      有午睡习惯
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.nap"> 
                      没有午睡习惯
                    </label>
                  </div>
                </div>
              </div>

              <!-- 二、生活习惯 -->
              <div class="form-section">
                <h3>二、生活习惯</h3>
                
                <div class="form-group">
                  <label>4. 是否抽烟：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.smoking" required> 
                      抽烟
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.smoking"> 
                      不抽烟
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>5. 是否介意室友抽烟：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.mindSmoking" required> 
                      介意
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.mindSmoking"> 
                      不介意
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>6. 是否打游戏：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.gaming" required> 
                      经常玩游戏（每天 ≥1 小时）
                    </label>
                    <label>
                      <input type="radio" value="rarely" v-model="questionnaire.gaming"> 
                      很少/几乎不玩
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>7. 是否戴耳机听声音：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.headphone" required> 
                      大多数时候戴耳机
                    </label>
                    <label>
                      <input type="radio" value="rarely" v-model="questionnaire.headphone"> 
                      不经常戴耳机
                    </label>
                  </div>
                </div>
              </div>

              <!-- 三、社交偏好 -->
              <div class="form-section">
                <h3>三、社交偏好</h3>
                
                <div class="form-group">
                  <label>8. 是否喜欢与室友闲聊：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="like" v-model="questionnaire.chatting" required> 
                      喜欢聊天/社交开放
                    </label>
                    <label>
                      <input type="radio" value="dislike" v-model="questionnaire.chatting"> 
                      不喜欢聊天/希望较安静
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>9. 是否能接受室友带朋友来宿舍：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="accept" v-model="questionnaire.friendsVisit" required> 
                      可以接受
                    </label>
                    <label>
                      <input type="radio" value="notAccept" v-model="questionnaire.friendsVisit"> 
                      不太能接受
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>10. 是否愿意参与宿舍集体活动（如聚餐）：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="willing" v-model="questionnaire.groupActivities" required> 
                      愿意
                    </label>
                    <label>
                      <input type="radio" value="notWilling" v-model="questionnaire.groupActivities"> 
                      不太愿意
                    </label>
                  </div>
                </div>
              </div>

              <!-- 四、卫生整理 -->
              <div class="form-section">
                <h3>四、卫生整理</h3>
                
                <div class="form-group">
                  <label>11. 对卫生的要求：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="high" v-model="questionnaire.cleanliness" required> 
                      较高（经常打扫）
                    </label>
                    <label>
                      <input type="radio" value="casual" v-model="questionnaire.cleanliness"> 
                      随意（每周 1 次或以下）
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>12. 整理个人物品：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="tidy" v-model="questionnaire.organization" required> 
                      整齐（经常归位）
                    </label>
                    <label>
                      <input type="radio" value="casual" v-model="questionnaire.organization"> 
                      比较随意
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>13. 是否介意室友的卫生不佳：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="mind" v-model="questionnaire.mindMessy" required> 
                      介意
                    </label>
                    <label>
                      <input type="radio" value="notMind" v-model="questionnaire.mindMessy"> 
                      不太介意
                    </label>
                  </div>
                </div>
              </div>

              <!-- 五、学习与噪音 -->
              <div class="form-section">
                <h3>五、学习与噪音</h3>
                
                <div class="form-group">
                  <label>14. 是否需要安静的学习环境：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.quietStudy" required> 
                      是
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.quietStudy"> 
                      否
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>15. 对室内噪音（聊天/键盘/音乐）的容忍度：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="low" v-model="questionnaire.noiseTolerance" required> 
                      低容忍
                    </label>
                    <label>
                      <input type="radio" value="high" v-model="questionnaire.noiseTolerance"> 
                      高容忍
                    </label>
                  </div>
                </div>
              </div>

              <!-- 六、其他偏好 -->
              <div class="form-section">
                <h3>六、其他偏好</h3>
                
                <div class="form-group">
                  <label>16. 是否在宿舍吃东西：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.eatingInRoom" required> 
                      经常吃
                    </label>
                    <label>
                      <input type="radio" value="rarely" v-model="questionnaire.eatingInRoom"> 
                      不常吃
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>17. 是否使用香水/香氛：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.fragrance" required> 
                      经常使用
                    </label>
                    <label>
                      <input type="radio" value="never" v-model="questionnaire.fragrance"> 
                      不使用
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>18. 是否介意气味（食物/香氛）：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="mind" v-model="questionnaire.mindSmell" required> 
                      介意
                    </label>
                    <label>
                      <input type="radio" value="notMind" v-model="questionnaire.mindSmell"> 
                      不介意
                    </label>
                  </div>
                </div>
              </div>

              <!-- 特殊需求 -->
              <div class="form-group">
                <label for="special-request">特殊需求说明（选填）：</label>
                <textarea 
                  id="special-request" 
                  rows="3" 
                  placeholder="如：需要下铺、身体原因需要特殊照顾等"
                  v-model="questionnaire.specialRequest"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                class="btn-submit"
                :disabled="isSubmitting"
              >
                <i class="bi" :class="submitIcon"></i> {{ submitText }}
              </button>
            </form>
          </div>
          
          <!-- 我的宿舍分配结果模块 -->
          <div class="result-card">
            <h2><i class="bi bi-house-check"></i> 我的宿舍分配结果</h2>
            <div class="result-content">
              <div v-if="!assignmentResult" class="result-pending">
                <i class="bi bi-hourglass-split"></i>
                <p>您的宿舍分配结果尚未公布</p>
                <p class="small-text">请先完成宿舍偏好问卷</p>
              </div>
              
              <div v-else class="result-detail">
                <div class="result-item">
                  <span>宿舍楼：</span>
                  <strong>{{ assignmentResult.building }}</strong>
                </div>
                <div class="result-item">
                  <span>房间号：</span>
                  <strong>{{ assignmentResult.room }}</strong>
                </div>
                <div class="result-item">
                  <span>床位号：</span>
                  <strong>{{ assignmentResult.bed }}</strong>
                </div>
                <div class="result-item">
                  <span>室友：</span>
                  <strong>{{ assignmentResult.roommate }}</strong>
                </div>
                <button class="btn-contact">
                  <i class="bi bi-chat-left-text"></i> 联系室友
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DormAssign',
  data() {
    return {
      isSubmitting: false,
      
      // 问卷数据 - 根据markdown文档的18个问题
      questionnaire: {
        // 一、作息习惯
        sleepTime: '',
        wakeUpTime: '',
        nap: '',
        
        // 二、生活习惯
        smoking: '',
        mindSmoking: '',
        gaming: '',
        headphone: '',
        
        // 三、社交偏好
        chatting: '',
        friendsVisit: '',
        groupActivities: '',
        
        // 四、卫生整理
        cleanliness: '',
        organization: '',
        mindMessy: '',
        
        // 五、学习与噪音
        quietStudy: '',
        noiseTolerance: '',
        
        // 六、其他偏好
        eatingInRoom: '',
        fragrance: '',
        mindSmell: '',
        
        // 特殊需求
        specialRequest: ''
      },
      
      // 分配结果
      assignmentResult: null
    }
  },
  computed: {
    submitText() {
      if (this.isSubmitting) return '提交中...'
      return '提交问卷'
    },
    submitIcon() {
      if (this.isSubmitting) return 'bi-arrow-repeat'
      return 'bi-send-check'
    }
  },
  methods: {
    async submitQuestionnaire() {
      if (this.isSubmitting) return
      
      // 验证所有必填项
      const requiredFields = [
        'sleepTime', 'wakeUpTime', 'nap',
        'smoking', 'mindSmoking', 'gaming', 'headphone',
        'chatting', 'friendsVisit', 'groupActivities',
        'cleanliness', 'organization', 'mindMessy',
        'quietStudy', 'noiseTolerance',
        'eatingInRoom', 'fragrance', 'mindSmell'
      ]
      
      for (const field of requiredFields) {
        if (!this.questionnaire[field]) {
          alert('请完成所有必填问题')
          return
        }
      }
      
      this.isSubmitting = true
      
      // 模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟成功提交
      console.log('提交的问卷数据:', this.questionnaire)
      alert('问卷提交成功！感谢您的参与。系统将根据您的偏好进行宿舍分配。')
      
      // 重置表单状态
      this.isSubmitting = false
      
      // 这里添加实际提交逻辑
      // 例如：this.$api.submitQuestionnaire(this.questionnaire)
    }
  }
}
</script>

<style scoped>
.dorm-assign-page {
  --primary-color: #2A5CAA;
  --secondary-color: #4CAF50;
  --light-color: #F5F7FA;
  --dark-color: #333333;
  --gray-color: #E0E0E0;
  --border-radius: 8px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

.dorm-assign-page {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--dark-color);
  background-color: var(--light-color);
  line-height: 1.6;
  min-block-size: 100vh;
}

.container {
  max-inline-size: 1000px;
  margin: 0 auto;
  padding: 80px 1rem 2rem;
}

/* 视图区域 */
.view-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  margin-block-end: 2rem;
}

.view-section h1, .view-section h2 {
  color: var(--primary-color);
  margin-block-end: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 学生视图样式 - 改为上下排列 */
.student-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.questionnaire-card, .result-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
}

.result-card {
  display: flex;
  flex-direction: column;
}

/* 表单样式 */
.form-section {
  margin-block-end: 2rem;
  padding-block-end: 1.5rem;
  border-block-end: 1px solid var(--gray-color);
}

.form-section:last-of-type {
  border-block-end: none;
}

.form-section h3 {
  color: var(--primary-color);
  margin-block-end: 1rem;
  font-size: 1.1rem;
  padding-inline-start: 0.5rem;
  border-inline-start: 3px solid var(--primary-color);
}

.form-group {
  margin-block-end: 1.5rem;
}

.form-group label {
  display: block;
  margin-block-end: 0.8rem;
  font-weight: 500;
  color: var(--dark-color);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: normal;
  cursor: pointer;
  margin-block-end: 0;
  padding: 0.5rem;
  border-radius: 4px;
  transition: var(--transition);
}

.radio-group label:hover {
  background-color: #f8f9fa;
}

.radio-group input[type="radio"] {
  margin: 0;
}

.form-group textarea {
  inline-size: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--gray-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-family: inherit;
  resize: vertical;
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

.btn-submit {
  inline-size: 100%;
  padding: 1rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition);
  margin-block-start: 1rem;
}

.btn-submit:hover:not(:disabled) {
  background-color: #3e8e41;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 结果卡片样式 */
.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-pending {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.result-pending i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-block-end: 1rem;
}

.small-text {
  font-size: 0.9rem;
  color: #999;
  margin-block-start: 0.5rem;
}

.result-detail {
  padding: 1rem 0;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-block-end: 1px solid var(--gray-color);
  align-items: center;
}

.result-item:last-child {
  border-block-end: none;
}

.btn-contact {
  inline-size: 100%;
  padding: 1rem;
  margin-block-start: 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition);
  font-weight: 500;
}

.btn-contact:hover {
  background-color: #1e4b8a;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 80px 0.5rem 1rem;
  }
  
  .view-section {
    padding: 1rem;
  }
  
  .questionnaire-card, .result-card {
    padding: 1rem;
  }
  
  .radio-group label {
    padding: 0.8rem;
  }
}

@media (max-width: 480px) {
  .form-section h3 {
    font-size: 1rem;
  }
  
  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>