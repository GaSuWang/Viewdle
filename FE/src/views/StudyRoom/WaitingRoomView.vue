// 이병헌
<template>
  <div class="WaitingRoomView">
    <!-- 참가자 영상 나오는 부분 -->
    <div class="WRContainer">

    </div>

    <!-- 방장 기능 -->
    <div class="superUser">
      <!-- 면접자 선택 -->
      <button>면접자 선택</button>
      <!-- 스터디 종료 -->
      <button @click="EndStudyConfirm">스터디 종료</button>
    </div>
  </div>  
</template>

<script>
import { useStore } from 'vuex'
export default {
name: 'WaitingRoomView',
setup(){
  const store = useStore()

  function EndStudyConfirm() {
    if(confirm('정말 스터디를 종료하시겠습니까?')){
      this.$router.push('/main')
    } 
  return{
    EndStudyConfirm,
  }
}
}
}
</script>

<style>

</style>