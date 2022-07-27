// 임현탁
<template>
  <div class="MainView">
    <div id='main'>
      Main  

      </div>
    <NavBar/>
    <!-- 검색 -->
    <!-- 최신순,오래된순 정렬 -->
    <!-- 풀방여부, 공개방여부 필터 -->
    <!-- 방생성 버튼 -->
    <!-- 카드들 반응형에 따라 3*3 or 3*2 or 2*2 -->
  </div>
</template>

<script>
import NavBar from '@/components/Lobby/NavBar.vue'
export default {
  components:{
    NavBar
  }
}
</script>

<style>
#main{
  position: fixed;
  left: 400px;
  top: 50px;
}
</style>