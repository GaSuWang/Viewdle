// import axios from "axios";

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
  FBList: [], // 피드백 리스트
};
const getters = {
  //SettingRoom
  UserCLList(state) {
    return state.userCLList;
  },
  CameraList(state) {
    return state.cameraList;
  },
  MicList(state) {
    return state.micList;
  },

  //WaitingRoom
  //AuthorityPassModal
  ParticipantList(state) {
    return state.participantList;
  },

  //ErView
  InterviewTipList(state) {
    return state.interviewTipList;
  },
  StudyRoomCL(state) {
    return state.studyRoomCL;
  },

  //ErView, FeedbackRoom, ReplayView
  FBList(state) {
    return state.FBList;
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
  // getParticipantList({ commit }) {
  //   axios
  //     .get("url")
  //     .then((res) => {
  //       commit("GET_PARTICIPANT_LIST", res.data.participants);
  //     })
  //     .catch((e) => {
  //       console.error(e.data);
  //     });
  // },
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
