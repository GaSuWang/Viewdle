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
      <p><small class="text-muted">{{item.roomPrivateYN}}</small></p>
    </div>
  </div>
  <div class="enterbutton">
    <div v-if="item.roomPrivateYN === 'Y'">
      <form @submit.prevent="enterSecretStudyroom(item.roomSeq)">
        <button class="btn btn-secondary enterbuttonitem" data-bs-toggle="modal" data-bs-target="#enterroom">비번방</button>
      </form>
    </div>
    <!-- 이병헌 시작 --> 
    <!-- <div v-else-if="item.roomPrivateYN === 'N'"> -->
    <div v-else>
    <!-- 이병헌 끝 -->
      <form @submit.prevent="enterNormalStudyroom(item.roomSeq)">
        <button class="btn btn-secondary enterbuttonitem">
          일반방
        </button>
      </form>
    </div>
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
import { reactive } from "vue";
export default {
  setup(){
    const store = useStore()
    const StudyroomList = computed(
      () => store.state.rhtModule.StudyroomList
    );
    const credentialsToenter = reactive({
      "roomPassword" : "",
      "roomSeq": '',
    })
    function enterNormalStudyroom(enterItem){
      store.dispatch('rhtModule/enterNormalStudyroom', enterItem)
    }
    function enterSecretStudyroom(enterItem){
      store.dispatch('rhtModule/enterSecretStudyroom', enterItem)
    }
    return {
      StudyroomList, credentialsToenter, enterNormalStudyroom, enterSecretStudyroom
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
  height: 10%;
  display:flex;
  justify-content: end;
  margin-right: 30px
}
.MainCardBottom{
  width: 100%;
  height:80%;
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
  height: 10%;
  display: flex;
  justify-content: end;
  margin-right: 20%;
  margin-bottom: 5px;
}
.enterbuttonitem{
  font-size: 5px;
}
</style>