const state = {
  //SettingRoom
  cameraList: {}, // 카메라 리스트?
  micList: {}, // 마이크 리스트?
  userCLList: {}, // 유저의 자소서 리스트

  //WaitingRoom
  //AuthorityPassModal
  participantList: [], // 방장 권한 위임 시 목록 나타내 주기 위해서

  //ErView
  interviewTipList: {}, // 면접 팁
  studyRoomCL: {}, // 유저가 설정실에서 정해서, 면접관이 면접실에서 새로운 페이지로 보는 자소서

  //ErView, FeedbackRoom, ReplayView
  fbList: [], // 피드백 리스트

  // openvidu
  // OpenVidu objects
  OV: undefined,
  session: undefined,
  publisher: undefined, // Local
  subscribers: [], // Remotes

  // Join form
  mySessionId: "SessionA",
  myUserName: "Participant" + Math.floor(Math.random() * 100),

  // Main video of the page, will be 'publisher' or one of the 'subscribers',
  // updated by click event in UserVideoComponent children
  mainStreamManager: undefined,
};
const getters = {
  //SettingRoom
  getUserCLList(state) {
    return state.userCLList;
  },
  getCameraList(state) {
    return state.cameraList;
  },
  getMicList(state) {
    return state.micList;
  },

  //WaitingRoom
  //AuthorityPassModal
  getParticipantList(state) {
    return state.participantList;
  },

  //ErView
  getInterviewTipList(state) {
    return state.interviewTipList;
  },
  getStudyRoomCL(state) {
    return state.studyRoomCL;
  },

  //ErView, FeedbackRoom, ReplayView
  getFBList(state) {
    return state.fbList;
  },
};
const mutations = {
  //SettingRoom

  //WaitingRoom
  GET_PARTICIPANT_LIST(state, participants) {
    state.participantList = participants;
  },
  //EEView

  //ERView

  //FeedbackRoom
};
const actions = {
  //SettingRoom

  //WaitingRoom
  getParticipantList({ commit }) {
    axios
      .get("url")
      .then((res) => {
        commit("GET_PARTICIPANT_LIST", res.data.participants);
      })
      .catch((e) => {
        console.error(e.data);
      });
  },
  //EEView

  //ERView

  //FeedbackRoom
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
