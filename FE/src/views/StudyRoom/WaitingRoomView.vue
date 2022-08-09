// 이병헌
<template>
  <div class="WaitingRoomView">
    <!-- <AuthorityPassModal/> -->

    <!-- 참가자 영상 나오는 부분 -->
    <div class="WRLeftArea">
      <div class="WRVideo container">
        <div class="row row-cols-2">
        <user-video class="video" :stream-manager="publisher" />
        <user-video class="video" v-for="sub in subscribers"
          :key="sub.stream.connection.connectionId"
          :stream-manager="sub" />
        </div>
      </div>
    </div>

    <!-- 방장 기능 -->
    <div class="WRRightArea">
      <div id="session-controller">
        <input
          class="btn btn-large btn-danger"
          type="button"
          id="buttonLeaveSession"
          @click="WRleaveSession"
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
      <div class="endStudy" v-if="userType === 'superUser'">
        <button class="btn btn-secondary" @click="EndStudyConfirm">
          <span>스터디 종료</span> 
        </button>
      </div>

      <div class="wr-to-lb super-user" v-if="userType === 'superUser'" >
        <button @click="userOutClick(userType)">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="start-interview" v-if="userType === 'superUser'">
        <button @click="startInterview"  >
          <i class="bi bi-check-lg"></i>
        </button>
        <button @click="startEZInterview"  >
          EZ<i class="bi bi-check-lg"></i>
        </button>
      </div>

      <div class="user-out" v-if="userType === 'user'">
        <button @click="userOutClick(userType)">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="mic-status">
        <button @click="(muteMySelf) (switchMicStatus)" v-if="session">
          <i v-if="MicStatus" class="bi bi-mic"></i>
          <i v-else class="bi bi-mic-mute"></i>
        </button>
      </div>

      <div class="camera-status">
        <button @click="(ShowMySelf) (switchCameraStatus)" v-if="session">
          <i v-if="CameraStatus" class="bi bi-camera-video"></i>
          <i v-else class="bi bi-camera-video-off"></i>
        </button>
      </div>

      <!-- 삭제할 버튼들 -->
      <div class="tempBtn"> 
        <button v-if="!session" @click="joinSession">입장하기</button>
        <button @click="switchUserType">{{userType}}</button>
      </div>

      <!-- 녹화 테스트용 버튼 -->
      <!-- 백하고 연동하게 될거라서 API만 필요하지 버튼은 필요없습니다! 그냥 결과값 확인하는 용도로 사용하세요!
      아마 녹화 종료하고 필요한 값 들 전달하면 될 거 같습니다. -->
      <!-- 입장 후 3초 후 녹화 시작으로, 면접 종료하면 녹화도 stop되게 연결하면 될 거 같아요! -->
      <div class="tempBtn"> 
        <button @click="startRecording">녹화 시작</button>
        <button @click="stopRecording">녹화 종료</button>
        <button @click="getRecording">녹화 하나</button>
        <button @click="getRecordings">녹화 여러개</button>    
        <button @click="deleteRecording">녹화 삭제</button>
      </div>

     </div>
  </div>
</template>

<script>
// 여기서 영상 띄우는 법
// npm run serve
// cmd에서 docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET -e OPENVIDU_RECORDING=true -e OPENVIDU_RECORDING_PUBLIC_ACCESS=true -e OPENVIDU_RECORDING_PATH=/opt/openvidu/recordings -v /var/run/docker.sock:/var/run/docker.sock -v /opt/openvidu/recordings:/opt/openvidu/recordings openvidu/openvidu-server-kms:2.22.0
// cmd에서 docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server-kms:2.22.0

// 단 도커 설치되어 있어야 함

