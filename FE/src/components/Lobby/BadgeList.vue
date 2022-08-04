// 임현탁
<template>
<div class="BadgeList">
    <h1>뱃지</h1>
    <div v-for="item in BadgeList" :key="item.seq">
      <img class="Badgeimg" :src="item.imgUrl">
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
    return{
      BadgeList
    }
  }
}
</script>

<style>
.BadgeList{
  width:45%;
  height:95%; 
  margin:20px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px gray;
}
.Badgeimg{
  width:30px;
  height: 30px;
}
</style>