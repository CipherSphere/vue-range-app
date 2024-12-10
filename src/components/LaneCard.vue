<template>
  <div class="relative">
    <!-- Compact Card/Button -->
    <div 
      @click="showModal = true"
      class="cursor-pointer rounded-lg shadow-md p-3 hover:shadow-xl hover:scale-105 transition-all w-32 min-h-[100px] flex flex-col justify-between text-center border-2"
      :class="statusClass(lane.status)"
    >
      <h3 class="text-3xl font-bold">{{ lane.id }}</h3>
      <div class="text-sm font-semibold">{{ lane.status }}</div>
      <div class="text-xs opacity-80 h-[1.2em]">{{ formatTimeForInput(lane.started_at) }}</div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-zinc-900 rounded-lg p-6 w-80 border border-zinc-700 shadow-xl">
        <h2 class="text-2xl font-bold mb-6 text-white">Lane {{ lane.id }}</h2>
        
        <div class="space-y-6">
          <!-- Status Buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="status in statuses"
              :key="status"
              @click="updateStatus(status)"
              class="p-3 rounded-lg text-white font-semibold transition-all hover:scale-105 border-2"
              :class="[statusClass(status), { 'ring-4 ring-offset-2 ring-offset-zinc-900': status === lane.status }]"
            >
              {{ status }}
            </button>
          </div>

          <!-- Start Time -->
          <div class="flex items-center space-x-3">
            <span class="font-medium text-white">Start Time:</span>
            <input 
              type="time" 
              :value="formatTimeForInput(lane.started_at)"
              @change="updateStartTime"
              class="px-3 py-2 rounded-lg bg-zinc-800 border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <!-- Close Button -->
          <button 
            @click="showModal = false"
            class="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg py-3 mt-4 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Lane } from '../types/lane';
import { useLaneStore } from '../stores/lanes';

const props = defineProps<{
  lane: Lane;
}>();

const showModal = ref(false);
const store = useLaneStore();
const statuses: Lane['status'][] = ['Executive', 'Instructor', 'Member', 'Guest', 'Down', 'Open'];

// Update Lane Status
const updateStatus = (status: Lane['status']) => {
  store.updateLaneStatus(props.lane.id, status);
  showModal.value = false;
};

// Format Time for Input
const formatTimeForInput = (date: string | null): string => {
  if (!date) return '';
  const parsedDate = new Date(date);
  return parsedDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

// Update Start Time
const updateStartTime = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const newTime = input?.value || '';
  const [hours, minutes] = newTime.split(':');
  const today = new Date();
  today.setHours(parseInt(hours), parseInt(minutes), 0);
  store.updateLaneStartTime(props.lane.id, today.toISOString());
};

// Dynamic Status Class Binding
const statusClass = (status: Lane['status']) => {
  return {
    'bg-purple-900 text-purple-100 border-purple-400': status === 'Executive',
    'bg-amber-800 text-amber-100 border-amber-400': status === 'Instructor',
    'bg-red-900 text-red-100 border-red-400': status === 'Member',
    'bg-teal-800 text-teal-100 border-teal-400': status === 'Guest',
    'bg-zinc-900 text-zinc-100 border-zinc-400': status === 'Down',
    'bg-green-700 text-green-100 border-green-400': status === 'Open',
  };
};
</script>
