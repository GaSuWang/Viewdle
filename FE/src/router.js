import { createWebHistory, createRouter } from 'vue-router';

// /* webpackPrefetch:true */ 입력해서 vue.config.js에서 prefetch 끈 것을 활성화 시킬 수 있음

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/pw',
    name: 'pw',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/replay',
    name: 'replay',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/cl',
    name: 'cl',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/setting-room',
    name: 'setting-room',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/wating-room',
    name: 'wating-room',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/ee-room',
    name: 'ee-room',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/ee-room/ez',
    name: 'ee-room-ez',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/er-room',
    name: 'er-room',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/er-room/ez',
    name: 'er-room-ez',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },
  {
    path: '/feedback-room',
    name: 'feedback-room',
    component: () => import(/* webpackPrefetch:true */ '@/views/')
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// beforeeach 통해서 로그인 안하면 로그인 페이지로 가게
export default router;
