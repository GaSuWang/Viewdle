// 임현탁
<template>
<div class="BadgeList">
    <h1>뱃지</h1>
    <h2>{{UserList.userMainBadge}}</h2>

</div>  
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  setup(){
    const store = useStore()
    const UserList = computed(
      () => store.state.rhtModule.UserList
    );
    return{
      UserList
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
</style>