<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
          Initialize Lanes
        </h2>
  
        <div class="space-y-6">
          <div class="flex flex-col">
            <label 
              for="laneCount" 
              class="text-sm font-medium text-gray-700 mb-2"
            >
              Number of Lanes:
            </label>
            <input
              type="number"
              id="laneCount"
              v-model="laneCount"
              min="1"
              class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
          </div>
  
          <button 
            @click="initialize"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Initialize
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'
  import { useLaneStore } from '../stores/lanes';
  
  const router = useRouter();
  const store = useLaneStore();
  const laneCount = ref(1);
  
  const initialize = () => {
    store.initializeLanes(laneCount.value);
    router.push('/lanes')
  };
  </script>  