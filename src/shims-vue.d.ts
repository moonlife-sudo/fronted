// vue类型声明文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/*' {
  const value: any
  export default value
}

declare module '@/views/*' {
  const value: any
  export default value
}

declare module '@/stores/*' {
  const value: any
  export default value
}
