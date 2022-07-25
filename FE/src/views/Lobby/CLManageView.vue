// 임현탁
<template>
  <div class="CLManageView">
    <p id='clmanage'>
      Cover Letter Manage
    </p>
    <NavBar/>
    <!-- 내 자기소개서 관리 페이지 -->
    <!-- 최신순/오래된순 정렬 -->
    <!-- 전체삭제 버튼-->
    <!-- <button type="button" class="btn">전체 삭제</button> -->

    <!-- 자소서가 하나도 없을 때 보여줄 문구, 이미지 -->

    <!-- 카드 형식의 자기소개서 -->
    <!-- 카드 안에 썸네일(?)이 좌측에, 제목과 생성일이 우측에 위치 -->
    <!-- 카드는 3열, 반응형 설계는 아직... -->
    <!-- <div class="CLM Container" v-for="cl in cls" :key="cl.seq">
      <CLMCard :card="cl"></CLMCard>
    </div> -->
    <!-- 임시로 만든 자소서 카드 대용 버튼 -->
    <!-- <button type="button" class="btn btn-primary" @click="open=true">{{open}}</button> -->
  </div>
</template>

<script>
// import CLMCard from '@/components/Lobby/CLMCard.vue'
import NavBar from '@/components/Lobby/NavBar.vue'
import { reactive } from 'vue'
export default {
  components: {
    // CLMCard,
    NavBar
  },
  setup(){
    const state = reactive({
      open: false
    })
    return {
      state
    }
  }
}
</script>

<style>
#clmanage{
  position: fixed;
  left: 400px;
  top: 50px;
}
</style>