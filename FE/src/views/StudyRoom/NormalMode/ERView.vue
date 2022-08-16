// 이병헌
//면접실(일반 모드)에서 면접관이 보는 페이지 (Interviewee Room VIew => EEView)

<template>
  <AuthorityPassModal/>
  <div class="ERView" id="ERView">
    <!-- 영상 구역  -->
    <div class="ERLeftArea">
      <!-- 면접자 영상 구역 -->
      <div class="EEVidContainer">
        <div class="EEVid">
          <user-video :stream-manager="EE" />
        </div>
      </div>
      <!-- 면접관 영상 구역 -->
      <div class="ERVidContainer">
        <div class="ERVid">
          <user-video
            v-for="ER in ERS"
            :key="ER.stream.connection.connectionId"
            :stream-manager="ER"/>
        </div>
      </div>
    </div>

    <!-- 유저 기능 구역 -->
    <div class="ERRightArea">
      <!-- 상단 -->
      <div class="ERButtonHeader">
        <!-- 면접자 자소서 페이지 열기 버튼 -->
        <div class="CLOpen">
         <Button @click.prevent="openEECL()" icon="pi pi-times" class="p-button-rounded p-button-secondary">
            <i class="bi bi-file-earmark-text"></i>
          </Button>
          <!-- <button @click.prevent="openEECL()">
            <i class="bi bi-file-earmark-text"></i>
          </button> -->
        </div>
        <!-- 질문 팁 모달 열기 버튼 -->
        <!-- <div class="QTip">
          <button @click="openQTip">
            <i class="bi bi-lightbulb-fill"></i>
          </button>
        </div> -->
        <!-- 면접에서 나가기 버튼(일반 유저) -->
        <div v-show="userType === 'user'" class="ERtoLBbtn user">
         <Button @click="ERLeaveSession" icon="pi pi-times" class="p-button-rounded p-button-secondary" />
          <!-- <button @click.prevent="ERLeaveSession">
            <i class="bi bi-x-lg"></i>
          </button> -->
        </div>
        <!-- 면접에서 나가기 버튼(방장 유저) -->
        <div v-show="userType === 'superUser'" class="ERtoLBbtn superUser">
          <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false"/>
          <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false">
              <i class="bi bi-x-lg"></i>
          </button> -->
        </div>
      </div>

      <!-- 중단 -->
      <!-- 피드백 구역 -->
      <feedback-area></feedback-area>

      <!-- 하단 -->
      <div class="ERButtonFooter">
        <!-- 면접 완료 버튼(방장 유저) -->
        <div class="finishInterviewBtn" @click="finishInterview" v-show="userType == 'superUser'">
          <Button icon="pi pi-check" class="p-button-rounded p-button-secondary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorityPassModal from '@/components/StudyRoom/AuthorityPassModal.vue'
import UserVideo from "@/components/UserVideo.vue";
// import { OpenVidu } from "openvidu-browser";
import swal from "sweetalert2";
import { mapGetters } from "vuex";
import FeedbackArea from "@/components/StudyRoom/NormalMode/FeedbackArea.vue";

