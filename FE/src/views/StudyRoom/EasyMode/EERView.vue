// 이병헌
<template>
  <AuthorityPassModal/>
  <div class="EERView">
    <!-- 영상 구역 -->
    <div class="EERContent">
      <!-- 면접자 영상 구역  -->
      <div class="EEVidContainer">
        <div class="EEVid">
          <!-- <warningStackBar :stack="warningCount"></warningStackBar> 경고게이지 주석 -->
          <user-video :stream-manager="EE" />
        </div>
      </div>
      <div class="ERVidContainer">
        <div class="ERVid">
          <user-video
            v-for="ER in ERS"
            :key="ER.stream.connection.connectionId"
            :stream-manager="ER"
          />
        </div>
      </div>
    </div>

    <div class="EERRightArea">
      <div class="EERButtonHeader">
        <div v-if="userType === 'superUser'" class="EERtoWRBtn superUser">
          <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false">
              <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div v-if="userType === 'user'" class="EERtoWRBtn user" @click="userLeaveSessionFromEER">
          <button type="button">
              <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div class="EERButtonFooter">
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
  </div>
</template>

<script>
import AuthorityPassModal from "@/components/StudyRoom/AuthorityPassModal.vue"
import UserVideo from "@/components/UserVideo.vue";
import { mapGetters } from "vuex";
// import warningStackBar from "@/components/StudyRoom/EasyMode/WarningStackBar.vue"; //경고게이지 주석
import { useRouter } from "vue-router";

