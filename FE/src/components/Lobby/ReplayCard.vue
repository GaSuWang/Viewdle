// 임현탁
<template>
  <div class="ReplayCard" v-for="item in ReplayList" :key="item.seq">
    <!-- <div class="ReplayCardTop">
    </div> -->
    <div class="ReplayCardBottom">
    <form @submit.prevent="detailReplay(item.videoSeq)">
      <button class="Replaycard-buttonitem1" data-bs-toggle="modal" data-bs-target="#enterReplay">열람</button>
    </form>
      <div class="Replaycard-body">
        <h5>{{item.videoTitle}}</h5>
        <p><small class="text-muted">{{item.videoRegTime}}</small></p>
        <p><small>{{item.videoSeq}}</small></p>
      </div>
    </div>
    <div class="Replaycard-button">
      <form @submit.prevent="deleteReplay(item.videoSeq)">
      <button class="btn Replaycard-buttonitem2">삭제하기</button>
      </form>
    </div>
    <!-- 왼쪽 -->
    <!-- 썸네일 -->
    
    <!-- 오른쪽 -->
    <!-- 방제 -->
  
    <!-- 생성 시각 -->  
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
  box-shadow: 1px 1px 1px 1px gray;
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
  margin-right: 20%;
}
.Replaycard-buttonitem2{
  margin : 3px;
  font-size: 3px;
  background-color: rgb(230,198,132);
  color: white;
}
.Replaycard-buttonitem1{
  position:fixed;
  width:100%;
  height: 80%;
  margin : 3px;
  font-size: 3px;
  background-color: rgb(230,198,132);
  opacity:0;
  color: black;
}
</style>