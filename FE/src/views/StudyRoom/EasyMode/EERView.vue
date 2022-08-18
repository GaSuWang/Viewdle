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
  <div :style="cssVariable" class="siren" v-if="sirenIsShow"></div>
  <div class="EERView">
    <div class="EERButtonHeader">
      <!-- 면접에서 나가기 버튼(방장 유저) -->
      <div v-if="userType === 'superUser'" class="EERtoWRBtn superUser">
        <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal"  data-bs-backdrop="false"/>
        <!-- <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          data-bs-backdrop="false"
        >
          <i class="bi bi-x-lg"></i>
        </button> -->
      </div>
      <!-- 면접에서 나가기 버튼(일반 유저) -->
      <div v-if="userType === 'user'" class="EERtoWRBtn user" @click="userLeaveSessionFromEER">
        <Button icon="pi pi-times" class="p-button-rounded p-button-secondary"/>
      </div>
      <div class="StudyEnd" v-if="userType == 'superUser'" @click="finishInterview">
        <Button icon="pi pi-check" class="p-button-rounded p-button-secondary"/>
      </div>
    </div>
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

    <div class="EERBottomArea">

      <!-- 돌발질문 카운트 다운 및 OX버튼 시작 -->
      <div v-if="OXBtnState">
        <button @click="selectOBtn">O</button>
        <button @click="selectXBtn">X</button>
      </div>
      <div v-if="isCountDownOn">countdown: {{ countDown }}</div>
      <!-- 돌발질문 카운트 다운 및 OX버튼 끝-->
        <div class="CLOpen">
         <Button @click.prevent="openEECL()" icon="pi pi-times" class="p-button-rounded p-button-secondary">
            <i class="bi bi-file-earmark-text"></i>
          </Button>
        </div>
        <div class="VoiceChangeBtn">
         <Button icon="pi pi-times" class="p-button-rounded p-button-secondary">
            <i class="bi bi-mic-fill"></i>
        </Button>
        </div>

        <div class="SuddenAttackBtn" >
         <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" :disabled="suddenBtnState" @click="sendSuddenQASignal" >
            <i class="bi bi-exclamation-triangle-fill"></i>
          </Button>
          <!-- <button :disabled="suddenBtnState" @click="sendSuddenQASignal">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </button> -->
        </div>
        <div class="CaptureBtn">
         <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" :disabled="suddenBtnState" @click="sendSuddenAttackSignal">
            <i class="bi bi-camera"></i>
          </Button>
          <!-- <button :disabled="suddenBtnState" @click="sendSuddenAttackSignal">
            <i class="bi bi-camera"></i>
          </button> -->
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
      sirenIsShow:false,
      // isEE: false,
      recognition : null,
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      "EE",
      "ERS",
      "isEE",
      "isER",
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
      'studyRoomCL',
      "filters"
    ]),
    ...mapGetters('rhtModule',[
      'CoverLetterDetail',
    ]),
    // nextSuperUserList() {
    //   return this.currentUserList.filter((p) => p.name !== this.myUserName);
    // },
    cssVariable() {
      return {
        "--bgcolor": this.bgIsWhite ? "#D8DBEB" : "tomato",
      };
    },
  },
  unmounted(){
    localStorage['cl'] = {}
    // if(this.userType === 'user'){
    //   this.$store.dispatch('lbhModule/userLeaveSessionAxios')
    // } else { this.$store.dispatch('lbhModule/studyDestroyFirstAxios')}
  },
  created() {
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
    
    this.$store.dispatch('lbhModule/getFilter');
    //방장이 스터디룸을 폭파할 때
    this.session.on('signal:studyDestroy', ()=>{
      if(this.userType === 'user'){
        alert('방장이 스터디를 폭파했습니다.\n대기실로 돌아갑니다.')
        this.$store.dispatch('lbhModule/userLeaveSessionAxios')
      }
    })


    // 내가 면접자인지 아닌지 확인
    //  if (JSON.parse(this.EE.stream.connection.data).clientEmail === this.myUserEmail){
    //   this.isEE = true;
    //  }
    //면접자로 지정된 유저가 자소서를 보낸 것을 받음
    this.session.on("signal:EECL", (e) => {
      // console.log("EECL signal로 받은 데이터", e.data);
      // const cl = JSON.parse(e.data);
      const data = parseInt(e.data)
      console.log("면접관이 받은 유저의 자소서", data);
      this.$store.commit("lbhModule/SET_STUDYROOM_CL",data);
    });

    //일반 유저인 면접자가, 면접 도중에 나간 경우
    this.session.on("signal:EELeaveSessionFromEER", (e) => {
      if(this.isEE) {
      this.recognition.stop();
      this.recognition = null; 
      }
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", e.data);
      const data = JSON.stringify(this.myUserInfo)
      this.session.signal({
        data: `${data}`,
        to: [],
        type: 'WRParticipantListUpdate'
      })
      alert('면접자가 방에서 나갔습니다. 대기실로 이동합니다.')
      this.$store.dispatch('lbhModule/EELeaveSessionAxios')
      this.$router.push({ name: "waiting-room" });
    });

    //일반 유저인 면접관이, 면접 도중에 나간 경우
    this.session.on("signal:ERLeaveSessionFromEER", (e) => {
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", e.data);
    });

    //방장인 면접자가, 면접을 보는 도중에 나갈 경우
    this.session.on("signal:superEELeaveSession", (e) => {
      if(this.isEE) {
      this.recognition.stop();
      this.recognition = null; 
      }
      const pastSuperUserEmail = e.data.split(" ")[0];
      const currentSuperUserEmail = e.data.split(" ")[1];
      this.$store.commit("lbhModule/DELETE_CURRENT_USER_LIST", pastSuperUserEmail);
      this.$store.dispatch('lbhModule/EELeaveSessionAxios')
      if (this.myUserEmail === currentSuperUserEmail) {
        alert("방장이 면접 도중에 나갔습니다.\n다음 방장으로 지목되셨습니다.");
        this.$store.commit("lbhModule/SWITCH_USER_TYPE", "superUser");
        this.$store.commit("lbhModule/ADD_WR_PARTICIPANT_LIST", this.myUserInfo);
        this.$router.push({ name: "waiting-room" });
      } else if (this.myUserEmail !== pastSuperUserEmail) {
        alert("면접자가 방에서 나갔습니다. 대기실로 이동합니다.");
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

    //방장이 면접을 완료할 경우
    this.session.on('signal:finishInterview', () => {
      this.warningCount =0;
      this.removeFilter();
      if(this.isEE) {
      this.recognition.stop();
      this.recognition = null; 
      }
      alert('방장이 면접을 종료했습니다.\n이제 대기실로 이동합니다.')
      //면접자가 대기실로 갈 거이니, 대기실 유저 목록을 업데이트하라는 시그널 보냄
      const data = JSON.stringify(this.myUserInfo)
      this.session.signal({
        data: `${data}`,
        to: [],
        type: 'WRParticipantListUpdate'
      })
      this.$router.push('/waiting-room')
    });  
    // this.nextSuperUser = "";
    window.addEventListener("beforeunload", this.EERleaveSession);
    console.log("eerview created", this.EE);
    console.log("eerview created", this.ERS);
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
      this.session.signal({
          data: '',
          to: [],
          type: 'finishInterview'
        })
        this.$store.dispatch('lbhModule/finishInterviewEERAxios')
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

    // img filter
    this.session.on("signal:imgFilterOn",  (event) => {
      let data = event.data;
      let img = "";
      let offsetX = "";
      let offsetY = "";
      let width = "";
      let height = ""; 
      
      if(data == "potato"){
        img = this.filters[1].imgUrl.toString(); // potato img
        offsetX = "-0.2F";
        offsetY = "-0.45F";
        width = "1.4F";
        height = "1.9";
      }else if (data == "bread"){
        img = this.filters[0].imgUrl.toString(); // bread img
        offsetX = "-0.35F";
        offsetY = "-0.55F";
        width = "1.7F";
        height = "2.0F";
      }else if(data == "bald"){
        img = this.filters[2].imgUrl.toString(); // bald img
        offsetX = "-0.05F";
        offsetY = "-0.7F";
        width = "1.15F";
        height = "0.9F";
      }
      // console.log(img);
      if(this.isER){
        for (let ER of this.ERS) {
          let mail = JSON.parse(ER.stream.connection.data).clientEmail;
            if (mail === this.myUserEmail) {
              if(this.isFiltered){
                clearTimeout(this.timeout); 
                this.removeFilter();
                setTimeout(() => {
                  ER.stream.applyFilter("FaceOverlayFilter")
                  .then(filter => {
                    filter.execMethod(
                      "setOverlayedImage",
                    {
                      "uri": img,
                      "offsetXPercent": offsetX,
                      "offsetYPercent": offsetY,
                      "widthPercent": width,
                      "heightPercent": height
                    });
                    this.isFiltered = true; 
                    console.log("img filter success");
                    this.timeout = setTimeout(this.removeFilter, 20000);
                  });
                }, 1000);
              }else{
                ER.stream.applyFilter("FaceOverlayFilter")
                  .then(filter => {
                    filter.execMethod(
                      "setOverlayedImage",
                    {
                      "uri": img,
                      "offsetXPercent": offsetX,
                      "offsetYPercent": offsetY,
                      "widthPercent": width,
                      "heightPercent": height
                    });
                    this.isFiltered = true; 
                    console.log("img filter success");
                    this.timeout = setTimeout(this.removeFilter, 20000);
                });
              }
            }
        }
      }
    })

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
            data: `${this.myUserEmail}`,
            to: [],
            type: "EELeaveSessionFromEER",
          });
          // if (this.session) {
          //   console.log("플레이모드에서, 일반 면접자가 방을 나감", this.session);
          //   this.session.disconnect();
          //   console.log("this.session.disconnect가 실행됐나?", this.session);
          // } else {
          //   console.log("뭔소리 하는거야? 세션?");
          // }
        } else  {
          this.session.signal({
            data: `${this.myUserEmail}`,
            to: [],
            type: "ERLeaveSessionFromEER",
          });
          // if (this.session) {
          //   console.log("플레이모드에서, 일반 면접자가 방을 나감", this.session);
          //   this.session.disconnect();
          //   console.log("this.session.disconnect가 실행됐나?", this.session);
          // } else {
          //   console.log("뭔소리 하는거야? 세션?");
          // }
        }

        // window.removeEventListener("beforeunload", this.EERleaveSession);

        this.$store.dispatch("lbhModule/userLeaveSessionAxios");
      }
    },
    finishInterview(){
      if(confirm('면접을 종료하시겟습니까?')){
        this.session.signal({
          data: '',
          to: [],
          type: 'finishInterview'
        })
        this.$store.dispatch('lbhModule/finishInterviewEERAxios')
      }
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
      this.sirenIsShow = true;
      var interval = setInterval(() => {
        this.bgIsWhite = !this.bgIsWhite;
      }, 200);
      setTimeout(() => {
        clearInterval(interval);
        this.bgIsWhite = true;
        this.sirenIsShow = false;
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
    // EERleaveSession() {
    //   if (this.userType === "superUser") {
    //     this.$store.commit("lbhModule/SET_APM_DESTINATION", "ERView");
    //     this.$store.commit("lbhModule/SET_APM_OPEN", true);
    //   } else {
    //     if (this.session) this.session.disconnect();

    //     this.$store.commit("lbhModule/SET_SESSION", undefined);
    //     this.$store.commit("lbhModule/SET_OV", undefined);
    //     this.$store.commit("lbhModule/SET_PUBLISHER", undefined);
    //     this.$store.commit("lbhModule/SET_SUBSCRIBERS", []);
    //     this.$store.commit("lbhModule/SET_SUPERUSER", {});

    //     window.removeEventListener("beforeunload", this.EERleaveSession);
    //   }
    // },
    // EERtoLBConfirm() {
    //   if (this.userType === "user") {
    //     if (
    //       confirm(
    //         "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 로비로 이동합니다."
    //       )
    //     ) {
    //       this.$router.push({ name: "main" });
    //     }
    //   } else if (this.userType === "superUser") {
    //     if (
    //       confirm(
    //         "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 방장 권한 위임 후 로비로 이동합니다."
    //       )
    //     ) {
    //       console.log("권한 위임 모달 실행");
    //     }
    //   }
    // },
    // StudyDestroy() {
    //   if (
    //     confirm(
    //       "정말 면접을 종료하시겠습니까? 면접자는 대기실로 이동하고, 나머지 면접자들은 피드백 완료를 위해 피드백실로 이동합니다."
    //     )
    //   ) {
    //     this.session
    //       .signal({
    //         data: "true",
    //         to: [],
    //         type: "endInterview",
    //       })
    //       .then(() => {
    //         console.log("erview send signal test");
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });
    //   }
    // },

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

// Speech API
    startRecognition() {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = SpeechRecognition? new SpeechRecognition() : false
      this.recognition.interimResults = true;
      this.recognition.lang = 'ko-KR';
      this.recognition.continuous = false;
    
      this.recognition.start(); // 음성 인식 시작
      console.log("start speech recognition");

      this.recognition.onresult = (e) => { // 음성 인식 결과 반환
        for(let i = e.resultIndex; i < e.results.length; ++i){
          if(e.results[i].isFinal){ 
            let script = e.results[i][0].transcript;
            // console.log(script);
            if(this.isEE){
              if(script.includes("빵")){
                console.log("빵");
                this.setImgFilterOn("bread");
              }else if(script.includes("감자")){
                console.log("감자");
                this.setImgFilterOn("potato");
              }else if(script.includes("나 안 해")){
                console.log("대머리");
                this.setImgFilterOn("bald");
              }
            } 
          }
        }
      }

      
      this.recognition.onend = () => { // 음성 인식이 끊겼을 때 
        //recognition.stop();
        if(this.recognition) this.recognition.start(); 
      }     

      this.recognition.onerror = (e) => { 
        console.log(e);
      }
    }
  },
};
</script>

