// 이병헌
//면접실(일반 모드)에서 면접자가 보는 페이지 (Interviewee Room VIew => EEView)
<template>
  <AuthorityPassModal/>

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
        <button @click="EELeaveSession">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 면접에서 나가기 버튼(방장 유저) -->
      <div v-show="userType === 'superUser'" class="EEtoLBbtn superUser">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false">
            <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 면접 완료 버튼(방장 유저) -->
      <div v-show="userType === 'superUser'" class="EndStudyBtn superUser">
        <button @click="finishInterview">
          <i class="bi bi-check-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorityPassModal from '@/components/StudyRoom/AuthorityPassModal.vue'
import UserVideo from "@/components/UserVideo.vue";
import { mapGetters } from "vuex";
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";
const OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";

export default {
  name: "EEView",
  components:{UserVideo, AuthorityPassModal},
  computed:{
    ...mapGetters('lbhModule',[
      "EE",
      "ERS",
      "myUserName",
      "mySessionId",
      "userType",
      "publisher",
      "subscribers",
      'sessionToken',
      "session",
      "nextSuperUserList",
      'currentUserList',
      'myUserInfo',
      'recordingObject'
    ])
  },
  data(){
    return {
      interval: null
    }
  },
  created(){
    //방장이 면접을 완료할 경우
    this.session.on('signal:endInterview', () => {
      alert('방장이 면접을 종료했습니다.\n이제 대기실로 이동합니다.')
      this.$store.commit('lbhModule/ADD_WR_PARTICIPANT_LIST', this.myUserInfo)
      this.toWR()
    //녹화 종료 시그널 보내기
      this.session.signal({
      data: this.myUserName,
      to: [],
      type: 'stopRecording'
      })      
    });  

    //일반 유저인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:ERleaveSession', (e)=>{
      const erInfo = JSON.parse(e)
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', erInfo)
    })

    //방장인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:superERLeaveSession', (e) => {
      const pastSuperUser = JSON.parse(e.data.split(' ')[0])
      const currentSuperUser = JSON.parse(e.data.split(' ')[1])
      this.$store.commit('DELETE_CURRENT_USER_LIST', pastSuperUser)
      if(this.myUserEmail === currentSuperUser.myUserEmail){
        alert('방장이 대기실에서 나갔습니다.\n다음 방장으로 지목되셨습니다.')
        this.$store.commit('lbhModule/SWITCH_USER_TYPE', 'superUser')
      }
    })
  
    // 녹화 중지 stop레코딩 시그널을 받은 경우
    this.session.on("signal:stopRecording", (e) => {
      console.log('이게')
      console.log(e.data)
      console.log('맞음?')
      console.log("스탑 레코딩에 입장했습니다")
      console.log(this.recordingObject)

      return new Promise(() => {
        axios({
          url: `${OPENVIDU_SERVER_URL}/openvidu/api/recordings/stop/${this.recordingObject.id}`,
          method: "post",
          headers: {
            Authorization: `Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU`,
          },
        }).then((res) => {
          console.log(`stop recording id ${res.data.id}`);
          console.log(res.data)
          // //레코딩 끝난 후 시그널링으로 URL 보내기
          // this.session.signal({
          // data: this.res.data.url,
          // to: [],
          // type: 'ReviewURL'          
          // })
          // this.$store.commit('lbhModule/SET_RECORDING_OBJECT', res.data)

          //레코딩 끝나고 저장하기
          this.$store.commit('rhtModule/SET_RECORDING_RES', res.data)
        });
      });
    })
      
  },
  mounted(){
    this.interval = setInterval(this.interval++, 1000);
  },
  unmounted(){
    clearInterval(this.interval)
  },
  // updated(){
  //   this.isAlone()
  // },
  methods:{
    // isAlone(){
    //   if(this.currentUserList.length === 1){
    //     alert('현재 방에 혼자 남으셨습니다.\n대기실로 이동합니다.')
    //     this.$store.commit('lbhModule/SET_EE', [])
    //     this.$store.commit('lbhModule/EMPTY_ERS')
    //     this.$router.push('/waiting-room')
    //   }
    // },
    EELeaveSession(){
      if (confirm("정말 면접 도중에 나가시겠습니까?\n지금까지의 면접영상이 저장되지 않고 로비로 이동합니다.")) {
        this.session.signal({
          data:`${this.myUserName}`,
          to:[],
          type:'EELeaveSession'
        })
        this.$store.dispatch('lbhModule/userLeaveSession')
        if (this.session) this.session.disconnect();

        this.$store.commit('lbhModule/SET_SESSION', undefined)
        this.$store.commit('lbhModule/SET_OV', undefined)
        this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
        this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
        this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");

        this.$router.push("/main");
      }
    },
    async finishInterview(){
      this.$store.dispatch('lbhModule/finishInterview')
      const videoUrl = '' //await (videoUrl 받아오기)
      this.$store.dispatch('lbhModule/finishInterviewAxios', videoUrl)

      // 종료하면 녹화 종료 보내기
      this.session.signal({
        data: this.myUserName,
        to: [],
        type: 'stopRecording'
      })
    },
    async toWR() {
      await this.$router.push('/waiting-room')
      this.$store.commit('lbhModule/SET_EE', [])
      this.$store.commit('lbhModule/EMPTY_ERS')
    },
  }
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
