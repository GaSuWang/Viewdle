// 이병헌
<template>
  <div>
    <AuthorityPassModal />
    <div class="SettingRoomView">
      <!-- 좌단 -->
      <!-- 유저 화면 나오는 곳 -->
      <div class="SRLeftArea">
        <div class="videoContainer">
          <video autoplay ref="userVideo" class="userVideo"></video>
        </div>
      </div>
      <!-- 우단   -->
      <div class="SRRightArea">
        <!-- 드롭다운 메뉴 -->
        <div class="SRDropdownARea">
          <!-- 마이크 선택 드롭다운-->
          <div class="mic dropdown">
            <button id="micLeft" class="btn" type="button" @click="micStatusSwitch">
              <span v-if="micOn">마이크 ON</span>
              <span v-else>마이크 OFF</span>
            </button>
          </div>

          <!-- 카메라 선택 드롭다운 -->
          <div class="camera dropdown">
            <button id="cameraLeft" class="btn" @click="cameraStatusSwitch">
              <span v-if="cameraOn">카메라 ON</span>
              <span v-else>카메라 OFF</span>
            </button>
          </div>

          <!-- 자소서 선택 드롭다운 -->
          <div class="cl dropdown">
            <button id="CLLeft" class="btn">
              
              <span>{{CLSelected.coverLetterTitle}}</span>
            </button>
            <button
              id="CLRight"
              class="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></button>
            <ul class="dropdown-menu" v-if="CLList">
              <li v-for="cl in CLList" :key="cl.coverLetterSeq">
                <p
                  :class="[
                    CLSelected.coverLetterTitle === cl.coverLetterTitle ? 'deviceSelected' : '',
                  ]"
                  @click="selectCL(cl)"
                >
                  {{ cl.coverLetterTitle }}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 하단 -->
        <div class="SRNavBtnArea">
          <!-- 로비 되돌아가기 버튼 -->
          <div class="toLBBtnDiv" v-if="userType === 'user'" @click="userLeaveSessionAxios()">
            <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" />
          </div>
          <div v-if="userType === 'superUser'" class="toLBBtnDiv" @click="studyDestroy">
            <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" />
          </div>
          <!-- 대기실 입장 버튼 -->
          <div class="toWRBtnDiv" @click="SRtoWR">
            <Button icon="pi pi-check" class="p-button-rounded p-button-secondary" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorityPassModal from "@/components/StudyRoom/AuthorityPassModal.vue";
import { mapGetters, useStore } from "vuex";
import { OpenVidu } from "openvidu-browser";

