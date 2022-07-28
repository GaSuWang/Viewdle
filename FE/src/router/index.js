import { createWebHistory, createRouter } from "vue-router";
// /* webpackPrefetch:true */ 입력해서 vue.config.js에서 prefetch 끈 것을 활성화 시킬 수 있음

const routes = [
  {
    path: "/",
    name: "Account",
    component: () => import("@/views/Account/AccountView.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () =>
      import(/* webpackPrefetch:true */ "@/components/Account/SignupCard.vue"),
  },
  {
    path: "/pw",
    name: "pw",
    component: () =>
      import(/* webpackPrefetch:true */ "@/components/Account/PWFindCard.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () =>
      import(/* webpackPrefetch:true */ "@/views/Lobby/MainView.vue"),
  },
  {
    path: "/mypage",
    name: "mypage",
    component: () =>
      import(/* webpackPrefetch:true */ "@/views/Lobby/MyView.vue"),
  },
  {
    path: "/replay",
    name: "replay",
    component: () =>
      import(/* webpackPrefetch:true */ "@/views/Lobby/ReplayView.vue"),
  },
  {
    path: "/cl",
    name: "cl",
    component: () =>
      import(/* webpackPrefetch:true */ "@/views/Lobby/CLManageView.vue"),
  },
  {
    path: "/setting-room",
    name: "setting-room",
    component: () =>
      import(
        /* webpackPrefetch:true */ "@/views/StudyRoom/SettingRoomView.vue"
      ),
  },
  {
    path: "/waiting-room",
    name: "waiting-room",
    component: () =>
      import(
        /* webpackPrefetch:true */ "@/views/StudyRoom/WaitingRoomView.vue"
      ),
  },
  {
    path: "/ee-room",
    name: "ee-room",
    component: () =>
      import(
        /* webpackPrefetch:true */ "@/views/StudyRoom/NormalMode/EEView.vue"
      ),
  },
  // {
  //   path: '/ee-room/ez',
  //   name: 'ee-room-ez',
  //   component: () => import(/* webpackPrefetch:true */ '@/views/')
  // },
  {
    path: "/er-room",
    name: "er-room",
    component: () =>
      import(
        /* webpackPrefetch:true */ "@/views/StudyRoom/NormalMode/ERView.vue"
      ),
  },
  // {
  //   path: '/er-room/ez',
  //   name: 'er-room-ez',
  //   component: () => import(/* webpackPrefetch:true */ '@/views/')
  // },
  {
    path: "/fb-room",
    name: "fb-room",
    component: () =>
      import(
        /* webpackPrefetch:true */ "@/views/StudyRoom/NormalMode/FeedbackView.vue"
      ),
  },
  {
    path: "/eecl",
    name: "eecl",
    component: () =>
      import(/* webpackPrefetch:true */ "@/views/StudyRoom/CLView.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// beforeeach 통해서 로그인 안하면 로그인 페이지로 가게
