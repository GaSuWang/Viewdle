// 이병헌
<template>
  <div class="WaitingRoomView">
    <!-- <AuthorityPassModal/> -->
    <!-- 참가자 영상 나오는 부분 -->
    <div class="WRSession" v-if="session">
      <!-- openvidu 간단히 -->
      <div id="wr-video-container" class="col-md-6">
        <!-- vue 3.x에서는 click.native 없어짐 -->
        <user-video :stream-manager="publisher" />
        <user-video
          v-for="sub in subscribers"
          :key="sub.stream.connection.connectionId"
          :stream-manager="sub"
        />
      </div>
    </div>

    <!-- 방장 기능 -->
    <div class="superUser">
      <div id="session-controller">
        <input
          class="btn btn-large btn-danger"
          type="button"
          id="buttonLeaveSession"
          @click="leaveSession"
          value="방 나가기"
        />
      </div>

      <!-- 면접자 선택 -->
      <div class="dropdown" v-if="userType === 'superUser'">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          @click="consoleWRParticipantList"
        >
          <span v-if="!EECnd">면접자 선택</span> 
          <span v-else-if="EECnd">면접자: {{EECnd}}</span> 
        </button>
        <ul class="dropdown-menu">
          <li v-for="user in WRParticipantList" :key="user.id">
            <span @click="selectEE(user.name)">{{ user.name }}</span> 
          </li>
        </ul>
      </div>
      <!-- 스터디 종료 -->
      <button class="btn btn-secondary"  v-if="userType === 'superUser'" @click="EndStudyConfirm">
        스터디 종료
      </button>
      <button v-if="userType === 'superUser'" @click="superUserOutClick">나가기</button>
      <button @click="startInterview"  v-if="userType === 'superUser'">면접 시작</button>
      <button v-if="userType === 'user'" @click="userOutClick">나가기</button>
      <button @click="muteMySelf">내 음성 끄고켜기</button>
      <button @click="ShowMySelf">내 비디오 끄고켜기</button>
      <button @click="joinSession">입장하기</button>
      <button @click="switchUserType">{{userType}}</button>
     </div>
  </div>
</template>

<script>
// 여기서 영상 띄우는 법
// npm run serve
// cmd에서 docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server-kms:2.22.0
// 단 도커 설치되어 있어야 함

// import AuthorityPassModal from "@/components/StudyRoom/AuthorityPassModal.vue"
import { useRouter } from "vue-router";
import { 
  // mapActions,
mapGetters } from "vuex";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import UserVideo from "@/components/UserVideo.vue";
axios.defaults.headers.post["Content-Type"] = "application/json";

