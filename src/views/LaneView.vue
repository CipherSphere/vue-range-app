<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto">
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

const store = useLaneStore();
</script>