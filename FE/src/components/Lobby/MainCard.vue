// 임현탁
<template>
<div class="MainCard" v-for="item in StudyroomList" :key="item.seq">
  <div class="MainCardTop">
     <p><small class="text-muted">{{item.roomCnt}}/{{item.roomLimit}}</small></p>
  </div>
  <div class="MainCardBottom">
    <div class="MainCardthumnail">
      <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
    </div>
    <div class="col MainCardBody">
      <h5>{{item.roomTitle}}</h5>
      <p></p>
      <p><small class="text-muted">{{item.roomRegTime}}</small></p>
      <p><small class="text-muted">{{item.roomType}}</small></p>
      <p><small class="text-muted">{{item.roomSeq}}</small></p>
    </div>
  </div>
  <div class="enterbutton">
      <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#enterroom">입장하기</button>
  </div>
  </div>
    <!-- 왼쪽 -->
    <!-- 썸네일 -->
    <!-- 이지, 하드모드 여부 색으로 표현 -->

    <!-- 오른쪽 -->
    <!-- 방 몇명있는지 -->
    <!-- 방제목 -->
    <!-- 만들어진 시간 -->
    <!-- 방장 이메일 -->


</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  setup(){
    const store = useStore()
    const StudyroomList = computed(
      () => store.state.rhtModule.StudyroomList
    );
    return {
      StudyroomList
    }
  }
}
</script>

<style>
.MainCard{
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
.MainCard:hover {
  transform:scale(1.04);
}
.MainCardTop{
  width:100%;
  height: 30px;
  display:flex;
  justify-content: end;
  margin-right: 30px
}
.MainCardBottom{
  width: 100%;
  display:flex;
}
.MainCardthumnail{
  margin:20px;
  width:40%;
  display:flex;
  justify-content: center;
}
.MainCardBody{
  width: 60%;
}
.enterbutton{
  width:100%;
  display: flex;
  justify-content: end;
  margin-right: 20%;
}
</style>