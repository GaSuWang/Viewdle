// 이병헌
<template>
  <div class="EEView">
    <!-- 영상 구역  -->
    <!-- 면접관 영상 구역 -->
    <div class="EELeft">
      <div class="EEContainer">
        <div class="participantVideo">1</div>
        <div class="participantVideo">2</div>
        <div class="participantVideo">3</div>
        <div class="participantVideo">4</div>
      </div>
    </div>
    <!-- 유저 기능 구역 -->
    <!-- 상단  -->

    <!-- 하단 -->
    <div class="EERight">
      <!-- 면접에서 나가기 버튼(일반 유저) -->
      <div v-show="userType === 'user'" class="EEtoLBbtn user">
        <button @click.prevent="EEtoLBConfirm(userType)">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 면접에서 나가기 버튼(방장 유저) -->
      <div v-show="userType === 'superUser'" class="EEtoLBbtn superUser">
        <button @click.prevent="EEtoLBConfirm(userType)">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <!-- 면접 완료 버튼(방장 유저) -->
      <div v-show="userType === 'superUser'" class="EndStudyBtn superUser">
        <button @click.prevent="EndStudyConfirm()">
          <i class="bi bi-check-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "EEView",
  setup() {
    const router = useRouter();
    const userType = ref("superUser"); //유저가 일반유저인지, 방장유저인지를 담고 있는 데이터를 여기에 넣어야, 지금은 임시
    function EEtoLBConfirm(userType) {
      if (userType === "user") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 면접영상이 저장되지 않고 대기실로 이동합니다."
          )
        ) {
          router.push("main");
        }
      } else if (userType === "superUser") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 면접영상이 저장되지 않고 대기실로 이동합니다."
          )
        ) {
          // 권한위임 모달 실행
        }
      }
    }
    function EndStudyConfirm() {
      if (
        confirm(
          "면접 과정을 종료하시겠습니까? 면접자는 대기실로, 면접관은 피드백 수정실로 이동합니다. "
        )
      ) {
        router.push("waiting-room");
      }
    }
    return {
      userType,
      EEtoLBConfirm,
      EndStudyConfirm,
    };
  },
};
</script>

<style scoped>
.EEView {
  position: absolute;
  width: 90vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: lightgrey;
  border-radius: 60px;
  padding: 3%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.EELeft {
  width: 65%;
  margin: 0;
}

.EEContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.participantVideo {
  width: 40%;
  background: darkgrey;
}

.EERight {
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

/* 버튼양식 */
.EndStudyBtn > button,
.EEtoLBbtn > button {
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
.EndStudyBtn > button:before,
.EEtoLBbtn > button:before {
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
.EndStudyBtn > button:after,
.EEtoLBbtn > button:after {
  content: "";
  display: block;
  background: rgb(255, 255, 255);
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
.EndStudyBtn > button:after,
.EEtoLBbtn > button:after {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}
/* 버튼양식 */
</style>
