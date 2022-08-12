// import axios from "axios";

import axios from "axios";

const state = {
  //방장권한
  APMOpen: false,
  currentUserList: [], //방장 권한 위임을 위해서만 존재
  
  //유저 정보
  //rhtModule UserList에서 userEmail, userName로 있어 getters를 통해 사용


  //방 정보  
  roomSeq: undefined,
  roomTitle: undefined,
  roomType: 'study', //2가 스터디모드, 1이 플레이모드

  //비디오 정보
  videoSeq: undefined,

  //SettingRoom
  CameraList: [], // 영상 디바이스 리스트
  CameraSelected: {}, // 선택된 영상 디바이스
  CameraStatus: false, //카메라 온오프
  MicList: [], // 오디오 디바이스 리스트
  MicSelected: {}, // 선택된 오디오 디바이스
  MicStatus: false, //마이크 온오프
  CLList: [{'coverLetterSeq': '1', 'coverLetterTitle': 'first cl', 'coverLetterContent': 'first cl content'}, 
  {'coverLetterSeq': '2', 'coverLetterTitle': 'second cl', 'coverLetterContent': 'second cl content'},
  {'coverLetterSeq': '3', 'coverLetterTitle': 'third cl', 'coverLetterContent': 'third cl content'}], // 유저의 자소서 리스트
  CLSelected: {}, //선택된 자소서 
  CLStatus: false, //자소서 온오프

  //WaitingRoom
  WRParticipantList: [], // 방장 권한 위임 시 목록 나타내 주기 위해서, 면접자 선택 위해서
  userType: 'user', //일반 유저는 user, 방장 유저는 suuperUser
  // mySessionId: "Session" + roomSeq, //undefined
  publisher: undefined,
  subscribers: [],
  sessionToken: undefined,
  // StartInterview: false, // 대기실에서 면접자를 정하고 면접을 시작할 때 true로 바뀜, 방장이 면접 종료 버튼을 누르면 false로 다시 바뀌어야 됨
  OV: undefined,
  session: undefined,

  //EEView, ERView
  isEE: false,
  isER: false,
  EE: [], //면접자
  ERS: [], //면접관들
  InterviewTipList: {}, // 면접 팁
  StudyRoomCL: {}, // 유저가 설정실에서 정해서, 면접관이 면접실에서 새로운 페이지로 보는 자소서

  //FeedbackRoom
  FBList: [],
  axiosFBList: [],
  replayFBList: [],

  // 녹화 관련
  recordingObject : null,
};
const getters = {
  //유저 정보
  myUserEmail(state){return state.myUserEmail},
  myUserName(state){return state.myUserName},
  myUserInfo(state){
    return {
      myUserEmail: state.myUserEmail,
      myUserName: state.myUserName
    }
  },
  //방 정보
  roomSeq(state){return state.roomSeq},
  roomTitle(state){return state.roomTitle},
  roomType(state){return state.roomType},

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
  mySessionId(state) {return 'Session' + state.roomSeq},
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

  //녹화 관련
  recordingObject(state) {return state.recordingObject},
};
const mutations = {
  //유저 정보
  GET_USER_INFO(state, user){
    state.myUserName = user.userName
    state.myUserEmail = user.userEmail
    console.log('에휴 이렇게라도 불러와야지...',user, state.myUserName, state.myUserEmail)
  },
  // GET_MY_USER_EMAIL(state, data){state.myUserEmail = data},
  // GET_MY_USER_NAME(state, data){state.myUserName = data},

  //방 정보
  GET_ROOM_INFO(state, data){
    state.roomSeq = data.roomSeq,
    state.roomTitle = data.roomTitle,
    state.roomType = data.roomType === '1'? 'play' : 'study',
    state.userType = data.isSuperUser === true ? 'superUser' : 'user'
    console.log("방정보",state.roomSeq, state.roomTitle ,state.roomType,state.userType )
  },
  
  // START_INTERVIEW_TIME(state){
  //   setInterval(() => {
  //     state.interviewTime++
  //   }, 1000);
  // },
  // STOP_INTERVIEW_TIME(state){
  //   clearInterval()
  // },
  SWITCH_USER_TYPE(state, userType){state.userType = userType},

  //openvidu
  SET_OV(state, ov){state.OV = ov},
  SET_SESSION(state, session){state.session = session},
  SET_SESSION_TOKEN(state,token){
    state.sessionToken = token
    console.log('SET_SESSION_TOKEN', state.sessionToken)
  },
  SET_PUBLISHER(state, publisher) {state.publisher = publisher},

  SET_SUBSCRIBERS(state, subscriber) {state.subscribers = subscriber},
  ADD_SUBSCRIBERS(state, subscriber) {state.subscribers.push(subscriber)},
  DELETE_SUBSCRIBERS(state, index) {state.subscribers.splice(index, 1)},

  // SET_MYSESSIONID(state, mySessionId) {state.mySessionId = mySessionId},

  //SettingRoom
  GET_CAMERA_LIST(state, cameraList) {state.CameraList = cameraList},
  SELECT_CAMERA(state, camera) { state.CameraSelected = camera },
  SWITCH_CAMERA_STATUS(state){state.CameraStatus = !state.CameraStatus},

  GET_MIC_LIST(state, micList) {state.MicList = micList},
  SELECT_MIC(state, mic) { state.MicSelected = mic },
  SWITCH_MIC_STATUS(state){state.MicStatus = !state.MicStatus},

  SET_COVERLETTER_LIST(state, CLList){state.CLList = CLList},
  SELECT_CL(state, cl){state.CLSelected = cl}, 
  SWITCH_CL_STATUS(state, status){state.CLStatus = status},

  //waiting-room
  SET_WR_PARTICIPANT_LIST(state, inputList) {
    console.log('SET_WR_PARTICIPANT_LIST 시작',inputList)
    state.WRParticipantList = inputList;
    console.log('SET_WR_PARTICIPANT_LIST 끝',state.WRParticipantList)
  },
  ADD_WR_PARTICIPANT_LIST(state, userInfo) {
    console.log("ADD_WR_PARTICIPANT_LIST 시작", state.WRParticipantList, userInfo);
    if (!state.WRParticipantList.includes(userInfo)) {
      state.WRParticipantList.push(userInfo);
    }
    console.log("ADD_WR_PARTICIPANT_LIST 끝", state.WRParticipantList, userInfo);
  },
  DELETE_WR_PARTICIPANT_LIST(state, userInfo) {
    console.log("DELETE_WR_PARTICIPANT_LIST 시작", state.WRParticipantList);
    const idx = state.WRParticipantList.findIndex(function(item) {return item.myUserEmail === userInfo.myUserEmail})
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
  ADD_CURRENT_USER_LIST(state, userInfo) {
    console.log("ADD_CURRENT_USER_LIST 시작", state.currentUserList, userInfo);
    if (!state.currentUserList.includes(userInfo)) {
      state.currentUserList.push(userInfo);
    }
    console.log("ADD_CURRENT_USER_LIST 끝", state.currentUserList, userInfo);

  },
  DELETE_CURRENT_USER_LIST(state, userInfo) {
    console.log("DELETE_CURRENT_USER_LIST 시작", state.currentUserList);
    const idx = state.currentUserList.findIndex(function(item) {return item.myUserEmail === userInfo.myUserEmail})
    if (idx>-1) state.currentUserList.splice(idx, 1)  
    console.log("DELETE_CURRENT_USER_LIST 끝", state.currentUserList); 
    // const delArray = [...state.currentUserList]
    // delArray.forEach(e=>{
    //   if(e.name === subscriberName){
    //     const i = state.currentUserList.indexOf(e)
    //     state.currentUserList.splice(i,1)
    //   }
    // })    
  },
  EMPTY_CURRENT_USER_LIST(state) {
    state.currentUserList = [];
    console.log('currentUserList 비웠다', state.currentUserList)
  },
  // GET_ROOMSEQ(state, data){state.roomSeq = data},
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
  SET_FB(state, fbList){state.FBList = fbList},
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
  //녹화 관련
  SET_RECORDING_OBJECT(state, recordingObject){state.recordingObject = recordingObject},
};

const BASE_URL = 'https://' + location.hostname + '/api/v1/'

const actions = {
  //Axios 모음

  //유저가 방 나감(스터디룸 나가기)
  userLeaveSessionAxios({state, getters}){
    axios({
      url: BASE_URL + 'studyroom/exit',
      method: 'patch',
      headers: {Authorization: getters.authHeader},
      data: {
        nextOwnerEmail: "",
        roomSeq: state.roomSeq,
      }
    })
    .then(console.log('일반 유저 정상적으로 세션 나감', state.roomSeq, typeof(state.roomSeq)))
    .catch(err=>console.error(err.response))
  },

  //방장이 권한 위임하고 방 나감(스터디룸 나가기)
  superUserLeaveSessionAxios({state, getters},nextSuperUserEmail){
    axios({
      url: BASE_URL + 'studyroom/exit',
      method: 'patch',
      headers: {Authorization: getters.authHeader},
      data: {
        nextOwnerEmail: nextSuperUserEmail,
        roomSeq: state.roomSeq,
      }
    })
    .then(console.log('방장 유저 정상적으로 세션 나감'))
    .catch(err=>console.error(err.response))
  },

  //방장이 방 폭파시킴 첫 단계(스터디룸 나가기, 일반 유저 방 나가기와 동일하지만 구분 위해 다른 이름 부여)
  studyDestroyFirstAxios({state, getters}){
    axios({
      url: BASE_URL + 'studyroom/exit',
      method: 'patch',
      headers: {Authorization: getters.authHeader},
      data: {
        nextOwnerEmail: "",
        roomSeq: state.roomSeq,
      }
    })
    .then(console.log('일단 방을 나감', state.roomSeq))
    .catch(err=>console.error(err.response))
  },

  //방장이 방 폭파시킴 두번째 단계(스터디 룸 삭제)
  studyDestorySecondAxios({state, getters}){
    axios({
      // url: BASE_URL + `studyroom/exit/${state.roomSeq}`, 이게 내가 기억하는 거
      url: BASE_URL + `studyroom/${state.roomSeq}`,
      method: 'patch',
      headers: {Authorization: getters.authHeader},
      data: {roomSeq: state.roomSeq},
    })
    .then(res => {
      console.log('방이 성공적으로 폭파됨', res.response) 
    })
    .catch(err=>console.error(err.response))
  },

  //면접 시작(스터디 룸 면접 시작)
  startInterviewAxios({state, getters}){
    axios({
      url: BASE_URL + `studyroom/interview/${state.roomSeq}`,
      method:'patch',
      headers: {Authorization: getters.authHeader},
      data: {roomSeq: state.roomSeq}
    })
    .then(res=>{
      console.log('면접 시작!, res.response.data:', res.response.data)
    })
    .catch(err=>console.error('면접 시작 axios 에러남',err))
  },

  //면접 끝, 면접자는 대기실로, 면접관은 피드백실로 이동(내 영상 저장)
  finishInterviewAxios({state, getters, commit}){
    axios({
      url: BASE_URL + 'video',
      method: 'post',
      headers: {Authorization: getters.authHeader},
      data: {
        userEmail: state.myUserEmail,
        videoTitle: state.roomTitle,
        videoUrl: state.videoUrl, //videoUrl 추가해야됨
      }
    })
    .then(res=>{
      console.log('성공적으로 면접 완료')
      commit('SET_VIDEOSEQ', res.data) //vdieoSeq 추가해야됨
    }) 
    .catch(err=>console.error(err.response))
  },

  //면접관이 피드백 끝냄(스터디 룸 면접 종료)
  FBCompleteAxios({state,getters}){
    axios({
      url: BASE_URL + 'studyroom/interview',
      method: 'post',
      headers: {Authorization: getters.authHeader},
      data: {
        feedbackList: state.FBList,
        roomSeq: state.roomSeq,
        videoSeq: state.videoSeq,
      }
    })
    .then(console.log('성공적으로 피드백까지 완료'))
    .catch(err=>console.error(err.response))
  },

  // 다시보기 비디오 가져오기(영상 및 피드백 다시보기)
  getReplayAxios({state, getters, commit}){
    axios({
      url: BASE_URL + `video/${state.videoSeq}`,
      method: 'post',
      headers: {Authorization: getters.authHeader},
      data: {
        videoSeq: state.videoSeq
      }
    })
    .then( res => {
      commit('SET_REPLAY_FBLIST', res.data.feedbackList)
      commit('SET_VIDEO_TITLE', res.data.videoTitle)
      commit('SET_VIDEO_URL', res.data.videoUrl)
    })
    .catch(err=>console.error(err.response))
  },

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
  // setMySessionId({ commit }, mySessionId) {
  //   commit("SET_MYSESSIONID", mySessionId);
  // },
  // setMyUserName({ commit }, myUserName) {
  //   commit("SET_MYUSERNAME", myUserName);
  // },

  //SettingRoom
  getCameraList({ commit }, cameraList) {commit("GET_CAMERA_LIST", cameraList)},
  selectCamera({ commit }, camera) {commit("SELECT_CAMERA", camera)},
  getMicList({ commit }, micList) {commit("GET_MIC_LIST", micList)},
  selectMic({ commit }, mic) {commit("SELECT_MIC", mic)},

  //WaitingRoom
  setStartInterview({ commit }, tf) {
    commit("SET_STARTINTERVIEW", tf);
  },
  startInterview({state, getters}, ee){
    axios({
      url: BASE_URL + `/studyroom/interview/${state.roomSeq}`,
      method: 'post',
      headers: {Authorization: getters.authHeader },
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
  getFB({commit, getters}){
    axios({
      url: BASE_URL + `video/${state.roomSeq}`,
      method: 'get',
      headers: {Authorization: getters.authHeader},
    })
    .then(res=>{
      commit('SET_FB', res.data)
    })
    .catch(err=>console.error(err.response))
  },
  postFB({getters}){
    axios({
      url: BASE_URL + `video/${state.roomSeq}`,
      method: 'post',
      headers: {Authorization: getters.authHeader},
    })
    .then(()=>{
      console.log('성공적으로 피드백 저장함')
    })
    .catch(err=>console.error(err.response))
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
