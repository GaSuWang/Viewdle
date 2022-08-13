// 이병헌
<template>
  <AuthorityPassModal />
  <!-- 돌발상황 영역 -->
  <div v-if="suddenAttackFlag == 0">
    <div class="guard"></div>
    <AttackSpaceBar class="sufddenAttack" @endSuddenAttack="endSuddenAttack" />
  </div>
  <ArrowDirection
    v-else-if="suddenAttackFlag == 1"
    class="suddenAttack"
    @endSuddenAttack="endSuddenAttack"
  />
  <OneToNine
    v-else-if="suddenAttackFlag == 2"
    class="suddenAttack"
    @endSuddenAttack="endSuddenAttack"
  />
  <!-- 돌발상황 영역 끝 -->
  <div :style="cssVariable" class="siren"></div>
  <div class="EERView">
    <!-- 영상 구역 -->
    <!-- style cssVariable 삭제 -->
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
        <!-- 면접에서 나가기 버튼(방장 유저) -->
        <div v-if="userType === 'superUser'" class="EERtoWRBtn superUser">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-backdrop="false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <!-- 면접에서 나가기 버튼(일반 유저) -->
        <div v-if="userType === 'user'" class="EERtoWRBtn user" @click="userLeaveSessionFromEER">
          <button type="button">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <!-- 돌발질문 카운트 다운 및 OX버튼 시작 -->
      <div v-if="OXBtnState">
        <button @click="selectOBtn">O</button>
        <button @click="selectXBtn">X</button>
      </div>
      <div v-if="isCountDownOn">countdown: {{ countDown }}</div>
      <!-- 돌발질문 카운트 다운 및 OX버튼 끝-->
      <div class="EERButtonFooter">
        <div class="CLViewBtn">
          <button @click="openEECL">
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
          <button :disabled="suddenBtnState" @click="sendSuddenQASignal">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </button>
        </div>
        <div class="CaptureBtn">
          <button :disabled="suddenBtnState" @click="sendSuddenAttackSignal">
            <i class="bi bi-camera"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorityPassModal from "@/components/StudyRoom/AuthorityPassModal.vue";
import UserVideo from "@/components/UserVideo.vue";
import { mapGetters } from "vuex";
// import warningStackBar from "@/components/StudyRoom/EasyMode/WarningStackBar.vue"; //경고게이지 주석
import AttackSpaceBar from "@/components/StudyRoom/EasyMode/Game/AttackSpaceBar.vue";
import OneToNine from "@/components/StudyRoom/EasyMode/Game/OneToNine.vue";
import ArrowDirection from "@/components/StudyRoom/EasyMode/Game/ArrowDirection.vue";
import { useRouter } from "vue-router";

