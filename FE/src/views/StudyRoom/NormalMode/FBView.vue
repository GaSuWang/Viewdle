// 이병헌
//피드백실 - 면접관 (Feedback Room VIew => FBView)

<template>
  <div class="FeedbackView">
    <!-- 좌단 -->
    <!-- 면접자 영상 -->
    <saved-video></saved-video>
    <!-- 우단 -->
    <div class="FBRightArea">
      <div class="FBButtonHeader">
        <!-- 면접자 자소서 페이지 열기 버튼 -->
        <div class="CLOpen">
          <button @click="openEECL">
            <i class="bi bi-file-earmark-text"></i>
          </button>
        </div>
        <!-- 면접에서 나가기 버튼(일반 유저) -->
        <div class="FBtoLBbtn user" v-show="userType === 'user'">
          <button @click.prevent="FBtoLBConfirm(userType)">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <!-- 면접에서 나가기 버튼(방장 유저) -->
        <div class="FBtoLBbtn superUser" v-show="userType === 'superUser'">
          <button @click.prevent="FBtoLBConfirm(userType)">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- 피드백 구역 -->
      <feedback-area :videoInfo="videoInfo"></feedback-area>

      <div class="FBButtonFooter">
        <!-- 면접 종료 버튼(방장 유저) -->
        <div class="FBCompleteBtn">
          <button @click="FBComplete">
            <i class="bi bi-check-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeedbackArea from "@/components/StudyRoom/NormalMode/FeedbackArea.vue";
import SavedVideo from "@/components/StudyRoom/SavedVideo.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  name: "FeedbackView",
  components: { FeedbackArea, SavedVideo },
  methods: {
    openEECL() {
      let route = this.$router.resolve({ path: "/eecl" });
      window.open(route.href);
    },
  },
  setup() {
    const videoInfo = {}; //해당 session의 면접자 영상 정보를 가져와야 함
    const router = useRouter();
    const userType = ref("user");
    function FBComplete() {
      if (
        confirm("피드백을 이대로 제출하시겠습니까? 이후에 대기실로 이동합니다.")
      ) {
        router.push("waiting-room");
      }
    }
    function FBtoLBConfirm(userType) {
      if (userType === "user") {
        if (
          confirm(
            "정말 피드백 수정 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 로비로 이동합니다."
          )
        ) {
          router.push({ name: "main" });
        }
      } else if (userType === "superUser") {
        if (
          confirm(
            "정말 피드백 수정 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 방장 권한 위임 후 로비로 이동합니다."
          )
        ) {
          // 권한위임 모달 실행
        }
      }
    }
    return {
      userType,
      videoInfo,
      FBComplete,
      FBtoLBConfirm,
    };
  },
};
</script>

<style scoped>
.FeedbackView {
  position: absolute;
  width: 90vw;
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

.FBRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  border-radius: 20px;
  background-color: #edf0f6;
  width: 30%;
}

.FBButtonHeader {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

/* 버튼 시작*/
.CLOpen > button,
.FBtoLBbtn > button,
.FBCompleteBtn > button {
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
.CLOpen > button:before,
.FBtoLBbtn > button:before,
.FBCompleteBtn > button:before {
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
.CLOpen > button:after,
.FBtoLBbtn > button:after,
.FBCompleteBtn > button:after {
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
.CLOpen > button:hover,
.FBtoLBbtn > button:hover,
.FBCompleteBtn > button:hover {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}
/* 버튼 끝*/

.FBButtonFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
