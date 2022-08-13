// 이병헌
<template>
  <AuthorityPassModal />
  <div class="EERView">
    <!-- 영상 구역 -->
    <div :style="cssVariable" class="EERContent">
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
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-backdrop="false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
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
          <button @click="removeImgFilter">
            <i class="bi bi-check-lg"></i>
          </button>
        </div>
        <div class="SuddenAttackBtn">
          <button :disabled="suddenBtnState" @click="sendSuddenQASignal">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </button>
        </div>
        <div class="CaptureBtn">
          <button @click="removeFilter">
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
import { useRouter } from "vue-router";

export default {
  name: "EERView",
  components: { UserVideo, AuthorityPassModal }, // warningStackBar //경고게이지 주석
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
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      "EE",
      "ERS",
      "myUserName",
      "mySessionId",
      "userType",
      "publisher",
      "subscribers",
      "SessionToken",
      "session",
      "currentUserList",
    ]),
    nextSuperUserList() {
      return this.currentUserList.filter((p) => p.name !== this.myUserName);
    },
    cssVariable() {
      return {
        "--bgcolor": this.bgIsWhite ? "white" : "tomato",
      };
    },
  },
  created() {
    //일반 유저인 면접자가, 면접 도중에 나간 경우
    this.session.on("signal:EELeaveSessionFromEER", (e) => {
      alert("면접자가 면접 도중에 나갔습니다.\n남은 참가자들 모두 대기실로 이동합니다.");
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", e.data);
      this.$store.commit("lbhModule/SET_EE", []);
      this.$store.commit("lbhModule/EMPTY_ERS");
      this.$router.push({ name: "waiting-room" });
    });

    //일반 유저인 면접관이, 면접 도중에 나간 경우
    this.session.on("signal:ERLeaveSession", (e) => {
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", e.data);
    });

    //방장인 면접자가, 면접을 보는 도중에 나갈 경우
    this.session.on("signal:superEELeaveSession", (e) => {
      const pastSuperUserName = e.data.split(" ")[0];
      const currentSuperUserName = e.data.split(" ")[1];
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", pastSuperUserName);
      if (this.myUserName === currentSuperUserName) {
        alert("방장이 면접을 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.");
        this.$store.commit("lbhModule/SWITCH_USER_TYPE_TEMP");
        this.$store.commit("lbhModule/SET_EE", []);
        this.$store.commit("lbhModule/EMPTY_ERS");
        this.$router.push({ name: "waiting-room" });
      } else if (this.session) {
        alert("면접자가 방에서 나갔습니다. 대기실로 이동합니다.");
        this.$store.commit("lbhModule/SET_EE", []);
        this.$store.commit("lbhModule/EMPTY_ERS");
        this.$router.push({ name: "waiting-room" });
      }
    });

    //방장인 면접관이, 면접을 보는 도중에 나갈 경우
    this.session.on("signal:superERLeaveSession", (e) => {
      const pastSuperUserName = e.data.split(" ")[0];
      const currentSuperUserName = e.data.split(" ")[1];
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", pastSuperUserName);
      if (this.myUserName === currentSuperUserName) {
        alert("방장이 면접을 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.");
        this.$store.commit("lbhModule/SWITCH_USER_TYPE_TEMP");
      }
    });

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
            //이미 설정된 필터가 있으면
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
              //설정된 필터가 없으면
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
    //----------------돌발 질문 시작-----------------------
    this.session.on("signal:suddenQA", () => {
      console.log("receive suddenQA signal");
      var name = JSON.parse(this.EE.stream.connection.data).clientData;
      if (name === this.myUserName) {
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
      var name = JSON.parse(this.EE.stream.connection.data).clientData;
      if (name !== this.myUserName) {
        this.suddenBtnState = false;
      }
    });
    //----------------돌발 질문 끝-----------------------
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

    // 면접자일때만 음성인식 시작
    if (JSON.parse(this.EE.stream.connection.data).clientData === this.myUserName) {
      this.startRecognition();
    }

    // img filter
    this.session.on("signal:imgFilterOn", (event) => {
      let data = event.data;
      let img = "";
      let offsetX = "";
      let offsetY = "";
      let width = "";
      let height = "";
      console.log(data);

      if (data == "potato") {
        img =
          "https://firebasestorage.googleapis.com/v0/b/viewdle-b6bf5.appspot.com/o/filter%2Fpotato_shape.png?alt=media&token=2426c722-cdb2-48af-8982-f17a16bd9e5e"; // potato img => 지금은 모자임
        offsetX = "-0.2F";
        offsetY = "-0.45F";
        width = "1.4F";
        height = "1.9";
      } else if (data == "bread") {
        img =
          "https://firebasestorage.googleapis.com/v0/b/viewdle-b6bf5.appspot.com/o/filter%2Fbread_shape.png?alt=media&token=5fe3699b-17e1-4086-9cd1-53fa59cce6c9"; // bread img
        offsetX = "-0.35F";
        offsetY = "-0.55F";
        width = "1.7F";
        height = "2.0F";
      } else if (data == "bald") {
        img =
          "https://firebasestorage.googleapis.com/v0/b/viewdle-b6bf5.appspot.com/o/filter%2Fbald_remove.png?alt=media&token=5b340aed-24b0-4f9a-93aa-3abfa2b1b736"; // bald img
        offsetX = "-0.05F";
        offsetY = "-0.7F";
        width = "1.15F";
        height = "0.9F";
      }
      if (JSON.parse(this.EE.stream.connection.data).clientData !== this.myUserName) {
        for (let ER of this.ERS) {
          let name = JSON.parse(ER.stream.connection.data).clientData;
          if (name === this.myUserName) {
            ER.stream.applyFilter("FaceOverlayFilter").then((filter) => {
              filter.execMethod("setOverlayedImage", {
                uri: img,
                offsetXPercent: offsetX,
                offsetYPercent: offsetY,
                widthPercent: width,
                heightPercent: height,
              });
              console.log("img filter success");
            });
          }
        }
      }
    });
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
        } else if (this.isER) {
          this.session.signal({
            data: `${this.myUserName}`,
            to: [],
            type: "ERLeaveSessionFromEER",
          });
        }
        if (this.session) this.session.disconnect();

        this.$store.commit("lbhModule/SET_SESSION", undefined);
        this.$store.commit("lbhModule/SET_OV", undefined);
        this.$store.commit("lbhModule/SET_PUBLISHER", undefined);
        this.$store.commit("lbhModule/SET_SUBSCRIBERS", []);
        this.$store.commit("lbhModule/SET_SUPERUSER", {});

        window.removeEventListener("beforeunload", this.EERleaveSession);

        this.$router.push("/main");
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
          console.log("1번관문");
          if (name === this.myUserName) {
            console.log("2번관문");
            ER.stream
              .removeFilter()
              .then(() => {
                console.log("remove filter");
              })
              .catch((e) => {
                console.log("remove filter error", e);
              });
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

    //돌발상황, 돌발질문 버튼 비활성화
    disabledSuddenBtn() {
      console.log("돌발질문 비활성화");
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

    //---------------------돌발 질문 관련 함수 끝-----------------------------
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

    // send img filter : potato or bread or bald
    setImgFilterOn(filter) {
      this.session
        .signal({
          data: filter,
          to: [],
          type: "imgFilterOn",
        })
        .then(() => {
          console.log("success");
        })
        .catch(() => {
          console.log("failed");
        });
    },

    removeImgFilter() {
      // if (this.isFiltered) {
      for (let ER of this.ERS) {
        let name = JSON.parse(ER.stream.connection.data).clientData;
        if (name === this.myUserName) {
          ER.stream.applyFilter("FaceOverlayFilter").then((filter) => {
            filter.execMethod("unsetOverlayedImage");
            console.log("img filter remove");
          });
        }
      }
      // }
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

      recognition.onresult = (e) => {
        // 음성 인식 결과 반환
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            let script = e.results[i][0].transcript;
            // console.log(script);
            if (script.includes("빵")) {
              console.log("빵");
              this.setImgFilterOn("bread");
            } else if (script.includes("감자")) {
              console.log("감자");
              this.setImgFilterOn("potato");
            } else if (script.includes("나 안 해")) {
              console.log("대머리");
              this.setImgFilterOn("bald");
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

    timer() {},
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
  --bgcolor: white;
  width: 80%;
  height: 100%;
  /* opacity: 50%; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition-duration: 0.2s;
  background-color: var(--bgcolor);
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
