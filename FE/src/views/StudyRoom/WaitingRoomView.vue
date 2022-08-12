// 이병헌
<template>
  <AuthorityPassModal/>
  <div class="WaitingRoomView">

    <!-- 참가자 영상 나오는 부분 -->
    <div class="WRLeftArea">
      <div class="WRVideo container">
        <div class="row row-cols-2">
          <user-video class="video" :stream-manager="publisher" />
          <user-video
            class="video"
            v-for="sub in subscribers"
            :key="sub.stream.connection.connectionId"
            :stream-manager="sub"
          />
        </div>
      </div>
    </div>

    <div class="WRRightArea">
      <!-- 대기실에서 나가기 버튼(일반 유저) -->
      <div class="user-out" v-if="userType === 'user'"  
      @click ="userLeaveSessionfromWR"
      >
        <button>
          방나가기
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 대기실에서 나가기 버튼(방장 유저) -->
      <div v-if="userType === 'superUser'" class="superUser">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false">
            <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- 방장 유저 기능 -->
      <!-- 면접자 선택 -->
      <div class="dropdown" v-if="userType === 'superUser'">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span v-if="!EECnd">면접자 선택</span>
          <span v-else-if="EECnd">면접자: {{ EECnd }}</span>
        </button>
        <ul class="dropdown-menu">
          <li v-for="user in WRParticipantList" :key="user.myUserEmail">
            <span @click="selectEE(user)">{{ user.myUserName }}: {{myUserEmail}}</span>
          </li>
        </ul>
      </div>

      <div class="start-interview" v-if="userType === 'superUser'">
        <button @click="startInterview">
          <i class="bi bi-check-lg"></i>
        </button>
        <button @click="startEZInterview">EZ<i class="bi bi-check-lg"></i></button>
      </div>

      <div class="mic-status">
        <button @click="switchMicStatus" v-if="session">
          <i v-if="MicStatus" class="bi bi-mic"></i>
          <i v-else class="bi bi-mic-mute"></i>
        </button>
      </div>

      <div class="camera-status">
        <button @click="switchCameraStatus" v-if="session">
          <i v-if="CameraStatus===true" class="bi bi-camera-video"></i>
          <i v-else-if="CameraStatus===false" class="bi bi-camera-video-off"></i>
        </button>
      </div>

      <!-- 삭제할 버튼들 -->
      <!-- <div class="tempBtn">
        <button v-if="!session" @click="joinSession">입장하기</button>
        <button @click="switchUserType">{{ userType }}</button>
      </div> -->
    </div>
  </div>
</template>

<script>
// 여기서 영상 띄우는 법
// npm run serve
// cmd에서 docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET -e OPENVIDU_RECORDING=true -e OPENVIDU_RECORDING_PUBLIC_ACCESS=true -e OPENVIDU_RECORDING_PATH=/opt/openvidu/recordings -v /var/run/docker.sock:/var/run/docker.sock -v /opt/openvidu/recordings:/opt/openvidu/recordings openvidu/openvidu-server-kms:2.22.0
// cmd에서 docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server-kms:2.22.0
// 단 도커 설치되어 있어야 함

import AuthorityPassModal from "@/components/StudyRoom/AuthorityPassModal.vue"
// import { useRouter } from "vue-router";
import { mapGetters } from "vuex";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import UserVideo from "@/components/UserVideo.vue";
axios.defaults.headers.post["Content-Type"] = "application/json";

