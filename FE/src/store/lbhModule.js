import axios from "axios";
import { createStore } from "vuex";

export const Test = createStore({
  state: {
    coverLetterList: {}, // 유저의 자소서
    userTrendInfo: {}, // 유저 추이 보여주기 위한 것
    interviewTipList: {}, // 면접 팁?
    feedbackList: {}, // 피드백 리스트
    cameraList: {}, // 카메라 리스트?
    micList: {}, // 마이크 리스트?
    subscriberList: {}, // 방장 권한 위임 시 목록 나타내 주기 위해서
  },
  getters: {
    getCoverLetterList(state) {
      return state.coverLetterList
    },
    getUserTrendInfo(state){
      return state.userTrendInfo
    },
    getInterviewTipList(state){
      return state.interviewTipList
    },
    getFeedbackList(state){
      return state.feedbackList
    },
    getCameraList(state){
      return state.cameraList
    },
    getMicList(state){
      return state.micList
    },
    getSubscriberList(state){
      return state.subscriberList
    },
  },
  mutations: {},
  actions: {},
});
