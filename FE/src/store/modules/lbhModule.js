import axios from "axios";
import { OpenVidu } from "openvidu-browser";
axios.defaults.headers.post["Content-Type"] = "application/json";
const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const state = {
  //SettingRoom
  CameraList: {}, // 영상 디바이스 리스트
  CameraSelected: {}, // 선택된 영상 디바이스
  MicList: {}, // 오디오 디바이스 리스트
  MicSelected:{}, // 선택된 오디오 디바이스
  UserCLList: {}, // 유저의 자소서 리스트

  //WaitingRoom
  //AuthorityPassModal
  WRParticipantList: {}, // 방장 권한 위임 시 목록 나타내 주기 위해서, 면접자 선택 위해서
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
  OV(state){return state.OV},
  session(state){return state.session},
  mainStreamManager(state){return state.mainStreamManager},
  publisher(state){return state.publisher},
  subscribers(state){return state.subscribers},
  mySessionId(state){return state.mySessionId},
  myUserName(state){return state.myUserName},

  //WaitingRoom
  //AuthorityPassModal
  WRParticipantList(state) {
    return state.ParticipantList;
  },
  StartInterview(state){
    return state.StartInterview
  },
  //EEView, ERView
  isEERFull(state){
    return state.isEERFull
  },
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
  //openvidu
  SET_OV(state, ov){state.OV = ov},
  SET_SESSION(state, session){state.session = session},
  SET_MAINSTREAMMANAGER(state, mainStreamManager){state.mainStreamManager = mainStreamManager},
  SET_PUBLISHER(state, publisher){state.publisher = publisher},
  SET_SUBSCRIBERS(state, subscriber){state.subscribers = subscriber},
  ADD_SUBSCRIBERS(state, subscriber){state.subscribers.push(subscriber)},
  DELETE_SUBSCRIBERS(state, index){state.subscribers.splice(index, 1)},
  SET_MYSESSIONID(state, mySessionId){state.mySessionId = mySessionId},
  SET_MYUSERNAME(state, myUserName){state.myUserName = myUserName},

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
  SET_STARTINTERVIEW(state, tf){
    state.StartInterview = tf
  },
  //EEView, ERView
  SET_EER_PARTICIPANT_LIST(state, participant){
    state.EERParticipantList.participant = participant
  },
  SET_ISEERFULL(state, tf){
    state.isEERFull = tf
  },
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
  //openvidu
  setOV({commit}, ov){
    commit('SET_OV',ov)
  },
  setSession({commit}, session){
    commit('SET_SESSION',session)
  },
  setMySessionId({commit}, mySessionId){
    commit('SET_MYSESSIONID',mySessionId)
  },
  setMyUserName({commit}, myUserName){
    commit('SET_MYUSERNAME',myUserName)
  },

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
  setStartInterview({commit, dispatch}, tf){
    commit('SET_STARTINTERVIEW', tf)
    dispatch('setEERParticipantList')
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
  setEERParticipantList({commit, state}){
    const users = { ...state.publisher, ...state.subscribers }
    commit('SET_EER_PARTICIPANT_LIST', users)
  },
  setEERFull({state, commit}){
    commit('SET_EERFULL', state.EER)
  },
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
  },
  joinSession({state, dispatch, commit}) {
    // --- Get an OpenVidu object ---
    // state.OV = new OpenVidu();
    let ov = new OpenVidu();
    dispatch('setOV', ov)
    
    // --- Init a session ---
    // state.session = state.OV.initSession();
    let session = state.OV.initSession();
    dispatch('setSession', session)
    // --- Specify the actions when events take place in the session ---

    // On every new Stream received...
    state.session.on("streamCreated", ({ stream }) => {
      const subscriber = state.session.subscribe(stream);
      // state.subscribers.push(subscriber);
      commit('ADD_SUBSCRIBERS', subscriber)
    });

    // On every Stream destroyed...
    state.session.on("streamDestroyed", ({ stream }) => {
      const index = state.subscribers.indexOf(stream.streamManager, 0);
      if (index >= 0) {
        commit('DELETE_SUBSCRIBERS', index)
      }
    });

    // On every asynchronous exception...
    state.session.on("exception", ({ exception }) => {
      console.warn(exception);
    });

    // --- Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    console.log('getToken 직전', state.mySessionId)
    dispatch('getToken',state.mySessionId).then((token) => {
      state.session.connect(token, { clientData: state.myUserName })
        .then(() => {
          // --- Get your own camera stream with the desired properties ---

          let publisher = state.OV.initPublisher(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: "640x480", // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // state.mainStreamManager = publisher;
          // state.publisher = publisher;

          commit('SET_MAINSTREAMMANAGER', publisher)
          commit('SET_PUBLISHER',publisher)

          // --- Publish your stream ---

          state.session.publish(state.publisher);
        })
        .catch((error) => {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        });
    });

    window.addEventListener("beforeunload", this.leaveSession);
  },

  leaveSession({state, dispatch, commit}) {
    // --- Leave the session by calling 'disconnect' method over the Session object ---
    if (state.session) state.session.disconnect();

    // state.session = undefined;
    // state.mainStreamManager = undefined;
    // state.publisher = undefined;
    // state.subscribers = [];
    // state.OV = undefined;
    commit('SET_SESSION', undefined);
    commit('SET_MAINSTREAMMANAGER', undefined);
    commit('SET_PUBLISHER', undefined);
    commit('SET_SUBSCRIBERS', undefined);
    commit('SET_OV', undefined);

    window.removeEventListener("beforeunload", dispatch('leaveSession'));
  },

  updateMainVideoStreamManager({state}, stream) {
    if (state.mainStreamManager === stream) return;
    state.mainStreamManager = stream;
  },

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken({dispatch}, mySessionId) {
    // return this.createSession(mySessionId).then(sessionId => this.createToken(sessionId));
    console.log('getToken 시작',mySessionId)
    const getTokenResult = dispatch('createSession', mySessionId)
    .then((sessionId)=>{
      dispatch('createToken', sessionId)
    })
    return getTokenResult
  },

  // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-session
  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
          JSON.stringify({
            customSessionId: sessionId,
          }),
          {
            auth: {
              username: "OPENVIDUAPP",
              password: OPENVIDU_SERVER_SECRET,
            },
          }
        )
        .then((response) => {
          console.log('아니 도대체 왜 createSession에 오는 sessionId는 이따구지?', sessionId)
          return response.data})
        .then((data) => {resolve(data.id)})
        .catch((error) => {
          console.log(error)

          if (error.response.status === 409) {
            resolve(sessionId);
          } else {
            console.warn(
              `No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`
            );
            if (
              window.confirm(
                `No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${OPENVIDU_SERVER_URL}"`
              )
            ) {
              location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
            }
            reject(error.response);
          }
        });
    });
  },

  // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-connection
  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
          {},
          {
            auth: {
              username: "OPENVIDUAPP",
              password: OPENVIDU_SERVER_SECRET,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => resolve(data.token))
        .catch((error) => reject(error.response));
    });
  },
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
