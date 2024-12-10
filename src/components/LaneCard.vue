<template>
  <div class="relative">
    <!-- Compact Card/Button -->
    <div 
      @click="showModal = true"
      class="cursor-pointer rounded-lg shadow-md p-3 hover:shadow-xl hover:scale-105 transition-all w-32 min-h-[100px] flex flex-col justify-between text-center border-2"
      :class="{
        'bg-purple-900 text-purple-100 border-purple-400': lane.status === 'Executive',
        'bg-amber-800 text-amber-100 border-amber-400': lane.status === 'Instructor',
        'bg-red-900 text-red-100 border-red-400': lane.status === 'Member',
        'bg-teal-800 text-teal-100 border-teal-400': lane.status === 'Guest',
        'bg-zinc-900 text-zinc-100 border-zinc-400': lane.status === 'Down',
        'bg-green-700 text-green-100 border-green-400': lane.status === 'Open'
      }"
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
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="status in statuses"
              :key="status"
              @click="updateStatus(status)"
              class="p-3 rounded-lg text-white font-semibold transition-all hover:scale-105 border-2"
              :class="{
                'bg-purple-900 border-purple-400 hover:bg-purple-800': status === 'Executive',
                'bg-amber-800 border-amber-400 hover:bg-amber-700': status === 'Instructor',
                'bg-red-900 border-red-400 hover:bg-red-800': status === 'Member',
                'bg-teal-800 border-teal-400 hover:bg-teal-700': status === 'Guest',
                'bg-zinc-900 border-zinc-400 hover:bg-zinc-800': status === 'Down',
                'bg-green-700 border-green-400 hover:bg-green-600': status === 'Open',
                'ring-4 ring-offset-2 ring-offset-zinc-900': status === lane.status
              }"
            >
              {{ status }}
            </button>
          </div>

          <div class="flex items-center space-x-3">
            <span class="font-medium text-white">Start Time:</span>
            <input 
              type="time" 
              :value="formatTimeForInput(lane.started_at)"
              @change="updateStartTime($event)"
              class="px-3 py-2 rounded-lg bg-zinc-800 border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

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
  lane: Lane
}>();

const showModal = ref(false);
const store = useLaneStore();
const statuses = ['Executive', 'Instructor', 'Member', 'Guest', 'Down', 'Open'];

const updateStatus = (status: Lane['status']) => {
  store.updateLaneStatus(props.lane.id, status);
  showModal.value = false;
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
  <span>{{ formatTime(lane.started_at) }}</span>
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
  lane: Lane;
}>();

const store = useLaneStore();
const statuses: Lane['status'][] = ['Executive', 'Instructor', 'Member', 'Guest', 'Down', 'Open'];

const updateStatus = (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    const status = target.value as Lane['status'];
    store.updateLaneStatus(props.lane.id, status);
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

</script>
