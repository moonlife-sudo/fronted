<template>
  <div class="dorm-assign-page">
    <main class="container">
      <section class="view-section">
        <div class="student-container">
          <!-- 宿舍偏好问卷模块 -->
          <div class="questionnaire-card">
            <h2><i class="bi bi-clipboard2-pulse"></i> Dormitory Preference Questionnaire</h2>
            <form @submit.prevent="submitQuestionnaire">
              <!-- I. Daily Schedule -->
              <div class="form-section">
                <h3>I. Daily Schedule</h3>
                
                <div class="form-group">
                  <label>1. Bedtime：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="before12" v-model="questionnaire.sleepTime" required> 
                      Before 12:00 AM
                    </label>
                    <label>
                      <input type="radio" value="after12" v-model="questionnaire.sleepTime"> 
                      After 12:00 AM
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>2. Wake-up time：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="before7" v-model="questionnaire.wakeUpTime" required> 
                      Before 7:00 AM
                    </label>
                    <label>
                      <input type="radio" value="after7" v-model="questionnaire.wakeUpTime"> 
                      After 7:00 AM
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>3. Napping habit：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.nap" required> 
                      I take naps
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.nap"> 
                      I don't take naps
                    </label>
                  </div>
                </div>
              </div>

              <!-- II. Lifestyle Habits -->
              <div class="form-section">
                <h3>II. Lifestyle Habits</h3>
                
                <div class="form-group">
                  <label>4. Smoking：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.smoking" required> 
                      I smoke
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.smoking"> 
                      I don't smoke
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>5. Roommate smoking：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.mindSmoking" required> 
                      I mind
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.mindSmoking"> 
                      I don't mind
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>6. Gaming：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.gaming" required> 
                      Often (≥1 hour per day)
                    </label>
                    <label>
                      <input type="radio" value="rarely" v-model="questionnaire.gaming"> 
                      Rarely/almost never
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>7. Headphone usage：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.headphone" required> 
                      Most of the time
                    </label>
                    <label>
                      <input type="radio" value="rarely" v-model="questionnaire.headphone"> 
                      Not often
                    </label>
                  </div>
                </div>
              </div>

              <!-- III. Social Preferences -->
              <div class="form-section">
                <h3>III. Social Preferences</h3>
                
                <div class="form-group">
                  <label>8. Chatting with roommates：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="like" v-model="questionnaire.chatting" required> 
                      I like chatting/socially open
                    </label>
                    <label>
                      <input type="radio" value="dislike" v-model="questionnaire.chatting"> 
                      I don't like chatting/prefer quiet
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>9. Roommate having friends over：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="accept" v-model="questionnaire.friendsVisit" required> 
                      Acceptable
                    </label>
                    <label>
                      <input type="radio" value="notAccept" v-model="questionnaire.friendsVisit"> 
                      Not very acceptable
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>10. Dorm group activities (e.g., dinners)：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="willing" v-model="questionnaire.groupActivities" required> 
                      Willing
                    </label>
                    <label>
                      <input type="radio" value="notWilling" v-model="questionnaire.groupActivities"> 
                      Not very willing
                    </label>
                  </div>
                </div>
              </div>

              <!-- IV. Hygiene and Organization -->
              <div class="form-section">
                <h3>IV. Hygiene and Organization</h3>
                
                <div class="form-group">
                  <label>11. Hygiene standards：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="high" v-model="questionnaire.cleanliness" required> 
                      High (clean often)
                    </label>
                    <label>
                      <input type="radio" value="casual" v-model="questionnaire.cleanliness"> 
                      Casual (once a week or less)
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>12. Personal item organization：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="tidy" v-model="questionnaire.organization" required> 
                      Tidy (keep items in place)
                    </label>
                    <label>
                      <input type="radio" value="casual" v-model="questionnaire.organization"> 
                      Relatively casual
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>13. Roommate hygiene standards：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="mind" v-model="questionnaire.mindMessy" required> 
                      I mind if they're not clean
                    </label>
                    <label>
                      <input type="radio" value="notMind" v-model="questionnaire.mindMessy"> 
                      I don't mind too much
                    </label>
                  </div>
                </div>
              </div>

              <!-- V. Study and Noise -->
              <div class="form-section">
                <h3>V. Study and Noise</h3>
                
                <div class="form-group">
                  <label>14. Quiet study environment：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="yes" v-model="questionnaire.quietStudy" required> 
                      Yes
                    </label>
                    <label>
                      <input type="radio" value="no" v-model="questionnaire.quietStudy"> 
                      No
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>15. Tolerance for indoor noise (chatting/keyboard/music)：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="low" v-model="questionnaire.noiseTolerance" required> 
                      Low tolerance
                    </label>
                    <label>
                      <input type="radio" value="high" v-model="questionnaire.noiseTolerance"> 
                      High tolerance
                    </label>
                  </div>
                </div>
              </div>

              <!-- VI. Other Preferences -->
              <div class="form-section">
                <h3>VI. Other Preferences</h3>
                
                <div class="form-group">
                  <label>16. Eating in the dorm：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.eatingInRoom" required> 
                      Often
                    </label>
                    <label>
                      <input type="radio" value="rarely" v-model="questionnaire.eatingInRoom"> 
                      Rarely
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>17. Using perfume/fragrance：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="often" v-model="questionnaire.fragrance" required> 
                      Often
                    </label>
                    <label>
                      <input type="radio" value="never" v-model="questionnaire.fragrance"> 
                      Never
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>18. Sensitivity to smells (food/fragrance)：</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" value="mind" v-model="questionnaire.mindSmell" required> 
                      I mind
                    </label>
                    <label>
                      <input type="radio" value="notMind" v-model="questionnaire.mindSmell"> 
                      I don't mind
                    </label>
                  </div>
                </div>
              </div>

              <!-- Special Needs -->
              <div class="form-group">
                <label for="special-request">Special Needs (Optional)：</label>
                <textarea 
                  id="special-request" 
                  rows="3" 
                  placeholder="E.g., need lower bunk, special care due to health reasons, etc."
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
          
          <!-- My Dormitory Assignment Result -->
          <!-- <div class="result-card">
            <h2><i class="bi bi-house-check"></i> My Dormitory Assignment Result</h2>
            <div class="result-content">
              <div v-if="!assignmentResult" class="result-pending">
                <i class="bi bi-hourglass-split"></i>
                <p>Your dormitory assignment result has not been announced yet</p>
                <p class="small-text">Please complete the dormitory preference questionnaire first</p>
              </div>
              
              <div v-else class="result-detail">
                <div class="result-item">
                  <span>Dorm Building：</span>
                  <strong>{{ assignmentResult.building }}</strong>
                </div>
                <div class="result-item">
                  <span>Room Number：</span>
                  <strong>{{ assignmentResult.room }}</strong>
                </div>
                <div class="result-item">
                  <span>Bed Number：</span>
                  <strong>{{ assignmentResult.bed }}</strong>
                </div>
                <div class="result-item">
                  <span>Roommates：</span>
                  <strong>{{ assignmentResult.roommate }}</strong>
                </div>
                <button class="btn-contact">
                  <i class="bi bi-chat-left-text"></i> Contact Roommates
                </button>
              </div>
            </div>
          </div> -->
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { submitDormSurvey, getDormSurvey } from '@/api/student'

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
      // assignmentResult: null
    }
  },
  computed: {
    submitText() {
      if (this.isSubmitting) return 'Submitting...'
      return 'Submit Questionnaire'
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
      // 验证所有必填项
      const requiredFields = [
        'sleepTime', 'wakeUpTime', 'nap',
        'smoking', 'mindSmoking', 'gaming', 'headphone',
        'chatting', 'friendsVisit', 'groupActivities', // 注意这里字段名要跟data里的一致
        'cleanliness', 'organization', 'mindMessy',
        'quietStudy', 'noiseTolerance',
        'eatingInRoom', 'fragrance', 'mindSmell'
      ]
      
      for (const field of requiredFields) {
        if (!this.questionnaire[field]) {
          alert('Please complete all required questions')
          return
        }
      }
      
      this.isSubmitting = true
      try {
        // 转换表单数据为API格式
        const surveyData = {
          sleep_time_pref: this.questionnaire.sleepTime === 'before12' ? 1 : 2,
          wake_time_pref: this.questionnaire.wakeUpTime === 'before7' ? 1 : 2,
          nap_habit: this.questionnaire.nap === 'yes' ? 1 : 2,
          smoking_status: this.questionnaire.smoking === 'yes' ? 1 : 2,
          roommate_smoke_accept: this.questionnaire.mindSmoking === 'no' ? 1 : 2,
          gaming_freq: this.questionnaire.gaming === 'often' ? 1 : 2,
          headphone_usage: this.questionnaire.headphone === 'often' ? 1 : 2,
          chatting_pref: this.questionnaire.chatting === 'like' ? 1 : 2,
          guest_acceptance: this.questionnaire.friendsVisit === 'accept' ? 1 : 2,
          group_activity_willingness: this.questionnaire.groupActivities === 'willing' ? 1 : 2,
          hygiene_requirement: this.questionnaire.cleanliness === 'high' ? 1 : (this.questionnaire.cleanliness === 'casual' ? 3 : 2),
          organization_level: this.questionnaire.organization === 'tidy' ? 1 : 2,
          roommate_hygiene_tolerance: this.questionnaire.mindMessy === 'mind' ? 1 : 2,
          quiet_study_need: this.questionnaire.quietStudy === 'yes' ? 1 : 2,
          noise_tolerance_level: this.questionnaire.noiseTolerance === 'low' ? 1 : 2,
          dorm_food_freq: this.questionnaire.eatingInRoom === 'often' ? 1 : 2,
          fragrance_usage: this.questionnaire.fragrance === 'often' ? 1 : 2,
          smell_sensitivity: this.questionnaire.mindSmell === 'mind' ? 1 : 2,

          // 🔥 关键修改：将特殊需求发给后端对应的 self_introduction 字段
          self_introduction: this.questionnaire.specialRequest
        }

        // 补充具体时间字段，防止后端报错
        if (this.questionnaire.sleepTime === 'before12') {
          surveyData.sleep_time = '23:00:00'
        } else {
          surveyData.sleep_time = '00:30:00'
        }

        if (this.questionnaire.wakeUpTime === 'before7') {
          surveyData.wake_up_time = '06:30:00'
        } else {
          surveyData.wake_up_time = '07:30:00'
        }

        const result = await submitDormSurvey(surveyData)

        if (result.code === 1) {
          // ✅ Modified to waiting prompt
          alert('Questionnaire submitted successfully! Your preferences have been recorded. Please wait for the administrator to conduct AI intelligent assignment.')
          await this.loadQuestionnaire() // Only display questionnaire

          // ❌ Do not call loadMyDormResult() as assignment hasn't been made yet
        } else {
          alert(result.msg || 'Submission failed')
        }
      } catch (error) {
        console.error('Failed to submit questionnaire:', error)
        alert(error.message || 'Submission failed, please try again later')
      } finally {
        this.isSubmitting = false
      }
    },
    async loadQuestionnaire() {
      try {
        const result = await getDormSurvey()
        if (result.code === 1 && result.data) {
          const data = result.data
          // 回显数据到表单
          this.questionnaire.sleepTime = data.sleep_time_pref === 1 ? 'before12' : 'after12'
          this.questionnaire.wakeUpTime = data.wake_time_pref === 1 ? 'before7' : 'after7'
          this.questionnaire.nap = data.nap_habit === 1 ? 'yes' : 'no'
          this.questionnaire.smoking = data.smoking_status === 1 ? 'yes' : 'no'
          this.questionnaire.mindSmoking = data.roommate_smoke_accept === 1 ? 'no' : 'yes'
          this.questionnaire.gaming = data.gaming_freq === 1 ? 'often' : 'rarely'
          this.questionnaire.headphone = data.headphone_usage === 1 ? 'often' : 'rarely'
          this.questionnaire.chatting = data.chatting_pref === 1 ? 'like' : 'quiet'
          this.questionnaire.guest = data.guest_acceptance === 1 ? 'accept' : 'mind'
          this.questionnaire.activity = data.group_activity_willingness === 1 ? 'willing' : 'reluctant'
          this.questionnaire.cleanliness = data.hygiene_requirement === 1 ? 'strict' : (data.hygiene_requirement === 2 ? 'normal' : 'casual')
          this.questionnaire.organization = data.organization_level === 1 ? 'high' : 'low'
          this.questionnaire.mindMessy = data.roommate_hygiene_tolerance === 1 ? 'notMind' : 'mind'
          this.questionnaire.quietStudy = data.quiet_study_need === 1 ? 'yes' : 'no'
          this.questionnaire.noiseTolerance = data.noise_tolerance_level === 1 ? 'low' : 'high'
          this.questionnaire.eatingInRoom = data.dorm_food_freq === 1 ? 'often' : 'rarely'
          this.questionnaire.fragrance = data.fragrance_usage === 1 ? 'often' : 'never'
          this.questionnaire.mindSmell = data.smell_sensitivity === 1 ? 'mind' : 'notMind'
        }
      } catch (error) {
        console.error('加载问卷失败:', error)
      }
    }
  },
  async mounted() {
    await this.loadQuestionnaire()
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

/* .result-card {
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
/* .result-content {
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
} */

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