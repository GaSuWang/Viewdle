// 이병헌
<template>
  <div class="ERView">
      <!-- 영상 구역  -->
      <!-- 상단 -->
      <!-- 면접자 영상 구역 -->

      <!-- 하단 -->
      <!-- 면접관 영상 구역 -->

      <!-- 유저 기능 구역 -->
      <div class="ERFeatureARea">
        <!-- 상단 -->
        <div class="ERButtonFooter">
          <!-- 면접자 자소서 페이지 열기 버튼 -->
          <div class="CLOpen">
            <button>자소서</button>
          </div>
          <!-- 질문 팁 모달 열기 버튼 -->
          <div class="QTip">
            <button>자소서</button>
          </div>
        </div>

        <!-- 중단 -->
        <!-- 피드백 구역 -->
        <feedback-view></feedback-view>

        <!-- 하단 -->
        <div class="ERButtonFooter">
          <!-- 면접 종료 버튼(방장 유저) -->
          <div v-show="userType === 'superUser'">
            <button>면접 완료</button>
          </div>
          <!-- 면접에서 나가기 버튼(일반 유저) -->
          <div v-show="userType === 'user'" class="ERtoLBbtn user">
            <button @click.prevent="ERtoLBConfirm(userType)">나가기</button>
          </div>
          <!-- 면접에서 나가기 버튼(방장 유저) -->
          <div v-show="userType === 'superUser'" class="ERtoLBbtn superUser">
            <button @click.prevent="ERtoLBConfirm(userType)">나가기</button>
          </div>
        </div>
      </div>
  </div>  
</template>

<script>
import { ref } from "vue";
import FeedbackView from '@/views/StudyRoom/NormalMode/FeedbackView.vue'
export default {
name:"ERView",
components: {FeedbackView},
setup() {
  const userType = ref("superUser"); //유저가 일반유저인지, 방장유저인지를 담고 있는 데이터를 여기에 넣어야, 지금은 임시
  function ERtoLBConfirm(userType) {
    if (userType === 'user') {
      if(confirm('정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 대기실로 이동합니다.')) {
        this.$router.push('main')
      }
    }
    else if (userType === 'superUser'){
      if(confirm('정말 면접 도중에 나가시겠습니까?\n지금까지의 피드백이 면접자에게 제공되지 않고 대기실로 이동합니다.')) {
        // 권한위임 모달 실행
      }
    }
  }
  return { 
    userType,
    ERtoLBConfirm 
  };
},
}
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


.ERButtonFooter {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.ERButtonArea > button{
  border: none;
}
</style>