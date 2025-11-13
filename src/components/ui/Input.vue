<!-- src/components/ui/Input.vue -->
<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
      :readonly="readonly" :class="inputClasses" @input="handleInput" @focus="handleFocus" @blur="handleBlur" />
    <div v-if="error" class="input-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiInput' })
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  placeholder?: string
  label?: string
  disabled?: boolean
  readonly?: boolean
  error?: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'medium'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'focus': [event: Event]
  'blur': [event: Event]
}>()

// 生成唯一ID
const id = `input_${Math.random().toString(36).substr(2, 9)}`

// 输入框类名
const inputClasses = computed(() => [
  'input',
  `input--${props.size}`,
  {
    'input--error': props.error,
    'input--disabled': props.disabled
  }
])

// 事件处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: Event) => {
  emit('focus', event)
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-block-end: 4px;
}

.input {
  inline-size: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: #fff;
  outline: none;
}

.input:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.input--small {
  padding: 6px 10px;
  font-size: 12px;
}

.input--medium {
  padding: 8px 12px;
  font-size: 14px;
}

.input--large {
  padding: 10px 14px;
  font-size: 16px;
}

.input--error {
  border-color: #ff4d4f;
}

.input--error:focus {
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

.input--disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.input-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-block-start: 2px;
}
</style>
