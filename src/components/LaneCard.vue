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

      <div class="text-sm text-gray-600 flex flex-col space-y-2">
        <span class="font-medium">Started:</span>
        <input 
          type="time" 
          :value="formatTimeForInput(lane.started_at)"
          @change="updateStartTime($event)"
          class="px-2 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
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

const formatTimeForInput = (date: string | null): string => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

const updateStartTime = (event: Event) => {
  const newTime = (event.target as HTMLInputElement).value;
  const today = new Date();
  const [hours, minutes] = newTime.split(':');
  today.setHours(parseInt(hours), parseInt(minutes), 0);
  store.updateLaneStartTime(props.lane.id, today.toISOString());
};
</script>