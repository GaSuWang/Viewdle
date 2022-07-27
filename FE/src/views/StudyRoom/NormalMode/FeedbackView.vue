// 이병헌
<template>
  <div class="FeedbackView">
    <!-- 좌단 -->
    <!-- 면접자 영상 -->
    <saved-video></saved-video>
    <!-- 우단 -->
    <!-- 면접자 자소서 새로운 페이지에서 여는 버튼 -->
    <!-- <router-link></router-link> -->
    <!-- 면접관 질문 팁 모달 버튼 -->
    <button></button>
    <!-- 피드백 구역 -->
    <feedback-area :videoInfo="videoInfo"></feedback-area>
  </div>
</template>

<script>
import FeedbackArea from "@/components/StudyRoom/NormalMode/FeedbackArea.vue";
import SavedVideo from "@/components/StudyRoom/SavedVideo.vue";
export default {
  name: "FeedbackView",
  components: { FeedbackArea, SavedVideo },
  setup() {
    const videoInfo = {}; //해당 session의 면접자 영상 정보를 가져와야 함
    return {
      videoInfo,
    };
  },
};
</script>

<style></style>
