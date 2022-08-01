// import axios from "axios";

const state = {
  //SettingRoom
  CameraList: {}, // 영상 디바이스 리스트
  CameraSelected: {}, // 선택된 영상 디바이스
  MicList: {}, // 오디오 디바이스 리스트
  MicSelected:{}, // 선택된 오디오 디바이스
  UserCLList: {}, // 유저의 자소서 리스트

  //WaitingRoom
  //AuthorityPassModal
  ParticipantList: [], // 방장 권한 위임 시 목록 나타내 주기 위해서, 면접자 선택 위해서

  //EEView, ERView
  EE: {}, //면접자
  ERS: {}, //면접관들
  //ERView
  InterviewTipList: {}, // 면접 팁
  StudyRoomCL: {}, // 유저가 설정실에서 정해서, 면접관이 면접실에서 새로운 페이지로 보는 자소서

  //ErView, FeedbackRoom, ReplayView
  FBList: [], // 피드백 리스트, 리스트로 하는 게 맞나?
};
const getters = {
  //SettingRoom
  UserCLList(state) {
    return state.userCLList;
  },
  CameraList(state) {
    return state.CameraList;
  },
  MicList(state) {
    return state.MicList;
  },

  //WaitingRoom
  //AuthorityPassModal
  ParticipantList(state) {
    return state.participantList;
  },

  //EEView, ERView
  EE(state) { //면접자
    return state.EE
  }, 
  ERS(state) { //면접관들
    return state.ERS
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
  GET_CAMERA_LIST(state, cameraList){
    state.CameraList = JSON.parse(JSON.stringify(cameraList))
    console.log(state.CameraList)
  },
  SET_CAMERA(state, camera){
    state.CameraSelected = camera
  },
  GET_MIC_LIST(state, micList){
    state.MicList = JSON.parse(JSON.stringify(micList))
    console.log(state.MicList)
  },
  SET_MIC(state, mic){
    state.MicSelected = mic
  },
  //WaitingRoom
  GET_PARTICIPANT_LIST(state, participants) {
    state.participantList = participants;
  },

  //EEView, ERView
  SET_EE(state, EE) {
    state.EE = EE
  }, 
  SET_ERS(state, ERS) {
    state.ERS = ERS
  }, 

  //EEView

  //ERView

  //FeedbackRoom
  DELETE_FB(state, id){
    console.log(typeof(state.FBList), state.FBList)
    state.FBList.foreach((e) => {
      if(e.reg_dt === id){
        const index = state.FBList.indexOf('e')
        if (index > -1) state.FBList.splice(index, 1)
      }
    })
    
  }
};
const actions = {
  //SettingRoom
  getCameraList({commit}, cameraList){
    commit('GET_CAMERA_LIST', cameraList)
  },
  setCamera({commit}, camera){
    commit('SET_CAMERA', camera)
  },
  getMicList({commit}, micList){
    commit('GET_MIC_LIST', micList)
  },
  setMic({commit}, mic){
    commit('SET_MIC', mic)
  },
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

  //EEView, ERView
  setEE({commit}, EE) {
    commit('SET_EE', EE)
  }, 
  setERS({commit}, ERS) {
    commit('SET_ERS', ERS)
  }, 

  //EEView

  //ERView

  //FeedbackRoom
  deleteFB({commit}, FBid){
    commit('DELETE_FB', FBid)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
