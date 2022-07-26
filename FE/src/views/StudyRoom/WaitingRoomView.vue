// 이병헌
<template>
  <div class="WaitingRoomView">
    <!-- 참가자 영상 나오는 부분 -->
    <div class="WRContainer">
      <div class="participantVideo">1</div>
      <div class="participantVideo">2</div>
      <div class="participantVideo">3</div>
      <div class="participantVideo">4</div>
      <div class="participantVideo">5</div>
    </div>

    <!-- 방장 기능 -->
    <div class="superUser">
      <!-- 면접자 선택 -->
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          면접자 선택
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">자소서1</a></li>
          <li><a class="dropdown-item" href="#">자소서2</a></li>
          <li><a class="dropdown-item" href="#">자소서3</a></li>
        </ul>
        <!-- 스터디 종료 -->
        <button class="btn btn-secondary" @click="EndStudyConfirm">
          스터디 종료
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import { ref } from "vue";
// import { useStore } from "vuex";
// import { OpenVidu } from 'openvidu-browser';
export default {
  name: "WaitingRoomView",
  setup() {
    // const store = useStore();
    // const userList = ref(state.lbhModuel.participantList)
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

<style scoped>
.WaitingRoomView {
  position: absolute;
  width: 80vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: lightgrey;
  border-radius: 60px;
  padding: 5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.WRContainer {
  width: 65%;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.participantVideo {
  width: 30%;
  background: darkgrey;
}

.superUser {
  width: 20%;
  margin: 0;
  flex-direction: row;
  justify-content: space-between;
}
</style>