const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export default {
  name: "WaitingRoomView",
  components: { UserVideo,
  //  AuthorityPassModal 
   },
  created(){
    console.log(this.subscribers)
  },
  data() {
    return {
      // OV: undefined,
      // session: undefined,
      EECnd: '', //면접자 후보, 일단 대기실에서 면접자로 선택된 사람 이름/이메일
      LeaveWR: false,
      recordingId: '',
    };
  },
  watcher:{
    superUserOut(){
      this.session.signal({
        data: `${this.superUser}`,
        to:[],
        type:'switchSuperUser'
      })
    }
  },
  computed: {
    ...mapGetters("lbhModule", [
      'userType',
      "publisher",
      "subscribers",
      "mySessionId",
      "myUserName",
      "WRParticipantList",
      "CameraSelected",
      "MicSelected",
      "CameraStatus",
      "MicStatus",
      "CLSelected",
      "superUserOut",
      "superUser",
      "OV",
      "session",
    ]),
  },
  setup() {
    const router = useRouter();
    function EndStudyConfirm() {
      if (confirm("정말 스터디를 종료하시겠습니까?")) {
        router.push("/main");
      }
    }
    return {
      EndStudyConfirm,
    };
  },
  methods: {
    superUserOutClick(){
      if(this.userType === 'superUser'){
        this.$router.push
      }
    },
    userOutClick(){
    },
    switchUserType(){
      console.log('why not ')
      this.$store.commit('lbhModule/SWITCH_USER_TYPE')
    },

    startInterview(){
      if (confirm(`면접자는 ${this.EECnd}님 입니다.\n면접을 시작하시겠습니까?`)) {
        this.session.signal({
          data: 'true',
          to:[],
          type:'startInterview'
        })
      }
    },
    selectEE(name){
      this.EECnd = name
      this.session.signal({
      data: `${this.EECnd}`,  // Any string (optional)
      to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: 'selectEE'             // The type of message (optional)
      })
      .then(() => {
        console.log('일단 신호는 보냄')
      })
      .catch(error => {
          console.error(error);
      });
    },
    consoleWRParticipantList() {
      console.log(this.WRParticipantList);
    },
    muteMySelf() {
      if (this.publisher.stream.audioActive) {
        console.log(this.publisher.stream.audioActive);
        this.publisher.publishAudio(false);
      } else {
        console.log(this.publisher.stream.audioActive);
        this.publisher.publishAudio(true);
      }
    },
    ShowMySelf() {
      if (this.publisher.stream.videoActive) {
        console.log(this.publisher.stream.videoActive);
        this.publisher.publishVideo(false);
        console.log();
      } else {
        console.log(this.publisher.stream.videoActive);
        this.publisher.publishVideo(true);
      }
    },
    joinSession() {
      // --- Get an OpenVidu object ---
      const newOv = new OpenVidu();
      this.$store.commit('lbhModule/SET_OV', newOv)

      // --- Init a session ---
      const ovInitSession = this.OV.initSession();
      this.$store.commit('lbhModule/SET_SESSION', ovInitSession)

      console.log('wr session',this.session)
      // --- Specify the actions when events take place in the session ---

      // On every new Stream received...
      this.session.on("streamCreated", ({ stream }) => {
        const subscriber = this.session.subscribe(stream);
        const subscriberName = JSON.parse(stream.connection.data).clientData;
        this.$store.commit("lbhModule/ADD_SUBSCRIBERS", subscriber);
        this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", subscriberName);

        this.session.signal({ 
          //새로운 유저가 들어오면, 모든 유저에게 현재의 방장 유저가 누군지 알려주는 데이터 전송
          //향후 새로운 유저에게 줘야 할 데이터 있으면 여기에서 보내주는 걸로
          data: `"superUser": ${this.superUser}, WRParticipantList: ${this.WRParticipantList},`,
          to:[],
          type:'welcomeNewUser'
        })
      });

      // On every Stream destroyed...
      this.session.on("streamDestroyed", ({ stream }) => {
        const index_s = this.subscribers.indexOf(stream.streamManager, 0);
        if (index_s >= 0) {
          this.$store.commit("lbhModule/DELETE_SUBSCRIBERS", index_s);
        }
        const subscriberName = JSON.parse(stream.connection.data).clientData;
        this.$store.commit("lbhModule/DELETE_WR_PARTICIPANT_LIST", subscriberName);
      });

      // On every asynchronous exception...
      this.session.on("exception", ({ exception }) => {
        console.warn(exception);
      });

      // --- Connect to the session with a valid user token ---

      // 'getToken' method is simulating what your server-side should do.
      // 'token' parameter should be retrieved and returned by your own backend

      this.getToken(this.mySessionId).then((token) => {
        console.log('getToken 다음이 시작됨?')
        this.session
          .connect(token, { clientData: this.myUserName })
          .then(() => {
            // --- Get your own camera stream with the desired properties ---
            console.log("내이름", this.myUserName);
            this.$store.commit(
              "lbhModule/ADD_WR_PARTICIPANT_LIST",
              this.myUserName
            );

            let publisher = this.OV.initPublisher(undefined, {
              audioSource: this.MicSelected, // The source of audio. If undefined default microphone
              videoSource: this.CameraSelected, // The source of video. If undefined default webcam
              publishAudio: this.MicStatus, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: this.CameraStatus, // Whether you want to start publishing with your video enabled or not
              resolution: "320x240", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });

            this.$store.commit("lbhModule/SET_PUBLISHER", publisher);

            // --- Publish your stream ---

            this.session.publish(this.publisher);
            console.log('오디오 비디오 어떻게 들어왔나',this.publisher.stream)
          })
          .catch((error) => {
            console.log(
              "There was an error connecting to the session:",
              error.code,
              error.message
            );
          });
      });


      this.session.on('signal:welcomeNewUser', (e)=>{ //방에 처음 들어왔을 때 받는 signal
        const json = JSON.parse(e.data)
        this.superUser = json.superUser
        this.WRParticipantList = json.WRParticipantList
        this.switchSuperUser = false
      })

      this.session.on('signal:switchSuperUser', (e)=>{
        this.$store.commit('lbhModule/SET_SUPERUSER', e.data)
        this.$store.commit('lbhModule/SET_SUPERUSER_OUT', false)
      })

      this.session.on('signal:EECL', (e)=>{ //면접자의 자소서를 받아옴
        const cl = JSON.parse(e.data)
        this.$store.commit('SET_STUDYROOM_CL', cl)
      })

      this.session.on('signal:selectEE', (event) => { //면접자가 누구인지 받음
       this.EECnd = event.data; // Message
      });

      this.session.on('signal:startInterview', (event) => {
       this.LeaveWR = event.data; 
       if(this.LeaveWR){
        if(this.EECnd === this.myUserName){ //만약에 내가 면접자라면
          this.session.signal({ // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
          data: `"title": ${this.CLSelected.coverLetterTitle}, "content": ${this.CLSelected.coverLetterContent}`, 
          to: [], 
          type: 'EECL' 
          })
          .then(() => {console.log('자소서 보냄')})
          .catch(error => {console.error(error)});
          console.log('startInterview as EE')
          this.$store.commit('lbhModule/SET_EE', this.publisher) //나(publisher)를 EE에 넣음
          this.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회하면서 ERS에 넣음
            this.$store.commit('lbhModule/SET_ERS', s)
          })
          console.log('startinterview session',this.session )
          this.$router.push({name:'ee-room', params:{session:this.session}})
        } else { //만약 내가 면접관이라면
          console.log('startInterview as ER')
          this.$store.commit('lbhModule/SET_ERS', this.publisher) //나(publisher)를 ERS에 넣음
          this.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회
            const subscriberName = JSON.parse(s.stream.connection.data).clientData;
            if(this.EECnd === subscriberName){ //면접자 포지션인 참여자(s)는 EE에 넣음
              this.$store.commit('lbhModule/SET_EE', s)
            } else { //그 외의 참여자(s)는 ERS에 넣음
              this.$store.commit('lbhModule/SET_ERS', s)
            }
          })
          console.log('startinterview session',this.session )
          this.$router.push({name: 'er-room', params:{session:this.session}})
          }
       }
      });

      window.addEventListener("beforeunload", this.leaveSession);
    },

    leaveSession() {
      this.session.signal({
        data: '',
        to: [],
        type: ''
      })
      // --- Leave the session by calling 'disconnect' method over the Session object ---
      if (this.session) this.session.disconnect();

      // this.session = undefined;
      // this.mainStreamManager = undefined;
      // this.publisher = undefined;
      // this.subscribers = [];
      // this.OV = undefined;
  
      // this.superUser = {};
      // this.superUserOut = false;
      // this.AMP

      this.$store.commit('lbhModule/SET_SESSION', undefined)
      this.$store.commit('lbhModule/SET_OV', undefined)
      this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
      this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])

      window.removeEventListener("beforeunload", this.leaveSession);
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

    getToken(mySessionId) {
      console.log('getToken이 시작되긴 했음', mySessionId)
      return this.createSession(mySessionId).then((sessionId) =>
        this.createToken(sessionId)
      );
    },


    // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-session
    createSession(sessionId) {
      console.log('createSession이 시작되긴 했음')
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
      console.log('createToken이 시작되긴 했음')
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
}
</script>

<style scoped>
.WaitingRoomView {
  position: absolute;
  width: 90vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 60px;
  padding: 3%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.WRSession {
  width: 65%;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

#wr-video-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.superUser {
  width: 20%;
  margin: 0;
  flex-direction: row;
  justify-content: space-between;
}
</style>
