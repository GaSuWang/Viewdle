// 임현탁
<template>
<div class="GrassShow">
    <h1>잔디</h1>
    <h2>{{HistoryList.usingDates}}</h2>
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
.GrassShow{
  width:95%;
  margin:20px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px gray;
}
</style>