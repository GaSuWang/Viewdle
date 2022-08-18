// 임현탁
<template>
<div class="BadgeList">
    <div class="BadgeTable">
    <div v-for="item in BadgeList" :key="item.seq">
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
  margin: 0 20px;
  border-radius: 20px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 2.5px 6px #fff;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.BadgeTable{
  width:95%;
  height:70%;
  /* text-align: center; */
}
.Badgeimg{
  width:50px;
  height: 50px;
  margin: 8px;
}
</style>