// 이병헌
//피드백실 - 면접관 (Feedback Room VIew => FBView)

<template>
  <AuthorityPassModal/>
  <div class="FBView">
    <!-- 좌단 -->
    <!-- 면접자 영상 -->
    <div class="savedEEVid">
      <video ref="video" width="640" height="280" controls :src="videoSrc">
      </video>
    </div>
    <!-- 우단 -->
    <div class="FBRightArea">
      <div class="FBButtonHeader">
        <!-- 타이머 -->
      <button type="button" class="btn" :disabled="counting">
        <vue-countdown v-if="counting" :time="300000" @end="onCountdownEnd" v-slot="{minutes, seconds}">{{minutes}}분 {{seconds}}초</vue-countdown>
      </button>
        <div class="CLOpen">
          <Button @click.prevent="openEECL()" icon="pi pi-times" class="p-button-rounded p-button-secondary">
            <i class="bi bi-file-earmark-text"></i>
          </Button>
        </div>
        <!-- 면접에서 나가기 버튼(일반 유저) -->
        <div class="FBtoLBbtn user" v-show="userType === 'user'">
         <Button @click="ERLeaveSession" icon="pi pi-times" class="p-button-rounded p-button-secondary" />
        </div>
        <!-- 면접에서 나가기 버튼(방장 유저) -->
        <div v-show="userType === 'superUser'" class="FBtoLBbtn superUser">
          <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false"/>
        </div>
      </div>

      <!-- 피드백 구역 -->
      <feedback-area :videoInfo="videoInfo"></feedback-area>

      <div @click="FBComplete" class="FBButtonFooter">
        <!-- 면접 종료 버튼(대기실로 이동) -->
        <Button icon="pi pi-check" class="p-button-rounded p-button-secondary" />
      </div>
    </div>
  </div>
</template>

<script>
import AuthorityPassModal from '@/components/StudyRoom/AuthorityPassModal.vue'
import FeedbackArea from "@/components/StudyRoom/NormalMode/FeedbackArea.vue";
import { mapGetters} from 'vuex';
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

