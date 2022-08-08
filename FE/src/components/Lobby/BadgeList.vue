// 임현탁
<template>
<div class="BadgeList">
    <h2>뱃지</h2>
    <div class="BadgeTable">
    <div v-for="item in BadgeList" :key="item.seq">
      <p>하이</p>
      <img class="Badgeimg" v-on:click="setBadge(item.imgUrl)" :src="item.imgUrl">
    </div>
    </div>
    

</div>  
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  setup(){
    const store = useStore()
    const BadgeList = computed(
      () => store.state.rhtModule.BadgeList
    );
    function setBadge(imgUrl){
      var confirmflag = confirm('뱃지를 변경하시겠습니까.')
      if(confirmflag){
      store.dispatch('rhtModule/setBadge', imgUrl)
      }
      }
    return{
      BadgeList, setBadge
    }
  }
}
</script>

<style>
.BadgeList{
  width:90%;
  height:95%; 
  margin:20px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px gray;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.BadgeTable{
  width:70%;
  height:70%;
  text-align: center;
}
.Badgeimg{
  width:50px;
  height: 50px;
  margin: 8px;
}
</style>