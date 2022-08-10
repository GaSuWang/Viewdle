// 임현탁
<template>
  <div class="ReplayCard" v-for="item in ReplayList" :key="item.seq">
  <div class="ReplayTop">
  </div>
  <div class="ReplayBottom">
    <div class="Replaythumnail">
      <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
    </div>
    <div class="Replaycard-body">
      <h5>{{item.videoTitle}}</h5>
      <p><small class="text-muted">{{item.videoRegTime}}</small></p>
      <p><small>{{item.videoSeq}}</small></p>
    </div>
  </div>
  <div class="Replaycard-button">
    <button class="btn btn-secondary Replaycard-buttonitem" data-bs-toggle="modal" data-bs-target="#enterReplay">열람</button>
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
    return {
      ReplayList
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
}
.ReplayCard:hover {
  transform:scale(1.04);
}
.ReplayTop{
  width:100%;
  height: 10%;
  display:flex;
  justify-content: end;
  margin-right: 30px
}
.ReplayBottom{
  width: 100%;
  height: 80%;
  display:flex;
  flex-flow:row;
}
.Replaythumnail{
  margin:20px;
  width:40%;
  display:flex;
  justify-content: center;
}
.Replaycard-body{
  width: 60%;
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
.Replaycard-buttonitem{
  margin : 3px;
  font-size: 3px;
}
</style>