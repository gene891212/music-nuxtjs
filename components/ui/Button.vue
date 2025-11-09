<template>
  <component :is="as" :class="buttonClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils'

interface ButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  as?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'md',
  as: 'button',
})

const buttonClasses = computed(() => {
  return cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700': props.variant === 'default',
      'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700':
        props.variant === 'ghost',
      'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700':
        props.variant === 'outline',
      'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700':
        props.variant === 'danger',
    },
    {
      'h-8 px-3 text-sm': props.size === 'sm',
      'h-10 px-4 text-base': props.size === 'md',
      'h-12 px-6 text-lg': props.size === 'lg',
      'h-10 w-10 p-0': props.size === 'icon',
    }
  )
})
</script>
