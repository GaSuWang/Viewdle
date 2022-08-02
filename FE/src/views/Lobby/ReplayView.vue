// 임현탁
<template>
<div class="ReplayViewBoss">
  <NavBar class="NavView"/>
  <div class="ReplayView">
    <p class="pagetitle">Replay</p>
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
        <ReplayCard/>
        <ReplayCard/>
        <ReplayCard/>
        <ReplayCard/>
        <ReplayCard/>
      </div>
    <!-- 오래된순, 최신순 정렬 -->
    <!-- 카드들 반응형에 따라 3*3 or 3*2 or 2*2 -->
    <!-- 자소서 삭제모달  -->
      <div class="modal fade" id="deleteReplay" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="">
              <h5 class="modal-title" id="staticBackdropLabel">정말 삭제 할거야?</h5>
              <button class="btn btn-secondary">Yes</button>
              <button class="btn btn-secondary" data-bs-dismiss="modal">No</button>
            </form>
          </div>
        </div>
      </div>  
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
  width: 90%;
  height: 90%;
  background : rgb(255,255,255,0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.NavView{
  height: 100%;
  width: 250px;
}
.ReplayView{

  height: 100%;
  width: 80%;
}
.ReplayTop{
  background: white;
  border-radius: 20px;
  width:98%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.ReplayTopitem{
  margin:0 20px;
}
.pagetitle{
  margin-top: 20px;
}
.ReplayBody{
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around;
  width: 98%;
  height: 83%;
  background: white;
  border-radius: 20px;
  padding: 20px;
  overflow: scroll;
}
</style>