<template>
    <div class="bg-white rounded-lg shadow-md p-1 hover:shadow-lg transition-shadow w-56">
      <h3 class="text-2xl text-center font-bold text-gray-800">{{ lane.id }}</h3>
      
      <div class="space-y-4">
        <select
          :value="lane.status"
          @change="updateStatus($event)"
          class="w-full px-4 py-2 rounded-md border focus:ring-2 focus:outline-none transition-colors"
          :class="{
            'bg-purple-800 border-purple-300 text-purple-100': lane.status === 'Executive',
            'bg-amber-700 border-amber-300 text-amber-100': lane.status === 'Instructor',
            'bg-red-950 border-red-300 text-red-100': lane.status === 'Member',
            'bg-teal-700 border-teal-300 text-teal-100': lane.status === 'Guest',
            'bg-zinc-950 border-zinc-300 text-zinc-100': lane.status === 'Down',
            'bg-green-500 border-green-300 text-green-100': lane.status === 'Open'
          }"
        >
          <option 
            v-for="status in statuses" 
            :key="status" 
            :value="status"
            class="bg-zinc-100 text-zinc-900"
          >
            {{ status }}
          </option>
        </select>
  
        <div 
          v-if="lane.started_at" 
          class="text-sm text-gray-600 flex items-center space-x-2"
        >
          <span class="font-medium">Started:</span>
          <span>{{ new Date(lane.started_at).toLocaleString() }}</span>
        </div>
        <div 
          v-else
          class="text-sm text-gray-600 flex items-center space-x-2"
        >
          <span class="font-medium">Started:</span>
          <span>No start time</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Lane } from '../types/lane';
  import { useLaneStore } from '../stores/lanes';
  
  const props = defineProps<{
    lane: Lane
  }>();
  
  const store = useLaneStore();
  const statuses = ['Executive', 'Instructor', 'Member', 'Guest', 'Down', 'Open'];
  
  const updateStatus = (event: Event) => {
    const status = (event.target as HTMLSelectElement).value as Lane['status'];
    store.updateLaneStatus(props.lane.id, status);
  };
  </script>  