export default {
  name: "EERView",
  components: { UserVideo, AuthorityPassModal, AttackSpaceBar, OneToNine, ArrowDirection }, // warningStackBar //경고게이지 주석
  data() {
    return {
      warningCount: 0, //현재 쌓인 경고수
      isFiltered: false, //비디오 필터 걸렸는지 확인
      suddenBtnState: false, //돌발질문 버튼 활성화 여부, :disabled활용, false일때 활성화
      OXBtnState: false, // 면접관 돌발질문 OX 버튼 활성화 여부 v-if활용 true일때 활성화
      isQASender: false, // 돌발질문 발생시킨 면접관인지 확인용
      isCountDownOn: false, // 카운트다운 활성화 여부 v-if활용 true일때 활성화
      countDown: 3, // 실제 화면에 표시되는 카운트다운
      bgIsWhite: true, //배경색 결정 변수 true:하얀색, false: 붉은색
      suddenAttackFlag: -1, //돌발 상황 분기
      timeout: null, //타임아웃 저장용
      isEE: false,
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      "EE",
      "ERS",
      "myUserName",
      "myUserEmail",
      "myUserInfo",
      "mySessionId",
      "userType",
      "publisher",
      "subscribers",
      "SessionToken",
      "session",
      "currentUserList",
      "WRParticipantList",
    ]),
    // nextSuperUserList() {
    //   return this.currentUserList.filter((p) => p.name !== this.myUserName);
    // },
    cssVariable() {
      return {
        "--bgcolor": this.bgIsWhite ? "white" : "tomato",
      };
    },
  },
  created() {

    // 내가 면접자인지 아닌지 확인
     if (JSON.parse(this.EE.stream.connection.data).clientEmail === this.myUserEmail){
      this.isEE = true;
     }
    //면접자로 지정된 유저가 자소서를 보낸 것을 받음
    this.session.on("signal:EECL", (e) => {
      console.log("EECL signal로 받은 데이터", e.data);
      const cl = JSON.parse(e.data);
      console.log("면접관이 받은 유저의 자소서", cl);
      this.$store.commit("SET_STUDYROOM_CL", cl);
    });

    //일반 유저인 면접자가, 면접 도중에 나간 경우
    this.session.on("signal:EELeaveSessionFromEER", (e) => {
      alert("면접자가 면접 도중에 나갔습니다.\n남은 참가자들 모두 대기실로 이동합니다.");
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", e.data);
      this.$store.commit("lbhModule/SET_EE", []);
      this.$store.commit("lbhModule/EMPTY_ERS");
      this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", this.myUserInfo);
      this.$router.push({ name: "waiting-room" });
    });

    //일반 유저인 면접관이, 면접 도중에 나간 경우
    this.session.on("signal:ERLeaveSession", (e) => {
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", e.data);
    });

    //방장인 면접자가, 면접을 보는 도중에 나갈 경우
    this.session.on("signal:superEELeaveSession", (e) => {
      const pastSuperUserEmail = e.data.split(" ")[0];
      const currentSuperUserEmail = e.data.split(" ")[1];
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", pastSuperUserEmail);
      if (this.myUserEmail === currentSuperUserEmail) {
        alert("방장이 면접 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.");
        this.$store.commit("lbhModule/SWITCH_USER_TYPE", "superUser");
        this.$store.commit("lbhModule/EMPTY_EE");
        this.$store.commit("lbhModule/EMPTY_ERS");
        this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", this.myUserInfo);
        this.$router.push({ name: "waiting-room" });
      } else if (this.myUserEmail !== pastSuperUserEmail) {
        alert("면접자가 방에서 나갔습니다. 대기실로 이동합니다.");
        this.$store.commit("lbhModule/EMPTY_EE");
        this.$store.commit("lbhModule/EMPTY_ERS");
        this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", this.myUserInfo);
        this.$router.push({ name: "waiting-room" });
      }
    });

    //방장인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on("signal:superERLeaveSession", (e) => {
      const pastSuperUserEmail = e.data.split(" ")[0];
      const currentSuperUserEmail = e.data.split(" ")[1];
      console.log("방장이 면접 도중에 나감", pastSuperUserEmail, currentSuperUserEmail);
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", pastSuperUserEmail);
      if (this.myUserEmail === currentSuperUserEmail) {
        alert("방장이 면접 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.");
        this.$store.commit("lbhModule/SWITCH_USER_TYPE", "superUser");
      } else {
        console.log(
          `내 이메일은 ${this.myUserEmail}, 전 방장 이메일은 ${pastSuperUserEmail}, 현 방장 이메일은 ${currentSuperUserEmail}`
        );
      }
    });

    // this.nextSuperUser = "";
    window.addEventListener("beforeunload", this.EERleaveSession);
    console.log("eerview cretaed", this.EE);
    console.log("eerview cretaed", this.ERS);
    console.log(this.session);
    this.session.on("signal:warning", () => {
      // 이병헌: 이제는 connection.data에 { clientName: this.myUserName, clientEmail: this.myUserEmail } 이런식으로 정보가 넘어가서,
      // clientData가 아닌, clientEmail로 확인해야 될 거 같아. 그래서 아래도 일단 다 수정해뒀어.
      this.addWarn(); //경고 누적
    });

    //change filter 신호 받기
    // this.session.on("signal:setFilter", (event) => {
    //   var data = event.data;
    //   var filter = "";
    //   //data를 이용해서 분기,
    //   if (data === "1") {
    //     filter = "dicetv";
    //   } else if (data === "2") {
    //     filter = "optv";
    //   }
    //   // if (JSON.parse(this.EE.stream.connection.data).clientData !== this.myUserName) {
    //   if (JSON.parse(this.EE.stream.connection.data).clientEmail !== this.myUserEmail) {
    //     for (var ER of this.ERS) {
    //       // var name = JSON.parse(ER.stream.connection.data).clientData;
    //       var email = JSON.parse(ER.stream.connection.data).clientEmail;
    //       if (email === this.myUserEmail) {
    //         //이미 설정된 필터가 있으면
    //         if (this.isFiltered) {
    //           this.removeFilter();
    //           setTimeout(() => {
    //             ER.stream
    //               .applyFilter("GStreamerFilter", { command: filter })
    //               .then(() => {
    //                 this.isFiltered = true;
    //                 console.log("success set filter");
    //                 setTimeout(this.removeFilter, 10000);
    //                 //일정 시간 이후 필터 해제하기
    //               })
    //               .catch((error) => {
    //                 console.log(error);
    //               });
    //           }, 1000);
    //         } else { //설정된 필터가 없으면
    //           ER.stream
    //             .applyFilter("GStreamerFilter", { command: filter })
    //             .then(() => {
    //               this.isFiltered = true;
    //               console.log("success set filter");
    //               setTimeout(this.removeFilter, 10000);
    //               //일정 시간 이후 필터 해제하기
    //             })
    //             .catch((error) => {
    //               console.log(error);
    //             });
    //         }
    //       }
    //     }
    //   }
    // });
    //----------------돌발 상황 시작 ----------------------
    this.session.on("signal:suddenAttack", () => {
      // var name = JSON.parse(this.EE.stream.connection.data).clientData;
      //var email = JSON.parse(this.EE.stream.connection.data).clientEmail;
      // if(name === this.myUserName){
      if (this.isEE) {
        console.log("receive suddenAttack signal");
        //면접자 돌발상황 발생시키기
        this.startSuddenAttack();
      } else {
        this.disabledSuddenBtn();
      }
    });
    this.session.on("siganl:endSuddenAttack", () => {
      // var name = JSON.parse(this.EE.stream.connection.data).clientData;
      //var email = JSON.parse(this.EE.stream.connection.data).clientEmail;
      // if(name !== this.myUserName){
      if (!this.isEE) {
        this.suddenBtnState = false;
      }
    });
    //----------------돌발 상황 끝 -----------------------
    //----------------돌발 질문 시작-----------------------
    this.session.on("signal:suddenQA", () => {
      console.log("receive suddenQA signal");
      // var name = JSON.parse(this.EE.stream.connection.data).clientData;
      //var email = JSON.parse(this.EE.stream.connection.data).clientEmail;
      // if (name === this.myUserName) {
      if (this.isEE) {
        //면접자 화면에 카운트다운 3,2,1 ->  ui 사이렌 효과주기
        this.startSirenEffect();
        this.showCountDown();
        //3초뒤 신호 발생시킨 면접관에게만 다시 신호 보내기
        setTimeout(this.sendShowOXSignal, 3000);
      } else {
        //돌발상황, 돌발질문 버튼 비활성화 시키기
        this.disabledSuddenBtn();
      }
    });
    this.session.on("signal:ShowOXBtn", () => {
      //OX버튼 보여주기
      if (this.isQASender) {
        console.log("버튼 보여줘~");
        this.showOXBtn();
        this.isQASender = false;
      }
    });
    this.session.on("signal:activeSuddenBtn", () => {
      console.log("돌발질문 버튼 활성화시키기");
      // var name = JSON.parse(this.EE.stream.connection.data).clientData;
      //var email = JSON.parse(this.EE.stream.connection.data).clientEmail;
      // if (name !== this.myUserName) {
      if (!this.isEE) {
        this.suddenBtnState = false;
      }
    });
    //----------------돌발 질문 끝-----------------------
    this.session.on("signal:EndInterviewByWarning", (event) => {
      console.log(event.data);
      this.returnWaitingRoom();
      //대기실로 돌아가는 메소드 구현
    });

    // this.session.on("signal:EECL", (e) => {
    //   // 면접자의 자소서를 받아옴
    //   const cl = JSON.parse(e.data);
    //   this.$store.commit("SET_STUDYROOM_CL", cl);
    // });
    // this.session.on("signal:superUserOut", (e) => {
    //   if (this.myUserName === e.data) {
    //     this.$store.commit("lbhModule/SWITCH_USER_TYPE");
    //   } else {
    //     ("방장바뀜");
    //   }
    // });

    // 면접자일때만 음성인식 시작
    // if (JSON.parse(this.EE.stream.connection.data).clientData === this.myUserName) {
    if (this.isEE) {
      this.startRecognition();
    }
  },
  setup() {
    const router = useRouter();
    //--------------------return waitingRoom ---------------------------
    function returnWaitingRoom() {
      if (this.isFiltered) {
        this.removeFilter();
      }
      router.push({ name: "waiting-room" });
    }
    //--------------------return waitingRoom end---------------------------
    return {
      returnWaitingRoom,
    };
  },
  methods: {
    userLeaveSessionFromEER() {
      if (confirm("정말 면접 도중에 나가시겠습니까?")) {
        if (this.isEE) {
          this.session.signal({
            data: `${this.myUserName}`,
            to: [],
            type: "EELeaveSessionFromEER",
          });
          if (this.session) {
            console.log("플레이모드에서, 일반 면접자가 방을 나감", this.session);
            this.session.disconnect();
            console.log("this.session.disconnect가 실행됐나?", this.session);
          } else {
            console.log("뭔소리 하는거야? 세션?");
          }
        } else if (!this.isER) {
          this.session.signal({
            data: `${this.myUserName}`,
            to: [],
            type: "ERLeaveSessionFromEER",
          });
          if (this.session) {
            console.log("플레이모드에서, 일반 면접자가 방을 나감", this.session);
            this.session.disconnect();
            console.log("this.session.disconnect가 실행됐나?", this.session);
          } else {
            console.log("뭔소리 하는거야? 세션?");
          }
        }

        window.removeEventListener("beforeunload", this.EERleaveSession);

        this.$store.dispatch("lbhModule/userLeaveSessionAxios");
      }
    },
    openEECL() {
      let route = this.$router.resolve({ path: "/eecl" });
      window.open(route.href);
    },
    changeVoice() {},
    capture() {},
    addWarn() {
      //경고 누적용
      this.warningCount++;
      if (
        this.isEE&&
        this.warningCount >= 5
      ) {
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
    // setFilter() {
    //   this.session
    //     .signal({
    //       data: this.warningCount + "",
    //       to: [],
    //       type: "setFilter",
    //     })
    //     .then(() => {
    //       console.log("set filter");
    //     })
    //     .catch(() => {
    //       console.log("fail get setFilter signal");
    //     });
    // },
    removeFilter() {
      if (this.isFiltered) {
        for (var ER of this.ERS) {
          // var name = JSON.parse(ER.stream.connection.data).clientData;
          var email = JSON.parse(ER.stream.connection.data).clientEmail;
          // if (name === this.myUserName) {
          if (email === this.myUserEmail) {
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
          to: [],
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
    //---------------------돌발 질문,상황 관련 함수 -----------------------------
    //돌발 질문 신호보내기
    sendSuddenQASignal() {
      this.isQASender = true;
      this.session
        .signal({
          data: "suddenQA",
          to: [],
          type: "suddenQA",
        })
        .then(() => {
          console.log("success send sudden QA");
        })
        .catch((e) => {
          console.log("fail send sudden QA error: ", e);
        });
    },

    sendSuddenAttackSignal() {
      this.session
        .signal({
          data: "suddenAttack",
          to: [],
          type: "suddenAttack",
        })
        .then(() => {
          console.log("success send sudden attack");
        })
        .catch((e) => {
          console.log("suddenAttackError:", e);
        });
    },

    //돌발상황, 돌발질문 버튼 비활성화
    disabledSuddenBtn() {
      this.suddenBtnState = true;
    },

    //todo 면접자 화면에 카운트다운 3,2,1
    showCountDown() {
      this.isCountDownOn = true;
      var timer = setInterval(() => {
        this.countDown--;
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        this.isCountDownOn = false;
        this.countDown = 3;
      }, 2800);
    },

    //o,x 버튼 보이게 하기 (면접관)
    showOXBtn() {
      this.OXBtnState = true;
    },

    //버튼 누르면 o,x버튼 사라지게함
    hideOXBtn() {
      this.OXBtnState = false;
    },
    //다시 돌발상황, 돌발질문 버튼 활성화
    activeSuddenBtn() {
      this.session.signal({
        data: "active sudden btn",
        to: [],
        type: "activeSuddenBtn",
      });
    },
    //신호 발생시킨 면접관에게만 다시 신호 보내기
    sendShowOXSignal() {
      this.session.signal({
        data: "show ox btn",
        to: [], //
        type: "ShowOXBtn",
      });
    },
    //배경 빨강->하양 반복 사이렌효과
    startSirenEffect() {
      console.log("웨에에에에에에에엥");
      var interval = setInterval(() => {
        this.bgIsWhite = !this.bgIsWhite;
      }, 200);
      setTimeout(() => {
        clearInterval(interval);
        this.bgIsWhite = true;
      }, 3000);
    },

    selectXBtn() {
      this.OXBtnState = false;
      this.sendWarningSignal();
      this.activeSuddenBtn();
    },
    selectOBtn() {
      this.OXBtnState = false;
      this.activeSuddenBtn();
    },
    startSuddenAttack() {
      //분기 나눔
      this.suddenAttackFlag = Math.floor(Math.random() * 3);
    },
    endSuddenAttack(success) {
      if (!success) {
        this.sendWarningSignal();
      }
      this.suddenAttackFlag = -1;
      this.activeSuddenBtn();
    },

    //---------------------돌발 질문,상황 관련 함수 끝-----------------------------
    //면접관실에서 나갈 때
    EERleaveSession() {
      if (this.userType === "superUser") {
        this.$store.commit("lbhModule/SET_APM_DESTINATION", "ERView");
        this.$store.commit("lbhModule/SET_APM_OPEN", true);
      } else {
        if (this.session) this.session.disconnect();

        this.$store.commit("lbhModule/SET_SESSION", undefined);
        this.$store.commit("lbhModule/SET_OV", undefined);
        this.$store.commit("lbhModule/SET_PUBLISHER", undefined);
        this.$store.commit("lbhModule/SET_SUBSCRIBERS", []);
        this.$store.commit("lbhModule/SET_SUPERUSER", {});

        window.removeEventListener("beforeunload", this.EERleaveSession);
      }
    },
    EERtoLBConfirm() {
      if (this.userType === "user") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 로비로 이동합니다."
          )
        ) {
          this.$router.push({ name: "main" });
        }
      } else if (this.userType === "superUser") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 방장 권한 위임 후 로비로 이동합니다."
          )
        ) {
          console.log("권한 위임 모달 실행");
        }
      }
    },
    StudyDestroy() {
      if (
        confirm(
          "정말 면접을 종료하시겠습니까? 면접자는 대기실로 이동하고, 나머지 면접자들은 피드백 완료를 위해 피드백실로 이동합니다."
        )
      ) {
        this.session
          .signal({
            data: "true",
            to: [],
            type: "endInterview",
          })
          .then(() => {
            console.log("erview send signal test");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },

    // Speech API
    startRecognition() {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      let recognition = SpeechRecognition ? new SpeechRecognition() : false;
      recognition.interimResults = true;
      recognition.lang = "ko-KR";
      recognition.continuous = false;

      recognition.start(); // 음성 인식 시작
      console.log("start speech recognition");

      recognition.onresult = function (e) {
        // 음성 인식 결과 반환
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            let script = e.results[i][0].transcript;
            // console.log(script);
            if (script.includes("빵")) {
              alert("빵!");
            } else if (script.includes("감자")) {
              alert("감자!");
            }
          }
        }
      };

      recognition.onend = function () {
        // 음성 인식이 끊겼을 때
        //recognition.stop();
        recognition.start();
      };

      recognition.onerror = function (e) {
        console.log(e);
      };
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
  transition-duration: 0.2s;
  background-color: white;
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

.suddenAttack {
  z-index: 1;
}
.guard {
  position: absolute;
  top: 0%;
  left: 0%;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-color: white;
  opacity: 0;
}
.siren {
  --bgcolor: white;
  position: absolute;
  top: 0%;
  left: 0%;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-color: var(--bgcolor);
}
</style>