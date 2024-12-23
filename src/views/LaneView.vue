<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center p-6">
    <!-- Lanes Section -->
    <div class="w-3/4 mb-8">
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

    <!-- Waitlist Section -->
    <div class="w-3/4 bg-gray-800 p-6 rounded-md shadow-md">
      <h2 class="text-gray-100 text-lg font-semibold mb-4">Waitlist</h2>
      <form @submit.prevent="addComment" class="mb-6 flex gap-2">
        <input 
          v-model="newComment" 
          type="text" 
          placeholder="Write a message..." 
          class="flex-grow px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          class="bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded-md transition-colors duration-200"
        >
          Submit
        </button>
      </form>
      <ul>
        <li 
          v-for="(comment, index) in comments" 
          :key="index" 
          class="flex justify-between items-center bg-gray-700 text-gray-100 px-4 py-2 mb-2 rounded-md"
        >
          <span>{{ index + 1 }}. {{ comment }}</span>
          <button 
            @click="removeComment(index)" 
            class="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLaneStore } from '@/stores/lanes';
import LaneCard from '@/components/LaneCard.vue';
import { useRouter } from 'vue-router';

const store = useLaneStore();
const router = useRouter();

// For waitlist comments
const newComment = ref('');
const comments = ref<string[]>([]);

const addComment = () => {
  if (newComment.value.trim() !== '') {
    comments.value.push(newComment.value.trim());
    newComment.value = '';
  }
};

const removeComment = (index: number) => {
  comments.value.splice(index, 1);
};

const handleReset = () => {
  store.uninitializeLanes();
  router.push('/vue-range-app/');
};
</script>
