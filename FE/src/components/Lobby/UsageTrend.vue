// 임현탁
<template>
<div class="UsageTrend">
  <h1>이용 추이</h1>
  <h2>{{HistoryList.userTotalTime}}</h2>
  <!-- 이용추이 -->
  <!-- 좌단 -->
  <!-- 연속 출석 일수 잔디? -->
  <!-- 우단 -->
  <!-- 총 이용시간? 이용추이 그래프? -->
</div>  
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  setup(){
    const store = useStore()
    const HistoryList = computed(
      () => store.state.rhtModule.HistoryList
    );
    return{
      HistoryList
    }
  }
}
</script>

<style>
.UsageTrend{
  width:45%;
  height:95%; 
  margin:20px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px gray;
}
</style>