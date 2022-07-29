// 임현탁
<template>
<div class="ReplayViewBoss">
  <NavBar/>
  <div class="ReplayView">
    <p>Replay</p>
    <div class='ReplayTop'>
      <div class="dropdown ReplayTopitem">
        <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          정렬
        </button>
        <ul class="dropdown-menu">
          <li>오래된순</li>
          <li>최신순</li>
        </ul>
      </div>
    </div>
      <hr>
      <div class="ReplayBody">
        <ReplayCard/>
      </div>
    <!-- 오래된순, 최신순 정렬 -->
    <!-- 카드들 반응형에 따라 3*3 or 3*2 or 2*2 -->
  </div> 
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
.ReplayViewBoss{
  height: 100%;
}
.ReplayView{
  position:fixed;
  top:50px;
  left: 300px;
  height: 100%;
  width: 80%;
  overflow:scroll;
}
.ReplayTop{
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}
.ReplayTopitem{
  margin:0 20px;
}
.ReplayBody{
  width: 98%;
  height: 85%;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>