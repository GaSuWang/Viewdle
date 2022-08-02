// import axios from "axios";
const state = {
  //SettingRoom
  CameraList: {}, // 영상 디바이스 리스트
  CameraSelected: {}, // 선택된 영상 디바이스
  MicList: {}, // 오디오 디바이스 리스트
  MicSelected: {}, // 선택된 오디오 디바이스
  UserCLList: {}, // 유저의 자소서 리스트

  //WaitingRoom
  //AuthorityPassModal
  WRParticipantList: [], // 방장 권한 위임 시 목록 나타내 주기 위해서, 면접자 선택 위해서
  StartInterview: false,

  //WaitingRoom
  OV: undefined,
  session: undefined,
  mainStreamManager: undefined,
  publisher: undefined,
  subscribers: [],

  mySessionId: "SessionA",
  myUserName: "Participant" + Math.floor(Math.random() * 100),

  //EEView, ERView
  EERParticipantList: {}, //면접실에 들어온 유저들
  isEERFull: false,
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

  //openvidu
  OV(state) {
    return state.OV;
  },
  session(state) {
    return state.session;
  },
  mainStreamManager(state) {
    return state.mainStreamManager;
  },
  publisher(state) {
    return state.publisher;
  },
  subscribers(state) {
    return state.subscribers;
  },
  mySessionId(state) {
    return state.mySessionId;
  },
  myUserName(state) {
    return state.myUserName;
  },

  //WaitingRoom
  //AuthorityPassModal
  WRParticipantList(state) {
    console.log(
      "getters state.WRParticipantList",
      JSON.parse(JSON.stringify(state.WRParticipantList))
    );
    return JSON.parse(JSON.stringify(state.WRParticipantList));
  },
  StartInterview(state) {
    return state.StartInterview;
  },
  //EEView, ERView
  isEERFull(state) {
    return state.isEERFull;
  }, //유저들이 정해진 포지션에 해당하는 페이지에 모두 도착?했는지
  EE(state) {
    return state.EE;
  }, //면접자
  ERS(state) {
    return state.ERS;
  }, //면접관들

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
  //openvidu
  // SET_OV(state, ov){state.OV = ov},
  // SET_SESSION(state, session){state.session = session},
  SET_PUBLISHER(state, publisher) {
    state.publisher = publisher;
  },
  SET_SUBSCRIBERS(state, subscriber) {
    state.subscribers = subscriber;
  },
  ADD_SUBSCRIBERS(state, subscriber) {
    state.subscribers.push(subscriber);
  },
  DELETE_SUBSCRIBERS(state, index) {
    state.subscribers.splice(index, 1);
  },
  SET_MYSESSIONID(state, mySessionId) {
    state.mySessionId = mySessionId;
  },
  SET_MYUSERNAME(state, myUserName) {
    state.myUserName = myUserName;
  },

  EMPTY_WR_PARTICIPANT_LIST(state) {
    state.WRParticipantList = {};
  },
  ADD_WR_PARTICIPANT_LIST(state, user) {
    console.log("ADD_WR_PARTICIPANT_LIST", state.WRParticipantList);
    if (!state.WRParticipantList.includes(user)) {
      console.log(state.WRParticipantList)
      state.WRParticipantList.push({ id: Date.now(), name: user });
      console.log(state.WRParticipantList)
    }
  },
  DELETE_WR_PARTICIPANT_LIST(state, subscriberName) {
    //이렇게 지우는 게 맞는 지 모르겠다...
    const delArray = [...state.WRParticipantList]
    console.log(delArray)
    delArray.forEach(e=>{
      if(e.name === subscriberName){
        const i = state.WRParticipantList.indexOf(e)
        state.WRParticipantList.splice(i,1)
        console.log([...state.WRParticipantList])
      }
    })    
  },

  //SettingRoom
  GET_CAMERA_LIST(state, cameraList) {
    state.CameraList = JSON.parse(JSON.stringify(cameraList));
    console.log(state.CameraList);
  },
  SET_CAMERA(state, camera) {
    state.CameraSelected = camera;
  },
  GET_MIC_LIST(state, micList) {
    state.MicList = JSON.parse(JSON.stringify(micList));
    console.log(state.MicList);
  },
  SET_MIC(state, mic) {
    state.MicSelected = mic;
  },
  //WaitingRoom
  GET_PARTICIPANT_LIST(state, participants) {
    state.participantList = participants;
  },
  SET_STARTINTERVIEW(state, tf) {
    state.StartInterview = tf;
  },
  //EEView, ERView
  SET_EER_PARTICIPANT_LIST(state, participant) {
    state.EERParticipantList.participant = participant;
  },
  SET_ISEERFULL(state, tf) {
    state.isEERFull = tf;
  },
  SET_EE(state, EE) {
    state.EE = EE;
  },
  SET_ERS(state, ERS) {
    state.ERS = ERS;
  },

  //EEView

  //ERView

  //FeedbackRoom
  DELETE_FB(state, id) {
    console.log(typeof state.FBList, state.FBList);
    state.FBList.foreach((e) => {
      if (e.reg_dt === id) {
        const index = state.FBList.indexOf("e");
        if (index > -1) state.FBList.splice(index, 1);
      }
    });
  },
};
const actions = {
  //openvidu
  setOV({ commit }, ov) {
    commit("SET_OV", ov);
  },
  setSession({ commit }, session) {
    commit("SET_SESSION", session);
  },
  setMySessionId({ commit }, mySessionId) {
    commit("SET_MYSESSIONID", mySessionId);
  },
  setMyUserName({ commit }, myUserName) {
    commit("SET_MYUSERNAME", myUserName);
  },

  //SettingRoom
  getCameraList({ commit }, cameraList) {
    commit("GET_CAMERA_LIST", cameraList);
  },
  setCamera({ commit }, camera) {
    commit("SET_CAMERA", camera);
  },
  getMicList({ commit }, micList) {
    commit("GET_MIC_LIST", micList);
  },
  setMic({ commit }, mic) {
    commit("SET_MIC", mic);
  },
  //WaitingRoom
  setStartInterview({ commit, dispatch }, tf) {
    commit("SET_STARTINTERVIEW", tf);
    dispatch("setEERParticipantList");
  },
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
  setEERParticipantList({ commit, state }) {
    const users = { ...state.publisher, ...state.subscribers };
    commit("SET_EER_PARTICIPANT_LIST", users);
  },
  setEERFull({ state, commit }) {
    commit("SET_EERFULL", state.EER);
  },
  setEE({ commit }, EE) {
    commit("SET_EE", EE);
  },
  setERS({ commit }, ERS) {
    commit("SET_ERS", ERS);
  },

  //EEView

  //ERView

  //FeedbackRoom
  deleteFB({ commit }, FBid) {
    commit("DELETE_FB", FBid);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
