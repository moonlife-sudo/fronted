<!-- src/components/ui/Modal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" :class="modalClasses" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button v-if="closable" class="modal-close" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppModal'
})

interface Props {
  visible: boolean
  title?: string
  closable?: boolean
  maskClosable?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  maskClosable: true,
  size: 'medium'
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'close': []
}>()

const modalClasses = [
  'modal',
  `modal--${props.size}`
]

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  inset-block-end: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal--small {
  inline-size: 400px;
}

.modal--medium {
  inline-size: 600px;
}

.modal--large {
  inline-size: 800px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-block-end: 1px solid #e8e8e8;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  inline-size: 24px;
  block-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
  max-block-size: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 20px;
  border-block-start: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
