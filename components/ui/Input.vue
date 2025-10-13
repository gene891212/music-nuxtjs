<script setup lang="ts">
import { cn } from '~/utils'

interface InputProps {
  modelValue?: string
  placeholder?: string
  type?: string
  class?: string
}

defineProps<InputProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    :type="type || 'text'"
    :placeholder="placeholder"
    :class="cn(
      'flex h-12 w-full rounded-full border border-gray-200 bg-gray-100 px-4 py-2',
      'text-sm transition-colors',
      'placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white',
      'disabled:cursor-not-allowed disabled:opacity-50',
      $props.class
    )"
    @input="handleInput"
  />
</template>