const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export default {
  name: "WaitingRoomView",
  components: { UserVideo,  AuthorityPassModal },
  created(){
    // const inWR = this.WRParticipantList.filter(e=>e.name === this.myUserName)
    // console.log('내가 현재 대기실에 들어왔는데, 대기실 유저 목록에 내가 있나?', inWR)
    // if(inWR.length === 0){this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', this.myUserName)}

    //새로고침 막기
    // const onConfirmRefresh = function (event) {
    //   event.preventDefault();
    //   return event.returnValue = "Are you sure you want to leave the page?";
    // }

    // window.addEventListener("beforeunload", onConfirmRefresh, { capture: true });


    window.addEventListener("beforeunload", this.forceLeaveSession,);
  },
  mounted(){
    //대기실에서 joinSession
    if(!this.currentUserList.filter((e)=>e.myUserEmail===this.myUserEmail).length){
      console.log('현재 스터디 참여 유저 목록',this.currentUserList)
      this.$store.commit("lbhModule/ADD_CURRENT_USER_LIST", this.myUserInfo);
      console.log('만약에 내가 지금 스터디에 참여하고 있지 않다면, joinSession해라 제발...')
      this.joinSession()
    }
    //방장이 방을 폭파시킬 때
    this.session.on('signal:studyDestroy', ()=> {
      this.$store.dispatch('studyDestroyAxios')
    })
      console.log('대기실들어옴',this.currentUserList)
      console.log('대기실들어옴',this.myUserInfo)
      console.log('대기실들어옴',this.roomSeq)
  },
  unmounted(){
    window.removeEventListener("beforeunload", this.forceLeaveSession,);
  },
  data() {
    return {
      EECnd: "", //면접자 후보, 일단 대기실에서 면접자로 선택된 사람 이름/이메일
      recordingId: "",
      LeaveWR: false,
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      //방정보
      'roomSeq',

      //openvidu
      "publisher",
      "subscribers",
      "mySessionId",
      "myUserName",
      "myUserEmail",
      "sessionToken",
      "OV",
      "session",

      //기기
      "CameraSelected",
      "CameraStatus",
      "MicSelected",
      "MicStatus",

      //유저 정보
      "userType",
      "myUserInfo",
      // "superUserOut",
      // "superUser",

      //기타
      "currentUserList",
      "WRParticipantList",
      "CLSelected",

      //녹화 관련
      "recordingObject"
    ]),
		// showVid() {
		// 	if(this.$router.currentRoute.value.name === 'waiting-room'){
		// 		if(this.videoStatus===true){return true
		// 		} else {return false}
		// 	} else {return true}
		// },
  },
  methods: {
    //일반,방장 유저 공통 기능
    //새로고침 막기
    onConfirmRefresh(){
      if(confirm('정말 새로고침을 하시겠습니까?\n여태까지의 정보가 저장되지 않고 로비로 이동합니다.')){
        if(this.session) this.session.disconnect()
        this.$router.push('/main')
      }
    },
    async forceLeaveSession() {
      if(this.userType === 'user'){
        console.log('유저 바로 out')
        this.$store.dispatch('lbhModule/userLeaveSessionAxios')
      } else {
        console.log('방장 바로 out')
        await this.$store.dispatch('lbhModule/studyDestroyFirstAxios')
        this.$store.dispatch('lbhModule/studyDestorySecondAxios')
      }
    },
    //마이크, 카메라 기능
    switchMicStatus() {
      this.$store.commit('lbhModule/SWITCH_MIC_STATUS')
      if (this.publisher.stream.audioActive) {
        this.publisher.publishAudio(false);
      } else {
        this.publisher.publishAudio(true);
      }
    },
    switchCameraStatus() {
      this.$store.commit('lbhModule/SWITCH_CAMERA_STATUS')
      if (this.publisher.stream.videoActive) {
        this.publisher.publishVideo(false);
      } else {
        this.publisher.publishVideo(true);
      }
    },

    //일반 유저 기능
    testMethod(){
      console.log('왜 버튼이 안눌리지')
    },

    userLeaveSessionfromWR(){
      console.log('userLeaveSessionfromWR 클릭이 안되는 거야?')
      if(confirm('정말 이 방에서 나가시겠습니까?')){
        this.$store.dispatch('lbhModule/userLeaveSessionAxios')
        //다른 참가자들 currentUserList, WRParticipantList에서 나의 이름과 이메일 지우기
        this.session.signal({
          data: `${this.myUserName}`,
          to: [],
          type: 'userLeaveSessionfromWR'
        })
        this.$store.commit('lbhModule/SET_SESSION', undefined)
        this.$store.commit('lbhModule/SET_OV', undefined)
        this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
        this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
        this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");        
        this.$store.commit("lbhModule/EMPTY_CURRENT_USER_LIST");        
        this.$router.push('/main')
      }
    },

    //대기실에서 나갈 때
    WRleaveSession() {
      if (this.session) this.session.disconnect();

      this.$store.commit('lbhModule/SET_SESSION', undefined)
      this.$store.commit('lbhModule/SET_OV', undefined)
      this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
      this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
      this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");

      window.removeEventListener("beforeunload", this.WRleaveSession);
    },

    //방장 유저 기능
    selectEE(user){
      this.EECnd = user
    },
    //스터디 모드 시작
    startInterview(){
      if(this.EECnd){
        if(confirm(`면접자는 ${this.EECnd.myUserName}입니다.\n면접을 시작하시겠습니까?`)){
          // this.$store.dispatch('lbhModule/startInterview', this.EECnd)
          this.session.signal({
            data: `${this.EECnd.myUserEmail}`,
            to:[],
            type:'startInterview'})
          }
      } else {alert('면접자를 선택한 후에 면접을 시작해주세요.')}
    },
    //플레이모드 시작
    startEZInterview(){
      if(this.EECnd){
        if(confirm(`면접자는 ${this.EECnd.myUserName}입니다.\n면접을 시작하시겠습니까?`)){
          this.session.signal({
            data: `${this.EECnd.myUserEmail}`,
            to: [],
            type: "startEZInterview",
          });
        }
      } else {
        alert("면접자를 선택한 후에 면접을 시작해주세요.");
      }
    },

    //오픈비두 
    joinSession() {
      const newOv = new OpenVidu();
      this.$store.commit('lbhModule/SET_OV', newOv)
      // this.OV = new OpenVidu()

      const ovInitSession = this.OV.initSession();
      this.$store.commit('lbhModule/SET_SESSION', ovInitSession)
      // this.session = this.OV.initSession()

      this.session.on("streamCreated", ({ stream }) => {
        console.log('streamCreated')
        const subscriber = this.session.subscribe(stream) ;
        console.log('subscriber',subscriber)
        this.$store.commit("lbhModule/ADD_SUBSCRIBERS", subscriber);

        const subscriberInfo = {
          myUserName: JSON.parse(stream.connection.data).clientName,
          myUserEmail: JSON.parse(stream.connection.data).clientEmail,
        }
        this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', subscriberInfo)
        this.$store.commit("lbhModule/ADD_CURRENT_USER_LIST", subscriberInfo);
      });

      this.session.on("streamDestroyed", ({ stream }) => {
        console.log('streamCreated')
        const index_s = this.subscribers.indexOf(stream.streamManager, 0);
        if (index_s >= 0) {
          this.$store.commit("lbhModule/DELETE_SUBSCRIBERS", index_s);
        }

        const subscriberEmail = JSON.parse(stream.connection.data).clientEmail;
        this.$store.commit("lbhModule/DELETE_WR_PARTICIPANT_LIST", subscriberEmail);
        this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", subscriberEmail);
      });

      this.session.on("exception", ({ exception }) => {
        console.warn(exception);
      });

      this.getToken(this.mySessionId).then((token) => {
        console.log("getToken 다음이 시작됨?");
        this.session
          .connect(token, { clientName: this.myUserName, clientEmail: this.myUserEmail })
          .then(() => {
            console.log('session Connection Info token?', token)
            const publisherInfo = {
              myUserName: this.myUserName,
              myUserEmail: this.myUserEmail
            }
            this.$store.dispatch('lbhModule/startInterviewAxios', this.roomSeq)
            this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", publisherInfo);
            // this.$store.commit("lbhModule/ADD_CURRENT_USER_LIST", publisherInfo);

            let publisher = this.OV.initPublisher(undefined, {
              audioSource: this.MicSelected, 
              videoSource: this.CameraSelected, 
              publishAudio: this.MicStatus, 
              publishVideo: this.CameraStatus, 
              resolution: "320x180", 
              frameRate: 30, 
              insertMode: "APPEND", 
              mirror: false, 
            });
            console.log('joinSession해서 만들어진 publisher', publisher)
            this.$store.commit("lbhModule/SET_PUBLISHER", publisher);

            this.publisher.subscribeToRemote(true);

            this.session.signal({
              data: '',
              to: [],
              type: 'publisherOn'
            })

            this.session.publish(this.publisher);
          })
          .catch((error) => {
            console.log("There was an error connecting to the session:", error.code, error.message);
          });
      });

      //방장이 대기실에서 나감
      this.session.on('signal:superLeaveSessionWR', (e) => {
        const pastSuperUser = JSON.parse(e.data.split(' ')[0])
        const currentSuperUser = JSON.parse(e.data.split(' ')[1])
        this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', pastSuperUser)
        if(this.myUserEmail === currentSuperUser.myUserEmail){
          alert('방장이 대기실에서 나갔습니다.\n다음 방장으로 지목되셨습니다.')
          this.$store.commit('lbhModule/SWITCH_USER_TYPE', 'superUser')
        }
      })

      // 면접 시작
      this.session.on('signal:startInterview', (e) => { 
        //대기실 유저 목록 지우기
        this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");
        this.EECnd = e.data

        //만약에 내가 면접자라면
        if(this.EECnd.myUserEmail === this.myUserEmail){ 
          console.log('startinterview as ee')
          this.$store.commit('lbhModule/SET_ISEE', true)
          this.$store.commit('lbhModule/SET_EE', this.publisher) //나(publisher)를 EE에 넣음

          // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
          this.session.signal({ 
          data: `"title": ${this.CLSelected.coverLetterTitle}, "content": ${this.CLSelected.coverLetterContent}`, 
          to: [], 
          type: 'EECL' 
          })
          .then(() => {console.log('자소서 보냄')})
          .catch(error => {console.error(error)});

          this.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회하면서 ERS에 넣음
            this.$store.commit('lbhModule/SET_ERS', s)
          })

          this.startRecording();

          this.$router.push({ name: "ee-room" });
        } 

        //만약 내가 면접관이라면
        else {
          console.log('startinterview as er')
          this.$store.commit('lbhModule/SET_ISER', true)
          this.$store.commit("lbhModule/SET_ERS", this.publisher); //나(publisher)를 ERS에 넣음

          this.subscribers.forEach((s) => {
            //그 외의 참여자들(subscribers)를 순회
            const subscriberEmail = JSON.parse(s.stream.connection.data).clientEmail;
            if (this.EECnd.myUserEmail === subscriberEmail) {
              this.$store.commit("lbhModule/SET_EE", s);
            } else {this.$store.commit("lbhModule/SET_ERS", s)}
          })
          this.$router.push({name: 'er-room'})
          }

        // window.addEventListener("close", this.WRleaveSession);
    })

      // EZ면접 시작
      this.session.on("signal:startEZInterview", (e) => {
        //대기실 유저 목록 지우기
        this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");
        this.EECnd = e.data;
        //만약에 내가 면접자라면
        if (this.EECnd.myUserEmail === this.myUserEmail) {
          console.log("startEZInterview as EE");
          this.$store.commit('lbhModule/SET_ISEE', true)
          this.$store.commit("lbhModule/SET_EE", this.publisher); //나(publisher)를 EE에 넣음
          this.session
            .signal({
              // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
              data: `"title": ${this.CLSelected.coverLetterTitle}, "content": ${this.CLSelected.coverLetterContent}`,
              to: [],
              type: "EECL",
            })
            .then(() => {
              console.log("자소서 보냄");
            })
            .catch((error) => {
              console.error(error);
            });

          //그 외의 참여자들(subscribers)를 순회하면서 ERS에 넣음
          this.subscribers.forEach((s) => {
            this.$store.commit("lbhModule/SET_ERS", s);
          });

          this.$router.push({ name: "ee-room-ez" });
        } 
        else {
          //만약 내가 면접관이라면
          console.log("startEZInterview as ER");
          this.$store.commit('lbhModule/SET_ISER', true)
          this.$store.commit("lbhModule/SET_ERS", this.publisher); //나(publisher)를 ERS에 넣음

          this.subscribers.forEach((s) => {
            //그 외의 참여자들(subscribers)를 순회
            const subscriberEmail = JSON.parse(s.stream.connection.data).clientEmail;
            if (this.EECnd.myUserEmail === subscriberEmail) {
              //면접자 포지션인 참여자(s)는 EE에 넣음
              this.$store.commit("lbhModule/SET_EE", s);
            } else {
              //그 외의 참여자(s)는 ERS에 넣음
              this.$store.commit("lbhModule/SET_ERS", s);
            }
          })
          this.$router.push({name: 'er-room-ez'})
          }
        // window.addEventListener("close", this.WRleaveSession);
    })
    },


    getToken(mySessionId) {
      return this.createSession(mySessionId).then((sessionId) =>{
        return this.createToken(sessionId)
        }
      );
    },
    createSession(sessionId) {
      console.log("createSession이 시작되긴 했음");
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
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
            {
              type: "WEBRTC",
              role: "PUBLISHER",
              kurentoOptions: {
                allowedFilters: ["GStreamerFilter"],
              },
            },
            {
              auth: {
                username: "OPENVIDUAPP",
                password: OPENVIDU_SERVER_SECRET,
              },
            }
          )
          .then((response) => response.data)
          .then((data) => {
            this.$store.commit('lbhModule/SET_SESSION_TOKEN', data.token)
            resolve(data.token)
          })
          .catch((error) => reject(error.response), console.log('createToken이 문제라고?'));
      });
    },

    // 녹화 funcion
    startRecording() {
      console.log(this.session);

      return new Promise(() => {
        axios({
          url: `${OPENVIDU_SERVER_URL}/openvidu/api/recordings/start`,
          method: "post",
          data: {
            session: this.session.sessionId,
            // outputMode: "INDIVIDUAL",
            outputMode: "COMPOSED",
            // recordingLayout: "CUSTOM",
            recordingLayout: "BEST_FIT",
            resolution: "1280x960",
            hasAudio: true,
            hasVideo: true,
          },
          headers: {
            Authorization: `Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU`,
          },
        }).then((res) => {
                // 레코딩 object에 저장
            this
                .$store
                .commit('lbhModule/SET_RECORDING_OBJECT', res.data)
        });
      });
    },
  },
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

.WRLeftArea {
  width: 70%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.WRVideo {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}

.row {
  width: 100%;
  display: flex;
  justify-content: center;
}

.video {
  align-self: center;
  width: 35%;
  margin-left: 5%;
  margin-right: 5%;
}

.WRRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  height: 100%;
  border-radius: 20px;
  background-color: #edf0f6;
}

.WRRightArea button {
  border: none;
  border-radius: 10%;
  width: 20%;
  aspect-ratio: 2/1;
  background-color: rgb(181, 180, 180);
}
</style>