export default {
  name: "EERView",
  components: { UserVideo, AuthorityPassModal }, // warningStackBar //경고게이지 주석
  data() {
    return {
      warningCount: 0,
      isFiltered: false,
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      "EE",
      "ERS",
      "isEE",
      "isER",
      "myUserName",
      "mySessionId",
      "userType",
      "publisher",
      "subscribers",
      "sessionToken",
      "session",
      "currentUserList",
    ]),
    nextSuperUserList() {
      return this.currentUserList.filter((p) => p.name !== this.myUserName);
    },
  },
  created() {
    //일반 유저인 면접자가, 면접 도중에 나간 경우
    this.session.on('signal:EELeaveSessionFromEER', (e)=>{
      alert('면접자가 면접 도중에 나갔습니다.\n남은 참가자들 모두 대기실로 이동합니다.')
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', e.data)
      this.$store.commit('lbhModule/SET_EE', [])
      this.$store.commit('lbhModule/EMPTY_ERS')
      this.$router.push({name:'waiting-room'})
    })

    //일반 유저인 면접관이, 면접 도중에 나간 경우
    this.session.on('signal:ERLeaveSession', (e)=>{
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', e.data)
    })

    //방장인 면접자가, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:superEELeaveSession', (e)=>{
      const pastSuperUserName = e.data.split(' ')[0]
      const currentSuperUserName = e.data.split(' ')[1]
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', pastSuperUserName)
      if(this.myUserName === currentSuperUserName){
        alert('방장이 면접을 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.')
        this.$store.commit('lbhModule/SWITCH_USER_TYPE_TEMP')
        this.$store.commit('lbhModule/SET_EE', [])
        this.$store.commit('lbhModule/EMPTY_ERS')
        this.$router.push({name:'waiting-room'})
      } else if(this.session){
        alert('면접자가 방에서 나갔습니다. 대기실로 이동합니다.')
        this.$store.commit('lbhModule/SET_EE', [])
        this.$store.commit('lbhModule/EMPTY_ERS')
        this.$router.push({name:'waiting-room'})
      }        
    })

    //방장인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on('signal:superERLeaveSession', (e) => {
      const pastSuperUserName = e.data.split(' ')[0]
      const currentSuperUserName = e.data.split(' ')[1]
      this.$store.commit('lbhModule/DELETE_CURRENT_USER_LIST', pastSuperUserName)
      if(this.myUserName === currentSuperUserName){
        alert('방장이 면접을 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.')
        this.$store.commit('lbhModule/SWITCH_USER_TYPE_TEMP')
      }
    })

    this.nextSuperUser = "";
    window.addEventListener("beforeunload", this.EERleaveSession);
    console.log("eerview cretaed", this.EE);
    console.log("eerview cretaed", this.ERS);
    console.log(this.session);
    this.session.on("signal:warning", (event) => {
      console.log(event.data);
      //신호를 받고, 내가 면접자인 경우에만 warningCount++
      if (JSON.parse(this.EE.stream.connection.data).clientData === this.myUserName) {
        console.log("EE: ", this.EE);
        this.addWarn(); //경고 누적
        this.setFilter(); //필터 걸기
      }

      // <- 테스트용, 모든 참여자 warningCoutn 올림
      //this.addWarn();
    });
    //change filter 신호 받기
    this.session.on("signal:setFilter", (event) => {
      var data = event.data;
      var filter = "";
      //data를 이용해서 분기,
      if (data === "1") {
        filter = "dicetv";
      } else if (data === "2") {
        filter = "optv";
      }

      if (JSON.parse(this.EE.stream.connection.data).clientData !== this.myUserName) {
        for (var ER of this.ERS) {
          var name = JSON.parse(ER.stream.connection.data).clientData;
          if (name === this.myUserName) {
            if (this.isFiltered) {
              this.removeFilter();
              setTimeout(() => {
                ER.stream
                  .applyFilter("GStreamerFilter", { command: filter })
                  .then(() => {
                    this.isFiltered = true;
                    console.log("success set filter");
                    setTimeout(this.removeFilter, 10000);
                    //일정 시간 이후 필터 해제하기
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }, 1000);
            } else {
              ER.stream
                .applyFilter("GStreamerFilter", { command: filter })
                .then(() => {
                  this.isFiltered = true;
                  console.log("success set filter");
                  setTimeout(this.removeFilter, 10000);
                  //일정 시간 이후 필터 해제하기
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        }
      }
    });

    this.session.on("signal:EndInterviewByWarning", (event) => {
      console.log(event.data);
      this.returnWaitingRoom();
      //대기실로 돌아가는 메소드 구현
    });

    this.session.on("signal:EECL", (e) => {
      // 면접자의 자소서를 받아옴
      const cl = JSON.parse(e.data);
      this.$store.commit("SET_STUDYROOM_CL", cl);
    });
    this.session.on("signal:superUserOut", (e) => {
      if (this.myUserName === e.data) {
        this.$store.commit("lbhModule/SWITCH_USER_TYPE");
      } else {
        ("방장바뀜");
      }
    });
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
  methods: {
    userLeaveSessionFromEER(){
      if(confirm('정말 면접 도중에 나가시겠습니까?')){
        if(this.isEE){
          this.session.signal({
            data:`${this.myUserName}`,
            to: [],
            type: 'EELeaveSessionFromEER'
          })
          
        } else if(this.isER) {
          this.session.signal({
            data:`${this.myUserName}`,
            to: [],
            type: 'ERLeaveSessionFromEER'
          })        
        }
        if (this.session) this.session.disconnect();

        this.$store.commit("lbhModule/SET_SESSION", undefined);
        this.$store.commit("lbhModule/SET_OV", undefined);
        this.$store.commit("lbhModule/SET_PUBLISHER", undefined);
        this.$store.commit("lbhModule/SET_SUBSCRIBERS", []);
        this.$store.commit("lbhModule/SET_SUPERUSER", {});

        window.removeEventListener("beforeunload", this.EERleaveSession);

        this.$router.push('/main')
      }
    },
    openEECL() {
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
    //--------------------경고 누적시 캠 효과 넣기 ----------------------
    setFilter() {
      this.session
        .signal({
          data: this.warningCount + "",
          to: [],
          type: "setFilter",
        })
        .then(() => {
          console.log("set filter");
        })
        .catch(() => {
          console.log("fail get setFilter signal");
        });
    },
    removeFilter() {
      if (this.isFiltered) {
        for (var ER of this.ERS) {
          var name = JSON.parse(ER.stream.connection.data).clientData;
          if (name === this.myUserName) {
            ER.stream.removeFilter();
            this.isFiltered = false;
          }
        }
      }
    },

    //----------------------------끝------------------------------------

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

.EEVidContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.EEVid {
  width: 65%;
  aspect-ratio: 16/9;
}

.ERVidContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  overflow-x: scroll;
  /* height: 20%;  */
}

.ERVid {
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

.EERRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20%;
  height: 100%;
  border-radius: 20px;
  background-color: #edf0f6;
}

.EERButtonHeader {
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

.EERButtonHeader > div > button,
.EERButtonFooter > div > button {
  border: none;
  background-color: rgb(209, 209, 209);
  border-radius: 50%;
}

.EERButtonHeader > div > button,
.EERButtonFooter > div > button {
  padding: 15px;
}

.EERButtonHeader > div > button > i,
.EERButtonFooter > div > button > i {
  font-size: 150%;
  color: black;
}
</style>