export default {
  name: "ERView",
  components: { FeedbackArea, UserVideo, AuthorityPassModal},
  data(){
    return{
      // nextSuperUser: '',
    }
  },
  computed:{
    ...mapGetters("lbhModule",[
      "EE",
      "ERS",
      "myUserName",
      "mySessionId",
      "userType",
      "publisher",
      "subscribers",
      'sessionToken',
      "session",
      "currentUserList",
      "nextSuperUserList",
      "myUserInfo",
      "myUserEmail",
      'studyRoomCL',
    ]),
    ...mapGetters('rhtModule',[
      'CoverLetterDetail',
    ]),
  },
  unmounted(){
    localStorage['cl'] = {}
    // if(this.userType === 'user'){
    //   this.$store.dispatch('lbhModule/userLeaveSessionAxios')
    // } else { this.$store.dispatch('lbhModule/studyDestroyFirstAxios')}
  },
  created(){
    //
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
    // this.OV = new OpenVidu();
    // this.session = this.OV.initSession();
    // this.session.connect(this.sessionToken)
    // .then(console.log('session connect success'))
    // .catch(err=>console.err(err.response))

// this.nextSuperUser = ''
    //방장이 스터디룸을 폭파할 때
    this.session.on('signal:studyDestroy', ()=>{
      alert('방장이 스터디를 폭파했습니다.\n대기실로 돌아갑니다.')
      this.$store.dispatch('lbhModule/userLeaveSessionAxios')
    })

    // 영상 저장에 필요한 비디오 타임 받음
    this.session.on('signal:startVideoTime', (e)=>{
      this.$store.commit('lbhModule/SET_START_VIDEO_TIME', e.data)
    })

    //면접자로 지정된 유저가 자소서를 보낸 것을 받음
    this.session.on("signal:EECL", (e) => {
      // console.log("EECL signal로 받은 데이터", e.data);
      // const cl = JSON.parse(e.data);
      const data = parseInt(e.data)
      console.log("면접관이 받은 유저의 자소서", data);
      this.$store.commit("lbhModule/SET_STUDYROOM_CL",data);
    });

    //방장이 면접을 완료할 경우
    this.session.on('signal:finishInterview', () => {
      console.log('finishinterview signal received, erview')
      this.toFB()
    });

    //일반 유저인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:ERLeaveSession', (e)=>{
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', e.data)
    })

    //방장인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:superERLeaveSession', (e) => {
      const pastSuperUserEmail = e.data.split(' ')[0]
      const currentSuperUserEmail = e.data.split(' ')[1]
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', pastSuperUserEmail)
      if(this.myUserEmail === currentSuperUserEmail){
        alert('방장이 면접을 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.')
        this.$store.commit('lbhModule/SWITCH_USER_TYPE', 'superUser')
      }
    })

    //방장인 면접자가, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:superEELeaveSession', (e)=>{
      const pastSuperUserEmail = e.data.split(' ')[0]
      const currentSuperUserEmail = e.data.split(' ')[1]
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', pastSuperUserEmail)
      if(this.myUserEmail === currentSuperUserEmail){
        alert('방장이 면접을 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.')
        this.$store.commit('lbhModule/SWITCH_USER_TYPE', 'superuser')
        this.toWR()
      } else{
        alert('면접자가 방에서 나갔습니다. 대기실로 이동합니다.')
        this.toWR()
      }        
    })

    //일반 유저인 면접자가, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:EELeaveSession', (e)=>{
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', e.data)
      this.$store.commit('lbhModule/EMPTY_FB')
      alert('면접자가 방에서 나갔습니다. 대기실로 이동합니다.')
      this.toWR()
    })

    //면접자가 보내준 저장된 영상 url
    this.session.on('signal:ReviewURL', (e)=>{
      this.$store.commit('lbhModule/GET_VIDEO_SRC', e.data)
    })
  },
  methods: {
    // isAlone(){
    //   if(this.currentUserList.length === 1){
    //     console.log('얘 혼자 남아서 대기실로 보냄')
    //     alert('현재 방에 혼자 남으셨습니다.\n대기실로 이동합니다.')
    //     this.$store.commit('lbhModule/SET_EE', [])
    //     this.$store.commit('lbhModule/EMPTY_ERS')
    //     this.$router.push('/waiting-room')
    //   }
    // },
    closeAPM(){
      this.nextSuperUser = ''
    },

    //나는 일반 유저 + 면접관, 면접 도중에 나가려고 함
    ERLeaveSession() {
      if(confirm('정말 면접 도중에 나가시겠습니까?\n작성한 피드백이 모두 삭제되고 로비로 이동합니다.')){
      this.session.signal({
        data:`${this.myUserInfo}`,
        to: [],
        type: 'ERLeaveSession'
      })

      if (this.session) this.session.disconnect();

      // this.$store.commit('lbhModule/SET_SESSION', undefined)
      // this.$store.commit('lbhModule/SET_OV', undefined)
      // this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
      // this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
      // this.$store.commit('lbhModule/SET_SUPERUSER', {})
      // this.$store.commit('lbhModule/EMPTY_FB')
      
      // window.removeEventListener("beforeunload", this.ERLeaveSession);
      // this.$router.push('/main')
      this.$store.dispatch('lbhModule/userLeaveSessionAxios')
      }
    },
    async toFB() {
      await this.$router.push({name:'fb-room'})
      // this.$store.commit('lbhModule/EMPTY_EE') //방장이 면접 종료?완료 버튼을 눌러 하나의 면접을 끝내면, 일단 EE를 empty array로 만듬
      // this.$store.commit('lbhModule/EMPTY_ERS')
    },
    async toWR() {
      await this.$router.push({name:'waiting-room'})
      // this.$store.commit('lbhModule/EMPTY_EE') //방장이 면접 종료?완료 버튼을 눌러 하나의 면접을 끝내면, 일단 EE를 empty array로 만듬
      // this.$store.commit('lbhModule/EMPTY_ERS')
    },
    openEECL() {
      this.$store.dispatch('rhtModule/detailCoverLetter', this.studyRoomCL)
      localStorage['cl'] = JSON.stringify({
        coverLetterTitle: this.CoverLetterDetail.coverLetterTitle,
        coverLetterContent: this.CoverLetterDetail.coverLetterContent,
      })
      let route = this.$router.resolve({ path: "/eecl"});
      window.open(route.href);
    },
    openQTip() {
      swal.fire({
        title: "면접관 질문 팁!",
        text: "와! 정말 유용한 팁들이에요~",
        icon: "info",
        cancelButtonText: "질문 팁 닫기",
        position: "top-end",
      });
    },
    async finishInterview(){
      console.log('면접 완료 버튼 눌렸는데?')
      if(confirm('정말 면접을 종료하시겠습니까? 면접자는 대기실로 이동하고, 나머지 면접자들은 피드백 완료를 위해 피드백실로 이동합니다.')){
        // const videoUrl = this.$store.getters['rhtModule/RecordingRes'].url
        // this.$store.dispatch('lbhModule/finishInterviewAxios', videoUrl)
        this.session.signal({
          data: '',
          to: [],
          type: 'finishInterview'
        })
      }
    },
  }
};
</script>