<style scoped>
.EERView {
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.EERButtonHeader{
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: space-between;
}

.EERContent {
  position: absolute;
  width: 80%;
  height: 78%;
  border-radius: 10px;
  margin-top: 1%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition-duration: 0.2s;
  /* background-color: white; */
}

.EEVidContainer {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.EEVid {
  /* width: 60%; */
  height: 100%;
  aspect-ratio: 2/1;
  display: flex;
  justify-content: center;
  align-items: center;

}

.ERVidContainer {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  width: 100%;
  height: 30%; 
  /* overflow-x: scroll; */
}

.ERVid {
  width: 100%;
  display: flex;
  justify-content: center;
}

div.EEVidContainer > div > div:nth-child(1){
  margin: 0;
  height: 98%;
}

div.EEVidContainer > div > div.userVideo{
  width: 100%;
  height: 100%;
  margin: 0;
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

.EERBottomArea {
  display: flex;
  justify-content: space-evenly;
  align-items:center;
  width: 100%;
  height: 10%;
  /* border-radius: 20px; */
}

.EERView button{
  background-color: #a7a9b9;
  border: #a7a9b9
}
.EERView button:enabled:hover{
  background-color: #787a89;
  border: #787a89
}

.EERButtonFooter {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
  --bgcolor: #D8DBEB;
  position: absolute;
  top: 0%;
  left: 0%;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--bgcolor);
}
</style>
