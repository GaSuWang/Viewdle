// 이병헌
<template>
  <AuthorityPassModal/>
  <div class="WaitingRoomView">

    <div class="WRRightArea">
      <!-- 현탁 -->
      <!-- 대기실에서 나가기 버튼(일반 유저) -->
      <div class="user-out" v-if="userType === 'user'" @click="userLeaveSessionAxios()">
      <!-- <div class="user-out" v-if="userType === 'user'" @click="userLeaveSessionfromWR"> -->
          <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" />

          <!-- <button class="toLBBtn">
            <i class="bi bi-x-lg"></i>
          </button> -->
      </div>
      <!-- 대기실에서 나가기 버튼(방장 유저) -->
      <div v-if="userType === 'superUser'" class="superUser">
        <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false"/>
        <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false">
            <i class="bi bi-x-lg"></i>
        </button> -->
      </div>
      <!-- 현탁 끝 -->
      
      <div class="startInterviewContainer">
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
            <span v-else-if="EECnd">면접자: {{ EECnd.myUserName }}</span>
          </button>
          <ul class="dropdown-menu">
            <li v-for="user in WRParticipantList" :key="user.myUserEmail">
              <span @click="selectEE(user)">{{ user.myUserName }}: {{user.myUserEmail}}</span>
            </li>
          </ul>
        </div>

        <div class="start-interview" v-if="userType === 'superUser'">
          <!-- <button @click="startInterview">
            <i class="bi bi-check-lg"></i>
          </button> -->
          <Button @click="startInterview" icon="pi pi-check" class="p-button-rounded p-button-secondary" />

          <!-- <button @click="startEZInterview">EZ<i class="bi bi-check-lg"></i></button> -->
        </div>

      </div>



      <!-- 삭제할 버튼들 -->
      <!-- <div class="tempBtn">
        <button v-if="!session" @click="joinSession">입장하기</button>
        <button @click="switchUserType">{{ userType }}</button>
      </div> -->
    </div>

        <!-- 참가자 영상 나오는 부분 -->
    <div class="WRLeftArea">
      <div class="WRVideo container">
        <div class="row row-cols-3">
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

      <div class="deviceBtn">
        <div class="mic-status">
          <Button @click="switchMicStatus" v-if="session" class="p-button-rounded p-button-secondary">
            <i v-if="MicStatus" class="bi bi-mic"></i>
            <i v-else class="bi bi-mic-mute"></i>
          </Button>

          <!-- <button class="deviceBtn" @click="switchMicStatus" v-if="session">
            <i v-if="MicStatus" class="bi bi-mic"></i>
            <i v-else class="bi bi-mic-mute"></i>
          </button> -->
        </div>

        <div class="camera-status">
          <Button @click="switchCameraStatus" v-if="session" class="p-button-rounded p-button-secondary">
            <i v-if="CameraStatus===true" class="bi bi-camera-video"></i>
            <i v-else-if="CameraStatus===false" class="bi bi-camera-video-off"></i>
          </Button>
          <!-- <button  class="deviceBtn" @click="switchCameraStatus" v-if="session">
            <i v-if="CameraStatus===true" class="bi bi-camera-video"></i>
            <i v-else-if="CameraStatus===false" class="bi bi-camera-video-off"></i>
          </button> -->
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
  mounted(){
    //대기실에 들어오면, 그 전 면접에서 사용한 면접 관련 state들 모두 초기화
    this.$store.commit('lbhModule/EMPTY_ERS')
    this.$store.commit('lbhModule/EMPTY_FB')
    this.$store.commit('lbhModule/EMPTY_AXIOS_FBLIST')
    this.$store.commit('lbhModule/EMPTY_FB_USER_COUNT')
    this.$store.commit('lbhModule/EMPTY_VIDEO_SRC')
    console.log('방관련 정보', this.roomType, this.roomTitle)
    // window.addEventListener("beforeunload", this.forceLeaveSession,);
    
    //대기실에서 joinSession
    if(!this.currentUserList.filter((e)=>e.myUserEmail===this.myUserEmail).length){
      console.log('현재 스터디 참여 유저 목록',this.currentUserList)
      this.$store.commit("lbhModule/ADD_CURRENT_USER_LIST", this.myUserInfo);
      console.log('만약에 내가 지금 스터디에 참여하고 있지 않다면, joinSession해라 제발...')
      this.joinSession()
    }
    //대기실로 유저가 돌아올 때
    this.session.on('signal:WRParticipantListUpdate', (e)=>{
      const data = JSON.parse(e.data)
      if(!this.WRParticipantList.includes(data)){
        console.log('유저가 대기실로 들어와서 대기실 유저 목록에 넣어줌', data)
        this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', data)
      }
    })

    //대기실에서 다른 유저가 나갔을 때
    this.session.on('signal:userLeaveSessionfromWR', (e)=>{
      console.log(e.data,'라는 이메일을 가진 사람이 대기실에서 나감')
      this.$store.commit("lbhModule/DELETE_WR_PARTICIPANT_LIST", e.data);
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", e.data);  
    })
    //방장이 방을 폭파시킬 때
    this.session.on('signal:studyDestroy', ()=> {
        this.$store.dispatch('lbhModule/userLeaveSessionAxios')
        alert('방장이 스터디를 폭파했습니다.\n로비로 돌아갑니다.')
        this.$router.push('/main')
    })
    console.log('대기실들어옴',this.currentUserList,this.myUserInfo,this.roomSeq)

    this.session.on('signal:startVideoTime', (e)=>{
      this.$store.commit('lbhModule/SET_START_VIDEO_TIME', e.data)
    })
  },
  unmounsted(){
    // if(this.userType === 'user'){
    //   this.$store.dispatch('lbhModule/userLeaveSessionAxios')
    // } else { this.$store.dispatch('lbhModule/studyDestroyFirstAxios')}
  },
  data() {
    return {
      EECnd: "", //면접자 후보, 일단 대기실에서 면접자로 선택된 사람 이름/이메일
      recordingId: "",
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      //방정보
      'roomSeq',
      'roomType',

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
      "recordingObject",

      //[김이랑] 피드백 영상 관련
      "startVideoTime",
    ]),
		// showVid() {
		// 	if(this.$router.currentRoute.value.name === 'waiting-room'){
		// 		if(this.videoStatus===true){return true
		// 		} else {return false}
		// 	} else {return true}
		// },
  },
  methods: {
    // 현탁
       userLeaveSessionAxios(){
      this.$store.dispatch('lbhModule/userLeaveSessionAxios')
      const myUserEmail = this.myUserEmail
      this.session.signal({
        data: `${myUserEmail}`,
        to: [],
        type: 'userLeaveSessionfromWR'
      })
      if(this.session) this.session.disconnect()   
    },
    // 현탁 끝


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
    userLeaveSessionfromWR(){
      if(confirm('정말 이 방에서 나가시겠습니까?')){
        // this.$store.dispatch('lbhModule/userLeaveSessionAxios')
        //다른 참가자들 currentUserList, WRParticipantList에서 나의 이름과 이메일 지우기
        const myUserEmail = this.myUserEmail
        this.session.signal({
          data: `${myUserEmail}`,
          to: [],
          type: 'userLeaveSessionfromWR'
        })
        if(this.session) this.session.disconnect()     
        this.$router.push('/main')
      }
    },

    //대기실에서 나갈 때
    // WRleaveSession() {
    //   if (this.session) this.session.disconnect();

    //   this.$store.commit('lbhModule/SET_SESSION', undefined)
    //   this.$store.commit('lbhModule/SET_OV', undefined)
    //   this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
    //   this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
    //   this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");

    //   window.removeEventListener("beforeunload", this.WRleaveSession);
    // },

    //방장 유저 기능
    selectEE(user){
      this.EECnd = user
      console.log(this.EECnd,'이 사람이 면접자')
    },

    //면접 시작
    startInterview(){
      if(this.roomType === 'study'){
        //스터디 모드 시작
        // startStudyInterview(){
          console.log('스터디 모드 시작', this.roomType)
          const myUserName = this.EECnd.myUserName
          const myUserEmail = this.EECnd.myUserEmail
          if(this.EECnd){
            if(confirm(`면접자는 ${myUserName}입니다.\n면접을 시작하시겠습니까?`)){
              this.$store.dispatch('lbhModule/startInterviewAxios')
              this.session.signal({
                data: `${myUserEmail}`,
                to:[],
                type:'startInterview'})
              }
          } else {alert('면접자를 선택한 후에 면접을 시작해주세요.')}

      // }
      } else {
        //플레이모드 시작
          console.log('플레이 모드 시작', this.roomType)
        // startPlayInterview(){
          const myUserName = this.EECnd.myUserName
          const myUserEmail = this.EECnd.myUserEmail
          if(this.EECnd){
            if(confirm(`면접자는 ${myUserName}입니다.\n면접을 시작하시겠습니까?`)){
              this.$store.dispatch('lbhModule/startInterviewAxios')
              this.session.signal({
                data: `${myUserEmail}`,
                to: [],
                type: "startEZInterview",
              });
            }
          } else {
            alert("면접자를 선택한 후에 면접을 시작해주세요.");
          }
        // }

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
        const pastSuperUserEmail = e.data.split(' ')[0]
        const currentSuperUserEmail = e.data.split(' ')[1]
        console.log('전, 현 방장 정보',pastSuperUserEmail, currentSuperUserEmail)
        this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', pastSuperUserEmail)
        if(this.myUserEmail === currentSuperUserEmail){
          alert('방장이 대기실에서 나갔습니다.\n다음 방장으로 지목되셨습니다.')
          this.$store.commit('lbhModule/SWITCH_USER_TYPE', 'superUser')
        }
      })

      // 면접 시작
      this.session.on('signal:startInterview', (e) => { 
        //대기실 유저 목록 지우기
        console.log('면접 시작! 내 이름과 이메일은', this.myUserName, this.myUserEmail)
        this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");
        this.$store.commit('lbhModule/SET_ISEE', false)
        this.$store.commit('lbhModule/SET_ISER', false)
        //만약에 내가 면접자라면
        if(e.data === this.myUserEmail){ 
          console.log('startinterview as ee')
          this.$store.commit('lbhModule/SET_ISEE', true)
          this.$store.commit('lbhModule/SET_EE', this.publisher) //나(publisher)를 EE에 넣음

          // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
          // const coverLetterTitle = this.CLSelected.coverLetterTitle
          // const coverLetterContent = this.CLSelected.coverLetterContent
          console.log('자소서', this.CLSelected)
          this.session.signal({ 
          data: `${this.CLSelected.coverLetterSeq}`, 
          to: [], 
          type: 'EECL' 
          })
          console.log('자소서 보냄')
          // .then(() => {console.log('자소서 보냄')})
          // .catch(error => {console.error(error)});

          this.subscribers.forEach(s=>{ //그 외의 참여자들(subscribers)를 순회하면서 ERS에 넣음
            this.$store.commit('lbhModule/SET_ERS', s)
          })

          this.startRecording();
          this.setRecordingtime();
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
            if (e.data === subscriberEmail) {
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
        this.$store.commit('lbhModule/SET_ISEE', false)
        this.$store.commit('lbhModule/SET_ISER', false)
        //만약에 내가 면접자라면
        if (e.data === this.myUserEmail) {
          console.log("startEZInterview as EE");
          this.$store.commit('lbhModule/SET_ISEE', true)
          this.$store.commit("lbhModule/SET_EE", this.publisher); //나(publisher)를 EE에 넣음

          // 다른 사람들에게 보여줄 나의 자소서를 보내야됨
          // const coverLetterTitle = this.CLSelected.coverLetterTitle
          // const coverLetterContent = this.CLSelected.coverLetterContent
          // const cl = JSON.stringify(this.CLSelected)
          // console.log('자소서', this.CLSelected)
          this.session.signal({ 
          data: `${this.CLSelected.coverLetterSeq}`, 
          to: [], 
          type: 'EECL' 
          })
          console.log('자소서 보냄')

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
            if (e.data === subscriberEmail) {
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
                allowedFilters: ["GStreamerFilter", "FaceOverlayFilter"],
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

    // 피드백 관련
    setRecordingtime(){
      var date = Date.now();
      this.session.signal({
        data: date,
        to: [],
        type: 'startVideoTime'
      })

      this.$store.commit('lbhModule/SET_START_VIDEO_TIME', Date.now())
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
  min-width: 1000px;
  aspect-ratio: 2/1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 10px 10px 20px 6px #9ea7b2;  
  background: rgb(255,255,255,0.5);
  border-radius: 60px;
  padding: 1.5%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.WRLeftArea {
  width: 100%;
  height: 90%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items:center;
  /* overflow-y: scroll; */

}

.WRVideo {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* overflow-y: scroll; */
  /* overflow-y: hidden; Hide vertical scrollbar */

}

.row {
  width: 100%;
  display: flex;
  justify-content: center;
}

.video {
  align-self: center;
  width: 30%;
  height: 20%;
  /* margin-left: 5%;
  margin-right: 5%; */
}

.WRRightArea {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  align-items: center;
  width: 100%;
  height: 7%;
  border-radius: 20px;
  /* background-color: #cacde0; */
}

/* .dropdown-toggle{
  width: 80%;
} */

.deviceBtn{
  display: flex;
  justify-content: center;
  width: 100%;
}
.deviceBtn .mic-status{
  margin-right: 1%;
}

.deviceBtn .camera-status{
  margin-left: 1%;
}
.startInterviewContainer{
  display: flex;
  justify-content: space-between;
  width: 15%;
}
.WaitingRoomView button{
  background-color: #a7a9b9;
  border: #a7a9b9
}
.WaitingRoomView button:enabled:hover{
  background-color: #787a89;
  border: #787a89
}
/* .deviceBtn{
  border: none;
  border-radius: 50%;
  width: 20%;
  background-color: rgb(181, 180, 180);
} */
</style>
