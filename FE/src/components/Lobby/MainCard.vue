// 임현탁
<template>
<div class="MainCard" v-for="item in StudyroomList" :key="item.seq">
    <div v-if="item.roomPrivateYN === 'Y'">
      <form @submit.prevent="enterSecretStudyroom(item.roomSeq)">
        <button class="btn enterbuttonitem" data-bs-toggle="modal" data-bs-target="#enterroom">입장하기</button>
      </form>
    </div>

    <div v-else-if="item.roomPrivateYN === 'N'">

      <form @submit.prevent="enterNormalStudyroom(item.roomSeq)">
        <button class="btn enterbuttonitem">
          입장하기
        </button>
      </form>
    </div>

  <div class="MainCardTop">

  </div>
  <div class="MainCardBottom">
    <div class="MainCardthumnail" >

      <img :src="item.thumbnailUrl" class="img-fluid rounded-start"/>
    </div>
    <div class="col MainCardBody">
      <h4 class="card-title" style="font-weight:bold">{{item.roomTitle}}</h4>
      <p></p>
      

      <p style="margin-bottom:0; margin-top:5px"><small class="text-muted">{{item.roomCnt}} / {{item.roomLimit}}</small></p>
      <p style="margin-bottom:0; margin-top:5px"><small class="text-muted">{{item.roomRegTime.split(":")[3] + "시 " + item.roomRegTime.split(":")[4] + "분" }}</small></p>

      <div :class="[item.roomType === 2 ? 'playmode' : 'studymode']">
        <div v-if="item.roomActiveYN === 'Y' || item.roomFullYN === 'Y'"> 
            <div class="card-state">Playing..</div>
          </div>
          <div v-else>
            <div class="card-state">Waiting..</div>
        </div>
      </div>
    </div>
  </div>
  <div class="enterbutton"></div>
</div>



</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { reactive } from "vue";
export default {
  data(){
    return{
      calDate : null,
    }
  },
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
  /* align-items: center; */
  align-content: center;
  justify-content: center;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 2.5px 6px #fff;
  transition: all 0.1s linear;
  display: flex;
  flex-flow: column;
}
.MainCard:hover {
  transform:scale(1.04);
}
.MainCardTop{
  width:100%;
  height: 20%;
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

  margin:5px;
  width:40%;
  display:flex;
  justify-content: center;
  align-content: center ;
}
.MainCardBody{
  margin-left: 5px;
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
  position: fixed;
  width : 100%;
  height: 100%;
  font-size: 5px;
  color: white;
  opacity:0;
}

.card-title{
  margin-top: 10px;

}

.card-state{
  margin-top: 5px;
  font-size: 30px;
}

.playmode{
  color:#FEAA00; 
  font-weight:bold;
}

.studymode{
  color:#47A0FF; 
  font-weight:bold;
}
</style>