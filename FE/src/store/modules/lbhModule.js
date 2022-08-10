// import axios from "axios";

import axios from "axios";

const state = {
  //방장권한
  APMOpen: false,
  currentUserList: [], //방장 권한 위임을 위해서만 존재
  
  //SettingRoom
  CameraList: [], // 영상 디바이스 리스트
  MicList: [], // 오디오 디바이스 리스트
  CLList: [{'coverLetterSeq': '1', 'coverLetterTitle': 'first cl'}, {'coverLetterSeq': '2', 'coverLetterTitle': 'second cl'},{'coverLetterSeq': '3', 'coverLetterTitle': 'third cl'}], // 유저의 자소서 리스트
  CameraSelected: {}, // 선택된 영상 디바이스
  MicSelected: {}, // 선택된 오디오 디바이스
  CLSelected: {}, //선택된 자소서 
  CameraStatus: false, //카메라 온오프
  MicStatus: false, //마이크 온오프
  CLStatus: false, //자소서 온오프

  //WaitingRoom
  WRParticipantList: [], // 방장 권한 위임 시 목록 나타내 주기 위해서, 면접자 선택 위해서
  StartInterview: false, // 대기실에서 면접자를 정하고 면접을 시작할 때 true로 바뀜, 방장이 면접 종료 버튼을 누르면 false로 다시 바뀌어야 됨
  userType: 'user', //일반 유저는 user, 방장 유저는 suuperUser
  mySessionId: "SessionA",
  myUserName: "Participant" + Math.floor(Math.random() * 100),
  publisher: undefined,
  subscribers: [],
  // OV: undefined,
  // session: undefined,
  roomSeq: undefined,
  sessionToken: undefined,

  //EEView, ERView
  isEE: false,
  isER: false,
  EE: [], //면접자
  ERS: [], //면접관들
  InterviewTipList: {}, // 면접 팁
  StudyRoomCL: {}, // 유저가 설정실에서 정해서, 면접관이 면접실에서 새로운 페이지로 보는 자소서

  //FeedbackRoom
  FBList: [], // 피드백 리스트, 리스트로 하는 게 맞나?
};
const getters = {
  //방장권한
  userType(state){return state.userType},
  WRParticipantList(state) {return JSON.parse(JSON.stringify(state.WRParticipantList))},
  StartInterview(state) {return state.StartInterview},
  currentUserList(state) {return state.currentUserList},
  nextSuperUserList(state){return state.currentUserList.filter(p => p.name !== state.myUserName)},

  //SettingRoom
  MicList(state) {return state.MicList},
  MicSelected(state){return state.MicSelected},
  MicStatus(state){return state.MicStatus},
  CameraList(state) {return state.CameraList},
  CameraSelected(state){return state.CameraSelected},
  CameraStatus(state){return state.CameraStatus},
  CLList(state) {return state.CLList},
  CLSelected(state){return state.CLSelected},
  CLStatus(state){return state.CLStatus},

  //openvidu
  OV(state) {return state.OV},
  session(state) {return state.session},
  publisher(state) {return state.publisher},
  subscribers(state) {return state.subscribers},
  mySessionId(state) {return state.mySessionId},
  myUserName(state) {return state.myUserName},
  roomSeq(state){return state.roomSeq},
  sessionToken(state){return state.sessionToken},
  
  //EEView, ERView
  isEE(state){return state.isEE},
  isER(state){return state.isER},
  EE(state) {return state.EE}, //면접자
  ERS(state) {return state.ERS}, //면접관들
  EEName(state) {
    if(Object.keys(state.EE).length !== 0){
      return JSON.parse(state.EE.stream.connection.data).clientData
  }},
  ERSNameList(state){
    if(state.ERS.length !== 0){
      return state.ERS.map(e=>{
        return JSON.parse(e.stream.connection.data).clientData
      })
  }},
  InterviewTipList(state) {return state.interviewTipList},
  StudyRoomCL(state) {return state.studyRoomCL},

  //ErView, FeedbackRoom, ReplayView
  FBList(state) {return state.FBList},
};
const mutations = {
  SWITCH_USER_TYPE_TEMP(state){ //개발 단계에서는 버튼으로 commit, 실제로는 userType은 권한 위임을 통해서만 commit
    console.log('지금 유저타입 변경됨')
    if(state.userType==='user'){
      state.userType='superUser'
    } else {
      state.userType='user'
    }
  },
  SWITCH_USER_TYPE(state){ //아마 진짜로 쓰일 방장 권한 위임 기능
    state.userType = 'superUser'
  },

  //openvidu
  SET_OV(state, ov){state.OV = ov},
  SET_SESSION(state, session){state.session = session},
  SET_SESSION_TOKEN(state,token){
    state.sessionToken = token
    console.log('SET_SESSION_TOKEN', state.sessionToken)
  },
  SET_PUBLISHER(state, publisher) {state.publisher = publisher},

  SET_SUBSCRIBERS(state, subscriber) {state.subscribers = subscriber},
  ADD_SUBSCRIBERS(state, subscriber) {state.subscribers.push(subscriber) 
    console.log('아니',subscriber,'가 들어왔는데 왜 localstorage에는 안들어가있는데?')},
  DELETE_SUBSCRIBERS(state, index) {state.subscribers.splice(index, 1)},

  SET_MYSESSIONID(state, mySessionId) {state.mySessionId = mySessionId},
  SET_MYUSERNAME(state, myUserName) {state.myUserName = myUserName},

  //SettingRoom
  GET_CAMERA_LIST(state, cameraList) {state.CameraList = cameraList},
  SELECT_CAMERA(state, camera) { state.CameraSelected = camera },
  SWITCH_CAMERA_STATUS(state){state.CameraStatus = !state.CameraStatus},

  GET_MIC_LIST(state, micList) {state.MicList = micList},
  SELECT_MIC(state, mic) { state.MicSelected = mic },
  SWITCH_MIC_STATUS(state){state.MicStatus = !state.MicStatus},

  // GET_CL_LIST(state){axios 통해 불러오기},
  SELECT_CL(state, cl){state.CLSelected = cl}, 
  SWITCH_CL_STATUS(state, status){state.CLStatus = status},

  //waiting-room
  SET_WR_PARTICIPANT_LIST(state, inputList) {
    console.log('SET_WR_PARTICIPANT_LIST 시작',inputList)
    state.WRParticipantList = inputList;
    console.log('SET_WR_PARTICIPANT_LIST 끝',state.WRParticipantList)
  },
  ADD_WR_PARTICIPANT_LIST(state, user) {
    console.log("ADD_WR_PARTICIPANT_LIST 시작", state.WRParticipantList, user);
    if (!state.WRParticipantList.includes(user)) {
      state.WRParticipantList.push({ id: Date.now(), name: user });
    }
    console.log("ADD_WR_PARTICIPANT_LIST 끝", state.WRParticipantList, user);
  },
  DELETE_WR_PARTICIPANT_LIST(state, subscriberName) {
    console.log("DELETE_WR_PARTICIPANT_LIST 시작", state.WRParticipantList);
    const idx = state.WRParticipantList.findIndex(function(item) {return item.name === subscriberName})
    if (idx>-1) state.WRParticipantList.splice(idx, 1)  
    console.log("DELETE_WR_PARTICIPANT_LIST 끝", state.WRParticipantList); 
  },
  EMPTY_WR_PARTICIPANT_LIST(state) {
    state.WRParticipantList = [];
    console.log('WRParticipantList 비웠다', state.WRParticipantList)
  },

  SET_CURRENT_USER_LIST({state}, inputList) {
    state.currentUserList = inputList;
    console.log('currentUserList 바꿈', state.currentUserList)
  },
  ADD_CURRENT_USER_LIST(state, user) {
    console.log("ADD_CURRENT_USER_LIST", state.currentUserList);
    if (!state.currentUserList.includes(user)) {
      state.currentUserList.push({ id: Date.now(), name: user });
    }
  },
  DELETE_CURRENT_USER_LIST(state, subscriberName) {
    const delArray = [...state.currentUserList]
    console.log(delArray)
    delArray.forEach(e=>{
      if(e.name === subscriberName){
        const i = state.currentUserList.indexOf(e)
        state.currentUserList.splice(i,1)
      }
    })    
  },
  EMPTY_CURRENT_USER_LIST(state) {
    state.currentUserList = {};
    console.log('currentUserList 비웠다', state.currentUserList)
  },
  GET_ROOMSEQ(state, data){state.roomSeq = data},
  SET_STARTINTERVIEW(state, tf) {state.StartInterview = tf},

  //EEView, ERView
  SET_ISEE(state, tf){state.isEE = tf},
  SET_ISER(state, tf){state.isER = tf},
  SET_STUDYROOM_CL(state,cl){state.studyRoomCL = cl},
  SET_EE(state, EE) {state.EE = EE},
  SET_ERS(state, ERS) {
    state.ERS.push(ERS)
    console.log('면접관이 추가되었습니다.')
  },
  EMPTY_ERS(state){state.ERS = []},

  //FeedbackRoom
  ADD_FB(state,fb){state.FBList.push(fb)},
  DELETE_FB(state, id) {
    const idx = state.FBList.findIndex(function(item) {return item.reg_dt === id})
    if (idx > -1) state.FBList.splice(idx, 1);
  },
  UPDATE_FB(state, fb) {
    const idx = state.FBList.findIndex(function(item) {return item.reg_dt === fb.reg_dt})
    state.FBList[idx] = fb;
  },
  EMPTY_FB(state){state.FBList = []},
};

