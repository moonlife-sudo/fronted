// create-structure.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 因为ESM中没有__dirname，所以需要模拟
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 定义完整的目录结构
const structure = {
  // Components
  'src/components/layout': ['AppHeader.vue', 'AppSidebar.vue', 'AppFooter.vue'],
  'src/components/ui': ['Button.vue', 'Input.vue', 'Card.vue', 'Modal.vue'],
  'src/components/auth': ['LoginForm.vue', 'RegisterForm.vue'],
  'src/components/teaching': [
    'CourseCard.vue',
    'LessonPlayer.vue',
    'QuizComponent.vue',
    'ProgressTracker.vue',
  ],
  'src/components/reservation': ['ResourceCard.vue', 'CalendarView.vue', 'BookingForm.vue'],
  'src/components/campus': [],
  'src/components/profile': ['UserCard.vue', 'AvatarUpload.vue', 'SettingsForm.vue'],

  // Views
  'src/views/auth': ['Login.vue', 'Register.vue'],
  'src/views/teaching': ['Index.vue', 'CourseDetail.vue', 'LearningPath.vue'],
  'src/views/reservation': ['Index.vue'],
  'src/views/campus': ['Index.vue'],
  'src/views/profile': ['Index.vue', 'Settings.vue', 'History.vue'],
  'src/views': ['Home.vue'], // Home.vue 放在 views 根目录

  // Assets
  'src/assets/styles/components': ['button.css', 'form.css', 'card.css', 'modal.css'],
  'src/assets/styles/layouts': ['header.css', 'sidebar.css', 'footer.css'],
  'src/assets/styles/pages/auth': ['login.css', 'register.css'],
  'src/assets/styles/pages/teaching': ['index.css', 'course-detail.css'],
  'src/assets/styles/pages/reservation': ['index.css'],
  'src/assets/styles/pages/campus': ['index.css'],
  'src/assets/styles/pages/profile': ['index.css', 'settings.css'],
  'src/assets/images': [],
  'src/assets/styles': ['main.css', 'variables.css'],

  // 其他目录
  'src/composables': [
    'useAuth.js',
    'useApi.js',
    'useTeaching.js',
    'useReservation.js',
    'useCampus.js',
    'useProfile.js',
  ],
  'src/stores': [
    'authStore.js',
    'teachingStore.js',
    'reservationStore.js',
    'campusStore.js',
    'profileStore.js',
  ],
  'src/router/routes': ['auth.js', 'teaching.js', 'reservation.js', 'campus.js', 'profile.js'],
  'src/utils': ['http.js', 'date.js', 'validation.js'],
  'src/config': ['api.js', 'app.js'],
  'src/router': ['index.js'],
}

console.log('开始检查并创建缺失的目录和文件...\n')

let createdCount = 0

// 递归创建目录和文件
Object.entries(structure).forEach(([dirPath, files]) => {
  // 创建目录（如果不存在）
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`✅ 创建目录: ${dirPath}`)
    createdCount++
  }

  // 创建文件（如果不存在）
  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '// 自动创建的文件\n')
      console.log(`✅ 创建文件: ${filePath}`)
      createdCount++
    }
  })
})

console.log(`\n🎉 完成！共创建了 ${createdCount} 个目录和文件`)
console.log('📁 你之前创建的文件保持不变')
