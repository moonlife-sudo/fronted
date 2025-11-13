<!-- src/components/ui/Button.vue -->
<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled || loading" @click="handleClick">
    <span v-if="loading" class="button-loading">⏳</span>
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BaseButton'
})

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium'
})

const emit = defineEmits<{
  'click': [event: MouseEvent]
}>()

const buttonClasses = [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
  {
    'button--disabled': props.disabled,
    'button--loading': props.loading
  }
]

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  outline: none;
  text-decoration: none;
}

.button--small {
  padding: 6px 12px;
  font-size: 12px;
}

.button--medium {
  padding: 8px 16px;
  font-size: 14px;
}

.button--large {
  padding: 10px 20px;
  font-size: 16px;
}

.button--primary {
  background-color: #2A5CAA;
  color: white;
}

.button--primary:hover:not(.button--disabled) {
  background-color: #1e4a8a;
}

.button--secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.button--secondary:hover:not(.button--disabled) {
  background-color: #e8e8e8;
}

.button--outline {
  background-color: transparent;
  color: #2A5CAA;
  border: 1px solid #2A5CAA;
}

.button--outline:hover:not(.button--disabled) {
  background-color: rgba(42, 92, 170, 0.1);
}

.button--text {
  background-color: transparent;
  color: #2A5CAA;
  border: none;
}

.button--text:hover:not(.button--disabled) {
  background-color: rgba(42, 92, 170, 0.1);
}

.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--loading {
  cursor: wait;
}

.button-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