const BASE_URL = 'https://' + location.hostname

const actions = {
  finishInterview(){
    if(confirm('정말 면접을 종료하시겠습니까? 면접자는 대기실로 이동하고, 나머지 면접자들은 피드백 완료를 위해 피드백실로 이동합니다.')){
      state.session.signal({
      data: 'true',  
      to: [],
      type: 'endInterview'
      })
      .then(() => {
        console.log('erview send signal test')
      })
      .catch(error => {
          console.error(error);
      });
    }
  },
  setMySessionId({ commit }, mySessionId) {
    commit("SET_MYSESSIONID", mySessionId);
  },
  setMyUserName({ commit }, myUserName) {
    commit("SET_MYUSERNAME", myUserName);
  },

  //SettingRoom
  getCameraList({ commit }, cameraList) {commit("GET_CAMERA_LIST", cameraList)},
  selectCamera({ commit }, camera) {commit("SELECT_CAMERA", camera)},
  getMicList({ commit }, micList) {commit("GET_MIC_LIST", micList)},
  selectMic({ commit }, mic) {commit("SELECT_MIC", mic)},

  //WaitingRoom
  setStartInterview({ commit }, tf) {
    commit("SET_STARTINTERVIEW", tf);
  },
  startInterview({state}, ee){
    axios({
      url: BASE_URL + `/studyroom/interview/${state.roomSeq}`,
      method: 'post',
      headers: {Authorization: getters.rhtModule.authHeader },
    })
    .then(()=>{
      state.session.signal({
        data: `${ee}`,
        to:[],
        type:'startInterview'
      })
    })
    .catch(err=>console.err(err.response))
  },

  //EEView, ERView
  setEE({ commit }, EE) {
    commit("SET_EE", EE);
  },
  setERS({ commit }, ERS) {
    commit("SET_ERS", ERS);
  },

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
