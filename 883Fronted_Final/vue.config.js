const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,  // 禁用 ESLint 检查
  devServer: {
    proxy: {
      // 代理AI分析服务请求
      '/api/analyze': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        logLevel: 'debug'
      }
    }
  }
})