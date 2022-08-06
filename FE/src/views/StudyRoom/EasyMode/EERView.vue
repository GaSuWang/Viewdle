// 이병헌
<template>
  <div class="EERView">
    <!-- 영상 구역 -->
    <div class="EERContent">

      <!-- 면접자 영상 구역  -->
      <div class="EEVidContainer">
        <div class="EEVid">
          <user-video :stream-manager="EE" />
        </div>
      </div>
      <div class="ERVidContainer">
        <div class="ERVid">
          <user-video
            v-for="ER in ERS"
            :key="ER.stream.connection.connectionId"
            :stream-manager="ER"/>
        </div>
      </div>
    </div>

    <div class="EERRightArea">
      <div class="EERButtonHeader">
        <div class="EERtoLB">
          <button >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div class="EERButtonFooter">
        <div class="CLViewBtn">
          <button @click="openCL" >
            <i class="bi bi-file-earmark-text"></i>
          </button>
        </div>  
        <div class="VoiceChangeBtn">
          <button >
            <i class="bi bi-mic-fill"></i>
          </button>
        </div>
        <div class="StudyEnd">
          <button >
            <i class="bi bi-check-lg"></i>
          </button>
        </div>
        <div class="SuddenAttackBtn">
          <button >
            <i class="bi bi-exclamation-triangle-fill"></i>
          </button>
        </div>
        <div class="CaptureBtn">
          <button >
            <i class="bi bi-camera"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserVideo from "@/components/UserVideo.vue";
import {mapGetters} from 'vuex'
export default {
  name: "EERView",
  components: {UserVideo},
  created(){
    this.nextSuperUser = ''
    window.addEventListener("beforeunload", this.EERleaveSession);
    console.log('eerview cretaed', this.EE)
    console.log('eerview cretaed', this.ERS)
    this.session.on('signal:EECL', (e)=>{ // 면접자의 자소서를 받아옴
        const cl = JSON.parse(e.data)
        this.$store.commit('SET_STUDYROOM_CL', cl)
    });
    this.session.on('signal:superUserOut', (e) => {
      if(this.myUserName === e.data){
        this.$store.commit('lbhModule/SWITCH_USER_TYPE')
        console.log('이제', this.myUserName,'가', this.userType, '이다.')
      } else{'방장바뀜'}
    })
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
      'SessionToken',
      "session",
      "currentUserList",
    ]),
    nextSuperUserList(){
      return this.currentUserList.filter(p => p.name !== this.myUserName)
    }
  },
  methods: {
    openEECL() {
      let route = this.$router.resolve({ path: "/eecl" });
      window.open(route.href);
    },
    changeVoice() {},
    suddenAttack() {},
    capture() {},

    //면접관실에서 나갈 때
    EERleaveSession() {
      if(this.userType === 'superUser') {
        this.$store.commit('lbhModule/SET_APM_DESTINATION', 'ERView')
        this.$store.commit('lbhModule/SET_APM_OPEN', true)

      } else {
        if (this.session) this.session.disconnect();
    
          this.$store.commit('lbhModule/SET_SESSION', undefined)
          this.$store.commit('lbhModule/SET_OV', undefined)
          this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
          this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
          this.$store.commit('lbhModule/SET_SUPERUSER', {})
          
          window.removeEventListener("beforeunload", this.EERleaveSession);
      }
    },
    EERtoLBConfirm() {
      if (this.userType === "user") {
        if (confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 로비로 이동합니다.")) 
        {this.$router.push({ name: "main" });}} 
        else if (this.userType === "superUser") {
        if (confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 방장 권한 위임 후 로비로 이동합니다.")) 
          { console.log('권한 위임 모달 실행') }
      }
    },
    StudyDestroy(){
      if(confirm('정말 면접을 종료하시겠습니까? 면접자는 대기실로 이동하고, 나머지 면접자들은 피드백 완료를 위해 피드백실로 이동합니다.')){
        this.session.signal({
        data: 'true',  
        to: [],
        type: 'endInterview'
        })
        .then(() => {
          console.log('erview send signal test')
        })
        .catch(error => {
            console.error(error);
        });
      }
    },
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
  padding: 1%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.EERContent {
  width: 80%;
  height: 100%;
  /* opacity: 50%; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.EEVidContainer{
  width: 100%;
  display:flex;
  justify-content: center;
}

.EEVid{
  width: 65%;
  aspect-ratio: 16/9;;
}

.ERVidContainer{
  display:flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  overflow-x: scroll;
  /* height: 20%;  */
}

.ERVid{
  width: 100%;
  display: flex;
  justify-content: center;
}

.EERBtnContainer {
  z-index: 1;
  width: 65%;
  opacity: 30%;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-self: center;
}

.EERRightArea{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20%;
  height: 100%;
  border-radius: 20px;
  background-color: #edf0f6; 
}

.EERButtonHeader{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.EERButtonFooter {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}


.EERButtonHeader > button {
  border: none;
  background-color: rgb(209, 209, 209);
  border-radius: 50%;
  width: 3%;
  height: 3%;
  /* filter: blur(3px); */
}

.EERButtonHeader > div > button > i {
  font-size: 100%;
  color: black;
}
.EERButtonHeader >div> button, 
.EERButtonFooter >div> button{
  border: none;
  background-color: rgb(209, 209, 209);
  border-radius: 50%;
}

.EERButtonHeader >div> button, 
.EERButtonFooter >div> button{
  padding:15px;
}

.EERButtonHeader >div> button > i, 
.EERButtonFooter >div> button > i {
  font-size: 150%;
  color: black;
}
</style>
