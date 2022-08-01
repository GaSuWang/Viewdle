// 이병헌
//면접실(일반 모드)에서 면접관이 보는 페이지 (Interviewee Room VIew => EEView)

<template>
  <div class="ERView">
    <!-- 영상 구역  -->
    <div class="ERLeftArea">
      <!-- 면접자 영상 구역 -->
      <div class="EEVidContainer">
        <div class="EEVid"></div>
      </div>
      <!-- 면접관 영상 구역 -->
      <div class="ERVidContainer">
        <div class="ERVid"></div>
        <div class="ERVid"></div>
        <div class="ERVid"></div>
        <div class="ERVid"></div>
      </div>
    </div>

    <!-- 유저 기능 구역 -->
    <div class="ERRightArea">
      <!-- 상단 -->
      <div class="ERButtonHeader">
        <!-- 면접자 자소서 페이지 열기 버튼 -->
        <div class="CLOpen">
          <button @click.prevent="openEECL()">
            <i class="bi bi-file-earmark-text"></i>
          </button>
        </div>
        <!-- 질문 팁 모달 열기 버튼 -->
        <div class="QTip">
          <button @click="openQTip">
            <i class="bi bi-lightbulb-fill"></i>
          </button>
        </div>
        <!-- 면접에서 나가기 버튼(일반 유저) -->
        <div v-show="userType === 'user'" class="ERtoLBbtn user">
          <button @click.prevent="ERtoLBConfirm(userType)">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <!-- 면접에서 나가기 버튼(방장 유저) -->
        <div v-show="userType === 'superUser'" class="ERtoLBbtn superUser">
          <button @click.prevent="ERtoLBConfirm(userType)">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- 중단 -->
      <!-- 피드백 구역 -->
      <feedback-area></feedback-area>

      <!-- 하단 -->
      <div class="ERButtonFooter">
        <!-- 면접 완료 버튼(방장 유저) -->
        <div class="StudyDestroyBtn" @click="StudyDestroy" v-show="userType === 'superUser'">
          <button>
            <i class="bi bi-check-lg"></i>
          </button>
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

    const userType = ref("superUser"); //유저가 일반유저인지, 방장유저인지를 담고 있는 데이터를 여기에 넣어야, 지금은 임시
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

    function StudyDestroy(){
      if(confirm('정말 면접을 종료하시겠습니까? 면접자는 대기실로 이동하고, 나머지 면접자들은 피드백 완료를 위해 피드백실로 이동합니다.')){
        router.push({name:'fb-room'})
      }
    }
    return {
      userType,
      ERtoLBConfirm,
      StudyDestroy,
    };
  },
};
</script>

<style scoped>
.ERView {
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

/* 좌단 */
.ERLeftArea{
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
}

.EEVidContainer{
  width: 100%;
  height: 80%;
}

.EEVid{
  width: 98%;
  height: 98%;
  background-color: #edf0f6;
  /* border: 1px solid black; */
  border-radius: 8px;
}

.ERVidContainer{
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  width: 98%;
  height: 20%; 
}

.ERVid{
  width: 24%;
  background-color: #edf0f6;
  /* border: 1px solid black; */
  border-radius: 8px;
}


/* 우단 */
.ERRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  border-radius: 20px;
  background-color: #edf0f6;
}

.ERButtonHeader {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.ERButtonFooter {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

/* 면접자 페이지 버튼들 시작*/
/* https://css-tricks.com/examples/RoundButtons/ */
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