<style scoped>
.ERView {
  position: absolute;
  width: 90vw;
  min-width: 1000px;
  aspect-ratio: 2/1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(255,255,255,0.5);
  box-shadow: 10px 10px 20px 6px #9ea7b2;  
  border-radius: 60px;
  padding: 1.5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* 좌단 */
.ERLeftArea{
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
}

.EEVidContainer{
  width: 100%;
  display:flex;
  justify-content: center;
}

.EEVid{
  width: 90%;
  height: 75%;
}

.ERVidContainer{
  display:flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  /* overflow-x: scroll; */
  height: 20%; 
}

.ERVid{
  width: 100%;
  height:100%;
  display: flex;
  justify-content: center;
}


/* 우단 */
.ERRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  border-radius: 20px;
  background-color: #edf0f6;
}

.ERButtonHeader {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.CLOpen{
  margin-right: 10%;
}

.ERButtonFooter {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.ERView button{
  background-color: #a7a9b9;
  border: #a7a9b9
}
.ERView button:enabled:hover{
  background-color: #787a89;
  border: #787a89
}

/* 면접자 페이지 버튼들 시작*/
/* https://css-tricks.com/examples/RoundButtons/ */
/* 굿/뱃 버튼은 FeedbackArea에 있음 */
/* .CLOpen > button,
.QTip > button,
.finishInterviewBtn > button,
.ERtoLBbtn > button {
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

.CLOpen > button:before ,
.QTip > button:before ,
.finishInterviewBtn > button:before ,
.ERtoLBbtn > button:before {
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

.CLOpen > button:after ,
.QTip > button:after ,
.finishInterviewBtn > button:after,
.ERtoLBbtn > button:after {
  content: "";
  display: block;
  background: #fff;
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


.CLOpen > button:hover,
.QTip > button:hover,
.finishInterviewBtn > button:hover,
.ERtoLBbtn > button:hover {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
} */
/* 면접자 페이지 버튼들 끝*/


.swal-overlay {
  background-color: black;
}
</style>
