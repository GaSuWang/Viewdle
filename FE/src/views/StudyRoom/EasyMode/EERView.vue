// 이병헌
<template>
  <div class="EERView">
    <!-- 영상 구역 -->
    <div class="EERContent">
      <!-- 면접자 영상 구역  -->
      <div class="EEVid">
        <warningStackBar :stack="warningCount"></warningStackBar>
      </div>
      <!-- 면접관 영상 구역 -->
      <div class="ERVidContainer">
        <div class="ERVid"></div>
        <div class="ERVid"></div>
        <div class="ERVid"></div>
        <div class="ERVid"></div>
      </div>
    </div>
    <!-- BtnContainer -->
    <div class="EERBtnContainer top">
      <div class="EERtoLB">
        <button>
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <div class="EERBtnContainer bottom">
      <div class="CLViewBtn">
        <button @click="openCL">
          <i class="bi bi-file-earmark-text"></i>
        </button>
      </div>
      <div class="VoiceChangeBtn">
        <button>
          <i class="bi bi-mic-fill"></i>
        </button>
      </div>
      <div class="StudyEnd">
        <button>
          <i class="bi bi-check-lg"></i>
        </button>
      </div>
      <div class="SuddenAttackBtn">
        <button @click="sendWarningSignal">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </button>
      </div>
      <div class="CaptureBtn">
        <button>
          <i class="bi bi-camera"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import warningStackBar from "@/components/StudyRoom/EasyMode/WarningStackBar.vue";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { useRouter } from "vue-router";
const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";
axios.defaults.headers.post["Content-Type"] = "application/json";
export default {
  name: "EERView",
  components: {
    warningStackBar,
  },
  computed: {
    ...mapGetters("lbhModule", ["EE", "myUserName", "mySessionId"]),
  },
  setup() {
    const router = useRouter();
    //--------------------return waitingRoom ---------------------------
    function returnWaitingRoom() {
      router.push({ name: "waiting-room" });
    }
    //--------------------return waitingRoom end---------------------------
    return {
      returnWaitingRoom,
    };
  },
  data() {
    return {
      warningCount: 0,
    };
  },

  //----------------------joinSession----------------------------
  created() {
    this.joinSession();
  },
  //--------------------joinSession end----------------------------

  methods: {
    openCL() {
      let route = this.$router.resolve({ path: "/eecl" });
      window.open(route.href);
    },
    changeVoice() {},
    suddenAttack() {},
    capture() {},

    addWarn() {
      //경고 누적용
      this.warningCount++;
      console.log("warningCount: ", this.warningCount);
      if (this.warningCount >= 3) {
        console.log("warningCount limit, return waiting room");
        //면접 종료
        this.session.signal({
          data: "End Interview by over warning stack limit",
          to: [],
          type: "EndInterviewByWarning",
        });
      }
    },

    //---------------------openvidu mehtod---------------------------
    joinSession() {
      // --- Get an OpenVidu object ---
      this.OV = new OpenVidu();

      // --- Init a session ---
      this.session = this.OV.initSession();

      this.getToken(this.mySessionId).then((token) => {
        this.session.connect(token);
      });

      this.session.on("signal:warning", (event) => {
        console.log(event.data);
        //신호를 받고, 내가 면접자인 경우에만 warningCount++
        // if (this.EE[0] === this.myUserName) {
        //   console.log("EE: ", this.EE);
        //   this.addWarn();
        // }

      // <- 테스트용, 모든 참여자 warningCoutn 올림
        this.addWarn();
        
      });
      this.session.on("signal:EndInterviewByWarning", (event) => {
        console.log(event.data);
        this.returnWaitingRoom();
        //대기실로 돌아가는 메소드 구현
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
    getToken(mySessionId) {
      return this.createSession(mySessionId).then((sessionId) => this.createToken(sessionId));
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
    //---------------------openvidu mehtod end---------------------------

    //---------------------send warning singal---------------------------
    sendWarningSignal() {
      this.session
        .signal({
          data: "stacked warning count",
          to: [], //<- 면접자만 어떻게 골라서 보내지...
          type: "warning",
        })
        .then(() => {
          console.log("successed send warning");
        })
        .catch(() => {
          console.log("failed send warning");
        });
    },
    //---------------------send warning singal end---------------------------
  },
};
</script>

<style scoped>
.EERView {
  position: absolute;
  width: 90vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 10px 10px 20px 6px #b5b8c0;
  border-radius: 60px;
  padding: 3%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.EERContent {
  width: 100%;
  height: 100%;
  opacity: 50%;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
}

.EEVid {
  width: 80%;
  height: 100%;
  background-color: #edf0f6;
  border-radius: 5%;
  border: 1px solid rgb(161, 161, 161);
}

.ERVidContainer {
  width: 20%;
  height: 100%;
}

.ERVid {
  width: 100%;
  height: 25%;
  background-color: #edf0f6;
  border: 1px solid rgb(161, 161, 161);
  border-radius: 10%;
}

.EERBtnContainer {
  z-index: 1;
  width: 67vw;
  opacity: 30%;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
}

.top {
  position: absolute;
  top: 8%;
  align-self: flex-end;
  left: 66%;
}

.bottom {
  position: absolute;
  bottom: 10%;
  justify-content: space-evenly;
  align-items: center;
  align-self: flex-start;
}

.EERBtnContainer.top > button {
  border: none;
  background-color: rgb(209, 209, 209);
  border-radius: 50%;
  width: 3%;
  height: 3%;
  /* filter: blur(3px); */
}

.EERBtnContainer.top > div > button > i {
  font-size: 100%;
  color: black;
}
.EERBtnContainer > div > button {
  border: none;
  background-color: rgb(209, 209, 209);
  border-radius: 50%;
}

.EERBtnContainer > div > button {
  padding: 15px;
}

.EERBtnContainer > div > button > i {
  font-size: 150%;
  color: black;
}
</style>
