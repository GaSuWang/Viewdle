// 이병헌
<template>
  <div class="SettingRoomView">
    <!-- 좌단 -->
    <!-- 유저 화면 나오는 곳 -->
    <div class="SRLeftArea">
    </div>
    <!-- 우단   -->
    <div class="SRRightArea">
      <!-- 드롭다운 메뉴 -->
      <div class="SRDropdownARea">
        <!-- 마이크 선택 드롭다운-->
        <p class="MicTitle">마이크 선택</p>
        <div class="mic dropdown">
          <button id="micLeft" class="btn" type="button" @click="micStatusSwitch">
            <span v-if="micOn">마이크 ON</span>
            <span v-else>마이크 OFF</span>
          </button>
          <button id="micRight" type="button" class="btn dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
          </button>
          <ul class="dropdown-menu">
            <li v-for="mic in MicList" :key="mic.deviceId">
              <p :class="[MicSelected===mic ? 'deviceSelected' : '']" @click="selectMic(mic)">{{mic.label}}</p> 
            </li>
          </ul>
        </div>

        <!-- 카메라 선택 드롭다운 -->
        <div class="camera dropdown">
          <p class="CameraTitle">카메라 선택</p>
          <button id="cameraLeft" class="btn" @click="cameraStatusSwitch">
            <span v-if="cameraOn">카메라 ON</span>
            <span v-else>카메라 OFF</span>
          </button>
          <button id="cameraRight"
            class="btn dropdown-toggle dropdown-toggle-split"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false">
          </button>
          <ul class="dropdown-menu">
            <li v-for="camera in CameraList" :key="camera.deviceId">
              <p :class="[CameraSelected===camera ? 'deviceSelected' : '']" @click="selectCamera(camera)">{{camera.label}}</p>
            </li>
          </ul>
        </div>

        <!-- 자소서 선택 드롭다운 -->
        <div class="cl dropdown">
          <p class="cl-dropdown-title">자소서 선택</p>
          <button id="CLLeft" class="btn" @click="CLStatusSwitch">
            <span v-if="CLOn">자소서 ON</span>
            <span v-else>자소서 OFF</span>
          </button>
          <button
            id="CLRight"
            class="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
          </button>
          <ul class="dropdown-menu">
            <li v-for="cl in CLList" :key="cl.coverLetterSeq">
              <p :class="[CLSelected.coverLetterTitle===cl.coverLetterTitle ? 'deviceSelected' : '']" @click="selectCL(cl)">{{cl.coverLetterTitle}}</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- 하단 -->
      <div class="SRNavBtnArea">
        <!-- 로비 되돌아가기 버튼 -->
        <div class="toLBBtnDiv" @click="SRtoLB">
          <button class="toLBBtn">
            <i class="bi bi-backspace"></i>
          </button>
        </div>

        <!-- 대기실 입장 버튼 -->
        <div class="toWRBtnDiv" @click="SRtoWR">
          <button class="toWRBtn">
            <i class="bi bi-check-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, useStore} from 'vuex';
import { OpenVidu } from 'openvidu-browser';

export default {
  name: "SettingRoomView",
  created(){
    // this.$store.dispatch('rhtModule/getCoverLetter')
    // let publisher = this.OV.initPublisher(undefined, {
    //   audioSource: this.MicSelected, 
    //   videoSource: this.CameraSelected, 
    //   publishAudio: this.MicStatus,
    //   publishVideo: this.CameraStatus,
    //   resolution: "640x480", 
    //   frameRate: 30, 
    //   insertMode: "APPEND", 
    //   mirror: false,
    // });

    // this.$store.commit("lbhModule/SET_PUBLISHER", publisher);

    // // --- Publish your stream ---

    // this.session.publish(this.publisher);
    // console.log('오디오 비디오 어떻게 들어왔나',this.publisher.stream)
  },
  data(){
    return{
      micOn: false,
      cameraOn : false,
      CLOn: false,
    }
  },
  computed:{
    ...mapGetters('lbhModule',[
      "CameraList",
      "CameraSelected",
      "CameraStatus",
      "MicList",
      "MicSelected",
      "MicStatus",
      "CLList",
      "CLSelected",
      'CLStatus',
    ]),
    // ...mapGetters('rhtModule',[
    //   "CoverLetterList"
    // ])
  },
  methods:{
    micStatusSwitch() {
      this.micOn = !this.micOn;
      this.$store.commit('lbhModule/SWITCH_MIC_STATUS', this.micOn)
    },
    cameraStatusSwitch() {
      this.cameraOn = !this.cameraOn;
      this.$store.commit('lbhModule/SWITCH_CAMERA_STATUS', this.cameraOn)
    },
    CLStatusSwitch() {
      this.CLOn = !this.CLOn;
      this.$store.commit('lbhModule/SWITCH_CL_STATUS', this.CLOn)
    },
    selectCL(cl){
      this.$store.commit('lbhModule/SELECT_CL', cl)
    },
    selectCamera(camera){
      this.$store.commit('lbhModule/SELECT_CAMERA', camera)
    },
    selectMic(mic){
      this.$store.commit('lbhModule/SELECT_MIC', mic)
    },
    SRtoLB() {
      if (confirm("로비로 되돌아가시겠습니까?")) {
        this.$router.push("main");
      }
    },
    SRtoWR() {
      // if(Object.keys(this.CameraSelected).length === 0 || 
      // Object.keys(this.MicSelected).length === 0 || 
      // Object.keys(this.CLSelected).length === 0){
      if(this.CameraSelected.length === 0 || 
      this.MicSelected.length === 0 || 
      this.CLSelected.length === 0){
        alert('마이크와 카메라, 자소서를 모두 선택해주셨나요?\n빠진 것은 없는 지 다시 한 번 확인해 주세요!')
      } else if (confirm("대기실로 이동하시겠습니까?")) {
        this.$router.push("waiting-room");
      }
    }
  },
  setup() {
    const store = useStore();

    // 디바이스 목록 가져오기
    var OV = new OpenVidu();
    function findDevices(){
      OV.getDevices().then(devices => {
      var videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('videoDevices는 이거', videoDevices)
      store.dispatch('lbhModule/getCameraList', videoDevices)
      var audioDevices = devices.filter(device => device.kind === 'audioinput');
      console.log('audioDevices는 이거', audioDevices)
      store.dispatch('lbhModule/getMicList', audioDevices)
    });
    } 
    findDevices()
  },
};
</script>

<style scoped>
.SettingRoomView {
  position: absolute;
  width: 90vw;
  /* 화면 구성을 위해서 min-width나 min-height를 주는 게 맞는 거 같은데*/
  min-width: 1000px;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 10px 10px 20px 6px #b5b8c0;  
  border-radius: 60px;
  padding: 3%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.SRLeftArea{
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
}
.SRRightArea{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
  border-radius: 20px;
  background-color: #edf0f6;
}

.SRDropdownARea{
  align-self: center;
  width: 80%;
}

.dropdown{
  margin-bottom: 10%;
}

.dropdown-menu{
  padding: 0
}

.dropdown-menu > li > p{
  padding: 1px;
  margin: 5px;
}

#micLeft, #cameraLeft, #CLLeft{
  border-radius: 30px 0 0 30px;
}
#micRight, #cameraRight, #CLRight{
  border-radius: 0 30px 30px 0;
}

.deviceSelected{
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

.SRNavBtnArea > button,
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

.SRNavBtnArea > button:before,
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

.SRNavBtnArea > button:after,
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

.SRNavBtnArea > button:hover,
.toLBBtn:hover,
.toWRBtn:hover {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}
</style>
