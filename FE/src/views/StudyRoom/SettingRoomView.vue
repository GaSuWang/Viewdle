// 이병헌
<template>
  <div class="SettingRoomView">
    <!-- 상단   -->
    <div class="SettingRoomHeader">
      <!-- 마이크 선택 모달 버튼 -->
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          마이크 
          <span v-show="!MicSelected">선택</span> 
          <span v-show="MicSelected">선택됨</span> 
        </button>
        <ul class="dropdown-menu">
          <li v-for="mic in MicList" :key="mic.deviceId">
            <span @click="selectMic(mic)">{{mic.label}}</span> 
            <!-- <mic-device :mic="mic"></mic-device> -->
          </li>
          
        </ul>
      </div>

      <!-- 카메라 선택 모달 버튼 -->
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          카메라
          <span v-show="!CameraSelected">선택</span> 
          <span v-show="CameraSelected">선택됨</span> 
        </button>
        <ul class="dropdown-menu">
          <li v-for="camera in CameraList" :key="camera.deviceId">
            <span @click="selectCamera(camera)">{{camera.label}}</span>
          <!-- <camera-device :camera="camera"></camera-device> -->
          </li>
        </ul>
      </div>

      <!-- 자소서 선택 모달 버튼 -->
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          자소서 선택
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">자소서1</a></li>
          <li><a class="dropdown-item" href="#">자소서2</a></li>
          <li><a class="dropdown-item" href="#">자소서3</a></li>
        </ul>
      </div>
    </div>

    <!-- 중단 -->
    <div class="SettingRoomContent">
      <!-- 유저 카메라 화면 영상 구역 -->
      <div class="SettingRoomVideo"></div>
    </div>

    <!-- 하단 -->
    <div class="SettingRoomFooter">
      <!-- 로비 되돌아가기 버튼 -->
      <div class="toLBBtnDiv" @click="SRtoLB">
        <button class="toLBBtn">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 유저 마이크 온오프 버튼 -->
      <button class="MicStatus" @click="micStatusSwitch">
        <i v-if="micOn" class="bi bi-mic"></i>
        <i v-else class="bi bi-mic-mute"></i>
      </button>
      <!-- 유저 카메라 온오프 버튼 -->
      <button class="CameraStatus" @click="cameraStatusSwitch">
        <i v-if="cameraOn" class="bi bi-camera-video"></i>
        <i v-else class="bi bi-camera-video-off"></i>
      </button>

      <!-- 대기실 입장 버튼 -->
      <div class="toWRBtnDiv" @click="SRtoWR">
        <button class="toWRBtn">
          <i class="bi bi-check-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import {mapGetters, useStore} from 'vuex';
import { useRouter } from "vue-router";
import { OpenVidu } from 'openvidu-browser';
// import CameraDevice from '@/components/StudyRoom/CameraDevice.vue'
// import MicDevice from '@/components/StudyRoom/MicDevice.vue'
export default {
  name: "SettingRoomView",
  // components:{CameraDevice, MicDevice},
  computed:{
    ...mapGetters('lbhModule',[
      "CameraSelected",
      "MicSelected",
      "CameraStatus",
      "MicStatus",
      
    ])
  },
  methods:{
    selectCamera(camera){
      this.$store.commit('lbhModule/SET_CAMERA', camera)
    },
    selectMic(mic){
      this.$store.commit('lbhModule/SET_MIC', mic)
    },
  },
  setup() {
    const store = useStore();

    // 디바이스 목록 가져오기
    var OV = new OpenVidu();
    function findDevices(){
      OV.getDevices().then(devices => {
      var videoDevices = devices.filter(device => device.kind === 'videoinput');
      store.dispatch('lbhModule/getCameraList', videoDevices)
      var audioDevices = devices.filter(device => device.kind === 'audioinput');
      store.dispatch('lbhModule/getMicList', audioDevices)
    });
    } 
    findDevices()

    const CameraList = computed(()=>store.getters['lbhModule/CameraList'])
    const MicList = computed(()=>store.getters['lbhModule/MicList'])

    const router = useRouter();
    const micSelect = ref(false);
    const cameraSelect = ref(false);
    const clSelect = ref(false);
    let micOn = ref(false);
    let cameraOn = ref(false);
    function SRtoLB() {
      if (confirm("로비로 되돌아가시겠습니까?")) {
        router.push("main");
      }
    }
    function SRtoWR() {
      if (confirm("대기실로 이동하시겠습니까?")) {
        router.push("waiting-room");
      }
    }
    function micStatusSwitch() {
      micOn.value = !micOn.value;
      this.$store.commit('lbhModule/SWITCH_MIC_STATUS', micOn.value)
    }
    function cameraStatusSwitch() {
      cameraOn.value = !cameraOn.value;
      this.$store.commit('lbhModule/SWITCH_CAMERA_STATUS', cameraOn.value)
    }
    return {
      CameraList,
      MicList,
      micSelect,
      cameraSelect,
      clSelect,
      micOn,
      cameraOn,
      SRtoLB,
      SRtoWR,
      micStatusSwitch,
      cameraStatusSwitch,
    };
  },
};
</script>

<style scoped>
.Modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}

.SettingRoomView {
  position: absolute;
  width: 90vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 3%;
}

.SettingRoomHeader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10%;
  border-radius: 60px 60px 0 0;
  background-color: #858a98;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.SettingRoomHeader > li {
  padding: 0;
  border-bottom: 5px rgb(210, 210, 210) solid;
}

.SettingRoomContent {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 80%;
  background-color: #B5BAC9;
}

.SettingRoomFooter {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10%;
  border-radius: 0 0 60px 60px;
  background-color: #858a98;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.btn {
  border-radius: 30px;
}

.SettingRoomHeader > button,
.SettingRoomFooter > button,
.toLBBtn,
.toWRBtn {
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
.SettingRoomHeader > button:before,
.SettingRoomFooter > button:before,
.toLBBtn:before,
.toWRBtn:before {
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
.SettingRoomHeader > button:after,
.SettingRoomFooter > button:after,
.toLBBtn:after,
.toWRBtn:after {
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
.SettingRoomHeader > button:hover,
.SettingRoomFooter > button:hover,
.toLBBtn:hover,
.toWRBtn:hover {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}
</style>
