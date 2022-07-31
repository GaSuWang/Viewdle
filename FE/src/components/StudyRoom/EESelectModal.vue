// 이병헌
<template>
<div class="EESelectModal">
  <h3>면접자 선택하기</h3>
  <ul>
    <form action="submit">
      <li @click="selectEE(participant)" v-for="participant in ParticipantList" :key="participant.user_seq">
        <i v-if="participant === EE" class="bi bi-check2-square"></i>
        <i v-else class="bi bi-square"></i>
        {{participant.name}}
        {{participant.email}}
      </li>
      <button @click="startInterview" type="submit">면접 시작하기</button>
    </form>
  </ul>
</div>  
</template>

<script>
import {computed} from 'vue'
export default {
name: 'EESelectModal',
data() {
  return{
    ParticipantList: {},
    EE: {}, //여기에 어느 정도로 유저 정보를 넣어서 전달해줄 지 차후 고민, 이건 ParticipantList에 어떤 종류의 데이터가 담겨있는 지에 따라 달라질 듯
    ERS:{},
  }
},
methods:{
  selectEE(participant){
    EE = participant
  },
  startInterview(EE, ERS){
    for(participant in ParticipantList){
    }
  },
},
created(){
  this.ParticipantList = computed(()=>this.$store.getters['lbhModule/ParticipantList'])
}
}
</script>

<style>

</style>