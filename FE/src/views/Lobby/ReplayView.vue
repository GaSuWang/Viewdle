// 임현탁
<template>
  <div class="ReplayView" data-bs-spy="scroll">
    <div id='replay'>
      <p>
        Replay
      </p>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          정렬
        </button>
        <ul class="dropdown-menu">
          <li>오래된순</li>
          <li>최신순</li>
        </ul>
      </div>
      <div class="ReplayBody">
      <div class="container">
        <ReplayCard/>
      </div>
      </div>
    </div>
    <NavBar/>
    <!-- 오래된순, 최신순 정렬 -->
    <!-- 카드들 반응형에 따라 3*3 or 3*2 or 2*2 -->
  </div>  
</template>

<script>
import NavBar from '@/components/Lobby/NavBar.vue'
import ReplayCard from '@/components/Lobby/ReplayCard.vue'
export default {
  components:{
    NavBar,
    ReplayCard 
  }
}
</script>

<style>
#replay{
  position: fixed;
  left: 400px;
  top: 50px;
}
#ReplayBody{
  position: fixed;
  left: 400px;
  top: 250px;
}

</style>