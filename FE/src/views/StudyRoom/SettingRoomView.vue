// 이병헌
<template>
<div>
  <AuthorityPassModal/>
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
          <ul class="dropdown-menu" v-if="CoverLetterList">
            <li v-for="cl in CoverLetterList" :key="cl.coverLetterSeq">
              <p :class="[CLSelected.coverLetterTitle===cl.coverLetterTitle ? 'deviceSelected' : '']" @click="selectCL(cl)">{{cl.coverLetterTitle}}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 하단 -->
      <!-- 임현탁 방에서 나가기 건들이는중 -->
      <div class="SRNavBtnArea">

        <!-- 로비 되돌아가기 버튼 -->
        <!-- <div class="toLBBtnDiv" @click="SRtoLB"> -->
        <div class="toLBBtnDiv" v-if="userType === 'user'" @click="userLeaveSessionAxios()">
          <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" />
          <!-- <button class="toLBBtn">
            <i class="bi bi-backspace"></i>
          </button> -->
        </div>
        <div v-if="userType === 'superUser'" class="toLBBtnDiv" @click="studyDestroy">
          <Button icon="pi pi-times" class="p-button-rounded p-button-secondary" />
          <!-- <button type="button" class="toLBBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-backdrop="false">
              <i class="bi bi-x-lg"></i>
          </button> -->
        </div>
      <!-- 임현탁 여기까지 건들임 -->
        <!-- 대기실 입장 버튼 -->
        <div class="toWRBtnDiv" @click="SRtoWR">
          <Button icon="pi pi-check" class="p-button-rounded p-button-secondary" />
          <!-- <button class="toWRBtn">
            <i class="bi bi-check-lg"></i>
          </button> -->
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import AuthorityPassModal from "@/components/StudyRoom/AuthorityPassModal.vue"
import {mapGetters, useStore} from 'vuex';
import { OpenVidu } from 'openvidu-browser';

export default {
  name: "SettingRoomView",
  components:{
    AuthorityPassModal
  },
  unmounsted(){
    if(this.userType === 'user'){
      this.$store.dispatch('lbhModule/userLeaveSessionAxios')
    } else { this.$store.dispatch('lbhModule/studyDestroyFirstAxios')}
  },
  created(){
    console.log(this.CLList)
    console.log('userinfo', this.$store.getters['rhtModule/UserList'])
    this.$store.dispatch('rhtModule/getCoverLetter')

    window.addEventListener('beforeunload', this.forceLeaveSession)

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
      'userType',
      'WRParticipantList',
    ]),
    ...mapGetters('rhtModule',[
      'CoverLetterList',
    ])
  },
  methods:{
    studyDestroy(){
      this.$store.dispatch('lbhModule/studyDestroyFirstAxios')
    },
    async forceLeaveSession() {
      if(this.userType === 'user'){
        this.$store.dispatch('lbhModule/userLeaveSessionAxios')
      } else {
        await this.$store.dispatch('lbhModule/studyDestroyFirstAxios')
        this.$store.dispatch('lbhModule/studyDestorySecondAxios')
      }
    },
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
    // 임현탁  방나가기를 위한 작업
    // SRtoLB() {
    //   if (confirm("로비로 되돌아가시겠습니까?")) {
    //     this.$router.push("main");
    //   }
    // },
    userLeaveSessionAxios(){
      this.$store.dispatch('lbhModule/userLeaveSessionAxios')
    },

    // 임현탁 작업 끝 
    
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
  aspect-ratio: 2/1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(255,255,255,0.5);
  box-shadow: 10px 10px 20px 6px #9ea7b2;  
  border-radius: 60px;
  padding: 1.5%;
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
  background-color: #fff;
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

.toLBBtnDiv button, 
.toWRBtnDiv button{
  background-color: #a7a9b9;
  border: #a7a9b9
}
.toLBBtnDiv button:enabled:hover, 
.toWRBtnDiv button:enabled:hover{
  background-color: #787a89;
  border: #787a89
}

/* .SettingRoomView button{
  background-color: #787a89;
  border: #787a89
}  */
/* .SettingRoomView button:enabled:hover{
  background-color: #787a89;
  border: #787a89
}  */
</style>
