// vue类型声明文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '@/*' {
  const value: unknown
  export default value
}

declare module '@/views/*' {
  const value: unknown
  export default value
}

declare module '@/stores/*' {
  const value: unknown
  export default value
}
