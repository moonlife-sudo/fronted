<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
  background-color: #f5f7fa;
  /* 统一背景色 */
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* 这里的 CSS 是全局性的，但移除了导致偏移的 .main-content 样式 */
#app {
  min-block-size: 100vh;
}
</style>