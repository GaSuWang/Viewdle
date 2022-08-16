// import axios from "axios";

import { router } from "@/router";
import axios from "axios";

const state = {
  //방장권한
  APMOpen: false,
  currentUserList: [], //방장 권한 위임을 위해서만 존재
  nextSuperUserInfo: {},
  studyDestroy: false,
  //유저 정보
  //rhtModule UserList에서 userEmail, userName로 있어 getters를 통해 사용


  //방 정보  
  roomSeq: undefined,
  roomTitle: undefined,
  roomType: 'study', //2가 스터디모드, 1이 플레이모드
  roomTime: 0,

  //비디오 정보
  videoSeq: undefined,
  videoSrc: '',

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
  userType: 'user', //일반 유저는 user, 방장 유저는 superUser
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
  studyRoomCL: {}, // 유저가 설정실에서 정해서, 면접관이 면접실에서 새로운 페이지로 보는 자소서

  //FeedbackRoom
  FBList: [],
  axiosFBList: [],
  replayFBList: [],
  FBUserCount: 0,

  // 녹화 관련
  recordingObject : null,

  // [김이랑] 비디오 관련
  videoTime : null,
  startVideoTime : null,

  // 박채림 / 필터 관련
  filters : []
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
  videoSrc(state){return state.videoSrc},

  //방장권한
  userType(state){return state.userType},
  // WRParticipantList(state) {return JSON.parse(JSON.stringify(state.WRParticipantList))},
  WRParticipantList(state) {
    console.log('state.WRParticipantList', state.WRParticipantList, typeof(state.WRParticipantList))
    function unique(data, key){
      return [ ...new Map(data.map(x => [key(x), x])).values()]
    }
    return unique(state.WRParticipantList, e => e.myUserEmail)
    // function unique(data, key){
    //   return [ ...new Map(data.map(x => [key(x), x])).values()]
    // }
    // if(state.WRParticipantList.isArray){
    //   return unique(state.WRParticipantList, e => e.myUserEmail)
    // } else return state.WRParticipantList
  },
  StartInterview(state) {return state.StartInterview},
  currentUserList(state) {return state.currentUserList},
  // nextSuperUserList(state){return state.currentUserList.filter(p => p.name !== state.myUserName)},
  nextSuperUserList(state){
    if(state.currentUserList.length) {
      return state.currentUserList.filter(p => p.myUserEmail !== state.myUserEmail)
    } else return []
  },
  nextSuperUserInfo(state) {return state.nextSuperUserInfo},
  studyDestroy(state){return state.studyDestroy},
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
  studyRoomCL(state) {return state.studyRoomCL},

  //ErView, FeedbackRoom, ReplayView
  FBList(state) {return state.FBList},
  axiosFBList(state) {return state.axiosFBList},
  FBUserCount(state){return state.FBUserCount},
  //녹화 관련
  recordingObject(state) {return state.recordingObject},

  //[김이랑] 비디오 관련
  videoTime(state) {return state.videoTime},
  startVideoTime(state) {return state.startVideoTime},

  // 박채림 / 필터 관련
  filters(state) {return state.filters}

};
const mutations = {
  //방장권한
  SET_STUDY_DESTOY(state, tf){state.studyDestroy = tf},

  //유저 정보
  GET_USER_INFO(state, user){
    state.myUserName = user.userName
    state.myUserEmail = user.userEmail
    console.log('에휴 이렇게라도 불러와야지...',user, state.myUserName, state.myUserEmail)
  },
  EMPTY_NEXT_SUPERUSER_INFO(state){state.nextSuperUserInfo = {}},
  SET_NEXT_SUPERUSER_INFO(state, data){state.nextSuperUserInfo = data},
  // GET_MY_USER_EMAIL(state, data){state.myUserEmail = data},
  // GET_MY_USER_NAME(state, data){state.myUserName = data},

  //방 정보
  GET_VIDEO_SRC(state, data) { 
    state.videoSrc = data
    console.log(`${data}를 받아왔고 이제 videoSrc도 ${state.videoSrc}'로 동일함`)
  },
  EMPTY_VIDEO_SRC(state) { state.videoSrc = ''},

  GET_ROOM_INFO(state, data){
    state.roomSeq = data.roomSeq,
    state.roomTitle = data.roomTitle,
    state.roomType = data.roomType === 1? 'play' : 'study',
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

  START_ROOM_TIME(state){setInterval(() => {
    state.roomTime++
  }, 1000);},
  EMPTY_ROOM_TIME(state){state.roomTime = 0},

  //waiting-room
  SET_WR_PARTICIPANT_LIST(state, inputList) {
    console.log('SET_WR_PARTICIPANT_LIST 시작',inputList)
    state.WRParticipantList = inputList;
    console.log('SET_WR_PARTICIPANT_LIST 끝',state.WRParticipantList)
  },
  ADD_WR_PARTICIPANT_LIST(state, userInfo) {
    console.log("ADD_WR_PARTICIPANT_LIST 시작", state.WRParticipantList, userInfo);
    if (!state.WRParticipantList.includes(userInfo)) {
      console.log(state.WRParticipantList.includes(userInfo))
      state.WRParticipantList.push(userInfo);
    }
    console.log("ADD_WR_PARTICIPANT_LIST 끝", state.WRParticipantList, userInfo);
  },
  DELETE_WR_PARTICIPANT_LIST(state, email) {
    console.log("DELETE_WR_PARTICIPANT_LIST 시작", state.WRParticipantList);
    const idx = state.WRParticipantList.findIndex(function(item) {return item.myUserEmail === email})
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
  DELETE_CURRENT_USER_LIST(state, email) {
    console.log("DELETE_CURRENT_USER_LIST 시작", state.currentUserList);
    const idx = state.currentUserList.findIndex(function(item) {return item.myUserEmail === email})
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
  SET_STUDYROOM_CL(state,cl){
    state.studyRoomCL = cl
    console.log('자소서 받아옴',state.studyRoomCL)
  },
  SET_EE(state, EE) {state.EE = EE},
  SET_ERS(state, ERS) {state.ERS.push(ERS)},
  EMPTY_EE(state) {state.EE = []},
  EMPTY_ERS(state){state.ERS = []},

  //FeedbackRoom
  SET_FB(state, fbList){state.FBList = fbList},
  ADD_FB(state,fb){state.FBList.push(fb)},
  DELETE_FB(state, timeline) {
    const idx = state.FBList.findIndex(function(item) {return item.timeline === timeline})
    if (idx > -1) state.FBList.splice(idx, 1);
  },
  UPDATE_FB(state, fb) {
    const idx = state.FBList.findIndex(function(item) {return item.timeline === fb.timeline})
    state.FBList[idx] = fb;
  },
  EMPTY_FB(state){state.FBList = []},
  ADD_AXIOS_FBLIST(state, data){
    const fblist = JSON.parse(data)
    if(state.axiosFBList !== []){ state.axiosFBList = [...state.axiosFBList, ...fblist] }
    console.log('axiosfblist add',data, fblist, state.axiosFBList)
  },
  EMPTY_AXIOS_FBLIST(state){state.axiosFBList = []},
  SET_FB_USER_COUNT(state){
    state.FBUserCount = state.currentUserList.length - 1
    console.log('set_fb_user_count',state.FBUserCount, state.currentUserList.length)  
  },
  MINUS_FB_USER_COUNT(state){
    console.log('MINUS_FB_USER_COUNT', state.FBUserCount)
    state.FBUserCount -= 1
    console.log('MINUS_FB_USER_COUNT', state.FBUserCount)
  },
  EMPTY_FB_USER_COUNT(state){state.FBUserCount = 0},
  //녹화 관련
  SET_RECORDING_OBJECT(state, recordingObject){state.recordingObject = recordingObject},

  //[김이랑] 비디오 관련
  SET_VIDEO_TIME(state, videoTime){state.videoTime = videoTime},
  SET_START_VIDEO_TIME(state, startVideoTime){state.startVideoTime = startVideoTime},
  SET_VIDEOSEQ(state, data){
    state.videoSeq = parseInt(data)
    console.log('videoSEq 설정됨', state.videoSeq, data)
  },


  // 박채림 / 필터 관련
  SET_VIDEO_FILTER_LIST(state, filters){
    state.filters = filters;
  },
};

const BASE_URL = 'http://' + location.hostname + ':8081' + '/api/v1/'
// const BASE_URL = 'https://' + location.hostname + '/api/v1/'

const actions = {
  //Axios 모음
  deleteData({commit}){
    commit('GET_ROOM_INFO', {roomSeq: undefined, roomTitle: undefined, roomType: '1', isSuperUser:false})
    commit('SET_OV', undefined)
    commit('SET_SESSION', undefined)
    commit('SET_SESSION_TOKEN', undefined)
    commit('SET_PUBLISHER', undefined)
    commit('SET_SUBSCRIBERS', [])
    //commit('SET_MYSESSIONID', undefined)
    commit('SELECT_CAMERA', {})
    commit('SELECT_MIC', {})
    commit('SELECT_CL', {})
    commit('EMPTY_WR_PARTICIPANT_LIST')
    commit('EMPTY_CURRENT_USER_LIST')
    commit('SET_ISEE', false)
    commit('SET_ISER', false)
    commit('EMPTY_EE')
    commit('EMPTY_ERS')
    commit('EMPTY_FB')
    commit('EMPTY_NEXT_SUPERUSER_INFO')
    commit('SWITCH_USER_TYPE', 'user')
    commit('EMPTY_AXIOS_FBLIST')
  },
  //유저가 방 나감(스터디룸 나가기)
  // userLeaveSessionAxios({state,dispatch, rootGetters }){
  //   console.log('유저 방에서 잘 나가....나?')   
  //   axios({
  //     url: BASE_URL + 'studyroom/exit',
  //     method: 'patch',
  //     headers: {Authorization: rootGetters['rhtModule/authHeader']},
  //     data: {
  //       nextOwnerEmail: "",
  //       roomSeq: state.roomSeq,
  //     }
  //   })
  //   .then(res =>{
  //     console.log('유저 방에서 잘 나감')
  //     console.log(res.response),
  //     dispatch('deleteData')
  //   }
  //   )
  //   .catch(err=>console.error(err.response.data))
  // },

  // //방장이 권한 위임하고 방 나감(스터디룸 나가기)
  // superUserLeaveSessionAxios({state, dispatch, rootGetters},nextSuperUserEmail){
  //   axios({
  //     url: BASE_URL + 'studyroom/exit',
  //     method: 'patch',
  //     headers: {Authorization: rootGetters['rhtModule/authHeader']},
  //     data: {
  //       nextOwnerEmail: nextSuperUserEmail,
  //       roomSeq: state.roomSeq,
  //     }
  //   })
  //   .then(res=> {
  //     dispatch('deleteData')
  //     console.log('방장 유저 정상적으로 세션 나감', res.response)
  //   })
  //   .catch(err=>console.error(err.response))
  // },

  // //방장이 방 폭파시킴 첫 단계(스터디룸 나가기, 일반 유저 방 나가기와 동일하지만 구분 위해 다른 이름 부여)
  // studyDestroyFirstAxios({state,rootGetters}){
  //   axios({
  //     url: BASE_URL + 'studyroom/exit',
  //     method: 'patch',
  //     headers: {Authorization: rootGetters['rhtModule/authHeader']},
  //     data: {
  //       nextOwnerEmail: "",
  //       roomSeq: state.roomSeq,
  //     }
  //   })
  //   .then(res=> {
  //     console.log('일단 방을 나감', state.roomSeq, res.response)
  //   })
  //   .catch(err=>console.error(err.response))
  // },

  // //방장이 방 폭파시킴 두번째 단계(스터디 룸 삭제)
  // studyDestorySecondAxios({state, dispatch, rootGetters}){
  //   axios({
  //     // url: BASE_URL + `studyroom/exit/${state.roomSeq}`, 이게 내가 기억하는 거
  //     url: BASE_URL + `studyroom/${state.roomSeq}`,
  //     method: 'patch',
  //     headers: {Authorization: rootGetters['rhtModule/authHeader']},
  //     data: {roomSeq: state.roomSeq},
  //   })
  //   .then(res => {
  //     dispatch('deleteData')
  //     console.log('방이 성공적으로 폭파됨', res.response) 
  //   })
  //   .catch(err=>console.error(err.response))
  // },

  // 임현탁 userLeaveSessionAxios수정위해 따로 뺴와서 수정중
  userLeaveSessionAxios({state,dispatch,commit, rootGetters }){
    console.log('유저 방에서 잘 나가....나?')   
    axios({
      url: BASE_URL + 'studyroom/exit',
      method: 'patch',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {
        nextOwnerEmail: "",
        roomSeq: state.roomSeq,
        time: state.roomTime,
      }
    })
    .then(res =>{
      commit('EMPTY_ROOM_TIME')
      console.log('유저 방에서 잘 나감')
      console.log(res.response),
      router.push('/main')
      alert('방에서 나왔습니다.')
      if(state.session) state.session.disconnect()
      dispatch('rhtModule/getStudyRoom',{}, {root:true})
      dispatch('deleteData')
    }
    )
    .catch(err=>console.error(err.response.data))
  },

  //방장이 권한 위임하고 방 나감(스터디룸 나가기)
  superUserLeaveSessionAxios({state, dispatch, commit, rootGetters},nextSuperUserEmail){
    axios({
      url: BASE_URL + 'studyroom/exit',
      method: 'patch',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {
        nextOwnerEmail: nextSuperUserEmail,
        roomSeq: state.roomSeq,
        time: state.roomTime,
      }
    })
    .then(res=> {
      commit('EMPTY_ROOM_TIME')
      dispatch('deleteData')
      console.log('방장 유저 정상적으로 세션 나감', res)
      router.push('/main')
      if(state.session) state.session.disconnect()
      dispatch('rhtModule/getStudyRoom',{}, {root:true})
    })
    .catch(err=>console.error(err.response))
  },

  //방장이 방 폭파시킴 첫 단계(스터디룸 나가기, 일반 유저 방 나가기와 동일하지만 구분 위해 다른 이름 부여)
  studyDestroyFirstAxios({state, dispatch,commit, rootGetters}){
    axios({
      url: BASE_URL + 'studyroom/exit',
      method: 'patch',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {
        nextOwnerEmail: "",
        roomSeq: state.roomSeq,
        time: state.roomTime,
      }
    })
    .then(res=> {
      commit('EMPTY_ROOM_TIME')
      console.log('일단 방을 나감', state.roomSeq, res.response)
      dispatch('studyDestroySecondAxios')
    })
    .catch(err=>console.error(err.response))
  },
  //방장이 방 폭파시킴 두번째 단계(스터디 룸 삭제)
  studyDestroySecondAxios({state, dispatch, rootGetters}){
    axios({
      // url: BASE_URL + `studyroom/exit/${state.roomSeq}`, 이게 내가 기억하는 거
      url: BASE_URL + `studyroom/${state.roomSeq}`,
      method: 'patch',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {roomSeq: state.roomSeq},
    })
    .then(res => {
      console.log('방이 성공적으로 폭파됨', res)
      router.push('/main') 
      dispatch('rhtModule/getStudyRoom',{}, {root:true})
      if(state.session) state.session.disconnect()
      dispatch('deleteData')
    })
    .catch(err=>console.error(err.response))
  },


  //면접 시작(스터디 룸 면접 시작)
  startInterviewAxios({state,rootGetters}){
    axios({
      url: BASE_URL + `studyroom/interview/${state.roomSeq}`,
      method:'patch',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {roomSeq: state.roomSeq}
    })
    .then(res=>{
      console.log('면접 시작!, res.response.data:', res)
    })
    .catch(err=>console.error('면접 시작 axios 에러남',err.response))
  },

  // 임현탁 videourl credentials에 받아옴
  //면접 끝, 면접자는 대기실로, 면접관은 피드백실로 이동(내 영상 저장)
  finishInterviewAxios({state, rootGetters, commit}, credentials){
    console.log('면접이 끝남. 비디오 url을 가지고 있는 면접자가 axios 요청을 보냄',credentials)
    axios({
      url: BASE_URL + 'video',
      method: 'post',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {
        userEmail: state.myUserEmail,
        videoTitle: state.roomTitle,
        videoUrl: credentials.url, //videoUrl 추가해야됨
        // videoUrl: credentials.url, //videoUrl 추가해야됨
      }
    })
    .then(res=>{
      console.log('성공적으로 면접 완료', state.myUserEmail, state.roomTitle,credentials, res.data)
      commit('SET_VIDEOSEQ', res.data.videoSeq) //vdieoSeq 추가해야됨
      state.session.signal({
        data: res.data.videoSeq,
        to: [],
        type: 'sendVideoSeq',
      })
    }) 
    .catch(err=>{
      console.log( state.myUserEmail, state.roomTitle,credentials)
      console.error(err.response)
    })
  },



  //면접관이 피드백 끝냄(스터디 룸 면접 종료)
  FBCompleteAxios({state,rootGetters}){
    console.log('fbcompleteAxios 실행됨', state.FBUserCount, state.axiosFBList)
    axios({
      url: BASE_URL + 'studyroom/interview',
      method: 'post',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {
        feedbackList: state.axiosFBList,
        roomSeq: state.roomSeq,
        videoSeq: state.videoSeq,
      }
    })
    .then(console.log('성공적으로 피드백까지 완료'))
    .catch(err=>console.error(err.response))
  },

  //면접자가 중간에 나가서 면접이 갑자기 종료됨 (스터디 룸 면접 종료)
  EELeaveSessionAxios({state,rootGetters}){
    console.log('EELeaveSessionAxios 실행됨')
    axios({
      url: BASE_URL + 'studyroom/interview',
      method: 'post',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {
        feedbackList: [],
        roomSeq: state.roomSeq,
        videoSeq: null,
      }
    })
    .then(console.log('면접자가 중간에 나가서 면접이 종료됨'))
    .catch(err=>{
      console.log('면접자가 중간에 나가서 면접을 종료하려 했는데 에러가 남')
      console.error(err.response)
    })
  },

  //플레이 모드 면접이 종료됨 (스터디 룸 면접 종료)
  finishInterviewEERAxios({state,rootGetters}){
    console.log('finishInterviewEERAxios 실행됨')
    axios({
      url: BASE_URL + 'studyroom/interview',
      method: 'post',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
      data: {
        feedbackList: [],
        roomSeq: state.roomSeq,
        videoSeq: null,
      }
    })
    .then(console.log('플레이 모드 면접이 종료됨'))
    .catch(err=>{
      console.log('플레이 모드 면접을 종료하려 했는데 에러남')
      console.error(err.response)
    })
  },



  // 다시보기 비디오 가져오기(영상 및 피드백 다시보기)
  getReplayAxios({state, rootGetters, commit}){
    axios({
      url: BASE_URL + `video/${state.videoSeq}`,
      method: 'post',
      headers: {Authorization: rootGetters['rhtModule/authHeader']},
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

  // 박채림 / 필터
  getFilter({commit}){
    axios({
      url : BASE_URL + 'studyroom/filter',
      method : 'get'
    }).
    then(res => {
      commit('SET_VIDEO_FILTER_LIST', res.data)
    })
    .catch(error => {
      console.log(error);
    }) 
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
