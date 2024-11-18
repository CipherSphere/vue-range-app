import { defineStore } from 'pinia';
import type { Lane } from '../types/lane';

export const useLaneStore = defineStore('lanes', {
  state: () => ({
    lanes: [] as Lane[],
    isInitialized: false
  }),

  actions: {
    initializeLanes(laneCount: number) {
      this.lanes = Array.from({ length: laneCount }, (_, index) => ({
        id: index + 1,
        status: 'Open',
        started_at: null
      }));
      this.isInitialized = true;
      this.saveLanesToStorage();
    },

    updateLaneStatus(laneId: number, status: Lane['status']) {
      const lane = this.lanes.find(l => l.id === laneId);
    
      if (lane) {
        lane.status = status;
        lane.started_at = new Date().toISOString();
        this.saveLanesToStorage();
      }
    },

    loadFromStorage() {
      const storedLanes = localStorage.getItem('lanes');
      const storedInit = localStorage.getItem('isInitialized');
      
      if (storedLanes && storedInit) {
        this.lanes = JSON.parse(storedLanes);
        this.isInitialized = JSON.parse(storedInit);
      }
    },

    saveLanesToStorage() {
      localStorage.setItem('lanes', JSON.stringify(this.lanes));
      localStorage.setItem('isInitialized', JSON.stringify(this.isInitialized));
    },

    updateLaneStartTime(laneId: number, startTime: string) {
      const lane = this.lanes.find(l => l.id === laneId);
      
      if (lane) {
        lane.started_at = startTime;
        this.saveLanesToStorage();
      }
    },

    uninitializeLanes() {
      this.lanes = [];
      this.isInitialized = false;
      localStorage.removeItem('lanes');
      localStorage.removeItem('isInitialized');
    }
  }});
