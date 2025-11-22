// 学生相关API
import { get, post } from '@/utils/request'

/**
 * 提交宿舍综合问卷
 */
export function submitDormSurvey(data) {
  return post('/student/dorm/survey', data)
}

/**
 * 查询宿舍综合问卷
 */
export function getDormSurvey() {
  return get('/student/dorm/survey')
}

