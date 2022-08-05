import axios from "axios";
import { OpenVidu } from "openvidu-browser";

axios.defaults.headers.post["Content-Type"] = "application/json";
const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const state = {
  mySessionId: "SessionA",
  myUserName: "Participant" + Math.floor(Math.random() * 100),
  publisher: undefined,
  subscribers: [],
  OV: undefined,
  session: undefined,
  // mainStreamManager: undefined,
  // SessionToken: undefined,
};

const getters = {
  //openvidu
  OV(state) {return state.OV},
  session(state) {return state.session},
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
  SessionToken(state){ return state.SessionToken},
};
const mutations = {
  //openvidu
  SET_OV(state, ov){state.OV = ov},
  SET_SESSION(state, session){state.session = session},
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
  SET_SESSION_TOKEN(state, token){
    state.SessionToken = token
    console.log('SET_SESSION_TOKEN',state.SessionToken)
  },
};

function leaveSession(){
    if (state.session) state.session.disconnect();

    state.session = undefined;
    state.mainStreamManager = undefined;
    state.publisher = undefined;
    state.subscribers = [];
    state.OV = undefined;

    state.superUser = {};
    state.superUserOut = false;
    state.AMP
    window.removeEventListener("beforeunload", leaveSession);
}

const actions = {
  joinSession({state, commit, dispatch}) {
    console.log('joinSession 불려오기는 함' )
    const newOpenVidu = new OpenVidu();
    commit('SET_OV', newOpenVidu)

    const ovInitSession = state.OV.initSession()
    commit('SET_SESSION', ovInitSession)
    
    // On every new Stream received...
    state.session.on("streamCreated", ({ stream }) => {
      const subscriber = state.session.subscribe(stream);
      const subscriberName = JSON.parse(stream.connection.data).clientData;
      commit("ADD_SUBSCRIBERS", subscriber);
      commit("ADD_WR_PARTICIPANT_LIST", subscriberName);

      state.session.signal({ 
        //새로운 유저가 들어오면, 모든 유저에게 현재의 방장 유저가 누군지 알려주는 데이터 전송
        //향후 새로운 유저에게 줘야 할 데이터 있으면 여기에서 보내주는 걸로
        data: `"superUser": ${state.superUser}, WRParticipantList: ${state.WRParticipantList},`,
        to:[],
        type:'welcomeNewUser'
      })
    });

    state.session.on("streamDestroyed", ({ stream }) => {
      const index_s = this.subscribers.indexOf(stream.streamManager, 0);
      if (index_s >= 0) {
        commit("DELETE_SUBSCRIBERS", index_s);
      }
      const subscriberName = JSON.parse(stream.connection.data).clientData;
      commit("DELETE_WR_PARTICIPANT_LIST", subscriberName);
    });

    // On every asynchronous exception...
    state.session.on("exception", ({ exception }) => {
      console.warn(exception);
    });

    dispatch('getToken',state.mySessionId).then((token) => {
      // commit('SET_SESSION_TOKEN', token) //아마 필요없는 부분
      state.session
        .connect(token, { clientData: state.myUserName })
        .then(() => {commit("ADD_WR_PARTICIPANT_LIST", state.myUserName);

          let publisher = state.OV.initPublisher(undefined, {
            audioSource: state.MicSelected, // The source of audio. If undefined default microphone
            videoSource: state.CameraSelected, // The source of video. If undefined default webcam
            publishAudio: state.MicStatus, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: state.CameraStatus, // Whether you want to start publishing with your video enabled or not
            resolution: "320x240", // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          commit("SET_PUBLISHER", publisher);

          state.session.publish(publisher);
        })
        .catch((error) => {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        });
    });

    state.session.on('signal:welcomeNewUser', (e)=>{ //방에 처음 들어왔을 때 받는 signal
      const json = JSON.parse(e.data)
      state.superUser = json.superUser
      state.WRParticipantList = json.WRParticipantList
      state.switchSuperUser = false
    })

    state.session.on('signal:switchSuperUser', (e)=>{
      commit('SET_SUPERUSER', e.data)
      commit('SET_SUPERUSER_OUT', false)
    })

    state.session.on('signal:EECL', (e)=>{ //면접자의 자소서를 받아옴
      const cl = JSON.parse(e.data)
      commit('SET_STUDYROOM_CL', cl)
    })

    state.session.on('signal:selectEE', (event) => { //면접자가 누구인지 받음
     state.EECnd = event.data; // Message
    });

    state.session.on('signal:startInterview', (event) => {
     state.LeaveWR = event.data; 
     if(state.LeaveWR){
      if(state.EECnd === state.myUserName){ //만약에 내가 면접자라면
        state.session.signal({ // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
        data: `"title": ${state.CLSelected.coverLetterTitle}, "content": ${this.CLSelected.coverLetterContent}`, 
        to: [], 
        type: 'EECL' 
        })
        .then(() => {console.log('자소서 보냄')})
        .catch(error => {console.error(error)});
        commit('SET_EE', state.publisher) //나(publisher)를 EE에 넣음
        state.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회하면서 ERS에 넣음
          commit('SET_ERS', s)
        })
        this.$router.push({name:'ee-room'})
      } else { //만약 내가 면접관이라면
        commit('SET_ERS', state.publisher) //나(publisher)를 ERS에 넣음
        state.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회
          const subscriberName = JSON.parse(s.stream.connection.data).clientData;
          if(state.EECnd === subscriberName){ //면접자 포지션인 참여자(s)는 EE에 넣음
            commit('SET_EE', s)
          } else { //그 외의 참여자(s)는 ERS에 넣음
            commit('SET_ERS', s)
          }
        })
        this.$router.push({name: 'er-room'})
        }
     }
    });

    window.addEventListener("beforeunload", leaveSession);
  },

  // leaveSession({state, dispatch}) {
  //   // state.session.signal({
  //   //   data: '',
  //   //   to: [],
  //   //   type: ''
  //   // })

  //   if (state.session) state.session.disconnect();

  //   state.session = undefined;
  //   state.mainStreamManager = undefined;
  //   state.publisher = undefined;
  //   state.subscribers = [];
  //   state.OV = undefined;

  //   state.superUser = {};
  //   state.superUserOut = false;
  //   state.AMP
  //   window.removeEventListener("beforeunload", dispatch('leaveSession'));
  // },


  getToken({dispatch}, mySessionId) {
    return dispatch('createSession', mySessionId)
    .then((sessionId) => dispatch('createToken', sessionId));
  },


  // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-session
  createSession(sessionId) {
    console.log('지금 여기가 문제라는 거지?')
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
          `"{"customSessionId": ${sessionId}"`,
          {
            auth: {
              username: "OPENVIDUAPP",
              password: OPENVIDU_SERVER_SECRET,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => resolve(data.id))
        .catch((error) => {
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
