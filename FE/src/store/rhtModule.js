// import axios from "axios";
import { createStore } from "vuex";

export const Test = createStore({
  state: {
    UserList:{},
    ParticipantList:{},
    ThumnailList:{},
    BadgeList:{},
    CoverLetterList:{},
    StudyroomList:{},
    FeedbackList:{},
    Replayvideo:{},
    isLoggedIn: false
  },
  getters: {
    getUserList(state){return state.UserList},
    getParticipantList(state){return state.ParticipantList},
    getThumnailList(state){return state.ThumnailList},
    getBadgeList(state){return state.BadgeList},
    getCoverLetterList(state){return state.CoverLetterList},
    getStudyroomList(state){return state.StudyroomList},
    getFeedbackList(state){return state.FeedbackList},
    getReplayList(state){return state.ReplayList},
  },
  mutations: {},
  actions: {},
});
