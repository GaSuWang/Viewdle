// 이병헌
<template>
  <div class="WaitingRoomView">
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
    <div class="superUser" v-show="userType === 'superUser'">
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
      <div class="dropdown">
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
      <button class="btn btn-secondary" @click="EndStudyConfirm">
        스터디 종료
      </button>
      <button @click="muteMySelf">내 음성 끄고켜기</button>
      <button @click="ShowMySelf">내 비디오 끄고켜기</button>
      <button @click="joinSession">입장하기</button>
      <button @click="startInterview">면접 시작</button>
    </div>
  </div>
</template>

<script>
// 여기서 영상 띄우는 법
// npm run serve
// cmd에서 docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server-kms:2.22.0
// 단 도커 설치되어 있어야 함

import { ref } from "vue";
import { useRouter } from "vue-router";
import { mapGetters } from "vuex";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import UserVideo from "@/components/UserVideo.vue";
axios.defaults.headers.post["Content-Type"] = "application/json";

const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export default {
  name: "WaitingRoomView",
  components: { UserVideo },
  data() {
    return {
      OV: undefined,
      session: undefined,
      EECnd: '', //면접자 후보, 일단 대기실에서 면접자로 선택된 사람 이름/이메일
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      "publisher",
      "subscribers",
      "mySessionId",
      "myUserName",
      "WRParticipantList",
    ]),
  },
  setup() {
    const router = useRouter();
    function EndStudyConfirm() {
      if (confirm("정말 스터디를 종료하시겠습니까?")) {
        router.push("/main");
      }
    }
    const userType = ref("superUser");
    // function startInterview(){
    //     if (confirm(`면접자는 ${this.EECnd}님 입니다.\n면접을 시작하시겠습니까?`)) {
    //     router.push("/waiting-room");
    //   }
    // }
    return {
      userType,
      EndStudyConfirm,
      // startInterview,
    };
  },
  methods: {
    startInterview(){
      if (confirm(`면접자는 ${this.EECnd}님 입니다.\n면접을 시작하시겠습니까?`)) {
        if(this.myUserName === this.EECnd){
          this.$router.push('/ee-room')
        } else {this.$router.push('/er-room')}
      }
    },
    selectEE(name){
      this.EECnd = name
      this.session.signal({
      data: `${this.EECnd}`,  // Any string (optional)
      to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: ''             // The type of message (optional)
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
      this.OV = new OpenVidu();

      // --- Init a session ---
      this.session = this.OV.initSession();

      // --- Specify the actions when events take place in the session ---

      // On every new Stream received...
      this.session.on("streamCreated", ({ stream }) => {
        const subscriber = this.session.subscribe(stream);
        const subscriberName = JSON.parse(stream.connection.data).clientData;
        this.$store.commit("lbhModule/ADD_SUBSCRIBERS", subscriber);
        this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", subscriberName);
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
        console.log("getToken 시작됨 근데 clientData가 뭐지", this.myUserName);
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
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: "320x240", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });

            this.$store.commit("lbhModule/SET_PUBLISHER", publisher);

            // --- Publish your stream ---

            this.session.publish(this.publisher);
          })
          .catch((error) => {
            console.log(
              "There was an error connecting to the session:",
              error.code,
              error.message
            );
          });
      });

      this.session.on('signal', (event) => {
       this.EECnd = event.data; // Message
      });

      window.addEventListener("beforeunload", this.leaveSession);
    },

    leaveSession() {
      // --- Leave the session by calling 'disconnect' method over the Session object ---
      if (this.session) this.session.disconnect();

      this.session = undefined;
      this.mainStreamManager = undefined;
      this.publisher = undefined;
      this.subscribers = [];
      this.OV = undefined;

      window.removeEventListener("beforeunload", this.leaveSession);
    },

    updateMainVideoStreamManager(stream) {
      if (this.mainStreamManager === stream) return;
      this.mainStreamManager = stream;
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
      return this.createSession(mySessionId).then((sessionId) =>
        this.createToken(sessionId)
      );
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
  },
  // created() {
  //   this.joinSession();
  // },
};
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
