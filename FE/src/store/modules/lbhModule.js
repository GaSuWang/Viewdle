// import axios from "axios";

const state = {
  //방장권한
  superUser: {},
  superUserOut: false,
  APMOpen: false,
  currentUserList: [], //방장 권한 위임을 위해서만 존재
  // APMDestination: undefined, //아마 vue3 teleport 모달 쓰지 않으면 이것도 안쓸 듯
  
  //SettingRoom
  CameraList: [], // 영상 디바이스 리스트
  MicList: [], // 오디오 디바이스 리스트
  CLList: [{'coverLetterSeq': '1', 'coverLetterTitle': 'first cl'}, {'coverLetterSeq': '2', 'coverLetterTitle': 'second cl'},{'coverLetterSeq': '3', 'coverLetterTitle': 'third cl'}], // 유저의 자소서 리스트
  CameraSelected: {}, // 선택된 영상 디바이스
  MicSelected: {}, // 선택된 오디오 디바이스
  CLSelected: {}, //선택된 자소서 
  //근데 카메라나 마이크를 선택했다는 것 자체가 이미 해당 기기를 키겠다는 거 아닌가? 
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
  OV: undefined,
  session: undefined,
  // inWR: true,


  //EEView, ERView
  EERParticipantList: [], //면접실에 들어온 유저들
  isEERFull: false,
  isEE: false, //면접자 포지션인지
  isER: false, //면접관 포지션인지
  EE: [], //면접자
  ERS: [], //면접관들
  //ERView
  InterviewTipList: {}, // 면접 팁
  StudyRoomCL: {}, // 유저가 설정실에서 정해서, 면접관이 면접실에서 새로운 페이지로 보는 자소서

  //ErView, FeedbackRoom, ReplayView
  FBParticipantList:[],
  FBList: [], // 피드백 리스트, 리스트로 하는 게 맞나?
};
const getters = {
  currentUserList(state) {return state.currentUserList},
  superUser(state){return state.superUser},
  superUserOut(state){return state.superUserOut},
  APMOpen(state){return state.APMOpen},
  APMDestination(state){return state.APMDestination},
  //SettingRoom
  CLList(state) {return state.CLList},
  CameraList(state) {return state.CameraList},
  CameraSelected(state){return state.CameraSelected},
  CameraStatus(state){return state.CameraStatus},
  MicSelected(state){return state.MicSelected},
  MicList(state) {return state.MicList},
  MicStatus(state){return state.MicStatus},
  CLStatus(state){return state.CLStatus},
  CLSelected(state){return state.CLSelected},

  //openvidu
  OV(state) {return state.OV},
  session(state) {return state.session},
  publisher(state) {return state.publisher},
  subscribers(state) {return state.subscribers},
  mySessionId(state) {return state.mySessionId},
  myUserName(state) {return state.myUserName},
  SessionToken(state){ return state.SessionToken},
  // inWR(state){return state.inWR},

  //WaitingRoom
  //AuthorityPassModal
  userType(state){
    return state.userType
  },
  WRParticipantList(state) {
    console.log('wrparticipantlist에서 에러가 나나?')
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
  InterviewTipList(state) {return state.interviewTipList},
  StudyRoomCL(state) {return state.studyRoomCL},

  //ErView, FeedbackRoom, ReplayView
  FBList(state) {
    return state.FBList;
  },
};
const mutations = {
  SET_SUPERUSER(state, user){state.superUser = user},
  SET_SUPERUSER_OUT(state, boolean){state.superUserOut = boolean},
  SET_APM_OPEN(state, boolean){state.APMOpen = boolean
  console.log('apmopen',state.APMOpen)},
  SET_APM_DESTINATION(state, destination){state.APMDestination = destination
  console.log('APMDestination',state.APMDestination)},
  //openvidu
  SET_OV(state, ov){state.OV = ov},
  SET_SESSION(state, session){state.session = session},
  SET_PUBLISHER(state, publisher) {
    console.log('setpublisher mutations start', state.publisher)
    state.publisher = publisher
    console.log('setpublisher mutations end', state.publisher)
  },
  SET_SUBSCRIBERS(state, subscriber) {state.subscribers = subscriber},
  ADD_SUBSCRIBERS(state, subscriber) {state.subscribers.push(subscriber)},
  DELETE_SUBSCRIBERS(state, index) {state.subscribers.splice(index, 1)},
  SET_MYSESSIONID(state, mySessionId) {state.mySessionId = mySessionId},
  SET_MYUSERNAME(state, myUserName) {state.myUserName = myUserName},
  // SET_INWR(state){state.inWR = !state.inWR},
  // SET_SESSION_TOKEN(state, token){
  //   state.SessionToken = token
  //   console.log('SET_SESSION_TOKEN',state.SessionToken)
  // },
  EMPTY_WR_PARTICIPANT_LIST(state) {
    state.WRParticipantList = [];
    console.log('WRParticipantList 비웠다', state.WRParticipantList)
  },
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
    //이렇게 지우는 게 맞는 지 모르겠다...
    console.log("DELETE_WR_PARTICIPANT_LIST 시작", state.WRParticipantList);
    const idx = state.WRParticipantList.findIndex(function(item) {return item.name === subscriberName})
    if (idx>-1) state.WRParticipantList.splice(idx, 1)  
    console.log("DELETE_WR_PARTICIPANT_LIST 끝", state.WRParticipantList);
    // const delArray = [...state.WRParticipantList]
    // console.log(delArray)
    // delArray.forEach(e=>{
    //   if(e.name === subscriberName){
    //     const i = state.WRParticipantList.indexOf(e)
    //     state.WRParticipantList.splice(i,1)
    //     console.log([...state.WRParticipantList])
    //   }
    // })    
  },

  EMPTY_CURRENT_USER_LIST(state) {
    state.currentUserList = {};
    console.log('currentUserList 비웠다', state.currentUserList)
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
    //이렇게 지우는 게 맞는 지 모르겠다...
    const delArray = [...state.currentUserList]
    console.log(delArray)
    delArray.forEach(e=>{
      if(e.name === subscriberName){
        const i = state.currentUserList.indexOf(e)
        state.currentUserList.splice(i,1)
      }
    })    
  },

  //SettingRoom
  SWITCH_USER_TYPE_TEMP(state){ //개발 단계에서는 버튼으로 commit, 실제로는 userType은 권한 위임을 통해서만 commit
    console.log('switch user type 눌리긴 함')
    if(state.userType==='user'){
      state.userType='superUser'
      console.log(state.userType)
    } else {
      state.userType='user'
      console.log(state.userType)
    }
  },
  SWITCH_USER_TYPE(state){ //아마 진짜로 쓰일 방장 권한 위임 기능
    state.userType = 'superUser'
  },
  SET_CAMERA_LIST(state, cameraList) {
    state.CameraList = cameraList;
  },
  SET_CAMERA(state, camera) { state.CameraSelected = camera },
  SWITCH_CAMERA_STATUS(state, status){ 
    state.CameraStatus = status 
    console.log('카메라 온오프',state.CameraStatus)
  },
  SET_MIC_LIST(state, micList) {
    state.MicList = micList;
  },
  SET_MIC(state, mic) { state.MicSelected = mic },
  SWITCH_MIC_STATUS(state, status){ 
    state.MicStatus = status 
    console.log('마이크 온오프',state.MicStatus)

  },
  SWITCH_CL_STATUS(state, status){ 
    state.CLStatus = status 
    console.log('자소서 온오프',state.CLStatus)

  },
  SET_CL(state, cl){state.CLSelected = cl
  console.log(cl, state.CLSelected)
  }, //대기실에서 자신이 이번 면접에서 쓸 자소서
  
  //WaitingRoom
  GET_PARTICIPANT_LIST(state, participants) {
    state.participantList = participants;
  },
  SET_STARTINTERVIEW(state, tf) {
    state.StartInterview = tf;
  },
  //EEView, ERView
  SET_STUDYROOM_CL(state,cl){state.studyRoomCL = cl},
  SET_EER_PARTICIPANT_LIST(state, participant) {
    state.EERParticipantList.participant = participant;
  },
  SET_ISEERFULL(state, tf) {
    state.isEERFull = tf;
  },
  SET_EE(state, EE) {
    state.EE = EE;
    console.log(state.EE)
  },
  SET_ERS(state, ERS) {
    // const er = JSON.parse(JSON.stringify(ERS))
    // console.log('parse stringify',er)
    state.ERS.push(ERS);
    console.log(state.ERS)
  },
  EMPTY_ERS(state){
    state.ERS = [];
    console.log('ERS 비워짐')
  },

  //EEView

  //ERView

  //FeedbackRoom
  ADD_FB(state,fb){
    state.FBList.push(fb)
  },
  DELETE_FB(state, id) {
    console.log('들어온 id', id)
    const idx = state.FBList.findIndex(function(item) {return item.reg_dt === id})
    if (idx > -1) state.FBList.splice(idx, 1);
    console.log('delete_fb됐나?', state.FBList)
  },
  UPDATE_FB(state, fb) {
    console.log('업데이트 시 들어온 fb', fb)
    const idx = state.FBList.findIndex(function(item) {return item.reg_dt === fb.reg_dt})
    console.log('업데이트 위해 필요한 idx 찾음', idx)
    state.FBList[idx] = fb;
  },
};
const actions = {
  StudyDestroy(){
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
  setCameraList({ commit }, cameraList) {
    commit("SET_CAMERA_LIST", cameraList);
  },
  setCamera({ commit }, camera) {
    commit("SET_CAMERA", camera);
  },
  setMicList({ commit }, micList) {
    commit("SET_MIC_LIST", micList);
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
