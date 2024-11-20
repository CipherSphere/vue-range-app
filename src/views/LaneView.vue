<template>
  <div class="min-h-screen bg-gray-900 p-6">
    <div class="mx-auto">
      <div class="flex justify-end mb-4">
        <button 
          @click="handleReset" 
          class="bg-red-600 hover:bg-red-700 text-gray-100 px-4 py-2 rounded-md transition-colors duration-200"
        >
          Reset All Lanes
        </button>
      </div>
      <div class="flex flex-wrap gap-1 justify-center">
        <LaneCard
          v-for="lane in store.lanes"
          :key="lane.id"
          :lane="lane"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLaneStore } from '@/stores/lanes';
import LaneCard from '@/components/LaneCard.vue';
import { useRouter } from 'vue-router';

const store = useLaneStore();
const router = useRouter();

const handleReset = () => {
  store.uninitializeLanes();
  router.push('/');
};
</script>