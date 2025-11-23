<template>
  <div
    class="bg-gray-50 min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex flex-col lg:overflow-hidden"
  >
    <!-- Main Content - Responsive Layout -->
    <div
      class="flex-1 flex flex-col lg:flex-row lg:overflow-hidden gap-2 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-6 max-w-[1800px] mx-auto w-full"
    >
      <!-- Left Side -->
      <div
        class="w-full lg:flex-1 flex flex-col bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden"
        :class="leftClass"
      >
        <slot name="left"></slot>
      </div>

      <!-- Right Side -->
      <div
        class="w-full lg:flex-1 flex flex-col bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden"
        :class="rightClass"
      >
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  leftClass: {
    type: String,
    default: '',
  },
  rightClass: {
    type: String,
    default: '',
  },
})
</script>
