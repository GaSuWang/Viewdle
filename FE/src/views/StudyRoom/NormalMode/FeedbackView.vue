// 이병헌
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
          <button @click="openEECL">자소서</button>
        </div>
        <!-- 질문 팁 모달 열기 버튼 -->
      </div>
      <!-- 피드백 구역 -->
      <feedback-area :videoInfo="videoInfo"></feedback-area>
      <div class="FBButtonFooter">
        <!-- 면접 종료 버튼(방장 유저) -->
        <div class="FBCompleteBtn">
          <button @click="FBComplete">피드백 완료</button>
        </div>
        <!-- 면접에서 나가기 버튼(일반 유저) -->
        <div v-show="userType === 'user'" class="FBtoLBbtn user">
          <button @click.prevent="FBtoLBConfirm(userType)">나가기</button>
        </div>
        <!-- 면접에서 나가기 버튼(방장 유저) -->
        <div v-show="userType === 'superUser'" class="FBtoLBbtn superUser">
          <button @click.prevent="FBtoLBConfirm(userType)">나가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeedbackArea from "@/components/StudyRoom/NormalMode/FeedbackArea.vue";
import SavedVideo from "@/components/StudyRoom/SavedVideo.vue";
import {useRouter} from 'vue-router'
import {ref} from 'vue'
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
    const router = useRouter()
    const userType = ref('user')
    function FBComplete(){
      if(confirm('피드백을 이대로 제출하시겠습니까? 이후에 대기실로 이동합니다.')){
        router.push('waiting-room')
      }
    }
    function FBtoLBConfirm(userType) {
      if (userType === 'user') {
        if(confirm('정말 피드백 수정 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 로비로 이동합니다.')) {
          router.push({name: 'main'})
        }

      }
      else if (userType === 'superUser'){
        if(confirm('정말 피드백 수정 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 방장 권한 위임 후 로비로 이동합니다.')) {
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

.FBRightArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20%;
  height: 100%;
}

.FBButtonFooter{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