export default {
  name: "SettingRoomView",
  components: {
    AuthorityPassModal,
  },
  unmounted() {},
  created() {
    this.$store.commit("lbhModule/START_ROOM_TIME");
    window.addEventListener("beforeunload", this.forceLeaveSession);
  },
  data() {
    return {
      micOn: false,
      cameraOn: false,
      CLOn: false,
    };
  },
  computed: {
    ...mapGetters("lbhModule", [
      "CameraList",
      "CameraSelected",
      "CameraStatus",
      "MicList",
      "MicSelected",
      "MicStatus",
      "CLList",
      "CLSelected",
      "CLStatus",
      "userType",
      "WRParticipantList",
    ]),
    ...mapGetters("rhtModule", ["CoverLetterList"]),
  },
  mounted() {
         if (this.CoverLetterList.length == 0) {
      this.$store.commit("lbhModule/SET_COVERLETTER_LIST", [
        {
          coverLetterSeq: -1,
          coverLetterTitle: "뷰들뷰들 자기소개서1",
          coverLetterContent: "안녕하세요 뷰들뷰들입니다.",
          coverLetterRegTime: "2222:22:22:22:22:17",
        },
        {
          coverLetterSeq: -2,
          coverLetterTitle: "뷰들뷰들 자기소개서2",
          coverLetterContent: "자기소개서를 등록해주세요.",
          coverLetterRegTime: "2222:22:22:22:22:17",
        },
      ]);
    }
    else{
      this.$store.commit("lbhModule/SET_COVERLETTER_LIST",this.CoverLetterList)
    }
    this.selectCL(this.CLList[0]);
    // console.log(this.CLSelected);
  },
  methods: {
    studyDestroy() {
      this.$store.dispatch("lbhModule/studyDestroyFirstAxios");
    },
    forceLeaveSession() {
      if (this.userType === "user") {
        this.$store.dispatch("lbhModule/userLeaveSessionAxios");
      } else {
        this.$store.dispatch("lbhModule/studyDestroyFirstAxios");
      }
      this.$router.push("/main");
    },
    micStatusSwitch() {
      this.micOn = !this.micOn;
      this.$store.commit("lbhModule/SWITCH_MIC_STATUS", this.micOn);
      this.changeUserVideo();
    },
    cameraStatusSwitch() {
      this.cameraOn = !this.cameraOn;
      this.$store.commit("lbhModule/SWITCH_CAMERA_STATUS", this.cameraOn);
      this.changeUserVideo();
    },
    CLStatusSwitch() {
      this.CLOn = !this.CLOn;
      this.$store.commit("lbhModule/SWITCH_CL_STATUS", this.CLOn);
    },
    selectCL(cl) {
      this.$store.commit("lbhModule/SELECT_CL", cl);
    },
    async selectCamera(camera) {
      this.$store.commit("lbhModule/SELECT_CAMERA", camera);
    },
    selectMic(mic) {
      this.$store.commit("lbhModule/SELECT_MIC", mic);
    },
    userLeaveSessionAxios() {
      this.$store.dispatch("lbhModule/userLeaveSessionAxios");
    },

    SRtoWR() {
      if (
        this.CameraSelected.length === 0 ||
        this.MicSelected.length === 0 ||
        this.CLSelected.length === 0
      ) {
        alert(
          "마이크와 카메라, 자소서를 모두 선택해주셨나요?\n빠진 것은 없는 지 다시 한 번 확인해 주세요!"
        );
      } else if (confirm("대기실로 이동하시겠습니까?")) {
        this.$router.push("waiting-room");
      }
    },
    changeUserVideo() {
      var constraints = { audio: this.MicStatus, video: this.CameraStatus };

      if (!this.MicStatus && !this.CameraStatus) {
        this.$refs.userVideo.style.display = "none";
        this.$refs.userVideo.muted = true;
      } else {
        navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
          this.$refs.userVideo.style.display = "block";
          // console.log("video", this.$refs.userVideo);
          this.$refs.userVideo.srcObject = mediaStream;
          this.$refs.userVideo.muted = false;
        });
      }
    },
  },
  setup() {
    const store = useStore();

    // 디바이스 목록 가져오기
    var OV = new OpenVidu();
    function findDevices() {
      OV.getDevices().then((devices) => {
        var videoDevices = devices.filter((device) => device.kind === "videoinput");
        // console.log("videoDevices는 이거", videoDevices);
        store.dispatch("lbhModule/getCameraList", videoDevices);
        var audioDevices = devices.filter((device) => device.kind === "audioinput");
        // console.log("audioDevices는 이거", audioDevices);
        store.dispatch("lbhModule/getMicList", audioDevices);
      });
    }
    findDevices();
  },
};
</script>

<style scoped>
.SettingRoomView {
  position: absolute;
  width: 90vw;
  min-width: 1000px;
  aspect-ratio: 2/1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(255, 255, 255, 0.5);
  box-shadow: 10px 10px 20px 6px #9ea7b2;
  border-radius: 60px;
  padding: 1.5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.SRLeftArea {
  display: flex;
  width: 70%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.SRRightArea {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
  border-radius: 20px;
  background-color: #fff;
}

.SRDropdownARea {
  align-self: center;
  width: 80%;
}

.dropdown {
  margin-bottom: 10%;
}

.dropdown-menu {
  padding: 0;
}

.dropdown-menu > li > p {
  padding: 1px;
  margin: 5px;
}

#CLLeft {
  border-radius: 30px 0 0 30px;
}
#micRight,
#cameraRight,
#CLRight {
  border-radius: 0 30px 30px 0;
}

.deviceSelected {
  background-color: blue;
  color: white;
}

.SRNavBtnArea {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.btn {
  border-radius: 30px;
}

.toLBBtnDiv button,
.toWRBtnDiv button {
  background-color: #a7a9b9;
  border: #a7a9b9;
}
.toLBBtnDiv button:enabled:hover,
.toWRBtnDiv button:enabled:hover {
  background-color: #787a89;
  border: #787a89;
}

.userVideo {
  width: 100%;
  height: 100%;
}
.videoContainer {
  width: 90%;
  height: 90%;
  background-color: black;
}
</style>
