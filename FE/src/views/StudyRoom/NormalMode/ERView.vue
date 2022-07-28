// 이병헌
<template>
  <div class="ERView">
    <!-- 영상 구역  -->
    <div class="ERContainer">
      <!-- 면접자 영상 구역 -->
      <div class="EEVidContainer"></div>
      <!-- 면접관 영상 구역 -->
      <div class="ERVidContainer"></div>
    </div>

    <!-- 유저 기능 구역 -->
    <div class="ERRightArea">
      <!-- 상단 -->
      <div class="ERButtonHeader">
        <!-- 면접자 자소서 페이지 열기 버튼 -->
        <div class="CLOpen">
          <button @click.prevent="openEECL()">자</button>
        </div>
        <!-- 질문 팁 모달 열기 버튼 -->
        <div class="QTip">
          <button @click="openQTip">면</button>
        </div>
      </div>

      <!-- 중단 -->
      <!-- 피드백 구역 -->
      <feedback-area></feedback-area>

      <!-- 하단 -->
      <div class="ERButtonFooter">
        <!-- 면접 종료 버튼(방장 유저) -->
        <div class="StudyDestroyBtn" v-show="userType === 'superUser'">
          <button>면접 완료</button>
        </div>
        <!-- 면접에서 나가기 버튼(일반 유저) -->
        <div v-show="userType === 'user'" class="ERtoLBbtn user">
          <button @click.prevent="ERtoLBConfirm(userType)">X</button>
        </div>
        <!-- 면접에서 나가기 버튼(방장 유저) -->
        <div v-show="userType === 'superUser'" class="ERtoLBbtn superUser">
          <button @click.prevent="ERtoLBConfirm(userType)">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import { useRouter } from "vue-router";
import { ref } from "vue";
import FeedbackArea from "@/components/StudyRoom/NormalMode/FeedbackArea.vue";
export default {
  name: "ERView",
  components: { FeedbackArea },
  methods: {
    openEECL() {
      let route = this.$router.resolve({ path: "/eecl" });
      window.open(route.href);
    },
    openQTip() {
      swal.fire({
        title: "면접관 질문 팁!",
        text: "와! 정말 유용한 팁들이에요~",
        icon: "info",
        cancelButtonText: "질문 팁 닫기",
        position: "top-end",
      });
    },
  },
  setup() {
    const router = useRouter();

    const userType = ref("user"); //유저가 일반유저인지, 방장유저인지를 담고 있는 데이터를 여기에 넣어야, 지금은 임시
    function ERtoLBConfirm(userType) {
      if (userType === "user") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 로비로 이동합니다."
          )
        ) {
          router.push({ name: "main" });
        }
      } else if (userType === "superUser") {
        if (
          confirm(
            "정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 방장 권한 위임 후 로비로 이동합니다."
          )
        ) {
          // 권한위임 모달 실행
        }
      }
    }
    return {
      userType,
      ERtoLBConfirm,
    };
  },
};
</script>

<style scoped>
.ERView {
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

.ERRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20%;
}

.ERButtonHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.ERButtonFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* 면접자 페이지 버튼들 시작*/
/* 굿/뱃 버튼은 FeedbackArea에 있음 */
.CLOpen > button,
.QTip > button,
.StudyDestroyBtn > button,
.ERtoLBbtn > button {
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

.CLOpen > button:before ,
.QTip > button:before ,
.StudyDestroyBtn > button:before ,
.ERtoLBbtn > button:before {
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

.CLOpen > button:after ,
.QTip > button:after ,
.StudyDestroyBtn > button:after,
.ERtoLBbtn > button:after {
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
.QTip > button:hover,
.StudyDestroyBtn > button:hover,
.ERtoLBbtn > button:hover {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}
/* 면접자 페이지 버튼들 끝*/


.swal-overlay {
  background-color: black;
}
</style>
