// 이병헌
<template>
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
          <video id="myvideo" hidden></video>
          <canvas id="filterCanvas"></canvas>
        </div>
      </div>
    </div>

    <div class="EERRightArea">
      <div class="EERButtonHeader">
        <div class="EERtoLB">
          <button>
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
          <button>``
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
import UserVideo from "@/components/UserVideo.vue";
import { mapGetters } from "vuex";
// import warningStackBar from "@/components/StudyRoom/EasyMode/WarningStackBar.vue"; //경고게이지 주석
import { useRouter } from "vue-router";
import * as facemesh from '@tensorflow-models/facemesh' 
import '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-wasm'

export default {
  name: "EERView",
  components: { UserVideo }, // warningStackBar //경고게이지 주석
  data() {
    return {
      warningCount: 0,
      isFiltered: false,
      // model : null, 
      curFaces : [],
    };
  },
  async created() {
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
        console.log("이제", this.myUserName, "가", this.userType, "이다.");
      } else {
        ("방장바뀜");
      }
    });

    this.session.on("signal:videoFilterOn", (event) => {
      console.log("=====" + event);
      // 면접관 각각에게 넘겨주는 코드 구현할 것
      if (JSON.parse(this.EE.stream.connection.data).clientData !== this.myUserName) {
          this.renderPrediction();
      }
    })

    // 면접자일때만 음성인식 시작
    if (JSON.parse(this.EE.stream.connection.data).clientData === this.myUserName) {
      this.startRecognition();
    }

    // 얼굴 인식 모델
    // if (this.fmesh == null || this.fmesh == undefined) {
    //   this.fmesh = new facemesh({
    //     locateFile: (file) => {
    //       return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    //     },
    //   });
    // }

    // await tf.getBackend();
    // this.model = await facemesh.load({detectionConfidence:0.9, maxFaces:3});
    // console.log(this.model);
    // this.filterCanvas = document.getElementById('filterCanvas');
    // console.log('############################' + this.filterCanvas);
    // let videoWidth = document.getElementById('filtervideo').width;
    // let videoHeight = document.getElementById('filtervideo').height;
    // this.filterCanvas.setAttribute("width", videoWidth);
    // this.filterCanvas.setAttribute("height", videoHeight);
    // this.ctx = this.filterCanvas.getContext('2d');

  },

  async mounted() {
      const video = document.getElementById("myvideo");
      // Find the <video> element in the webpage, 
      // then use the mediaDevices API to request a camera from the user
      const stream = await navigator.mediaDevices.getUserMedia({
        'video': {},
      });
      // Assign our camera to the HTML's video element
      video.srcObject = stream;
      video.play();
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
      "OV",

      //기기
      "CameraSelected",
      "CameraStatus",
      "MicSelected",
      "MicStatus",

    ]),
    nextSuperUserList() {
      return this.currentUserList.filter((p) => p.name !== this.myUserName);
    },
  },

  methods: {
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

    // send video filter signal
    setVideoFilterOn() {
      this.session
        .signal({
          data: "set video filter",
          to: [],
          type: "videoFilterOn",
        })
        .then(() => {
          console.log("success");
        })
        .catch(() => {
          console.log("failed");
        });
    },

    changeOn(){
      console.log('############################### changeOn');
        const filterCanvas = document.getElementById('filterCanvas');
        let im = filterCanvas.captureStream().getVideoTracks()[0];

        this.session.unpublish(this.publisher);
        
        let publisher = this.OV.initPublisher(undefined, {
          audioSource: this.MicSelected, 
          videoSource: im, 
          publishAudio: this.MicStatus, 
          publishVideo: this.CameraStatus, 
        });
        
        this.publisher.subscribeToRemote(true);
        this.session.signal({
          data: 'reconnect',
          to: [],
          type: 'publisherOn'
          })
        this.session.publish(publisher);
    },

    drawFace(face){
      console.log('############################### drawFace');
      const video = document.getElementById('myvideo')
      const filterCanvas = document.getElementById('filterCanvas');
      const ctx = filterCanvas.getContext('2d');

      let mesh = face.scaledMesh;
    
      // Left eye bounds (top, left, bottom, right) are the points (27, 130, 23, 243)
      let lTop = mesh[27][1] - 3;
      let lLeft = mesh[130][0] - 3;
      let lBot = mesh[23][1] + 3;
      let lRig = mesh[243][0] + 3;
      let lWid = lRig-lLeft;
      let lHei = lBot-lTop;
      
      // Right eye bounds (top, left, bottom, right) are the points (257, 463, 253, 359)
      let rTop = mesh[257][1] - 3;
      let rLeft = mesh[463][0] - 3;
      let rBot = mesh[253][1] + 3;
      let rRig = mesh[359][0] + 3;
      let rWid = rRig-rLeft;
      let rHei = rBot-rTop;

      // Draw each eye from the video onto each eye in the canvas, but twice as big
      ctx.drawImage(video, rLeft, rTop, rWid, rHei,
                              (rLeft - rWid*.5) + 30, rTop - rHei*.5, 2*rWid, 2*rHei);
      ctx.drawImage(video, lLeft, lTop, lWid, lHei,
                              (lLeft - lWid*.5) - 30, lTop - lHei*.5, 2*lWid, 2*lHei);


      // We're taking the X coordinates of the upper lip (which we assume are equal with lower lip)
      let Xs = face.annotations.lipsUpperOuter.map(elem => elem[0])
      // And the Y coordinates of the upper and lower lip 
      let TopYs = face.annotations.lipsUpperOuter.map(elem => elem[1])
      let BotYs = face.annotations.lipsLowerOuter.map(elem => elem[1])

      let lipRight = Math.max(...Xs);
      let lipLeft = Math.min(...Xs);
      let lipTop = Math.min(...TopYs);
      let lipBot = Math.max(...BotYs);
      let lipWid = lipRight-lipLeft;
      let lipHei = lipBot-lipTop;
      ctx.drawImage(video, lipLeft, lipTop, lipWid, lipHei,
                              lipLeft - lipWid*.5, lipTop - lipHei*.5, 2*lipWid, 2*lipHei);
      this.changeOn();
    },

    /*drawVideo(){
      const filterCanvas = document.getElementById('filterCanvas');
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, filterCanvas.width, canvas.height);
      for (let face of this.curFaces){
        this.drawFace(face);  
      } 
      // Call self again
      requestAnimationFrame(this.drawVideo)
    }, */

    async renderPrediction() {
      console.log('############################### renderPrediction');
      console.log(this.model);
      const video = document.getElementById('myvideo')
      const filterCanvas = document.getElementById('filterCanvas');
      const ctx = filterCanvas.getContext('2d');

      // await tf.getBackend();
      const model = await facemesh.load({detectionConfidence:0.9, maxFaces:3});
      
      const facepred = await model.estimateFaces(video);
      if (facepred.length > 0) { 
            this.curFaces = facepred;
      }

      console.log(this.curFaces);

      ctx.clearRect(0, 0, filterCanvas.width, filterCanvas.height);

      for (let face of this.curFaces){
        this.drawFace(face);  
      }

    },

    // Speech API
    startRecognition() {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      let recognition = SpeechRecognition? new SpeechRecognition() : false
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
    
      recognition.start(); // start recognition
      console.log("start speech recognition");
      // let thisEE = JSON.parse(this.EE.stream.connection.data).clientData;
      // let thisUserName = this.myUserName;
      recognition.onresult = (e) => {
        for(let i = e.resultIndex; i < e.results.length; ++i){
          if(e.results[i].isFinal){ 
            let script = e.results[i][0].transcript;
            // console.log(script);
            if(script.includes("빵")){
              alert("빵!");
            }else if(script.includes("감자")){
              console.log("감자!");
              this.setVideoFilterOn();
            }
          }
        }
      }
      // recognition.onresult = function(e){ // 음성 인식 결과 반환
      //   for(let i = e.resultIndex; i < e.results.length; ++i){
      //     if(e.results[i].isFinal){ 
      //       let script = e.results[i][0].transcript;
      //       // console.log(script);
      //       if(script.includes("빵")){
      //         alert("빵!");
      //       }else if(script.includes("감자")){
      //         console.log("감자!");
              
      //         // if (JSON.parse(this.EE.stream.connection.data).clientData != this.myUserName) {
      //         //   this.renderPrediction();
      //         //   // this.renderPrediction().then(res => console.log(res));
      //         // }
      //       }
      //     }
      //   }
      // }

      recognition.onend = function(){ // When voice recognition is stopped
        //recognition.stop();
        recognition.start(); 
      }     

      recognition.onerror = function(e) {
        console.log(e);
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
