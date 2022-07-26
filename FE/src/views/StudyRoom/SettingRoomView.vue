// 이병헌
<template>
  <div class="SettingRoomView">
    <!-- 상단   -->
    <div class="SettingRoomHeader">
      <!-- 마이크 선택 모달 버튼 -->
      <button class="Mic Select Modal">마이크 선택</button>
      <!-- 카메라 선택 모달 버튼 -->
      <button class="Camera Select Modal">카메라 선택</button>
      <!-- 자소서 선택 모달 버튼 -->
      <button class="CL Select Modal">자소서 선택</button>
    </div>

    <!-- 중단 -->
    <!-- 유저 카메라 화면 영상 구역 -->
    <div class="SettingRoomContent">
      <div class="SettingRoomVideo"></div>
    </div>

    <!-- 하단 -->
    <div class="SettingRoomFooter">
      <!-- 로비 되돌아가기 버튼 -->
      <button>
        <router-link :to="{ name: MainView }">되돌아가기</router-link>
      </button>
      <!-- 유저 마이크 온오프 버튼 -->
      <button class="Mic OnOff">마이크 Off</button>
      <!-- 유저 카메라 온오프 버튼 -->
      <button class="Camera OnOff">카메라 Off</button>

      <!-- 대기실 입장 버튼 -->
      <button>
        <router-link :to="{ name: WaitingRoomView }">대기실 이동</router-link>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingRoomView",
};
</script>

<style>
.SettingRoomView {
  position: absolute;
  width: 80vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.SettingRoomHeader > button {
  border: none;
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

.SettingRoomFooter > button {
  border: none;
}

.SettingRoomFooter > button> a {
  text-decoration: none;
  
}
</style>
