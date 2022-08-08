// 이병헌
//면접실(일반 모드)에서 면접자가 보는 페이지 (Interviewee Room VIew => EEView)
<template>
  <div class="EEView">
    <!-- 영상 구역  -->
    <!-- 면접관 영상 구역 -->
    <div class="EELeftArea">
        <div class="ERVideo container">
          <div class="row row-cols-2">
            <user-video class="video"
              v-for="ER in ERS"
              :key="ER.stream.connection.connectionId"
              :stream-manager="ER"/>
          </div>
        </div>
    </div>
    <!-- 유저 기능 구역 -->
    <!-- 상단  -->

    <!-- 하단 -->
    <div class="EERight">
      <!-- 면접에서 나가기 버튼(일반 유저) -->
      <div v-show="userType === 'user'" class="EEtoLBbtn user">
        <button @click.prevent="EEtoLBConfirm(userType)">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 면접에서 나가기 버튼(방장 유저) -->
      <div v-show="userType === 'superUser'" class="EEtoLBbtn superUser">
        <button @click.prevent="EEtoLBConfirm(userType)">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 면접 완료 버튼(방장 유저) -->
      <div v-show="userType === 'superUser'" class="EndStudyBtn superUser">
        <button @click.prevent="StudyDestroy">
          <i class="bi bi-check-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UserVideo from "@/components/UserVideo.vue";
import { ref } from "vue";
import { mapGetters } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export default {
  name: "EEView",
  components:{UserVideo},
  computed:{
    ...mapGetters('lbhModule',[
      "EE",
      "ERS",
      "myUserName",
      "mySessionId",
      "userType",
      "publisher",
      "subscribers",
      'SessionToken',
      "session",

      //기기
      "CameraSelected",
      "CameraStatus",
      "CameraStatus",
      "MicSelected",
      "MicStatus",
      "MicStatus",
    ])
  },
  data(){
    return {
    }
  },
  created(){
    console.log('면접자 정보', this.publisher.stream.connection.data)
    this.session.on('signal:endInterview', () => {
      console.log('signal endinterview 받음')
      console.log('면접자가 면접자실에서 나감', JSON.parse(this.publisher.stream.connection.data).clientData)
      this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', this.myUserName)
      this.toWR()
    });  
  },
  methods:{
    StudyDestroy(){
      this.$store.dispatch('lbhModule/StudyDestroy')
    },
    async toWR() {
      await this.$router.push({name:'waiting-room'})
      this.$store.commit('lbhModule/SET_EE', []) //방장이 면접 종료?완료 버튼을 눌러 하나의 면접을 끝내면, 일단 EE를 empty array로 만듬
      this.$store.commit('lbhModule/EMPTY_ERS')
    },
    switchUserType(){
      this.$store.commit('lbhModule/SWITCH_USER_TYPE')
    },
    getToken(mySessionId) {
        console.log('getToken이 시작되긴 했음', mySessionId)
        return this.createSession(mySessionId).then((sessionId) =>{
          console.log('createSession은 잘 됨')
          return this.createToken(sessionId)
          }
        );
    },  
    createSession(sessionId) {
      console.log('createSession이 시작되긴 했음')
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
            // {},
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
            console.log('createSession에서 막힘')
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
    createToken(sessionId) {
      console.log('createToken까지 왔나?')
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,{},
            {
              auth: {
                username: "OPENVIDUAPP",
                password: OPENVIDU_SERVER_SECRET,
              },
            }
          )
          .then((response) => response.data)
          .then((data) => resolve(data.token))
          .catch((error) => reject(error.response), console.log('createToken이 문제라고?'));
      });
    },
  },
  setup() {
    const router = useRouter();
    const userType = ref("superUser"); //유저가 일반유저인지, 방장유저인지를 담고 있는 데이터를 여기에 넣어야, 지금은 임시
    function EEtoLBConfirm(userType) {
      if (userType === "user") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 면접영상이 저장되지 않고 대기실로 이동합니다."
          )
        ) {
          router.push("main");
        }
      } else if (userType === "superUser") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 면접영상이 저장되지 않고 대기실로 이동합니다."
          )
        ) {
          // 권한위임 모달 실행
        }
      }
    }
    function EndStudyConfirm() {
      if (
        confirm(
          "면접 과정을 종료하시겠습니까? 면접자는 대기실로, 면접관은 피드백 수정실로 이동합니다. "
        )
      ) {
        router.push("waiting-room");
      }
    }
    return {
      userType,
      EEtoLBConfirm,
      EndStudyConfirm,
    };
  },
};
</script>

<style scoped>
.EEView {
  position: absolute;
  width: 90vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 10px 40px 20px 6px #bfc2cb;  
  border-radius: 60px;
  padding: 3%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.EELeftArea {
  width: 95%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.ERVideo {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;  
  overflow-y: scroll;
}

.row {
  width: 100%;
}

.video{
  width: 45%;
  margin-left: 2%;
  margin-right: 2%;
  display:flex;
  justify-content: center;
  align-items: center;
}

.EERight {
  width: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

/* 버튼양식 */
.EndStudyBtn > button,
.EEtoLBbtn > button {
  border: none;
  display: block;
  background: linear-gradient(#f7f7f7, #e7e7e7);
  color: #a7a7a7;
  margin: 18px;
  width: 36px;
  height: 36px;
  position: relative;
  text-align: center;
  line-height: 36px;
  border-radius: 50%;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.EndStudyBtn > button:before,
.EEtoLBbtn > button:before {
  content: "";
  display: block;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #fff;
  width: 100%;
  height: 1px;
  position: absolute;
  top: 50%;
  z-index: -1;
}
.EndStudyBtn > button:after,
.EEtoLBbtn > button:after {
  content: "";
  display: block;
  background: rgb(255, 255, 255);
  border-top: 2px solid #ddd;
  position: absolute;
  top: -9px;
  left: -9px;
  bottom: -9px;
  right: -9px;
  z-index: -1;
  border-radius: 50%;
  box-shadow: inset 0px 4px 24px #ddd;
}
.EndStudyBtn > button:after,
.EEtoLBbtn > button:after {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}
/* 버튼양식 */
</style>
