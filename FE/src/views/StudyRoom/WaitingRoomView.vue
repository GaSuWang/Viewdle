// 이병헌
<template>
  <div class="WaitingRoomView">
    <!-- 참가자 영상 나오는 부분 -->
    <div class="WRContainer">
      <div class="participantVideo"></div>
      <div class="participantVideo"></div>
      <div class="participantVideo"></div>
      <div class="participantVideo"></div>
      <div class="participantVideo"></div>
    </div>

    <!-- 방장 기능 -->
    <div class="superUser">
      <!-- 면접자 선택 -->
      <button>면접자 선택</button>
      <!-- 스터디 종료 -->
      <button @click="EndStudyConfirm">스터디 종료</button>
    </div>
  </div>
</template>

<script>
// import { useStore } from "vuex";
export default {
  name: "WaitingRoomView",
  setup() {
    // const store = useStore();

    function EndStudyConfirm() {
      if (confirm("정말 스터디를 종료하시겠습니까?")) {
        this.$router.push("/main");
      }
    }
    return {
      EndStudyConfirm,
    };
  },
};
</script>

<style>
.WaitingRoomView {
  position: absolute;
  width: 80vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.superUser {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30%;
  flex-direction: row;
  justify-content: space-between;
}
</style>
