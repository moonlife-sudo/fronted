<!-- src/components/ui/Card.vue -->
<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UiCard'
})

interface Props {
  title?: string
  shadow?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shadow: true,
  bordered: true
})

const cardClasses = [
  'card',
  {
    'card--shadow': props.shadow,
    'card--bordered': props.bordered
  }
]
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.card--shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card--bordered {
  border: 1px solid #e8e8e8;
}

.card-header {
  padding: 16px;
  border-block-end: 1px solid #e8e8e8;
  background: #fafafa;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 16px;
  border-block-start: 1px solid #e8e8e8;
  background: #fafafa;
}
</style>
