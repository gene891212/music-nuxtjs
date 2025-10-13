<script setup lang="ts">
import { computed, ref } from 'vue'

interface SliderProps {
  modelValue: number
  min?: number
  max?: number
  step?: number
}

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const isDragging = ref(false)
const sliderRef = ref<HTMLDivElement>()

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const updateValue = (event: MouseEvent) => {
  if (!sliderRef.value) return
  
  const rect = sliderRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const percentage = x / rect.width
  const value = props.min + percentage * (props.max - props.min)
  const steppedValue = Math.round(value / props.step) * props.step
  
  emit('update:modelValue', Math.max(props.min, Math.min(props.max, steppedValue)))
}

const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  updateValue(event)
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
      updateValue(e)
    }
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<template>
  <div
    ref="sliderRef"
    class="relative h-1 w-full cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
    @mousedown="handleMouseDown"
  >
    <div
      class="absolute h-full rounded-full bg-primary-500 transition-all"
      :style="{ width: `${percentage}%` }"
    />
    <div
      class="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white border-2 border-primary-500 shadow-md transition-all"
      :class="{ 'scale-125': isDragging }"
      :style="{ left: `calc(${percentage}% - 6px)` }"
    />
  </div>
</template>
