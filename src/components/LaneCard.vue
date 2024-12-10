<template>
  <div class="relative">
  <!-- Compact Card/Button -->
  <div 
    @click="openModal"
    class="cursor-pointer rounded-lg shadow-md p-3 hover:shadow-xl hover:scale-105 transition-all w-32 min-h-[100px] flex flex-col justify-between text-center border-2"
    :class="statusClass(lane.status)"
  >
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
  // If the lane is 'Open', reset the temporary start time and clear it from the card
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
    console.warn("No time input provided.");
    showModal.value = false;
    return;
  }

  const [hours, minutes] = temporaryStartTime.value.split(':');
  if (!hours || !minutes) {
    console.error("Invalid time format.");
    showModal.value = false;
    return;
  }

  const today = new Date();
  today.setHours(parseInt(hours), parseInt(minutes), 0);

  if (isNaN(today.getTime())) {
    console.error("Invalid time value.");
    showModal.value = false;
    return;
  }

  store.updateLaneStartTime(props.lane.id, today.toISOString());
  showModal.value = false;
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
  // If the status is being set to 'Open', clear the temporary start time and update the lane
  if (status === 'Open') {
    temporaryStartTime.value = ''; // Clear the time when the status is set to 'Open'
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
