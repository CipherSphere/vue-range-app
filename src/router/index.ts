import { createRouter, createWebHistory } from 'vue-router'
import InitScreen from '../views/InitView.vue'
import LaneView from '../views/LaneView.vue'
import { useLaneStore } from '../stores/lanes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/vue-range-app/',
      name: 'init',
      component: InitScreen,
      beforeEnter: (to, from, next) => {
        const store = useLaneStore()
        store.loadFromStorage()
        if (store.isInitialized) {
          next('/lanes')
        } else {
          next()
        }
      }
    },
    {
      path: '/vue-range-app/lanes',
      name: 'lanes',
      component: LaneView,
      beforeEnter: (to, from, next) => {
        const store = useLaneStore()
        store.loadFromStorage()
        if (!store.isInitialized) {
          next('/')
        } else {
          next()
        }
      }
    }
  ]
})

export default router