// import AuthorityPassModal from "@/components/StudyRoom/AuthorityPassModal.vue"
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
  components: { UserVideo,
  //  AuthorityPassModal 
   },
  created(){
  },
  data() {
    return {
      EECnd: "", //면접자 후보, 일단 대기실에서 면접자로 선택된 사람 이름/이메일
      recordingId: '',
      LeaveWR: false,

      recordingObject : null,
      recordingObjects : null,
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      //openvidu
      "publisher",
      "subscribers",
      "mySessionId",
      "myUserName",
      "OV",
      "session",

      //기기
      "CameraSelected",
      "CameraStatus",
      "CameraStatus",
      "MicSelected",
      "MicStatus",
      "MicStatus",

      //유저 권한
      'userType',
      // "superUserOut",
      "superUser",

      //기타
      "currentUserList",
      "WRParticipantList",
      "CLSelected",
    ]),
		showVid() {
			if(this.$router.currentRoute.value.name === 'waiting-room'){
				if(this.videoStatus===true){return true
				} else {return false}
			} else {return true}
		},
  },
  setup() {
  },
  methods: {
    EndStudyConfirm() {
      if (confirm("정말 스터디를 종료하시겠습니까?")) {
        this.$router.push("/main");
      }
    },
    switchMicStatus() { //마이크 On/Off
      this.MicStatus = !this.MicStatus;
      this.$store.commit('lbhModule/SWITCH_MIC_STATUS', this.MicStatus)
    },
    switchCameraStatus() { //카메라 On/Off
      this.CameraStatus = !this.CameraStatus;
      this.$store.commit('lbhModule/SWITCH_CAMERA_STATUS', this.CameraStatus)
    },
    superUserOutClick(userType){
      if(userType === 'superUser'){
        console.log('방장 바꿈?')
      }
    },
    userOutClick(){
      if(this.userType === 'user'){
        if(confirm('정말 이 방에서 나가시겠습니까?')){
          this.WRleaveSession()
        }
      }
    },
    switchUserType(){
      this.$store.commit('lbhModule/SWITCH_USER_TYPE_TEMP')
    },

    startInterview(){
      if(this.EECnd){
        if(confirm(`면접자는 ${this.EECnd}입니다.\n면접을 시작하시겠습니까?`)){
          this.session.signal({
            data: `${this.EECnd}`,
            to:[],
            type:'startInterview'
          })}
      } else {alert('면접자를 선택한 후에 면접을 시작해주세요.')}
    },
    startEZInterview(){
      if(this.EECnd){
        if(confirm(`면접자는 ${this.EECnd}입니다.\n면접을 시작하시겠습니까?`)){
          this.session.signal({
            data: `${this.EECnd}`,
            to:[],
            type:'startEZInterview'
          })}
      } else {alert('면접자를 선택한 후에 면접을 시작해주세요.')}
    },
    selectEE(name){
      this.EECnd = name
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
      console.log('joinSession start')
      // --- Get an OpenVidu object ---
      const newOv = new OpenVidu();
      this.$store.commit('lbhModule/SET_OV', newOv)

      // --- Init a session ---
      const ovInitSession = this.OV.initSession();
      this.$store.commit('lbhModule/SET_SESSION', ovInitSession)

      // --- Specify the actions when events take place in the session ---

      // On every new Stream received...
      this.session.on("streamCreated", ({ stream }) => {
        const subscriber = this.session.subscribe(stream);
        const subscriberName = JSON.parse(stream.connection.data).clientData;
        this.$store.commit("lbhModule/ADD_SUBSCRIBERS", subscriber);
        this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", subscriberName);
        this.$store.commit("lbhModule/ADD_CURRENT_USER_LIST", subscriberName);

        const superUser = this.superUser
        console.log('superUser', superUser)
        const WRParticipantList = this.WRParticipantList
        console.log('WRParticipantList', WRParticipantList)
        this.session.signal({ 
          //새로운 유저가 들어오면, 모든 유저에게 현재의 방장 유저가 누군지 알려주는 데이터 전송
          //향후 새로운 유저에게 줘야 할 데이터 있으면 여기에서 보내주는 걸로
          data: `{"superUser": "${superUser}", "WRParticipantList": "${WRParticipantList}"}`,
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
        this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", subscriberName);
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
            this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", this.myUserName);
            this.$store.commit("lbhModule/ADD_CURRENT_USER_LIST", this.myUserName);

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

            this.$store.commit("lbhModule/SET_PUBLISHER", publisher);
            this.session.signal({
              data: '',
              to: [],
              type: 'publisherOn'
            })

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
        console.log('welcomenewuser로 받아온 정보', json, JSON.parse(json.superUser), JSON.parse(json.WRParticipantList))
        this.$store.commit('lbhModule/SET_SUPERUSER', json.superUser)
        this.$store.commit('lbhModule/SET_WR_PARTICIPANT_LIST', json.WRParticipantList)
        this.$store.commit('lbhModule/SET_CURRENT_USER_LIST', json.WRParticipantList)
      })

      this.session.on('signal:switchSuperUser', (e)=>{
        this.$store.commit('lbhModule/SET_SUPERUSER', e.data)
        this.$store.commit('lbhModule/SET_SUPERUSER_OUT', false)
      })

      // 면접 시작
      this.session.on('signal:startInterview', (e) => { 
        //대기실에서 내 이름 지우기
        this.$store.commit("lbhModule/SET_WR_PARTICIPANT_LIST", []);

        this.EECnd = e.data
        if(this.EECnd === this.myUserName){ //만약에 내가 면접자라면
          console.log('startInterview as EE')

          this.session.signal({ // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
          data: `"title": ${this.CLSelected.coverLetterTitle}, "content": ${this.CLSelected.coverLetterContent}`, 
          to: [], 
          type: 'EECL' 
          })
          .then(() => {console.log('자소서 보냄')})
          .catch(error => {console.error(error)});

          this.$store.commit('lbhModule/SET_EE', this.publisher) //나(publisher)를 EE에 넣음
          this.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회하면서 ERS에 넣음
            this.$store.commit('lbhModule/SET_ERS', s)
          })

          this.$router.push({name:'ee-room'})

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
          this.$router.push({name: 'er-room'})
          }
        this.$store.commit('lbhModule/EMPTY_WR_PARTICIPANT_LIST')
        // this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
        // this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
        window.addEventListener("close", this.WRleaveSession);
    })

      // EZ면접 시작
      this.session.on('signal:startEZInterview', (e) => { 
        this.EECnd = e.data
        if(this.EECnd === this.myUserName){ //만약에 내가 면접자라면
          console.log('startEZInterview as EE')

          this.session.signal({ // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
          data: `"title": ${this.CLSelected.coverLetterTitle}, "content": ${this.CLSelected.coverLetterContent}`, 
          to: [], 
          type: 'EECL' 
          })
          .then(() => {console.log('자소서 보냄')})
          .catch(error => {console.error(error)});

          this.$store.commit('lbhModule/SET_EE', this.publisher) //나(publisher)를 EE에 넣음
          this.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회하면서 ERS에 넣음
            this.$store.commit('lbhModule/SET_ERS', s)
          })

          this.$router.push({name:'ee-room-ez'})

        } else { //만약 내가 면접관이라면
          console.log('startEZInterview as ER')

          this.$store.commit('lbhModule/SET_ERS', this.publisher) //나(publisher)를 ERS에 넣음

          this.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회
            const subscriberName = JSON.parse(s.stream.connection.data).clientData;
            if(this.EECnd === subscriberName){ //면접자 포지션인 참여자(s)는 EE에 넣음
              this.$store.commit('lbhModule/SET_EE', s)
            } else { //그 외의 참여자(s)는 ERS에 넣음
              this.$store.commit('lbhModule/SET_ERS', s)
            }
          })
          this.$router.push({name: 'er-room-ez'})
          }
        this.$store.commit('lbhModule/EMPTY_WR_PARTICIPANT_LIST')
        // this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
        // this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
        window.addEventListener("close", this.WRleaveSession);
    })
    
    },

    //대기실에서 나갈 때
    WRleaveSession() {
      // this.session.signal({
      if (this.session) this.session.disconnect();

      this.$store.commit('lbhModule/SET_SESSION', undefined)
      this.$store.commit('lbhModule/SET_OV', undefined)
      this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
      this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
      this.$store.commit('lbhModule/SET_SUPERUSER', {})
      this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");

      window.removeEventListener("beforeunload", this.WRleaveSession);
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

    // 녹화 funcion
    startRecording() {
      console.log(this.session)

      return new Promise(() => {
        axios({
          url : `${OPENVIDU_SERVER_URL}/openvidu/api/recordings/start`,
          method : 'post',
          data : {
            session: this.session.sessionId,
            outputMode: "INDIVIDUAL",
            hasAudio: true,
            hasVideo: true
          },          
          headers: {
            Authorization: `Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU`
          }
        })
        .then((res) => {
          this.recordingObject = res.data
        })
      })
    },

    stopRecording() {
      return new Promise(() => {
        axios({
          url : `${OPENVIDU_SERVER_URL}/openvidu/api/recordings/stop/${this.recordingObject.id}`,
          method : 'post',
          data : {
            session: this.session.sessionId,
            outputMode: "COMPOSED",
            hasAudio: true,
            hasVideo: true
          },          
          headers: {
            Authorization: `Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU`
          }
        })
        .then((res) => {
          console.log(`stop recording id ${res.data.id}`)
        })
      })
    },

    deleteRecording() {
      return new Promise(() => {
        axios({
          url : `${OPENVIDU_SERVER_URL}/openvidu/api/recordings/${this.recordingObject.id}`,
          method : 'delete',       
          headers: {
            Authorization: `Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU`
          }
        })
        .then((res) => {
          if (res.status == "204") {
            console.log(`success delete recording id ${this.recordingObject.id}`)
          } else {
            console.log(`fail delete recording id ${this.recordingObject.id}, status code ${res.status}`)
          }
        })
      })
    },

    getRecording() {
      return new Promise(() => {
        axios({
          url : `${OPENVIDU_SERVER_URL}/openvidu/api/recordings/${this.recordingObject.id}`,
          method : 'get',        
          headers: {
            Authorization: `Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU`
          }
        })
        .then((res) => {
          console.log(`get recording id ${res.data.id}`)
          this.recordingObject = res
        })
      })
    },

    getRecordings() {
      return new Promise(() => {
        axios({
          url : `${OPENVIDU_SERVER_URL}/openvidu/api/recordings`,
          method : 'get',     
          headers: {
            Authorization: `Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU`
          }
        })
        .then((res) => {
          console.log(`get recordings ${JSON.stringify(res.data)}`)
          this.recordingObjects = res.data
        })
      })
    }
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

.WRLeftArea {
  width: 70%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.WRVideo{
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

.video{
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

.WRRightArea button{
  border: none;
  border-radius: 10%;
  width: 20%;
  aspect-ratio: 2/1;
  background-color: rgb(181, 180, 180);
}
</style>
