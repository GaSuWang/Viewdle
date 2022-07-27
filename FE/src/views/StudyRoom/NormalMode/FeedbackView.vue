// 이병헌
<template>
  <div class="FeedbackView">
    <!-- 좌단 -->
    <!-- 면접자 영상 -->
    <saved-video></saved-video>
    <!-- 우단 -->
    <div class="FBButtonHeader">
      <!-- 면접자 자소서 페이지 열기 버튼 -->
      <div class="CLOpen">
        <button @click="openEECL">자소서</button>
      </div>
      <!-- 질문 팁 모달 열기 버튼 -->
    </div>
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
  methods:{
    openEECL(){
      let route = this.$router.resolve({path:"/eecl"})
      window.open(route.href)
    }
  },
  setup() {
    const videoInfo = {}; //해당 session의 면접자 영상 정보를 가져와야 함
    return {
      videoInfo,
    };
  },
};
</script>

<style></style>
