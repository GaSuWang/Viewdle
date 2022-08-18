import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Account",
    component: () => import("@/views/Account/AccountView.vue"),
  },
  {
    path: "/googlesignup",
    name: "GoogleSignup",
    component: () => import("@/components/Account/GoogleSignup.vue"),
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
  {
    path: "/er-room",
    name: "er-room",
    component: () =>
    import(
      /* webpackPrefetch:true */ "@/views/StudyRoom/NormalMode/ERView.vue"
      ),
    },
    {
      path: "/fb-room",
      name: "fb-room",
      component: () =>
        import(
          /* webpackPrefetch:true */ "@/views/StudyRoom/NormalMode/FBView.vue"
        ),
    },
    {
      path: "/eecl",
      name: "eecl",
      component: () =>
        import(/* webpackPrefetch:true */ "@/views/StudyRoom/CLView.vue"),
    },
    {
      path: '/ee-room/ez',
      name: 'ee-room-ez',
      component: () => import(/* webpackPrefetch:true */ '@/views/StudyRoom/EasyMode/EERView.vue')
    },
    {
      path: '/er-room/ez',
      name: 'er-room-ez',
      component: () => import(/* webpackPrefetch:true */ '@/views/StudyRoom/EasyMode/EERView.vue')
    },

];



export const router = createRouter({
  history: createWebHistory(),
  routes,
});

