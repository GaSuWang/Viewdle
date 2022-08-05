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

// 당장은 개발에 방해될 것 같아서 주석처리함
// router.beforeEach((to, from, next) => {
//   //로그인 하지 않았을 경우에는 무조건 로그인 페이지로

//   // 피드백실은 스터디 모드 면접관실을 통해서만 진입 가능
//   if(to.name === 'fb-room' && from.name !== 'er-room'){
//     alert('해당 경로로 이동하실 수 없습니다.')
//     return false
//   }
//   // 스터디모드/플레이모드의 면접자/면접관실은 대기실을 통해서만 이동 가능
//   if((to.name === 'er-room' || to.name === 'ee-room' || to.name === 'er-room-ez' || to.name === 'ee-room-ez') && from.name !== 'waiting-room'){
//     alert('해당 경로로 이동하실 수 없습니다.')
//     return false
//   }

//   // 대기실 waiting-room으로 가는 경우
//   // 1. 설정실 setting-room에서 진입
//   // 2. 면접자실/면접관실, 피드백실에서 면접 진행 도중 면접자가 방을 나갈 때
//   // 3. 면접자의 면접이 끝날 때
//   // 2번과 3번같은 경우는, 이동시 router에 name뿐 아니라 params도 넘겨줘서 이동하도록
//   if(to.name==='waiting-room' && (from.name !== 'setting-room' || !from.params)){
//     alert('해당 경로로 이동하실 수 없습니다.')
//     return false  
//   } 
// })