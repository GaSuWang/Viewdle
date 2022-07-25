// 임현탁
<template>
  <div class="ReplayView">
    <p id='replay'>
      Replay
    </p>
    <NavBar/>
    <!-- 오래된순, 최신순 정렬 -->
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
#replay{
  position: fixed;
  left: 400px;
  top: 50px;
}
</style>