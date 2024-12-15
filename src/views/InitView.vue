<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-gray-100 mb-8">
        Initialize Lanes
      </h2>

      <div class="space-y-6">
        <div class="flex flex-col">
          <label 
            for="laneCount" 
            class="text-sm font-medium text-gray-300 mb-2"
          >
            Number of Lanes:
          </label>
          <input
            type="number"
            id="laneCount"
            v-model="laneCount"
            min="1"
            max="99"
            class="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
        </div>

        <button 
          @click="initialize"
          class="w-full bg-blue-600 text-gray-100 py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
  if (laneCount.value > 99) {
    alert('Maximum number of lanes is 99');
    return;
  }

  if (laneCount.value < 1) {
    alert('Minimum number of lanes is 1');
    return;
  }

  store.initializeLanes(laneCount.value);
  router.push('/vue-range-app/lanes');
};
</script>  