// const OPENVIDU_SERVER_URL = "https://" + location.hostname;
const OPENVIDU_SERVER_URL = "https://" + location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = "MY_SECRET";
export default {
  name: "FeedbackView",
  //, VideoPlayer
  components: { FeedbackArea, AuthorityPassModal },
  data(){
    return {
      counting: false,
    }
  },
  computed:{
    ...mapGetters('lbhModule', [
      'session',
      'myUserName',
      'mySessionId',
      'publisher',
      'subscribers',
      'myUserEmail',
      'myUserName',
      'myUserInfo',
      'studyRoomCL',
      'userType',

      //기기
      "CameraSelected",
      "CameraStatus",
      "CameraStatus",
      "MicSelected",
      "MicStatus",
      "MicStatus",
      //비디오 관련
      "videoSrc",
      "videoTime",

      "FBList",
      "FBUserCount",
      "axiosFBList",
    ]),
    ...mapGetters('rhtModule',[
      'CoverLetterDetail',
    ]),
    checkVideoTime(){
      return this.$store.getters['lbhModule/videoTime']
    },
  },
  watch:{
    checkVideoTime(time){
      // console.log("실행됨")
      this.video = this.$refs.video
      // console.log(this.video.currentTime)
      this.video.currentTime = time
      // console.log(this.video.currentTime)
    }
  },
  //비디오 관련
  created(){
    //
    this.session.on("streamDestroyed", ({ stream }) => {
      // console.log('streamCreated')
      const index_s = this.subscribers.indexOf(stream.streamManager, 0);
      if (index_s >= 0) {
        this.$store.commit("lbhModule/DELETE_SUBSCRIBERS", index_s);
      }

      const subscriberEmail = JSON.parse(stream.connection.data).clientEmail;
      this.$store.commit("lbhModule/DELETE_WR_PARTICIPANT_LIST", subscriberEmail);
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", subscriberEmail);
    });
    
    //방장이 스터디룸을 폭파할 때
    this.session.on('signal:studyDestroy', ()=>{
      if(this.userType === 'user'){
        alert('방장이 스터디를 폭파했습니다.\n대기실로 돌아갑니다.')
        this.$store.dispatch('lbhModule/userLeaveSessionAxios')
      }
    })

      //현재 피드백실에 있는 인원 설정
      this.$store.commit('lbhModule/SET_FB_USER_COUNT')

      this.session.on('signal:sendVideoSeq', (e)=>{
        this.$store.commit('lbhModule/SET_VIDEOSEQ', e.data)
      })

      //방장인 면접자가, 면접을 끝내고 대기실에 있는 도중에 나갈 경우
      this.session.on('signal:superLeaveSessionWR', (e)=>{
        const pastSuperUserEmail = e.data.split(' ')[0]
        const currentSuperUserEmail = e.data.split(' ')[1]
        this.$store.commit('DELETE_CURRENT_USER_LIST', pastSuperUserEmail)
        if(this.myUserName === currentSuperUserEmail){
          alert('방장이 대기실에서 나갔습니다.\n다음 방장으로 지목되셨습니다.')
          this.$store.commit('lbhModule/SWITCH_USER_TYPE', 'superUser')
        }
      })

    //방장인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:superERLeaveSession', (e)=>{
      const pastSuperUserEmail = e.data.split(' ')[0]
      const currentSuperUserEmail = e.data.split(' ')[1]
      this.$store.commit('DELETE_CURRENT_USER_LIST', pastSuperUserEmail)
      if(this.myUserName === currentSuperUserEmail){
        this.$store.commit('lbhModule/SWITCH_USER_TYPE', 'superUser')
        alert('현재 방장이 스터디를 종료했으며, 다음 방장으로 선택되셨습니다.')
      } 
    })

    //일반유저인 면접자가, 면접을 끝내고 대기실에 있는 도중에 나갈 경우
    this.session.on('signal:userLeaveSessionfromWR', (e)=>{
      this.$store.commit('DELETE_CURRENT_USER_LIST', e.data)
    })

    //일반 유저인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:ERLeaveSessionFromFB', (e)=>{
      this.$store.commit('DELETE_CURRENT_USER_LIST', e.data)
    })

    //다른 면접관이 피드백 완료하면, 해당 면접관의 피드백을 받아 axiosFBList에 더하기
    this.session.on('signal:addAllFBList', (e)=>{
      // console.log('addAllFbList',e)
      this.$store.commit('lbhModule/MINUS_FB_USER_COUNT')
      this.$store.commit('lbhModule/ADD_AXIOS_FBLIST', e.data)
      //만약 피드백실에서 모두 나가면, 피드백까지 면접 종료
      if(this.FBUserCount <= 0){
        // console.log('fbcompleteAxios실행')
        this.$store.dispatch('lbhModule/FBCompleteAxios')
      }
    })

    this.session.on("signal:EECL", (e) => {
      const data = parseInt(e.data)
      // console.log("면접관이 받은 유저의 자소서", data);
      this.$store.commit("lbhModule/SET_STUDYROOM_CL",data);
    });

  },
  mounted(){
    this.startCountdown()
  },
  unmounted(){
    this.$store.commit('lbhModule/EMPTY_VIDEO_SRC')
    this.$store.commit('lbhModule/EMPTY_FB')
    this.$store.commit('lbhModule/EMPTY_FB_USER_COUNT')
    localStorage['cl'] = {}
  },
  methods: {
    //vue-countdown
    startCountdown() {
      this.counting = true;
    },
    onCountdownEnd() {
      if (confirm("피드백을 이대로 제출하시겠습니까? 이후에 대기실로 이동합니다.")) {
        //전체 피드백 리스트에 피드백 넣기
        const myFBList = JSON.stringify(this.FBList)
        this.session.signal({
          data: myFBList,
          to: [],
          type: 'addAllFBList'
        })
        //면접관이 대기실로 갈 거이니, 대기실 유저 목록을 업데이트하라는 시그널 보냄
        const data = JSON.stringify(this.myUserInfo)
        this.session.signal({
          data: `${data}`,
          to: [],
          type: 'WRParticipantListUpdate'
        })
        this.$store.commit('lbhModule/EMPTY_EE')
        this.$store.commit('lbhModule/EMPTY_ERS')
        // console.log('피드백실에서 이제 나감')
        this.$router.push({name:'waiting-room'})
      }
    },

    ERLeaveSessionFromFB() {
      if(confirm('정말 피드백 수정 도중에 나가시겠습니까?\n작성한 피드백이 모두 삭제되고 로비로 이동합니다.')){
      this.session.signal({
        data:`${this.myUserInfo}`,
        to: [],
        type: 'ERLeaveSession'
      })

      if (this.session) this.session.disconnect();
      this.$store.dispatch('lbhModule/userLeaveSessionAxios')
      }
    },

openEECL() {
      localStorage["cl"] = JSON.stringify({
        coverLetterTitle: this.studyRoomCL.coverLetterTitle,
        coverLetterContent: this.studyRoomCL.coverLetterContent,
      });
      let route = this.$router.resolve({ path: "/eecl" });
      window.open(route.href);
    },
    FBComplete() {
      if (confirm("피드백을 이대로 제출하시겠습니까? 이후에 대기실로 이동합니다.")) {
        //전체 피드백 리스트에 피드백 넣기
        const myFBList = JSON.stringify(this.FBList)
        this.session.signal({
          data: myFBList,
          to: [],
          type: 'addAllFBList'
        })
        //면접관이 대기실로 갈 거이니, 대기실 유저 목록을 업데이트하라는 시그널 보냄
        const data = JSON.stringify(this.myUserInfo)
        this.session.signal({
          data: `${data}`,
          to: [],
          type: 'WRParticipantListUpdate'
        })
        this.$store.commit('lbhModule/EMPTY_EE')
        this.$store.commit('lbhModule/EMPTY_ERS')
        // console.log('피드백실에서 이제 나감')
        this.$router.push({name:'waiting-room'})
      }
    },
    getToken(mySessionId) {
        return this.createSession(mySessionId).then((sessionId) =>{
          return this.createToken(sessionId)
          }
        );
    },  
    createSession(sessionId) {
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
    const videoInfo = {}; //해당 session의 면접자 영상 정보를 가져와야 함
    return {
      videoInfo,
    };
  },
};
</script>

<style scoped>
.FBView {
  position: absolute;
  width: 90vw;
  aspect-ratio: 2/1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 10px 10px 20px 6px #b5b8c0;  
  border-radius: 60px;
  padding: 3%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.savedEEVid{
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#app > div > div.FBView > div.savedEEVid > video{
  width: 90%;
  height: 90%;
}

.savedEEVid{
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#app > div > div.FBView > div.savedEEVid > video{
  width: 90%;
  height: 90%;
}

.FBRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  border-radius: 20px;
  background-color: #edf0f6;
  width: 30%;
}

.FBButtonHeader {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.CLOpen{
  margin-left: 30%
}

.FBView button{
  background-color: #a7a9b9;
  border: #a7a9b9
}
.FBView button:enabled:hover{
  background-color: #787a89;
  border: #787a89
}

#app > div > div.FBView > div.FBRightArea > div.FBButtonHeader > button{
  background-color: #a7a9b9;
  border: #a7a9b9;
  color: white;
}

.FBButtonFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

