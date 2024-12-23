<template>
  <div class="relative">
    <!-- Compact Card/Button -->
    <div 
      @click="openModal"
      class="cursor-pointer rounded-lg shadow-md p-3 hover:shadow-xl hover:scale-105 transition-all w-32 min-h-[100px] flex flex-col justify-between text-center border-2"
      :class="statusClass(lane.status)"
    >
      <!-- Rental Icon -->
      <div v-if="lane.isRental" class="absolute top-2 right-2 text-yellow-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4H8l4-4 4 4h-3v4z" />
        </svg>
      </div>

      <h3 class="text-3xl font-bold">{{ lane.id }}</h3>
      <div class="text-sm font-semibold">{{ lane.status }}</div>
      
      <!-- Conditional Time Display: Only show time if the status is not 'Open' -->
      <div v-if="lane.status !== 'Open'" class="text-xs opacity-80 h-[1.2em]">{{ formatTimeForInput(lane.started_at) }}</div>
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
              :class="[statusClass(status), { 'ring-4 ring-offset-2 ring-offset-zinc-900': status === lane.status }]">
              {{ status }}
            </button>
          </div>

          <!-- Rental Toggle -->
          <button 
            @click="toggleRental"
            class="w-full bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg py-3 font-semibold transition-colors"
          >
            {{ lane.isRental ? 'Remove Rental' : 'Mark as Rental' }}
          </button>

          <!-- Start Time (Hidden if status is "Open") -->
          <div v-if="lane.status !== 'Open'" class="flex items-center space-x-3">
            <span class="font-medium text-white">Start Time:</span>
            <input 
              type="time" 
              :value="temporaryStartTime"
              @input="onInputTime"
              class="px-3 py-2 rounded-lg bg-zinc-800 border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <!-- Close Button -->
          <button 
            @click="closeModal"
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
const temporaryStartTime = ref('');
const store = useLaneStore();
const statuses: Lane['status'][] = ['Executive', 'Instructor', 'Member', 'Guest', 'Down', 'Open'];

// Open Modal and Initialize Temporary Time
const openModal = () => {
  if (props.lane.status === 'Open') {
    temporaryStartTime.value = '';
  } else {
    temporaryStartTime.value = formatTimeForInput(props.lane.started_at);
  }
  showModal.value = true;
};

// Close Modal and Update Start Time
const closeModal = () => {
  if (!temporaryStartTime.value) {
    showModal.value = false;
    return;
  }

  const [hours, minutes] = temporaryStartTime.value.split(':');
  const today = new Date();
  today.setHours(parseInt(hours), parseInt(minutes), 0);

  store.updateLaneStartTime(props.lane.id, today.toISOString());
  showModal.value = false;
};

// Toggle Rental Status
const toggleRental = () => {
  store.toggleRentalStatus(props.lane.id);
};

// Format Time for Input
const formatTimeForInput = (date: string | null): string => {
  if (!date) return '';
  const parsedDate = new Date(date);
  return parsedDate.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Handle Time Input
const onInputTime = (event: Event) => {
  const input = event.target as HTMLInputElement;
  temporaryStartTime.value = input.value;
};

// Update Lane Status
const updateStatus = (status: Lane['status']) => {
  if (status === 'Open') {
    temporaryStartTime.value = '';
  }
  store.updateLaneStatus(props.lane.id, status);
  showModal.value = false;
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
