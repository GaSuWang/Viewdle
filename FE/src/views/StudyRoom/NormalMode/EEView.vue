// 이병헌
<template>
  <div class="EEView">
    <!-- 영상 구역  -->
    <!-- 면접관 영상 구역 -->
    <div class="EEContainer">
      <div class="participantVideo">1</div>
      <div class="participantVideo">2</div>
      <div class="participantVideo">3</div>
      <div class="participantVideo">4</div>
    </div>
    <!-- 유저 기능 구역 -->
    <!-- 상단  -->

    <!-- 하단 -->
    <div class="EEButtonArea">
      <!-- 면접에서 나가기 버튼(일반 유저) -->
      <div v-show="userType === 'user'" class="EEtoLBbtn user">
        <button @click.prevent="EEtoLBConfirm(userType)">나가기</button>
      </div>
      <!-- 면접에서 나가기 버튼(방장 유저) -->
      <div v-show="serType === 'superUser'" class="EEtoLBbtn superUser">
        <button @click.prevent="EEtoLBConfirm(userType)">나가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "EEView",
  setup() {
    const userType = ref("user"); //유저가 일반유저인지, 방장유저인지를 담고 있는 데이터를 여기에 넣어야, 지금은 임시
    function EEtoLBConfirm(userType) {
      if (userType === 'user') {
        if(confirm('정말 면접에서 나가시겠습니까?\n지금까지의 면접영상이 저장되지 않고 대기실로 이동합니다.')) {
          this.$router.push('main')
        } else if (userType === 'superUser'){
          if(confirm('정말 면접에서 나가시겠습니까?\n지금까지의 면접영상이 저장되지 않고 대기실로 이동합니다.')) {
            // 권한위임 모달 실행
          }
        }
      }
    }
    return { 
      userType,
      EEtoLBConfirm 
    };
  },
};
</script>

<style scoped>
.EEView {
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

.EEContainer {
  width: 65%;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.participantVideo {
  width: 40%;
  background: darkgrey;
}

.EEButtonArea {
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.EEtoLBbtn.user > button{
  border: none;
}

</style>
