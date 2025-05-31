import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SongRecommender from '../components/SongRecommender.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/recommender',
    name: 'recommender',
    component: SongRecommender
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
