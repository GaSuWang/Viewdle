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
          마이크 선택
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">마이크1</a></li>
          <li><a class="dropdown-item" href="#">마이크2</a></li>
          <li><a class="dropdown-item" href="#">마이크3</a></li>
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
          카메라 선택
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">카메라1</a></li>
          <li><a class="dropdown-item" href="#">카메라2</a></li>
          <li><a class="dropdown-item" href="#">카메라3</a></li>
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
      <button class="toLBBtn">
        <div class="toLBBtnDiv">
          <router-link :to="{ name: 'main' }">되돌아가기</router-link>
        </div>
      </button>
      <!-- 유저 마이크 온오프 버튼 -->
      <button class="Mic OnOff">마이크 Off</button>
      <!-- 유저 카메라 온오프 버튼 -->
      <button class="Camera OnOff">카메라 Off</button>

      <!-- 대기실 입장 버튼 -->
      <button class="toWRBtn">
        <div class="toWRBtnDiv">
          <router-link :to="{ name: 'waiting-room' }">대기실 이동</router-link>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "SettingRoomView",
  setup() {
    const micSelect = ref(false);
    const cameraSelect = ref(false);
    const clSelect = ref(false);
    const micOnOff = ref("마이크 Off");
    const cameraOnOff = ref("카메라 Off");
    return {
      micSelect,
      cameraSelect,
      clSelect,
      micOnOff,
      cameraOnOff,
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
  padding: 3%
}

.SettingRoomHeader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10%;
  border-radius: 60px 60px 0 0;
  background-color: lightgrey;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.SettingRoomContent {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 80%;
  background-color: black;
  opacity: 30%;
}

.SettingRoomFooter {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10%;
  border-radius: 0 0 60px 60px;
  background-color: lightgrey;
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
  border-radius: 0.5rem;
}

.toLBBtn:hover,
.toWRBtn:hover,
.toLBBtn:hover a,
.toWRBtn:hover a {
  background-color: black;
  color: white;
}

.toLBBtnDiv > a,
.toWRBtnDiv > a {
  text-decoration: none;
  color: black;
}

/* 돌아가기, 대기실 버튼 애니메이션 */
/* .toLBBtn {
  color: #fff;
  background: none;
  padding: 0;
}

.toLBBtn .toLBBtnDiv {
  top: 0;
  left: 0;
  position: absolute;
  width: 7%;
  aspect-ratio: 5/2;
  background: #e7e7e7;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.1, 0, 0.3, 1);
  display: flext;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.toLBBtn:hover .toLBBtnDiv {
  transform: scale3d(1.2, 1.2, 1);
}

.toLBBtn .toLBBtnDiv::before,
.toLBBtn .toLBBtnDiv::after {
  content: "";
  position: absolute;
  background: #000;
}

.toLBBtn .toLBBtnDiv::before {
  width: 110%;
  height: 0;
  padding-bottom: 110%;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate3d(-50%, -50%, 0) scale3d(0, 0, 1);
}

.toLBBtn:hover .toLBBtnDiv::before {
  transition: transform 0.4s cubic-bezier(0.1, 0, 0.3, 1);
  transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);
}

.toLBBtn .toLBBtnDiv::after {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s;
}

.toLBBtn:hover .toLBBtnDiv::after {
  opacity: 1;
  transition-duration: 0.01s;
  transition-delay: 0.3s;
}

.toLBBtn.toLBBtnDiv a {
  display: block;
  position: relative;
  padding: 1.5rem 3rem;
  mix-blend-mode: difference;
} */
</style>
