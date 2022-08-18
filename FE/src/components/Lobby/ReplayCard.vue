// 임현탁
<template>
  <div class="ReplayCard" v-for="item in ReplayList" :key="item.seq">

    <div class="ReplayCardBottom">
    <form @submit.prevent="detailReplay(item.videoSeq)">
      <button class="Replaycard-buttonitem1" data-bs-toggle="modal" data-bs-target="#enterReplay">열람</button>
    </form>
      <div class="Replaycard-body m-3">
        <h5>{{item.videoTitle}}</h5>
        <p><small class="text-muted">{{item.videoRegTime}}</small></p>

      </div>
    </div>
    <div class="Replaycard-button">
      <form @submit.prevent="deleteReplay(item.videoSeq)">
      <button class="btn Replaycard-buttonitem2">삭제</button>
      </form>
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  setup(){
    const store = useStore()
    const ReplayList = computed(
      () => store.state.rhtModule.ReplayList
    );
    function detailReplay(credentialsTodelete){
      store.dispatch('rhtModule/detailReplay', credentialsTodelete)
    }
    function deleteReplay(credentialsTodelete){
      if(confirm("정말 삭제 하시겠습니까?")){
        store.dispatch('rhtModule/deleteReplay', credentialsTodelete)
      } else{
        alert("삭제가 취소되었습니다.")
      }
    }
    return {
      ReplayList, deleteReplay, detailReplay
    }
  }
}
</script>

<style>
.ReplayCard{
  width:45%;
  height:45%; 
  margin:10px;
  border-radius: 20px;
  align-items: center;
  align-content: center;
  justify-content: center;
    box-shadow:  0px 1.5px 4px #aaa, inset 0px 2.5px 6px #fff;
  transition: all 0.1s linear;
  display: flex;
  flex-flow: column;
  overflow: hidden;
}
.ReplayCard:hover {
  transform:scale(1.04);
}
.ReplayCardTop{
  width:100%;
  height: 10%;
  display:flex;
  justify-content: end;
  margin-right: 30px
}
.ReplayCardBottom{
  width: 100%;
  height: 80%;
  display:flex;
  flex-flow:row;
}
.ReplayCardthumnail{
  margin:20px;
  width:40%;
  display:flex;
  justify-content: center;
}
.Replaycard-body{
  width: 100%;
  display: flex;
  flex-flow: column;
}
.Replaycard-button{
  width:100%;
  height:10%;
  display:flex;
  justify-content: end;
  margin: 2vw;

}
.Replaycard-buttonitem2{
  width: 6vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #FEAA00;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
    margin-right: 1vw;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.Replaycard-buttonitem1{
  position:fixed;
  width:100%;
  height: 80%;
  margin : 3px;
  font-size: 3px;
  opacity:0;
  background-color: #FEAA00;
  color: black;
}
</style>