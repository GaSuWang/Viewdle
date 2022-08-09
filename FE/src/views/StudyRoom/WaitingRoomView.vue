// 이병헌
<template>
  <AuthorityPassModal/>
  <div class="WaitingRoomView">

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

    <div class="WRRightArea">
      <!-- 일반 유저 기능-->
      <!-- 대기실 나가기 -->
      <!-- <div id="session-controller" v-if="userType==='user'">
        <input
          class="btn btn-large btn-danger"
          type="button"
          id="buttonLeaveSession"
          @click="WRleaveSession"
          value="방 나가기"
        />
      </div> -->

      <div class="user-out" v-if="userType === 'user'">
        <button @click="userOutClick(userType)">
          방나가기
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
          <span v-else-if="EECnd">면접자: {{EECnd}}</span> 
        </button>
        <ul class="dropdown-menu">
          <li v-for="user in WRParticipantList" :key="user.id">
            <span @click="selectEE(user.name)">{{ user.name }}</span> 
          </li>
        </ul>
      </div>
      <!-- 스터디 종료 -->
      <div v-if="userType === 'superUser'" class="ERtoLBbtn superUser">
        <!-- <button @click.prevent="ERleaveSession">
          <i class="bi bi-x-lg"></i>
        </button> -->
        <button type="button" class="btn btn-primary" @click="ERleaveSession" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false">
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
    const inWR = this.WRParticipantList.filter(e=>e.name === this.myUserName)
    console.log('내가 현재 대기실에 들어왔는데, 대기실 유저 목록에 내가 있나?', inWR)
    if(inWR.length === 0){this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', this.myUserName)}
  },
  data() {
    return {
      EECnd: "", //면접자 후보, 일단 대기실에서 면접자로 선택된 사람 이름/이메일
      recordingId: '',
      LeaveWR: false,

      recordingObject : null,
      recordingObjects : null,
      // OV: undefined,
      // session: undefined,
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      //openvidu
      "publisher",
      "subscribers",
      "mySessionId",
      "myUserName",
      "sessionToken",
      "OV",
      "session",

      //기기
      "CameraSelected",
      "CameraStatus",
      "MicSelected",
      "MicStatus",

      //유저 권한
      'userType',
      // "superUserOut",
      // "superUser",

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
  methods: {
    //일반,방장 유저 공통 기능
    switchUserType(){
      this.$store.commit('lbhModule/SWITCH_USER_TYPE_TEMP')
    },
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
    userOutClick(){
      if(confirm('정말 이 방에서 나가시겠습니까?')){
        this.WRleaveSession()
        this.$router.push('/main')
        // axios
      }
    },

    //방장 유저 기능
    selectEE(name){
      this.EECnd = name
    },
    //스터디 모드 시작
    startInterview(){
      if(this.EECnd){
        if(confirm(`면접자는 ${this.EECnd}입니다.\n면접을 시작하시겠습니까?`)){
          // this.$store.dispatch('lbhModule/startInterview', this.EECnd)
          this.session.signal({
            data: `${this.EECnd}`,
            to:[],
            type:'startInterview'})
          }
      } else {alert('면접자를 선택한 후에 면접을 시작해주세요.')}
    },
    //플레이모드 시작
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

    //오픈비두 
    joinSession() {
      const newOv = new OpenVidu();
      this.$store.commit('lbhModule/SET_OV', newOv)
      // this.OV = new OpenVidu()

      const ovInitSession = this.OV.initSession();
      this.$store.commit('lbhModule/SET_SESSION', ovInitSession)
      // this.session = this.OV.initSession()

      // On every new Stream received...
      this.session.on("streamCreated", ({ stream }) => {
        console.log('STREAM CREATED!STREAM CREATED!STREAM CREATED!STREAM CREATED!')
        const subscriber = this.session.subscribe(stream) ;
        const subscriberName = JSON.parse(stream.connection.data).clientData;
        this.$store.commit("lbhModule/ADD_SUBSCRIBERS", subscriber);
        const inWR = this.WRParticipantList.filter(e=>e.name === subscriberName)
        if(inWR.length === 0){this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', subscriberName)}
        // this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", subscriberName);
        this.$store.commit("lbhModule/ADD_CURRENT_USER_LIST", subscriberName);
      });

      this.session.on("streamDestroyed", ({ stream }) => {
        const index_s = this.subscribers.indexOf(stream.streamManager, 0);
        if (index_s >= 0) {
          this.$store.commit("lbhModule/DELETE_SUBSCRIBERS", index_s);
        }
        const subscriberName = JSON.parse(stream.connection.data).clientData;
        this.$store.commit("lbhModule/DELETE_WR_PARTICIPANT_LIST", subscriberName);
        this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", subscriberName);
      });

      this.session.on("exception", ({ exception }) => {
        console.warn(exception);
      });

      this.getToken(this.mySessionId).then((token) => {
        console.log('getToken 다음이 시작됨?')
        this.session
          .connect(token, { clientData: this.myUserName })
          .then(() => {
            const inWR = this.WRParticipantList.filter(e=>e.name === this.myUserName)
            if(inWR.length === 0){this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', this.myUserName)}
            // this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", this.myUserName);
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
          })
          .catch((error) => {
            console.log(
              "There was an error connecting to the session:",
              error.code,
              error.message
            );
          });
      });

      // 면접 시작
      this.session.on('signal:startInterview', (e) => { 
        console.log('면접시작할 때 나의 유저 타입', this.userType)
        //대기실에서 내 이름 지우기
        this.$store.commit("lbhModule/SET_WR_PARTICIPANT_LIST", []);

        this.EECnd = e.data
        if(this.EECnd === this.myUserName){ //만약에 내가 면접자라면
          console.log('startInterview as EE', this.userType)

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
      if (this.session) this.session.disconnect();

      this.$store.commit('lbhModule/SET_SESSION', undefined)
      this.$store.commit('lbhModule/SET_OV', undefined)
      this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
      this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
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
          .then((data) => {
            this.$store.commit('lbhModule/SET_SESSION_TOKEN', data.token)
            resolve(data.token)
          })
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
            // outputMode: "INDIVIDUAL",
            outputMode: "COMPOSED",
            // recordingLayout: "CUSTOM",
            recordingLayout: "BEST_FIT",
            resolution: "1280x960",
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
