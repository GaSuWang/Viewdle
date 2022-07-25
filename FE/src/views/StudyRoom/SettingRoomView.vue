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
  <div class="SettingRoomVideo"></div>

  <!-- 하단 -->
  <div class="SettingRoomFooter">
    <!-- 로비 되돌아가기 버튼 -->
    <router-link :to="{name: MainView}">되돌아가기</router-link>
    <!-- 유저 마이크 온오프 버튼 -->
    <button class="Mic OnOff">마이크 Off</button>
    <!-- 유저 카메라 온오프 버튼 -->
    <button class="Camera OnOff">카메라 Off</button>

    <!-- 대기실 입장 버튼 -->
    <router-link :to="{name: WaitingRoomView}">대기실 이동</router-link>
  </div>


  </div>  
</template>

<script>
export default {
 name:"SettingRoomView",
}
</script>

<style>

</style>